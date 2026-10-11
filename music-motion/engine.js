/* Music Motion Lab: shared audio analysis for all visual layers. Original implementation. */
(function(root){
'use strict';
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,Number.isFinite(v)?v:a));
function summarize(freq,wave,sampleRate,fftSize){
 let sum=0;for(let i=0;i<wave.length;i++)sum+=wave[i]*wave[i];const rms=Math.sqrt(sum/Math.max(1,wave.length));
 const means=[0,0,0],counts=[0,0,0],edges=[30,250,2500,12000];
 for(let i=1;i<freq.length;i++){const hz=i*sampleRate/fftSize;for(let b=0;b<3;b++)if(hz>=edges[b]&&hz<edges[b+1]){means[b]+=freq[i]/255;counts[b]++;}}
 return {rms,level:clamp(rms*5.8),low:rms<.0025?0:clamp(means[0]/Math.max(1,counts[0])*1.7),mid:rms<.0025?0:clamp(means[1]/Math.max(1,counts[1])*1.7),high:rms<.0025?0:clamp(means[2]/Math.max(1,counts[2])*2)};
}
class SignalEngine{
 constructor(audio){this.audio=audio;this.mode='simulation';this.context=null;this.analyser=null;this.node=null;this.stream=null;this.fileNode=null;this.url=null;this.version=0;this.bpm=108;this.smoothing=.7;this.lastOnset=-100;this.meanEnergy=.05;this.meanFlux=.01;this.previousBins=new Float32Array(64);this.freq=new Uint8Array(1024);this.wave=new Float32Array(2048);this.signal={level:0,low:0,mid:0,high:0,pulse:0,beat:0,travel:0};this.simTime=0;this.lastSimBeat=-1;this.demoBpm=108;this.onStatus=()=>{};this.beforeSuspend=()=>{};}
 async contextReady(){
  const AC=root.AudioContext||root.webkitAudioContext;if(!AC)throw new Error('這個瀏覽器無法啟用聲音分析，仍可使用無聲模擬。');
  if(!this.context){this.context=new AC();this.analyser=this.context.createAnalyser();this.analyser.fftSize=2048;this.analyser.smoothingTimeConstant=.35;this.master=this.context.createGain();this.master.gain.value=.75;this.master.connect(this.context.destination);this.context.onstatechange=()=>{if(this.context.state==='interrupted')this.onStatus('聲音已被裝置中斷，請重新啟動。');};}
  await this.context.resume();if(this.context.state!=='running')throw new Error('聲音尚未啟用，請再點一次播放。');
 }
 reset(){Object.assign(this.signal,{level:0,low:0,mid:0,high:0,pulse:0,beat:0,travel:0});this.previousBins.fill(0);this.lastOnset=-100;this.meanEnergy=.05;this.meanFlux=.01;this.lastSimBeat=-1;this.simTime=0;}
 detach(){
  this.version++;if(this.node){try{this.node.stop();}catch{}try{this.node.disconnect();}catch{}this.node=null;}
  if(this.fileNode){try{this.fileNode.disconnect();}catch{}}if(this.stream){this.stream.getTracks().forEach(t=>t.stop());this.stream=null;}if(this.micNode){try{this.micNode.disconnect();}catch{}this.micNode=null;}
  this.audio.pause();if(this.analyser){try{this.analyser.disconnect();}catch{}}this.reset();
 }
 simulate(){this.detach();this.mode='simulation';this.onStatus('模擬節奏 · 無聲');}
 async demo(){
  this.detach();const token=this.version;this.mode='starting';const ready=this.contextReady();await ready;if(token!==this.version)return;
  const ctx=this.context,rate=ctx.sampleRate,step=60/this.bpm/2,duration=step*32,buffer=ctx.createBuffer(2,Math.ceil(rate*duration),rate);this.demoBpm=this.bpm;
  const notes=[220,261.6256,329.6276,391.9954,440,391.9954,329.6276,261.6256];let seed=127;
  const rnd=()=>{seed=(Math.imul(seed,1103515245)+12345)|0;return (seed>>>0)/4294967296*2-1;};
  for(let k=0;k<32;k++){
   const offset=Math.round(k*step*rate),f=notes[Math.floor(k/2)%notes.length];const size=Math.min(buffer.length-offset,Math.floor(rate*.65));
   for(let j=0;j<size;j++){
    const t=j/rate,attack=Math.min(1,t/.008);let v=0;
    if(k%2===0)v+=Math.sin(2*Math.PI*(52*t+2.2*(1-Math.exp(-t*25))))*Math.exp(-t*11)*.24;
    if(k%8===4)v+=rnd()*Math.exp(-t*28)*.09;
    if(j<rate*.05)v+=rnd()*Math.exp(-t*90)*.035;
    if(k%2===1)v+=(Math.sin(2*Math.PI*f*t)+.25*Math.sin(2*Math.PI*f*2*t))*Math.exp(-t*5)*.075;
    v*=attack;buffer.getChannelData(0)[offset+j]+=v*.85;buffer.getChannelData(1)[offset+j]+=v*(k%4<2?.75:1);
   }
  }
  this.node=ctx.createBufferSource();this.node.buffer=buffer;this.node.loop=true;this.node.connect(this.analyser);this.analyser.connect(this.master);this.node.start();this.mode='demo';this.onStatus('示範音樂 · 即時分析');
 }
 async loadFile(file){
  if(!file) return;if(!(file.type.startsWith('audio/')||/\.(mp3|wav|m4a|aac|ogg|flac|opus|webm)$/i.test(file.name)))throw new Error('請選擇瀏覽器可播放的音樂檔。');
  this.detach();this.mode='file';if(this.url)URL.revokeObjectURL(this.url);this.url=URL.createObjectURL(file);this.audio.src=this.url;this.audio.load();const token=this.version;
  await this.contextReady();if(token!==this.version)return;this.attachFile();await this.audio.play();this.onStatus('音樂檔 · '+file.name);
 }
 attachFile(){if(!this.fileNode)this.fileNode=this.context.createMediaElementSource(this.audio);try{this.fileNode.disconnect();}catch{}try{this.analyser.disconnect();}catch{}this.fileNode.connect(this.analyser);this.analyser.connect(this.master);}
 async resumeFile(){if(this.mode!=='file'){this.detach();this.mode='file';}await this.contextReady();this.attachFile();this.onStatus('音樂檔 · 即時分析');}
 async microphone(){
  if(!root.navigator?.mediaDevices?.getUserMedia)throw new Error('這個瀏覽器無法收音，請使用音樂檔或示範音樂。');
  this.detach();this.mode='starting';const token=this.version;await this.contextReady();if(token!==this.version)return;
  const stream=await root.navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
  if(token!==this.version){stream.getTracks().forEach(t=>t.stop());return;}
  this.stream=stream;this.micNode=this.context.createMediaStreamSource(stream);this.micNode.connect(this.analyser);this.mode='microphone';this.onStatus('麥克風 · 僅分析，不回放');
  stream.getAudioTracks().forEach(t=>t.onended=()=>{if(this.stream===stream){this.simulate();this.onStatus('收音已中斷，已切回無聲模擬。');}});
 }
 tick(dt,now){
  dt=clamp(dt,0,.08);const s=this.signal;let target;
  if(this.mode==='simulation'){
   this.simTime+=dt;const beat=this.simTime*this.bpm/60,b=Math.floor(beat),q=beat-b;
   if(b!==this.lastSimBeat){this.lastSimBeat=b;s.beat++;s.pulse=1;}
   target={level:.18+.5*Math.exp(-q*5),low:.1+.65*Math.exp(-q*8),mid:.15+.38*(.5+.5*Math.sin(this.simTime*1.8)),high:.08+.38*Math.exp(-((beat*2)%1)*12)};
   for(let i=0;i<this.freq.length;i++)this.freq[i]=Math.floor(255*clamp((target.low*Math.exp(-i/30)+target.mid*Math.exp(-(((i-90)/65)**2))+target.high*Math.exp(-(((i-260)/130)**2)))*(.55+.45*Math.sin(i*.31+this.simTime*3)**2)));
   for(let i=0;i<this.wave.length;i++)this.wave[i]=Math.sin(i*.024+this.simTime*3)*target.level*.35+Math.sin(i*.062-this.simTime*2)*target.mid*.1;
  }else if(this.analyser&&this.context?.state==='running'&&['demo','file','microphone'].includes(this.mode)){
   this.analyser.getByteFrequencyData(this.freq);this.analyser.getFloatTimeDomainData(this.wave);target=summarize(this.freq,this.wave,this.context.sampleRate,this.analyser.fftSize);
   let flux=0;for(let i=0;i<64;i++){const v=this.freq[Math.min(this.freq.length-1,1+i*5)]/255;flux+=Math.max(0,v-this.previousBins[i]);this.previousBins[i]=v;}flux/=64;
   const gate=target.rms>.006,trigger=gate&&now-this.lastOnset>.28&&((flux>Math.max(.009,this.meanFlux*1.8))||(target.low>this.meanEnergy*1.3+.09&&target.level>.1));
   if(trigger){s.pulse=1;s.beat++;this.lastOnset=now;}
   this.meanEnergy+=(target.low-this.meanEnergy)*(1-Math.exp(-dt*2));this.meanFlux+=(flux-this.meanFlux)*(1-Math.exp(-dt*2));
  }else{target={level:0,low:0,mid:0,high:0};this.freq.fill(0);this.wave.fill(0);}
  const seconds=.03+this.smoothing*.32;
  for(const key of ['level','low','mid','high'])s[key]=clamp(s[key]+(target[key]-s[key])*(1-Math.exp(-dt/(target[key]>s[key]?seconds*.55:seconds))));
  s.pulse=clamp(s.pulse*Math.exp(-dt*7));s.travel+=s.level*dt;return s;
 }
 dispose(){this.detach();if(this.url)URL.revokeObjectURL(this.url);if(this.context)this.context.close().catch(()=>{});}
}
root.SignalEngine=SignalEngine;root.audioSummarize=summarize;if(typeof module!=='undefined')module.exports={SignalEngine,summarize};
})(typeof window!=='undefined'?window:globalThis);
