// Tiny stack VM: faithful interpreter of make.fun's tiny stack ISA v1.
// 32-bit wrapping ints, 256-value stack, 64-deep call stack, 256 words of
// memory, input/output, all ten traps with exact exit codes, 1e6-step and
// 65536-byte limits. Answers every /input/<id>/ (program.bin+input.bin),
// writes /output/<id>/stdout.bin + exit.txt. Node 22, no deps, deterministic.
import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const d of readdirSync(I).sort()){
let p,q;
try{p=readFileSync(join(I,d,'program.bin'));q=readFileSync(join(I,d,'input.bin'))}catch{p=new Uint8Array(0);q=p}
const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=new Uint8Array(65536);
let a=0,c=0,f=0,s=0,l=0,g=0,e=0;const n=p.length;
L:for(;;){
if(s===1e6){e=10;break}
if(f<0||f>=n){e=9;break}
const k=p[f];
if(!(k<8||(k>15&&k<35&&k!==31)||(k>47&&k<53)||k===64||k===65||(k>79&&k<84))){e=5;break}
const m=k===1?1:k===2?4:k>47&&k<52?2:0;
if(f+m>=n){e=9;break}
s++;
const x=f+1+m;
const u=k===7?3:k===5||k===6||k===65||(k>15&&k<35&&k!==23&&k!==27)?2:k===3||k===4||k===23||k===27||k===49||k===50||k===64||k===80||k===81||k===83?1:0;
const v=k===6||k===7?3:k===4||k===5?2:k===1||k===2||k===82||k===64||(k>15&&k<35)?1:0;
if(a<u){e=2;break}
if(a-u+v>256){e=3;break}
f=x;
switch(k){
case 0:e=0;break L;
case 1:D[a++]=(p[x-1]<<24)>>24;break;
case 2:D[a++]=p[x-4]|(p[x-3]<<8)|(p[x-2]<<16)|(p[x-1]<<24);break;
case 3:a--;break;
case 4:D[a]=D[a-1];a++;break;
case 5:{const t=D[a-1];D[a-1]=D[a-2];D[a-2]=t;break}
case 6:D[a]=D[a-2];a++;break;
case 7:{const t=D[a-3];D[a-3]=D[a-2];D[a-2]=D[a-1];D[a-1]=t;break}
case 23:D[a-1]=-D[a-1]|0;break;
case 27:D[a-1]=~D[a-1];break;
case 48:case 49:case 50:{const r=((p[x-2]|(p[x-1]<<8))<<16)>>16;let t=1;if(k!==48){const y=D[--a];t=k===49?(y===0?1:0):(y!==0?1:0)}if(t)f=x+r;break}
case 51:if(c===64){e=7;break L}C[c++]=x;f=p[x-2]|(p[x-1]<<8);break;
case 52:if(c===0){e=8;break L}f=C[--c];break;
case 64:{const y=D[a-1];if(y<0||y>255){e=6;break L}D[a-1]=M[y];break}
case 65:{const y=D[a-1],z=D[a-2];if(y<0||y>255){e=6;break L}a-=2;M[y]=z;break}
case 80:{const t=String(D[a-1]);if(l+t.length>65536){e=11;break L}a--;for(let i=0;i<t.length;i++)o[l++]=t.charCodeAt(i);break}
case 81:if(l>=65536){e=11;break L}o[l++]=D[--a]&255;break;
case 82:D[a++]=g<q.length?q[g++]:-1;break;
case 83:e=D[--a]&255;break L;
default:{const b=D[a-1],y=D[a-2];let r;
if(k===16)r=(y+b)|0;
else if(k===17)r=(y-b)|0;
else if(k===18)r=Math.imul(y,b);
else if(k===19){if(b===0){e=4;break L}r=(y/b)|0}
else if(k===20){if(b===0){e=4;break L}r=(y%b)|0}
else if(k===21){if(b===0){e=4;break L}r=((y>>>0)/(b>>>0))|0}
else if(k===22){if(b===0){e=4;break L}r=((y>>>0)%(b>>>0))|0}
else if(k===24)r=y&b;
else if(k===25)r=y|b;
else if(k===26)r=y^b;
else if(k===28)r=y<<(b&31);
else if(k===29)r=y>>(b&31);
else if(k===30)r=(y>>>(b&31))|0;
else if(k===32)r=y===b?1:0;
else if(k===33)r=y<b?1:0;
else r=(y>>>0)<(b>>>0)?1:0;
a-=2;D[a++]=r;break}
}
}
mkdirSync(join(O,d),{recursive:true});
writeFileSync(join(O,d,'stdout.bin'),o.subarray(0,l));
writeFileSync(join(O,d,'exit.txt'),e+'\n');
}
