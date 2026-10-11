(function(global){
'use strict';
class Clock{
constructor(config){this.config=config;this.index=0;this.target=1;this.direction=1;this.phase='enter';this.elapsed=0;this.playing=true;this.ended=false;this.ambient=0;}
duration(){return(this.phase==='hold'?this.config.holdTime:this.phase==='enter'?this.config.inTime:this.config.outTime)*1000}
progress(){return Math.min(1,this.elapsed/this.duration())}
advance(dt){if(!this.playing)return;dt=Math.max(0,Math.min(dt,250));this.ambient+=dt*this.config.speed;if(this.manualHold&&this.phase==='hold'){this.elapsed=0;return}this.elapsed+=dt;let guard=0;while(this.elapsed>=this.duration()&&this.playing&&guard++<10){this.elapsed-=this.duration();if(this.phase==='enter'){this.phase='hold'}else if(this.phase==='hold'){if(!this.config.loop&&this.index===2){this.elapsed=this.duration();this.playing=false;this.ended=true;break}this.target=(this.index+1)%3;this.direction=1;this.phase=this.config.mode==='single'?'exit':'travel'}else if(this.phase==='exit'){this.index=this.target;this.phase='enter'}else{this.index=this.target;this.phase='hold'}}}
move(direction){const base=this.phase==='travel'||this.phase==='exit'?this.target:this.index;const next=(base+direction+3)%3;this.index=base;this.direction=direction;this.target=next;this.elapsed=0;this.ended=false;if(this.playing){this.phase=this.config.mode==='single'?'exit':'travel'}else{this.index=next;this.phase='hold'}}
toggle(){if(this.ended){this.index=0;this.target=1;this.phase='enter';this.elapsed=0;this.ended=false}this.playing=!this.playing}
restart(){this.index=0;this.target=1;this.direction=1;this.phase='enter';this.elapsed=0;this.ambient=0;this.ended=false;this.playing=true}
seek(value){this.playing=false;this.ended=false;const a=this.config.inTime*1000,b=this.config.holdTime*1000,c=this.config.outTime*1000;const t=Math.max(0,Math.min(.999999,value))*(a+b+c);this.direction=1;this.target=(this.index+1)%3;if(t<a){this.phase='enter';this.elapsed=t}else if(t<a+b){this.phase='hold';this.elapsed=t-a}else{this.phase=this.config.mode==='single'?'exit':'travel';this.elapsed=t-a-b}}
cycleProgress(){const a=this.config.inTime*1000,b=this.config.holdTime*1000,c=this.config.outTime*1000;return ((this.phase==='enter'?0:this.phase==='hold'?a:a+b)+this.elapsed)/(a+b+c)}
}
const smooth=t=>t*t*(3-2*t);
function slots(clock){const {index,target,phase,direction,config}=clock;const p=smooth(clock.progress());const rows=Array.from({length:3},()=>({x:0,y:0,scale:1,opacity:0,blur:0}));if(config.mode==='single'){rows[index].opacity=1;return rows}
const depth=config.mode==='depth',horizontal=config.mode==='horizontal';const distance=horizontal?88:depth?87:105;
function at(i,pos,opacity,scale){rows[i]={x:horizontal?pos*distance:0,y:horizontal?0:pos*distance,opacity,scale,blur:config.reduce?0:Math.abs(pos)*(depth?1.3:.5)}}
const next=(index+1)%3,prev=(index+2)%3;
if(phase==='travel'){
 const currentEnd=direction===1?(depth?.14:0):.24;
 at(index,-direction*p,1+(currentEnd-1)*p,1-p*.36);
 const targetStart=direction===1?.24:depth?.14:0;
 at(target,direction*(1-p),targetStart+(1-targetStart)*p,.64+.36*p);
 const third=3-index-target;
 if(depth){const first=p<.5;const q=first?p*2:(p-.5)*2;const startOpacity=direction===1?.14:.24;const endOpacity=direction===1?.24:.14;at(third,first?-direction*(1+p):direction*(2-q),first?startOpacity*(1-q):endOpacity*q,.6)}
 else if(direction===1){at(third,2-p,.24*p,.64)}
 else{at(third,1+p,.24*(1-p),.64)}
}else{at(index,0,1,1);at(next,1,.24,.64);if(depth)at(prev,-1,.14,.6)}return rows}
const api={Clock,slots,smooth};global.MotionCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
