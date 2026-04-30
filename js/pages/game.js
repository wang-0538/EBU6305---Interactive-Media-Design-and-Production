const drawings=[
{name:'House',draw(ctx,w,h){
ctx.beginPath();ctx.moveTo(w*.1,h*.88);ctx.lineTo(w*.9,h*.88);ctx.stroke();
ctx.strokeRect(w*.22,h*.42,w*.56,h*.42);
ctx.beginPath();ctx.moveTo(w*.16,h*.42);ctx.lineTo(w*.5,h*.12);ctx.lineTo(w*.84,h*.42);ctx.closePath();ctx.stroke();
ctx.beginPath();ctx.moveTo(w*.25,h*.42);ctx.lineTo(w*.5,h*.22);ctx.lineTo(w*.75,h*.42);ctx.closePath();ctx.stroke();
ctx.strokeRect(w*.61,h*.19,w*.09,h*.15);ctx.strokeRect(w*.595,h*.16,w*.12,h*.03);
ctx.beginPath();ctx.moveTo(w*.44,h*.84);ctx.lineTo(w*.44,h*.64);ctx.quadraticCurveTo(w*.5,h*.54,w*.56,h*.64);ctx.lineTo(w*.56,h*.84);ctx.closePath();ctx.stroke();
ctx.beginPath();ctx.moveTo(w*.5,h*.84);ctx.lineTo(w*.5,h*.6);ctx.stroke();
ctx.beginPath();ctx.arc(w*.535,h*.73,Math.max(2,w*.006),0,Math.PI*2);ctx.stroke();
const win=x=>{ctx.strokeRect(w*x,h*.54,w*.12,h*.13);ctx.beginPath();ctx.moveTo(w*(x+.06),h*.54);ctx.lineTo(w*(x+.06),h*.67);ctx.moveTo(w*x,h*.605);ctx.lineTo(w*(x+.12),h*.605);ctx.stroke();ctx.beginPath();ctx.moveTo(w*(x-.01),h*.54);ctx.lineTo(w*(x+.06),h*.5);ctx.lineTo(w*(x+.13),h*.54);ctx.closePath();ctx.stroke();};
win(.29);win(.59);
ctx.beginPath();ctx.moveTo(w*.46,h*.84);ctx.lineTo(w*.4,h*.93);ctx.lineTo(w*.6,h*.93);ctx.lineTo(w*.54,h*.84);ctx.closePath();ctx.stroke();
}},
{
    name:'FancyFish',
    draw(ctx,w,h){
    
    const cx=w*0.5, cy=h*0.55;
    
    // body
    ctx.beginPath();
    ctx.ellipse(cx,cy,w*0.25,h*0.18,0,0,Math.PI*2);
    ctx.closePath();
    ctx.stroke();
    
    // tail
    ctx.beginPath();
    ctx.moveTo(w*0.75,cy);
    ctx.lineTo(w*0.92,h*0.42);
    ctx.lineTo(w*0.92,h*0.68);
    ctx.closePath();
    ctx.stroke();
    
    // dorsal fin
    ctx.beginPath();
    ctx.moveTo(w*0.48,h*0.38);
    ctx.quadraticCurveTo(w*0.55,h*0.22,w*0.63,h*0.40);
    ctx.closePath();
    ctx.stroke();
    
    // bottom fin
    ctx.beginPath();
    ctx.moveTo(w*0.50,h*0.72);
    ctx.quadraticCurveTo(w*0.58,h*0.85,w*0.66,h*0.70);
    ctx.closePath();
    ctx.stroke();
    
    // side fin
    ctx.beginPath();
    ctx.moveTo(w*0.55,h*0.55);
    ctx.quadraticCurveTo(w*0.62,h*0.50,w*0.60,h*0.63);
    ctx.closePath();
    ctx.stroke();
    
    // eye outer
    ctx.beginPath();
    ctx.arc(w*0.38,h*0.52,w*0.030,0,Math.PI*2);
    ctx.closePath();
    ctx.stroke();
    
    // eye inner
    ctx.beginPath();
    ctx.arc(w*0.38,h*0.52,w*0.010,0,Math.PI*2);
    ctx.closePath();
    ctx.stroke();
    
    // mouth
    ctx.beginPath();
    ctx.arc(w*0.29,h*0.59,w*0.009,0,Math.PI*2);
    ctx.closePath();
    ctx.stroke();
    
    // scales

    
    // bubbles
    [[0.18,0.32,0.03],[0.14,0.22,0.02],[0.22,0.18,0.015]].forEach(([x,y,r])=>{
    ctx.beginPath();
    ctx.arc(w*x,h*y,w*r,0,Math.PI*2);
    ctx.closePath();
    ctx.stroke();
    });
    
    }
    },
{name:'Flower',draw(ctx,w,h){
const cx=w*.5,cy=h*.38;
for(let i=0;i<12;i++){const a=i/12*Math.PI*2,x=cx+Math.cos(a)*w*.14,y=cy+Math.sin(a)*h*.14;ctx.beginPath();ctx.ellipse(x,y,w*.065,h*.1,a,0,Math.PI*2);ctx.closePath();ctx.stroke();}
ctx.beginPath();ctx.arc(cx,cy,w*.085,0,Math.PI*2);ctx.closePath();ctx.stroke();
[[-.03,-.02],[.02,-.03],[0,0],[-.025,.03],[.03,.02]].forEach(([dx,dy])=>{ctx.beginPath();ctx.arc(cx+w*dx,cy+h*dy,w*.012,0,Math.PI*2);ctx.closePath();ctx.stroke();});
ctx.beginPath();ctx.moveTo(cx-w*.015,cy+h*.1);ctx.lineTo(cx-w*.03,h*.88);ctx.lineTo(cx+w*.03,h*.88);ctx.lineTo(cx+w*.015,cy+h*.1);ctx.closePath();ctx.stroke();
const leaf=(x1,y1,c1x,c1y,tx,ty,c2x,c2y)=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.bezierCurveTo(c1x,c1y,tx,ty,tx,ty);ctx.bezierCurveTo(c2x,c2y,x1,y1,x1,y1);ctx.closePath();ctx.stroke();};
leaf(cx-w*.01,cy+h*.35,cx-w*.2,cy+h*.28,cx-w*.25,cy+h*.43,cx-w*.11,cy+h*.5);
leaf(cx+w*.01,cy+h*.44,cx+w*.22,cy+h*.36,cx+w*.28,cy+h*.52,cx+w*.12,cy+h*.58);
ctx.beginPath();ctx.moveTo(w*.36,h*.88);ctx.lineTo(w*.64,h*.88);ctx.lineTo(w*.6,h*.98);ctx.lineTo(w*.4,h*.98);ctx.closePath();ctx.stroke();ctx.strokeRect(w*.35,h*.85,w*.3,h*.03);
}},
{name:'Car',draw(ctx,w,h){
ctx.beginPath();ctx.moveTo(w*.14,h*.71);ctx.lineTo(w*.2,h*.55);ctx.lineTo(w*.34,h*.45);ctx.lineTo(w*.63,h*.45);ctx.lineTo(w*.78,h*.56);ctx.lineTo(w*.86,h*.71);ctx.closePath();ctx.stroke();
ctx.beginPath();ctx.moveTo(w*.14,h*.71);ctx.lineTo(w*.86,h*.71);ctx.lineTo(w*.86,h*.82);ctx.lineTo(w*.14,h*.82);ctx.closePath();ctx.stroke();
ctx.beginPath();ctx.moveTo(w*.28,h*.56);ctx.lineTo(w*.37,h*.49);ctx.lineTo(w*.49,h*.49);ctx.lineTo(w*.49,h*.64);ctx.lineTo(w*.28,h*.64);ctx.closePath();ctx.stroke();
ctx.beginPath();ctx.moveTo(w*.52,h*.49);ctx.lineTo(w*.62,h*.49);ctx.lineTo(w*.73,h*.57);ctx.lineTo(w*.73,h*.64);ctx.lineTo(w*.52,h*.64);ctx.closePath();ctx.stroke();
const wheel=x=>{ctx.beginPath();ctx.arc(w*x,h*.82,w*.09,0,Math.PI*2);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(w*x,h*.82,w*.045,0,Math.PI*2);ctx.closePath();ctx.stroke();};
wheel(.31);wheel(.69);ctx.strokeRect(w*.18,h*.67,w*.08,h*.045);ctx.strokeRect(w*.74,h*.67,w*.08,h*.045);
ctx.beginPath();ctx.moveTo(w*.47,h*.64);ctx.lineTo(w*.47,h*.82);ctx.stroke();ctx.beginPath();ctx.moveTo(w*.18,h*.82);ctx.lineTo(w*.82,h*.82);ctx.stroke();
}},
{name:'Tree',draw(ctx,w,h){
const cx=w*.5;
ctx.beginPath();ctx.arc(cx,h*.34,w*.22,0,Math.PI*2);ctx.closePath();ctx.stroke();
ctx.beginPath();ctx.moveTo(w*.46,h*.92);ctx.lineTo(w*.44,h*.56);ctx.lineTo(w*.56,h*.56);ctx.lineTo(w*.54,h*.92);ctx.closePath();ctx.stroke();
ctx.beginPath();ctx.moveTo(w*.08,h*.94);ctx.lineTo(w*.92,h*.94);ctx.stroke();
}},
{name:'Cat',draw(ctx,w,h){
const cx=w*.5,cy=h*.48;
ctx.beginPath();ctx.arc(cx,cy,w*.26,0,Math.PI*2);ctx.closePath();ctx.stroke();
ctx.beginPath();ctx.moveTo(cx-w*.22,cy-h*.12);ctx.lineTo(cx-w*.32,cy-h*.34);ctx.lineTo(cx-w*.1,cy-h*.22);ctx.closePath();ctx.stroke();
ctx.beginPath();ctx.moveTo(cx+w*.22,cy-h*.12);ctx.lineTo(cx+w*.32,cy-h*.34);ctx.lineTo(cx+w*.1,cy-h*.22);ctx.closePath();ctx.stroke();
ctx.beginPath();ctx.arc(cx-w*.1,cy-h*.02,w*.038,0,Math.PI*2);ctx.closePath();ctx.stroke();
ctx.beginPath();ctx.arc(cx+w*.1,cy-h*.02,w*.038,0,Math.PI*2);ctx.closePath();ctx.stroke();
ctx.beginPath();ctx.moveTo(cx,cy+h*.02);ctx.lineTo(cx-w*.045,cy+h*.1);ctx.lineTo(cx+w*.045,cy+h*.1);ctx.closePath();ctx.stroke();
ctx.beginPath();ctx.moveTo(cx,cy+h*.1);ctx.quadraticCurveTo(cx-w*.08,cy+h*.16,cx-w*.14,cy+h*.14);ctx.stroke();
ctx.beginPath();ctx.moveTo(cx,cy+h*.1);ctx.quadraticCurveTo(cx+w*.08,cy+h*.16,cx+w*.14,cy+h*.14);ctx.stroke();
ctx.beginPath();ctx.moveTo(cx-w*.24,cy+h*.06);ctx.lineTo(cx-w*.4,cy+h*.04);ctx.stroke();
ctx.beginPath();ctx.moveTo(cx-w*.24,cy+h*.1);ctx.lineTo(cx-w*.4,cy+h*.12);ctx.stroke();
ctx.beginPath();ctx.moveTo(cx+w*.24,cy+h*.06);ctx.lineTo(cx+w*.4,cy+h*.04);ctx.stroke();
ctx.beginPath();ctx.moveTo(cx+w*.24,cy+h*.1);ctx.lineTo(cx+w*.4,cy+h*.12);ctx.stroke();
}},
{name:'Sailboat',draw(ctx,w,h){
ctx.beginPath();ctx.moveTo(w*.06,h*.76);ctx.quadraticCurveTo(w*.22,h*.7,w*.42,h*.76);ctx.quadraticCurveTo(w*.62,h*.82,w*.94,h*.72);ctx.stroke();
ctx.beginPath();ctx.moveTo(w*.3,h*.74);ctx.lineTo(w*.38,h*.9);ctx.lineTo(w*.62,h*.9);ctx.lineTo(w*.7,h*.74);ctx.closePath();ctx.stroke();
ctx.beginPath();ctx.moveTo(w*.5,h*.74);ctx.lineTo(w*.5,h*.28);ctx.stroke();
ctx.beginPath();ctx.moveTo(w*.52,h*.32);ctx.lineTo(w*.82,h*.62);ctx.lineTo(w*.52,h*.62);ctx.closePath();ctx.stroke();
ctx.beginPath();ctx.moveTo(w*.5,h*.28);ctx.lineTo(w*.38,h*.22);ctx.lineTo(w*.5,h*.18);ctx.closePath();ctx.stroke();
}},
{name:'Mushroom',draw(ctx,w,h){
const cx=w*.5;
ctx.beginPath();ctx.arc(cx,h*.4,w*.27,Math.PI,0);ctx.closePath();ctx.stroke();
[[-.14,-.08,.035],[.06,-.12,.03],[-.02,-.15,.028]].forEach(([dx,dy,r])=>{ctx.beginPath();ctx.arc(cx+w*dx,h*.4+h*dy,w*r,0,Math.PI*2);ctx.closePath();ctx.stroke();});
ctx.beginPath();ctx.moveTo(cx-w*.14,h*.4);ctx.lineTo(cx-w*.11,h*.86);ctx.quadraticCurveTo(cx,h*.92,cx+w*.11,h*.86);ctx.lineTo(cx+w*.14,h*.4);ctx.closePath();ctx.stroke();
ctx.beginPath();ctx.moveTo(w*.18,h*.94);ctx.lineTo(w*.82,h*.94);ctx.stroke();
}}
];

const galleryView=document.getElementById('gallery-view');
const editorView=document.getElementById('editor-view');
const editorTitle=document.getElementById('editor-title');
const editorCanvas=document.getElementById('editor-canvas');
const editorCtx=editorCanvas.getContext('2d',{willReadFrequently:true});
const colorPreview=document.getElementById('color-preview');
const recentPalette=document.getElementById('recent-palette');
const backBtn=document.getElementById('back-to-gallery');
const resetBtn=document.getElementById('reset-drawing');
const saveBtn=document.getElementById('save-image');
const shareCommunityBtn=document.getElementById('share-community');
const fillToolBtn=document.getElementById('tool-fill');
const eraserToolBtn=document.getElementById('tool-eraser');
const colorModelSelect=document.getElementById('color-model');
const gameModeSelect=document.getElementById('game-mode');
const challengePanel=document.getElementById('challenge-panel');
const challengeSampleCanvas=document.getElementById('challenge-sample-canvas');
const challengeSampleCtx=challengeSampleCanvas.getContext('2d');
const submitChallengeBtn=document.getElementById('submit-challenge');
const challengeScoreEl=document.getElementById('challenge-score');

const rgbInputs={r:document.getElementById('rgb-r'),g:document.getElementById('rgb-g'),b:document.getElementById('rgb-b'),rn:document.getElementById('rgb-r-number'),gn:document.getElementById('rgb-g-number'),bn:document.getElementById('rgb-b-number')};
const hsvInputs={h:document.getElementById('hsv-h'),s:document.getElementById('hsv-s'),v:document.getElementById('hsv-v'),hn:document.getElementById('hsv-h-number'),sn:document.getElementById('hsv-s-number'),vn:document.getElementById('hsv-v-number')};
const cmykInputs={c:document.getElementById('cmyk-c'),m:document.getElementById('cmyk-m'),y:document.getElementById('cmyk-y'),k:document.getElementById('cmyk-k'),cn:document.getElementById('cmyk-c-number'),mn:document.getElementById('cmyk-m-number'),yn:document.getElementById('cmyk-y-number'),kn:document.getElementById('cmyk-k-number')};
const modelGroups={rgb:document.getElementById('controls-rgb'),hsv:document.getElementById('controls-hsv'),cmyk:document.getElementById('controls-cmyk')};
const fillProgressLabel=document.getElementById('fill-progress-label');
const fillProgressTrack=document.getElementById('fill-progress-track');
const fillProgressFill=document.getElementById('fill-progress-fill');
const sessionTimeEl=document.getElementById('session-time');
const completionTimeEl=document.getElementById('completion-time');
const colorAdjustCountEl=document.getElementById('color-adjust-count');
const editorControlsPanel=document.querySelector('.editor-view .controls');
const editorStatsEl=document.querySelector('.editor-stats');
const canvasPane=document.querySelector('.canvas-pane');

let activeDrawingIndex=0;let activeTool='fill';
let recentColors=[];
let editorBaselineSnapshot=null;
let sessionStartMs=0;let sessionTimerId=null;let reachedFullCompletion=false;let completionElapsedMs=null;let colorAdjustCount=0;
let activeGameMode='standard';
let challengeRegionMap=null;let challengeRegions=[];let challengeTemplateColors=[];

function setSketchStyle(ctx,scale=1){ctx.lineWidth=Math.max(4*scale,1);ctx.strokeStyle='#000';ctx.lineCap='round';ctx.lineJoin='round';}
function drawPreview(index){const canvas=document.getElementById(`preview-${index}`);if(!canvas)return;const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);setSketchStyle(ctx,.5);drawings[index].draw(ctx,canvas.width,canvas.height);}
function drawEditor(index){const w=editorCanvas.width,h=editorCanvas.height;editorCtx.clearRect(0,0,w,h);editorCtx.fillStyle='#fff';editorCtx.fillRect(0,0,w,h);setSketchStyle(editorCtx,1);drawings[index].draw(editorCtx,w,h);const snap=editorCtx.getImageData(0,0,w,h);editorBaselineSnapshot=new ImageData(new Uint8ClampedArray(snap.data),w,h);refreshSessionStats();}

function isStrokePixel(r,g,b){return r<35&&g<35&&b<35;}
function computePaintProgress(baseline,current){const b=baseline.data,c=current.data;let total=0,filled=0;for(let i=0;i<b.length;i+=4){const br=b[i],bg=b[i+1],bb=b[i+2],ba=b[i+3];if(ba<250)continue;if(isStrokePixel(br,bg,bb))continue;total++;const cr=c[i],cg=c[i+1],cb=c[i+2];if(Math.abs(cr-br)>2||Math.abs(cg-bg)>2||Math.abs(cb-bb)>2)filled++;}const pct=total===0?0:Math.min(100,Math.round((filled/total)*100));return{total,filled,pct};}
function formatDuration(ms){const s=Math.floor(ms/1000),m=Math.floor(s/60),sec=s%60;return`${m}:${String(sec).padStart(2,'0')}`;}
function updateColorAdjustDisplay(){if(colorAdjustCountEl)colorAdjustCountEl.textContent=`Color adjustments: ${colorAdjustCount}`;}
function updateTimerDisplay(){if(!sessionTimeEl||editorView.hidden)return;sessionTimeEl.textContent=`Session time: ${formatDuration(performance.now()-sessionStartMs)}`;}
function startEditorSession(){sessionStartMs=performance.now();reachedFullCompletion=false;completionElapsedMs=null;colorAdjustCount=0;if(sessionTimerId)clearInterval(sessionTimerId);sessionTimerId=setInterval(updateTimerDisplay,1000);updateTimerDisplay();if(completionTimeEl){completionTimeEl.hidden=true;completionTimeEl.textContent='Completed in: —';}updateColorAdjustDisplay();}
function stopEditorSession(){if(sessionTimerId){clearInterval(sessionTimerId);sessionTimerId=null;}}
function refreshSessionStats(){if(!editorBaselineSnapshot||editorView.hidden)return;const current=editorCtx.getImageData(0,0,editorCanvas.width,editorCanvas.height);const {total,filled,pct}=computePaintProgress(editorBaselineSnapshot,current);if(fillProgressLabel)fillProgressLabel.textContent=`${pct}% · ${filled.toLocaleString()} / ${total.toLocaleString()} px`;if(fillProgressFill)fillProgressFill.style.width=`${pct}%`;if(fillProgressTrack){fillProgressTrack.setAttribute('aria-valuenow',String(pct));fillProgressTrack.setAttribute('aria-valuetext',`${pct}% complete`);}if(total>0&&filled<total&&reachedFullCompletion){reachedFullCompletion=false;completionElapsedMs=null;if(completionTimeEl){completionTimeEl.hidden=true;completionTimeEl.textContent='Completed in: —';}}if(total>0&&filled===total&&!reachedFullCompletion){reachedFullCompletion=true;completionElapsedMs=performance.now()-sessionStartMs;if(completionTimeEl){completionTimeEl.hidden=false;completionTimeEl.textContent=`Completed in: ${formatDuration(completionElapsedMs)}`;}}}
function randomChallengeColor(){return[Math.floor(35+Math.random()*190),Math.floor(35+Math.random()*190),Math.floor(35+Math.random()*190)];}
function buildChallengeRegions(baseline){
const width=baseline.width,height=baseline.height,data=baseline.data,size=width*height,regionMap=new Int32Array(size);
regionMap.fill(-1);
const queueX=new Int32Array(size),queueY=new Int32Array(size),regions=[],edgeRegionSet=new Set();
let regionId=0;
for(let y=0;y<height;y++){
for(let x=0;x<width;x++){
const pixelIndex=y*width+x;
if(regionMap[pixelIndex]!==-1)continue;
const i4=pixelIndex*4;
if(data[i4+3]<250||isStrokePixel(data[i4],data[i4+1],data[i4+2])){continue;}
let head=0,tail=0;
queueX[tail]=x;queueY[tail]=y;tail++;
regionMap[pixelIndex]=regionId;
const pixels=[];
let touchesEdge=false;
while(head<tail){
const cx=queueX[head],cy=queueY[head];head++;
const cIndex=cy*width+cx;
pixels.push(cIndex);
if(cx===0||cy===0||cx===width-1||cy===height-1)touchesEdge=true;
const neighbors=[[cx-1,cy],[cx+1,cy],[cx,cy-1],[cx,cy+1]];
for(const [nx,ny] of neighbors){
if(nx<0||ny<0||nx>=width||ny>=height)continue;
const nIndex=ny*width+nx;
if(regionMap[nIndex]!==-1)continue;
const n4=nIndex*4;
if(data[n4+3]<250||isStrokePixel(data[n4],data[n4+1],data[n4+2]))continue;
regionMap[nIndex]=regionId;
queueX[tail]=nx;queueY[tail]=ny;tail++;
}
}
regions.push(pixels);
if(touchesEdge)edgeRegionSet.add(regionId);
regionId++;
}
}
const playableRegionIds=[];
regions.forEach((_,id)=>{if(!edgeRegionSet.has(id))playableRegionIds.push(id);});
return{regionMap,regions,playableRegionIds};
}
function drawChallengeSample(){
if(!editorBaselineSnapshot||!challengeSampleCtx)return;
challengeSampleCtx.clearRect(0,0,challengeSampleCanvas.width,challengeSampleCanvas.height);
challengeSampleCtx.fillStyle='#fff';
challengeSampleCtx.fillRect(0,0,challengeSampleCanvas.width,challengeSampleCanvas.height);
const sampleImageData=new ImageData(new Uint8ClampedArray(editorBaselineSnapshot.data),editorBaselineSnapshot.width,editorBaselineSnapshot.height);
const sampleData=sampleImageData.data;
for(const regionId of challengeRegions){
const color=challengeTemplateColors[regionId];
if(!color)continue;
const pixels=challengeRegionMap.regions[regionId];
for(let i=0;i<pixels.length;i++){
const idx4=pixels[i]*4;
sampleData[idx4]=color[0];
sampleData[idx4+1]=color[1];
sampleData[idx4+2]=color[2];
sampleData[idx4+3]=255;
}
}
const offscreen=document.createElement('canvas');
offscreen.width=sampleImageData.width;offscreen.height=sampleImageData.height;
offscreen.getContext('2d').putImageData(sampleImageData,0,0);
challengeSampleCtx.drawImage(offscreen,0,0,challengeSampleCanvas.width,challengeSampleCanvas.height);
}
function setupChallengeRound(){
if(!editorBaselineSnapshot){challengePanel.hidden=true;return;}
if(activeGameMode!=='challenge'){challengePanel.hidden=true;return;}
challengePanel.hidden=false;
challengeScoreEl.textContent='Score: —';
challengeRegionMap=buildChallengeRegions(editorBaselineSnapshot);
challengeRegions=challengeRegionMap.playableRegionIds;
challengeTemplateColors=[];
challengeRegions.forEach((regionId)=>{challengeTemplateColors[regionId]=randomChallengeColor();});
drawChallengeSample();
}
function scoreChallenge(){
if(activeGameMode!=='challenge'||!challengeRegionMap||!challengeRegions.length){challengeScoreEl.textContent='Score: No playable regions found.';return;}
const current=editorCtx.getImageData(0,0,editorCanvas.width,editorCanvas.height).data;
let totalSimilarity=0;
for(let r=0;r<challengeRegions.length;r++){
const regionId=challengeRegions[r],pixels=challengeRegionMap.regions[regionId],target=challengeTemplateColors[regionId];
let sumR=0,sumG=0,sumB=0;
for(let i=0;i<pixels.length;i++){
const idx4=pixels[i]*4;
sumR+=current[idx4];sumG+=current[idx4+1];sumB+=current[idx4+2];
}
const count=pixels.length||1;
const avgR=sumR/count,avgG=sumG/count,avgB=sumB/count;
const diff=Math.sqrt((avgR-target[0])**2+(avgG-target[1])**2+(avgB-target[2])**2);
const similarity=1-Math.min(1,diff/441.67295593);
totalSimilarity+=similarity;
}
const finalScore=Math.round((totalSimilarity/challengeRegions.length)*100);
challengeScoreEl.textContent=`Score: ${finalScore}/100 (${challengeRegions.length} regions compared)`;
}

function clampRange(v,min,max){return Math.min(max,Math.max(min,Number(v)||0));}
function hsvToRgb(h,s,v){const hh=((h%360)+360)%360,sat=s/100,val=v/100,c=val*sat,x=c*(1-Math.abs((hh/60)%2-1)),m=val-c;let r1=0,g1=0,b1=0;if(hh<60){r1=c;g1=x;}else if(hh<120){r1=x;g1=c;}else if(hh<180){g1=c;b1=x;}else if(hh<240){g1=x;b1=c;}else if(hh<300){r1=x;b1=c;}else{r1=c;b1=x;}return{r:Math.round((r1+m)*255),g:Math.round((g1+m)*255),b:Math.round((b1+m)*255)};}
function cmykToRgb(c,m,y,k){const cc=c/100,mm=m/100,yy=y/100,kk=k/100;return{r:Math.round(255*(1-cc)*(1-kk)),g:Math.round(255*(1-mm)*(1-kk)),b:Math.round(255*(1-yy)*(1-kk))};}
function getCurrentRgb(){const model=colorModelSelect.value;if(model==='hsv')return hsvToRgb(Number(hsvInputs.h.value),Number(hsvInputs.s.value),Number(hsvInputs.v.value));if(model==='cmyk')return cmykToRgb(Number(cmykInputs.c.value),Number(cmykInputs.m.value),Number(cmykInputs.y.value),Number(cmykInputs.k.value));return{r:Number(rgbInputs.r.value),g:Number(rgbInputs.g.value),b:Number(rgbInputs.b.value)};}
function rgbString({r,g,b}){return `rgb(${r}, ${g}, ${b})`;}
function rgbToHex({r,g,b}){return`#${[r,g,b].map((v)=>Math.max(0,Math.min(255,Number(v)||0)).toString(16).padStart(2,'0')).join('')}`;}
function colorsEqual(a,b){return a&&b&&a.r===b.r&&a.g===b.g&&a.b===b.b;}
function applyRgbToInputs(color){if(!color)return;colorModelSelect.value='rgb';setVisibleModelGroup('rgb');rgbInputs.r.value=String(color.r);rgbInputs.rn.value=String(color.r);rgbInputs.g.value=String(color.g);rgbInputs.gn.value=String(color.g);rgbInputs.b.value=String(color.b);rgbInputs.bn.value=String(color.b);updateColorPreview();}
function renderRecentPalette(){if(!recentPalette)return;recentPalette.innerHTML='';const list=recentColors.slice(0,5);for(let i=0;i<5;i++){const swatch=document.createElement('button');swatch.type='button';swatch.className='palette-swatch';swatch.setAttribute('aria-label',`Recent color ${i+1}`);if(list[i]){swatch.style.background=rgbString(list[i]);swatch.title=rgbString(list[i]);swatch.addEventListener('click',()=>applyRgbToInputs(list[i]));}else{swatch.style.background='#fff';swatch.disabled=true;}recentPalette.appendChild(swatch);}}
function pushRecentColor(color){if(!color)return;if(recentColors.length&&colorsEqual(recentColors[0],color))return;recentColors=recentColors.filter((c)=>!colorsEqual(c,color));recentColors.unshift({r:color.r,g:color.g,b:color.b});if(recentColors.length>5)recentColors=recentColors.slice(0,5);renderRecentPalette();}
function updateColorPreview(){const color=getCurrentRgb();colorPreview.style.background=rgbString(color);pushRecentColor(color);}

function bindPair(rangeInput,numberInput){const min=Number(rangeInput.min),max=Number(rangeInput.max);rangeInput.addEventListener('input',()=>{numberInput.value=rangeInput.value;updateColorPreview();});numberInput.addEventListener('input',()=>{numberInput.value=String(clampRange(numberInput.value,min,max));rangeInput.value=numberInput.value;updateColorPreview();});}
function setVisibleModelGroup(model){modelGroups.rgb.hidden=model!=='rgb';modelGroups.hsv.hidden=model!=='hsv';modelGroups.cmyk.hidden=model!=='cmyk';}
function bindModelControls(){bindPair(rgbInputs.r,rgbInputs.rn);bindPair(rgbInputs.g,rgbInputs.gn);bindPair(rgbInputs.b,rgbInputs.bn);bindPair(hsvInputs.h,hsvInputs.hn);bindPair(hsvInputs.s,hsvInputs.sn);bindPair(hsvInputs.v,hsvInputs.vn);bindPair(cmykInputs.c,cmykInputs.cn);bindPair(cmykInputs.m,cmykInputs.mn);bindPair(cmykInputs.y,cmykInputs.yn);bindPair(cmykInputs.k,cmykInputs.kn);colorModelSelect.addEventListener('change',()=>{setVisibleModelGroup(colorModelSelect.value);updateColorPreview();});}

function colorMatch(data,index,target,t=14){return Math.abs(data[index]-target[0])<=t&&Math.abs(data[index+1]-target[1])<=t&&Math.abs(data[index+2]-target[2])<=t&&data[index+3]===target[3];}
function canFillPixel(data,index,target){const isBlackLine=data[index]<35&&data[index+1]<35&&data[index+2]<35;if(isBlackLine)return false;return colorMatch(data,index,target,14);}
function floodFill(startX,startY,fillColor){const width=editorCanvas.width,height=editorCanvas.height;if(startX<0||startY<0||startX>=width||startY>=height)return;const imageData=editorCtx.getImageData(0,0,width,height),data=imageData.data,startIdx=(startY*width+startX)*4,target=[data[startIdx],data[startIdx+1],data[startIdx+2],data[startIdx+3]];if(target[0]===fillColor[0]&&target[1]===fillColor[1]&&target[2]===fillColor[2]&&target[3]===255)return;if(target[0]<35&&target[1]<35&&target[2]<35)return;const stack=[[startX,startY]];while(stack.length){const p=stack.pop();if(!p)continue;const [x,y]=p,idx=(y*width+x)*4;if(!canFillPixel(data,idx,target))continue;data[idx]=fillColor[0];data[idx+1]=fillColor[1];data[idx+2]=fillColor[2];data[idx+3]=255;if(x>0)stack.push([x-1,y]);if(x<width-1)stack.push([x+1,y]);if(y>0)stack.push([x,y-1]);if(y<height-1)stack.push([x,y+1]);}editorCtx.putImageData(imageData,0,0);refreshSessionStats();}

function setActiveTool(tool){activeTool=tool;fillToolBtn.classList.toggle('is-active',tool==='fill');eraserToolBtn.classList.toggle('is-active',tool==='eraser');}
function openEditor(index){activeDrawingIndex=index;editorTitle.textContent=`Painting Workspace: ${drawings[index].name}`;galleryView.hidden=true;editorView.hidden=false;setActiveTool('fill');startEditorSession();drawEditor(index);setupChallengeRound();}
function showGallery(){stopEditorSession();editorView.hidden=true;galleryView.hidden=false;challengePanel.hidden=true;}
function bindGalleryButtons(){document.querySelectorAll('[data-open-drawing]').forEach((button)=>{button.addEventListener('click',()=>{openEditor(Number(button.getAttribute('data-open-drawing')));});});}
function toCanvasCoords(event){const rect=editorCanvas.getBoundingClientRect(),scaleX=editorCanvas.width/rect.width,scaleY=editorCanvas.height/rect.height;return{x:Math.floor((event.clientX-rect.left)*scaleX),y:Math.floor((event.clientY-rect.top)*scaleY)};}
function bindEditorCanvas(){editorCanvas.addEventListener('click',(event)=>{const {x,y}=toCanvasCoords(event);if(activeTool==='eraser'){floodFill(x,y,[255,255,255]);return;}const {r,g,b}=getCurrentRgb();floodFill(x,y,[r,g,b]);});}
function resetCurrentDrawing(){startEditorSession();drawEditor(activeDrawingIndex);setupChallengeRound();} 
function saveCurrentCanvas(){const link=document.createElement('a');const safeName=drawings[activeDrawingIndex].name.toLowerCase();link.download=`${safeName}-painting.png`;link.href=editorCanvas.toDataURL('image/png');link.click();}
function shareCanvasToCommunity(){
const drawing=drawings[activeDrawingIndex];
const palette=recentColors.length?recentColors.slice(0,6).map(rgbToHex):[rgbToHex(getCurrentRgb())];
const draft={
content:`Game artwork: I painted ${drawing.name} and want to discuss my color choices.`,
tag:"#Palettes",
colorHex:palette[0]||"#2b78e4",
paletteHexes:palette,
includePalette:true,
includeImage:true,
imageDataUrl:editorCanvas.toDataURL('image/png'),
origin:"game",
originMeta:{
drawingName:drawing.name,
mode:activeGameMode,
fillProgress:fillProgressLabel?fillProgressLabel.textContent:""
},
updatedAt:new Date().toISOString()
};
try{localStorage.setItem("clw_community_draft_v1",JSON.stringify(draft));}catch(_error){return;}
document.dispatchEvent(new CustomEvent("clw:community-draft-updated",{detail:{origin:"game",drawingName:drawing.name}}));
window.location.href="community.html";
}
function bindToolActions(){fillToolBtn.addEventListener('click',()=>setActiveTool('fill'));eraserToolBtn.addEventListener('click',()=>setActiveTool('eraser'));resetBtn.addEventListener('click',resetCurrentDrawing);saveBtn.addEventListener('click',saveCurrentCanvas);if(shareCommunityBtn)shareCommunityBtn.addEventListener('click',shareCanvasToCommunity);}

function bindColorAdjustTracking(){if(!editorControlsPanel)return;editorControlsPanel.addEventListener('input',(e)=>{if(editorView.hidden)return;const t=e.target;if(t.matches&&t.matches('input[type="range"], input[type="number"]')){colorAdjustCount++;updateColorAdjustDisplay();}});}
function bindGameMode(){
if(!gameModeSelect)return;
gameModeSelect.addEventListener('change',()=>{
activeGameMode=gameModeSelect.value;
if(activeGameMode!=='challenge'){
challengePanel.hidden=true;
if(challengeScoreEl)challengeScoreEl.textContent='Score: —';
return;
}
if(!editorView.hidden){setupChallengeRound();}
});
}
function placeStatsAboveCanvas(){if(!editorStatsEl||!canvasPane)return;const canvasEl=document.getElementById('editor-canvas');if(canvasEl&&editorStatsEl.parentElement!==canvasPane){canvasPane.insertBefore(editorStatsEl,canvasEl);}}
function init(){activeGameMode=gameModeSelect?gameModeSelect.value:'standard';if(challengePanel)challengePanel.hidden=true;placeStatsAboveCanvas();drawings.forEach((_,index)=>drawPreview(index));bindGalleryButtons();bindModelControls();bindColorAdjustTracking();bindEditorCanvas();bindToolActions();bindGameMode();backBtn.addEventListener('click',showGallery);submitChallengeBtn.addEventListener('click',scoreChallenge);setVisibleModelGroup(colorModelSelect.value);updateColorPreview();showGallery();}
init();
