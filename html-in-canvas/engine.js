import {makeMarkup} from './scenes.js';

export function detectFeatures() {
  const two=document.createElement('canvas').getContext('2d');
  const gl=document.createElement('canvas').getContext('webgl2');
  return {
    twoD:typeof two?.drawElementImage==='function',
    webgl2:!!gl,
    htmlTexture:!!gl&&(typeof gl.texElementSubImage2D==='function'||typeof gl.texElementImage2D==='function'),
    method2d:typeof two?.drawElementImage,
    webglMethod:typeof gl?.texElementSubImage2D==='function'?'texElementSubImage2D':(typeof gl?.texElementImage2D==='function'?'texElementImage2D':'none'),
    snapshot:typeof HTMLCanvasElement.prototype.captureElementImage==='function',
    geometry:typeof HTMLCanvasElement.prototype.updateElementGeometry==='function',
    content:'content' in HTMLCanvasElement.prototype
  };
}

const vsSource=`#version 300 es
in vec2 aPos;
out vec2 vUV;
void main() { gl_Position=vec4(aPos,0.0,1.0); vUV=aPos*0.5+0.5; }
`;
const fsSource=`#version 300 es
precision highp float;
in vec2 vUV;
uniform sampler2D uTexture;
uniform float uTime;
uniform float uStrength;
out vec4 color;
void main(){
  vec2 uv=vUV;
  float envelope=sin(uv.x*3.14159265);
  uv.y += sin(uv.x*11.0+uTime*1.35)*0.058*uStrength*envelope;
  vec2 center=uv-0.5;
  uv=0.5+center*(1.0+0.16*uStrength*dot(center,center));
  float shift=0.007*uStrength;
  vec4 base=texture(uTexture,vec2(uv.x,1.0-uv.y));
  float r=texture(uTexture,vec2(uv.x+shift,1.0-uv.y)).r;
  float b=texture(uTexture,vec2(uv.x-shift,1.0-uv.y)).b;
  color=vec4(r,base.g,b,base.a);
}`;
function compile(gl,type,src){
  const shader=gl.createShader(type);gl.shaderSource(shader,src);gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
    const error=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw new Error('GLSL：'+error);
  }
  return shader;
}
function initGL(gl){
  const program=gl.createProgram(),vert=compile(gl,gl.VERTEX_SHADER,vsSource),frag=compile(gl,gl.FRAGMENT_SHADER,fsSource);
  gl.attachShader(program,vert);gl.attachShader(program,frag);gl.linkProgram(program);
  gl.deleteShader(vert);gl.deleteShader(frag);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('WebGL link：'+gl.getProgramInfoLog(program));
  gl.useProgram(program);
  const position=gl.getAttribLocation(program,'aPos');
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  const quad=new Float32Array([-0.78,-0.66,0.78,-0.66,-0.78,0.66,0.78,0.66]);
  gl.bufferData(gl.ARRAY_BUFFER,quad,gl.STATIC_DRAW);
  gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
  gl.uniform1i(gl.getUniformLocation(program,'uTexture'),0);
  return {program,buf,tex,time:gl.getUniformLocation(program,'uTime'),strength:gl.getUniformLocation(program,'uStrength'),texWidth:0,texHeight:0,uploaded:false};
}
export class LaboratoryEngine {
  constructor(stage,onFault){
    this.stage=stage;this.onFault=onFault;this.features=detectFeatures();
    this.scene=null;this.mode='dom';this.playing=true;this.intensity=.46;this.text='';
    this.draws=0;this.paints=0;this.durations=[];this.canvas=null;this.ctx=null;this.gl=null;this.glData=null;this.source=null;
    this.raf=0;this.observer=null;this.epoch=performance.now();this.ended=false;this.lastError='';
  }
  supported(scene){
    return scene.kind==='webgl'?this.features.htmlTexture:this.features.twoD;
  }
  destroy(){
    this.ended=true;if(this.raf)cancelAnimationFrame(this.raf);
    this.raf=0;this.observer?.disconnect();this.observer=null;
    this.stage.replaceChildren();this.canvas=null;this.ctx=null;this.gl=null;this.glData=null;this.source=null;
    this.lastError='';
  }
  start(scene,requested,text,playing,intensity){
    this.destroy();this.ended=false;
    this.scene=scene;this.text=text;this.playing=playing;this.intensity=intensity;this.epoch=performance.now();this.draws=0;this.paints=0;this.durations=[];
    this.mode=requested==='native'&&this.supported(scene)?'native':requested==='raster'?'raster':'dom';
    this.stage.classList.remove('error','paused');
    this.stage.classList.toggle('paused',!playing);
    const label=document.createElement('span');label.className='stage-mark';
    label.textContent=this.mode==='native'?'實際原生 HTML-in-Canvas':this.mode==='dom'?'替代展示：DOM 疊層（未使用新 API）':'替代展示：傳統 Canvas 2D（非新 API）';
    if(this.mode==='dom'){
      const layer=document.createElement('div');layer.className='fallback-layer';
      layer.innerHTML=makeMarkup(scene,text).replace('class="canvas-source','class="fallback-source');
      if(['glass','projection','tilt','webgl'].includes(scene.id))layer.classList.add(scene.id==='tilt'?'turn':scene.id==='projection'?'zoom':'wobble');
      this.stage.append(layer,label);this.source=layer.querySelector('.fallback-source');
      this.bindInteractions();return this.mode;
    }
    const canvas=document.createElement('canvas');canvas.id='renderCanvas';
    if(this.mode==='native'){
      canvas.setAttribute('layoutsubtree','');
      canvas.setAttribute('content','drawable');
      canvas.innerHTML=makeMarkup(scene,text);
      this.source=canvas.querySelector('#liveDOM');
      if(scene.kind==='webgl')this.source.setAttribute('aria-hidden','true');
    }
    this.canvas=canvas;this.stage.append(canvas,label);
    try{
      if(this.mode==='native'&&scene.kind==='webgl'){
        this.gl=canvas.getContext('webgl2',{alpha:true,antialias:true,preserveDrawingBuffer:false});
        if(!this.gl)throw new Error('WebGL2 不可用');
        this.glData=initGL(this.gl);
      }else{
        this.ctx=canvas.getContext('2d',{alpha:true});
        if(!this.ctx)throw new Error('Canvas 2D 不可用');
      }
      if(this.mode==='native')canvas.addEventListener('paint',()=>{
        this.paints++;
        if(this.ended)return;
        try{
          if(this.gl)this.uploadTexture();
          else this.draw2d();
        }catch(e){this.fail(e);}
      });
      this.observer=new ResizeObserver(()=>this.resize());
      this.observer.observe(this.stage);
      this.bindInteractions();
      this.resize();
      if(this.mode==='native'&&typeof canvas.requestPaint==='function')canvas.requestPaint();
      if(this.needsLoop())this.loop();
    }catch(e){this.fail(e);}
    return this.mode;
  }
  resize(){
    if(!this.canvas||this.ended)return;
    const box=this.stage.getBoundingClientRect();
    const w=Math.max(1,Math.round(box.width*Math.min(devicePixelRatio||1,2.5)));
    const h=Math.max(1,Math.round(box.height*Math.min(devicePixelRatio||1,2.5)));
    if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}
    if(this.gl)this.gl.viewport(0,0,w,h);
    if(this.mode==='native')this.canvas.requestPaint?.();
    else this.drawRaster();
  }
  updateText(text){
    this.text=text;
    if(this.source){
      this.source.querySelectorAll('[data-title]').forEach(el=>el.textContent=text);
      if(this.mode==='native')this.canvas?.requestPaint?.();
    }else if(this.mode==='raster')this.drawRaster();
  }
  updateIntensity(value){this.intensity=value;if(this.mode==='native')this.canvas?.requestPaint?.();else if(this.mode==='raster')this.drawRaster();}
  setPlaying(playing){this.playing=playing;this.stage.classList.toggle('paused',!playing);
    if(playing&&!this.raf&&this.needsLoop())this.loop();
  }
  needsLoop(){return this.playing&&(this.mode==='native'?['tilt','glass','webgl','projection'].includes(this.scene.id):this.mode==='raster'&&['tilt','glass','webgl','projection'].includes(this.scene.id));}
  loop(){
    if(this.ended||!this.needsLoop()){this.raf=0;return;}
    this.raf=requestAnimationFrame(()=>{
      this.raf=0;if(this.ended||!this.needsLoop())return;
      if(this.mode==='native'){
        if(this.gl){if(this.glData.uploaded)this.drawGL();}
        else this.canvas?.requestPaint?.();
      }else this.drawRaster();
      this.loop();
    });
  }
  bindInteractions(){
    if(!this.source)return;
    const button=this.source.querySelector('[data-action="greet"]');
    if(button)button.addEventListener('click',()=>{
      const input=this.source.querySelector('#sceneName');
      const result=this.source.querySelector('[data-greeting]');
      result.textContent='歡迎 '+(input.value.trim()||'來賓')+'，願你平安！';
      this.canvas?.requestPaint?.();
    });
  }
  draw2d(){
    if(!this.ctx||!this.source||this.ended)return;
    const t0=performance.now(),ctx=this.ctx;
    const dp=this.canvas.width/Math.max(1,this.stage.clientWidth),w=this.canvas.width/dp,h=this.canvas.height/dp;
    const sw=this.source.offsetWidth,sh=this.source.offsetHeight;
    if(!sw||!sh)return;
    ctx.reset();ctx.setTransform(dp,0,0,dp,0,0);
    const x=(w-sw)/2,y=(h-sh)/2,seconds=(performance.now()-this.epoch)/1000;
    // 2D scene starts with a transparent canvas. Stage background stays in CSS.
    if(this.scene.effect==='projection'){
      const glow=ctx.createRadialGradient(w*.50,h*.42,20,w*.50,h*.45,Math.max(w,h)*.55);
      glow.addColorStop(0,'rgba(148,255,236,'+(.12+.07*Math.sin(seconds)*this.intensity)+')');
      glow.addColorStop(1,'rgba(10,22,45,0)');
      ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
      ctx.globalAlpha=.25;ctx.fillStyle='#b5ffee';
      for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(w*.52,h*.03);ctx.lineTo(w*(i+1)/8,h);ctx.lineTo(w*(i+1.2)/8,h);ctx.closePath();ctx.fill();}
      ctx.globalAlpha=1;
    }
    try{
      let result;
      if(this.scene.effect==='tilt'){
        ctx.translate(w/2,h/2);ctx.rotate(Math.sin(seconds*.85)*this.intensity*.22);
        result=ctx.drawElementImage(this.source,-sw/2,-sh/2);
      }else if(this.scene.effect==='glass'){
        ctx.save();ctx.filter='blur('+(9+this.intensity*24)+'px)';
        ctx.globalAlpha=.38;ctx.drawElementImage(this.source,x+10,y+11);ctx.restore();
        result=ctx.drawElementImage(this.source,x,y);
      }else{
        result=ctx.drawElementImage(this.source,x,y);
      }
      // Chromium pre-155 returned a DOMMatrix; 155+ synchronizes automatically.
      if(result&&typeof result.toString==='function'&&this.source.style.transform!==result.toString()){
        this.source.style.transform=result.toString();
      }else if(result===undefined&&this.source.style.transform){
        this.source.style.transform='';
      }
      this.draws++;this.observeDraw(performance.now()-t0);
    }catch(e){this.fail(e);}
  }
  uploadTexture(){
    if(!this.gl||!this.source||this.ended)return;
    const t0=performance.now(),gl=this.gl,data=this.glData;
    gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,data.tex);
    if(typeof gl.texElementSubImage2D==='function'){
      if(typeof this.canvas.captureElementImage!=='function')throw new Error('新版 WebGL 方法需要 captureElementImage');
      const shot=this.canvas.captureElementImage(this.source);
      const w=Math.ceil(shot.width),h=Math.ceil(shot.height);
      if(!w||!h)return;
      if(data.texWidth!==w||data.texHeight!==h){
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
        data.texWidth=w;data.texHeight=h;
      }
      gl.texElementSubImage2D(gl.TEXTURE_2D,0,0,0,this.source);
    }else if(typeof gl.texElementImage2D==='function'){
      if(gl.texElementImage2D.length===3)gl.texElementImage2D(gl.TEXTURE_2D,gl.RGBA8,this.source);
      else gl.texElementImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,this.source);
    }else throw new Error('瀏覽器沒有 HTML texture API');
    data.uploaded=true;this.draws++;this.observeDraw(performance.now()-t0);
    this.drawGL();
  }
  drawGL(){
    const t0=performance.now(),gl=this.gl,data=this.glData;
    if(!data?.uploaded)return;
    gl.viewport(0,0,this.canvas.width,this.canvas.height);
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(data.program);gl.bindTexture(gl.TEXTURE_2D,data.tex);
    gl.uniform1f(data.time,(performance.now()-this.epoch)/1000);
    gl.uniform1f(data.strength,this.intensity);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    this.draws++;this.observeDraw(performance.now()-t0);
  }
  drawRaster(){
    if(!this.ctx||this.ended)return;
    const t0=performance.now(),ctx=this.ctx,w=this.canvas.width,h=this.canvas.height,dpr=this.canvas.width/Math.max(1,this.stage.clientWidth);
    ctx.reset();ctx.clearRect(0,0,w,h);ctx.setTransform(dpr,0,0,dpr,0,0);
    const cw=w/dpr,ch=h/dpr,tm=(performance.now()-this.epoch)/1000;
    ctx.save();ctx.translate(cw/2,ch/2);
    if(this.scene.id==='tilt')ctx.rotate(Math.sin(tm)*this.intensity*.22);
    const bw=Math.min(cw*.70,590),bh=Math.min(ch*.62,270);
    ctx.shadowBlur=this.scene.effect==='glass'?44:14;ctx.shadowColor='rgba(89,238,219,.38)';
    ctx.fillStyle='#203d59';ctx.strokeStyle='#75e4cc';ctx.lineWidth=2;
    ctx.beginPath();ctx.roundRect(-bw/2,-bh/2,bw,bh,25);ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;ctx.textAlign='center';ctx.fillStyle='#a9e9dc';ctx.font='600 '+Math.max(10,Math.round(cw*.015))+'px system-ui';
    ctx.fillText('TRADITIONAL CANVAS 2D',0,-bh*.30);
    ctx.fillStyle='white';ctx.font='bold '+Math.max(18,Math.min(42,cw*.052))+'px "Microsoft JhengHei",system-ui';
    let title=this.text;while(ctx.measureText(title).width>bw*.85&&title.length>1)title=title.slice(0,-1);
    ctx.fillText(title,0,10);
    ctx.fillStyle='#98b7c5';ctx.font=Math.max(10,Math.round(cw*.017))+'px system-ui';
    ctx.fillText('手動 fillText 排字，沒有原生 DOM 互動與文字選取',0,bh*.33,bw*.90);
    ctx.restore();
    this.draws++;this.observeDraw(performance.now()-t0);
  }
  observeDraw(ms){this.durations.push(ms);if(this.durations.length>200)this.durations.shift();}
  fail(err){
    if(this.ended)return;
    this.lastError=String(err?.message||err);
    this.ended=true;
    this.stage.classList.add('error');
    this.onFault?.(this.lastError);
  }
  metrics(){
    const sorted=[...this.durations].sort((a,b)=>a-b);
    const p95=sorted.length?sorted[Math.ceil(.95*sorted.length)-1].toFixed(2)+' ms':'—';
    return {draws:this.draws,paints:this.paints,p95,mode:this.mode,error:this.lastError};
  }
}
