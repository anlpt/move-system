(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,96284,e=>{"use strict";var t=e.i(43476),i=e.i(71645);function r(e,t,i,o=2){let l=0,n=0;for(let r of e){let e=Math.sqrt((r.x-t)**2+(r.y-i)**2);if(e<1e-10)return r.value;let s=1/e**o;l+=s*r.value,n+=s}return 0===n?0:l/n}function o(e){let t=e.length;if(t<3)return{nugget:0,sill:1,range:.05,model:"spherical"};let i=[];for(let r=0;r<t;r++)for(let o=r+1;o<t;o++){let t=Math.sqrt((e[r].x-e[o].x)**2+(e[r].y-e[o].y)**2),l=.5*(e[r].value-e[o].value)**2;i.push({h:t,gamma:l})}let r=e.map(e=>e.value),o=r.reduce((e,t)=>e+t,0)/t,l=r.reduce((e,t)=>e+(t-o)**2,0)/t,n=i.map(e=>e.h).sort((e,t)=>e-t);return{nugget:.05*l,sill:1.1*l,range:n[Math.floor(.6*n.length)]??.05,model:"spherical"}}let l={"RB-01":"Helmet Non-Compliance","RB-02":"Phone Use While Riding","RB-03":"Wrong-Way Riding","RB-04":"Lane Violation","RB-05":"Red Light Running","RB-06":"Double / Triple Riding","RB-07":"Pedestrian Conflict","RB-08":"Abrupt Stop in Flow","RB-09":"Overloading","RB-10":"Speeding in School Zone"},n={"RB-01":{label:"HIGH",color:"#ef4444"},"RB-02":{label:"HIGH",color:"#f97316"},"RB-03":{label:"HIGH",color:"#eab308"},"RB-04":{label:"MODERATE",color:"#84cc16"},"RB-05":{label:"MODERATE",color:"#22c55e"},"RB-06":{label:"MODERATE",color:"#06b6d4"},"RB-07":{label:"HIGH",color:"#3b82f6"},"RB-08":{label:"MODERATE",color:"#8b5cf6"},"RB-09":{label:"MODERATE",color:"#ec4899"},"RB-10":{label:"HIGH",color:"#f43f5e"}},s={h01:"District 1",h02:"District 1",h03:"District 1",h04:"District 3",h05:"District 3",h06:"District 3",h07:"District 5",h08:"District 5",h09:"District 5",h10:"District 6",h11:"District 6",h12:"District 7",h13:"District 7",h14:"District 8",h15:"District 8",h16:"District 10",h17:"District 10",h18:"Tân Bình",h19:"Tân Bình",h20:"Tân Bình",h21:"Bình Thạnh",h22:"Bình Thạnh",h23:"Bình Thạnh",h24:"Phú Nhuận",h25:"Phú Nhuận",h26:"Gò Vấp",h27:"Gò Vấp",h28:"Gò Vấp",h29:"Thủ Đức",h30:"Thủ Đức"},a=`
  <rect width="320" height="155" fill="#0a1520"/>
  <rect x="0" y="98" width="320" height="57" fill="#060c14"/>
  <line x1="0" y1="127" x2="320" y2="127" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="18,12"/>
  <line x1="0" y1="98"  x2="320" y2="98"  stroke="#1e293b" stroke-width="1"/>
`;function d(e,t="#475569"){let i=e-58,r=e+58;return`
    <circle cx="${i}" cy="113" r="14" fill="none" stroke="${t}" stroke-width="2.5"/>
    <circle cx="${i}" cy="113" r="3"  fill="${t}"/>
    <circle cx="${r}" cy="113" r="14" fill="none" stroke="${t}" stroke-width="2.5"/>
    <circle cx="${r}" cy="113" r="3"  fill="${t}"/>
    <line   x1="${i}" y1="99" x2="${i+42}" y2="85" stroke="${t}" stroke-width="3"/>
    <line   x1="${i+42}" y1="85" x2="${r}" y2="99" stroke="${t}" stroke-width="3"/>
    <line   x1="${i}" y1="99" x2="${r}"    y2="99" stroke="${t}" stroke-width="2"/>
    <line   x1="${r-12}" y1="85" x2="${r+14}" y2="79" stroke="${t}" stroke-width="2.5"/>
  `}function c(e,t="#64748b"){let i=e-14;return`
    <ellipse cx="${i}" cy="81" rx="13" ry="10" fill="${t}"/>
    <circle  cx="${i}" cy="67" r="9"           fill="${t}"/>
  `}let x={"RB-01":`<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${a}
    ${d(160)}${c(160,"#64748b")}
    <circle cx="146" cy="67" r="14" fill="none" stroke="#ef4444" stroke-width="2.5"/>
    <line   x1="136" y1="57" x2="156" y2="77"  stroke="#ef4444" stroke-width="2.5"/>
    <text x="160" y="148" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold" font-family="system-ui">NO HELMET DETECTED</text>
  </svg>`,"RB-02":`<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${a}
    ${d(160)}${c(160,"#64748b")}
    <rect x="118" y="59" width="14" height="20" rx="2" fill="#1d4ed8" stroke="#60a5fa" stroke-width="1.5"/>
    <rect x="120" y="62" width="10" height="12" rx="1" fill="#93c5fd" opacity=".7"/>
    <line x1="132" y1="67" x2="146" y2="67" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,2"/>
    <text x="160" y="148" text-anchor="middle" fill="#f97316" font-size="10" font-weight="bold" font-family="system-ui">PHONE USE WHILE RIDING</text>
  </svg>`,"RB-03":`<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${a}
    <polygon points="230,115 250,107 250,123" fill="#22c55e" opacity=".6"/>
    <line x1="170" y1="115" x2="248" y2="115" stroke="#22c55e" stroke-width="2" opacity=".6"/>
    <polygon points="240,130 260,122 260,138" fill="#22c55e" opacity=".4"/>
    <line x1="180" y1="130" x2="258" y2="130" stroke="#22c55e" stroke-width="1.5" opacity=".4"/>
    ${d(120,"#ef4444")}${c(120,"#ef4444")}
    <polygon points="70,108 50,115 70,122" fill="#ef4444"/>
    <text x="100" y="148" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold" font-family="system-ui">WRONG-WAY RIDING</text>
  </svg>`,"RB-04":`<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${a}
    <line x1="160" y1="98" x2="160" y2="155" stroke="#e2e8f0" stroke-width="2.5"/>
    ${d(195)}${c(195,"#64748b")}
    <line x1="154" y1="88" x2="170" y2="100" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="4,3"/>
    <circle cx="160" cy="93" r="8" fill="none" stroke="#f59e0b" stroke-width="2"/>
    <text x="175" y="148" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold" font-family="system-ui">LANE VIOLATION</text>
  </svg>`,"RB-05":`<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${a}
    <rect x="60"  y="18" width="28" height="72" rx="5" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <circle cx="74" cy="34" r="9" fill="#ef4444" filter="url(#glow)"/>
    <circle cx="74" cy="54" r="9" fill="#1e293b" stroke="#374151" stroke-width="1"/>
    <circle cx="74" cy="74" r="9" fill="#1e293b" stroke="#374151" stroke-width="1"/>
    <line x1="74" y1="90" x2="74" y2="155" stroke="#334155" stroke-width="2"/>
    <line x1="0"  y1="103" x2="320" y2="103" stroke="#e2e8f0" stroke-width="2.5"/>
    ${d(200,"#ef4444")}${c(200,"#ef4444")}
    <text x="200" y="148" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold" font-family="system-ui">RED LIGHT RUNNING</text>
  </svg>`,"RB-06":`<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${a}
    ${d(160)}
    <ellipse cx="130" cy="82" rx="11" ry="9" fill="#475569"/>
    <circle  cx="130" cy="70" r="8"          fill="#475569"/>
    <ellipse cx="152" cy="79" rx="11" ry="9" fill="#64748b"/>
    <circle  cx="152" cy="67" r="8"          fill="#64748b"/>
    <ellipse cx="173" cy="82" rx="10" ry="8" fill="#475569"/>
    <circle  cx="173" cy="71" r="7"          fill="#475569"/>
    <text x="160" y="16" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold" font-family="system-ui">\xd7 3</text>
    <text x="160" y="148" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold" font-family="system-ui">TRIPLE RIDING DETECTED</text>
  </svg>`,"RB-07":`<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${a}
    <rect x="200" y="98" width="18" height="57" fill="#1e293b"/>
    <rect x="222" y="98" width="18" height="57" fill="#1e293b"/>
    <rect x="244" y="98" width="18" height="57" fill="#1e293b"/>
    <circle cx="230" cy="72" r="8" fill="#94a3b8"/>
    <line   x1="230" y1="80" x2="230" y2="100" stroke="#94a3b8" stroke-width="4"/>
    <line   x1="218" y1="88" x2="242" y2="88"  stroke="#94a3b8" stroke-width="3"/>
    <line   x1="230" y1="100" x2="220" y2="115" stroke="#94a3b8" stroke-width="3"/>
    <line   x1="230" y1="100" x2="240" y2="115" stroke="#94a3b8" stroke-width="3"/>
    ${d(100,"#ef4444")}${c(100,"#ef4444")}
    <line x1="140" y1="107" x2="200" y2="107" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="5,4" opacity=".7"/>
    <text x="160" y="148" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold" font-family="system-ui">PEDESTRIAN CONFLICT</text>
  </svg>`,"RB-08":`<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${a}
    <line x1="60"  y1="106" x2="160" y2="106" stroke="#475569" stroke-width="4" stroke-linecap="round" stroke-dasharray="6,8" opacity=".7"/>
    <line x1="65"  y1="118" x2="165" y2="118" stroke="#475569" stroke-width="4" stroke-linecap="round" stroke-dasharray="6,8" opacity=".5"/>
    ${d(205)}${c(205,"#64748b")}
    <text x="45" y="88" fill="#f59e0b" font-size="22" font-weight="bold" font-family="system-ui" opacity=".8">!</text>
    <text x="160" y="148" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold" font-family="system-ui">ABRUPT STOP IN TRAFFIC</text>
  </svg>`,"RB-09":`<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${a}
    ${d(160)}
    <rect x="60"  y="86" width="38" height="30" rx="3" fill="#854d0e" stroke="#a16207" stroke-width="1.5"/>
    <rect x="222" y="86" width="38" height="30" rx="3" fill="#854d0e" stroke="#a16207" stroke-width="1.5"/>
    <rect x="68"  y="72" width="30" height="22" rx="3" fill="#92400e" stroke="#a16207" stroke-width="1.5"/>
    <rect x="222" y="72" width="30" height="22" rx="3" fill="#92400e" stroke="#a16207" stroke-width="1.5"/>
    ${c(160,"#64748b")}
    <text x="160" y="148" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold" font-family="system-ui">OVERLOADED VEHICLE</text>
  </svg>`,"RB-10":`<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${a}
    <polygon points="65,22 95,22 105,38 95,54 65,54 55,38" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
    <text x="80" y="35" text-anchor="middle" fill="#1a2035" font-size="9"  font-weight="bold" font-family="system-ui">SCHOOL</text>
    <text x="80" y="46" text-anchor="middle" fill="#1a2035" font-size="8"  font-weight="bold" font-family="system-ui">ZONE</text>
    <line x1="40" y1="72"  x2="75"  y2="72"  stroke="#ef4444" stroke-width="2" opacity=".5"/>
    <line x1="35" y1="80"  x2="75"  y2="80"  stroke="#ef4444" stroke-width="2" opacity=".7"/>
    <line x1="30" y1="88"  x2="75"  y2="88"  stroke="#ef4444" stroke-width="2" opacity=".9"/>
    ${d(200,"#ef4444")}${c(200,"#ef4444")}
    <text x="160" y="148" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold" font-family="system-ui">SPEEDING IN SCHOOL ZONE</text>
  </svg>`};function h(e){let t,i,r,o,a,d=n[e.behavior]??{label:"MODERATE",color:"#f59e0b"},c=d.color,h=`${c}18`,p=`${c}35`,f=l[e.behavior]??e.behavior,g=s[e.id]??"HCMC",y=Math.min(98,Math.round(76+2.1*e.risk)),u=x[e.behavior]??x["RB-01"],m=(t=e.risk/10,r=258/(i=[8,72,95,68,22,14,10,18,55,82,90,62,24,10].map(e=>Math.min(100,Math.round(e*(.7+.6*t))))).length-2,o=i.map((e,t)=>{let o=Math.max(2,e/100*42),l=4+t*(258/i.length),n=42-o;return`<rect x="${l.toFixed(1)}" y="${n.toFixed(1)}" width="${r.toFixed(1)}" height="${o.toFixed(1)}" rx="1.5" fill="${c}" opacity="${e>60?".95":e>30?".55":".28"}"/>`}).join(""),a=["6","7","8","9","10","11","12","13","15","16","17","18","19","20"].map((e,t)=>{if(t%2!=0)return"";let o=4+t*(258/i.length)+r/2;return`<text x="${o.toFixed(1)}" y="52" text-anchor="middle" fill="#475569" font-size="7" font-family="system-ui">${e}</text>`}).join(""),`<svg viewBox="0 0 266 56" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block">
    ${o}${a}
  </svg>`),b=Math.round(e.risk/10*100);return`
<div style="width:296px;font-family:'Segoe UI',system-ui,sans-serif;overflow:hidden;
            box-shadow:0 0 28px ${c}28,0 20px 48px rgba(0,0,0,.7)">

  <!-- 3 px accent strip at top -->
  <div style="height:3px;background:linear-gradient(90deg,${c}00,${c},${c}90,${c}00)"></div>

  <!-- behavior scene SVG -->
  <div style="position:relative;height:155px;overflow:hidden;background:#080d16;line-height:0">
    ${u}
    <!-- gradient fade into content section -->
    <div style="position:absolute;bottom:0;left:0;right:0;height:36px;
                background:linear-gradient(transparent,#0f1623)"></div>
    <!-- capture badge (uses accent color) -->
    <div style="position:absolute;top:9px;left:9px;display:flex;align-items:center;gap:5px;
                background:rgba(8,13,22,.82);border:1px solid ${p};border-radius:6px;padding:3px 9px">
      <div style="width:6px;height:6px;border-radius:50%;background:${c};
                  box-shadow:0 0 6px ${c}"></div>
      <span style="font-size:9px;font-weight:700;color:${c};letter-spacing:.07em">BEHAVIOR CAPTURE</span>
    </div>
    <!-- risk badge -->
    <div style="position:absolute;top:9px;right:9px;
                background:rgba(8,13,22,.82);border:1px solid ${p};border-radius:6px;padding:3px 10px">
      <span style="font-size:10px;font-weight:800;color:${c}">RISK&nbsp;${e.risk}</span>
    </div>
  </div>

  <!-- content body -->
  <div style="padding:11px 13px 13px;background:#0f1623">

    <!-- school name + district -->
    <div style="margin-bottom:10px">
      <div style="font-size:13px;font-weight:700;color:#f1f5f9;line-height:1.3">${e.school}</div>
      <div style="display:flex;align-items:center;gap:6px;margin-top:3px">
        <span style="font-size:10px;color:#475569">${g} \xb7 Ho Chi Minh City</span>
        <span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:4px;
                     background:${h};color:${c};border:1px solid ${p}">${d.label}</span>
      </div>
    </div>

    <!-- 3-stat row — all tinted with accent -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin-bottom:10px">
      <div style="background:${h};border-radius:8px;padding:7px 4px;text-align:center;
                  border:1px solid ${p}">
        <div style="font-size:18px;font-weight:800;color:${c};line-height:1.1">${e.risk}</div>
        <div style="font-size:8px;color:#475569;margin-top:2px;letter-spacing:.05em">RISK SCORE</div>
      </div>
      <div style="background:rgba(255,255,255,.04);border-radius:8px;padding:7px 4px;text-align:center;
                  border:1px solid rgba(255,255,255,.07)">
        <div style="font-size:18px;font-weight:800;color:#f1f5f9;line-height:1.1">${e.count}</div>
        <div style="font-size:8px;color:#475569;margin-top:2px;letter-spacing:.05em">DETECTIONS</div>
      </div>
      <div style="background:rgba(255,255,255,.04);border-radius:8px;padding:7px 4px;text-align:center;
                  border:1px solid rgba(255,255,255,.07)">
        <div style="font-size:18px;font-weight:800;color:#f1f5f9;line-height:1.1">${y}%</div>
        <div style="font-size:8px;color:#475569;margin-top:2px;letter-spacing:.05em">CONFIDENCE</div>
      </div>
    </div>

    <!-- risk level bar -->
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
      <span style="font-size:9px;color:#475569;font-weight:600;letter-spacing:.04em;white-space:nowrap">RISK LEVEL</span>
      <div style="flex:1;height:5px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${b}%;border-radius:3px;
                    background:linear-gradient(90deg,${c}80,${c})"></div>
      </div>
      <span style="font-size:9px;font-weight:700;color:${c}">${e.risk}/10</span>
    </div>

    <!-- hourly chart -->
    <div style="background:rgba(255,255,255,.03);border-radius:8px;padding:8px 9px 4px;
                margin-bottom:10px;border:1px solid rgba(255,255,255,.06)">
      <div style="font-size:9px;color:#475569;font-weight:600;letter-spacing:.05em;margin-bottom:6px">
        HOURLY DETECTION PATTERN
      </div>
      ${m}
    </div>

    <!-- behavior tag — accent border left -->
    <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;
                background:${h};border-radius:8px;border:1px solid ${p};border-left:3px solid ${c}">
      <span style="font-size:10px;font-weight:700;color:${c};flex-shrink:0">${e.behavior}</span>
      <span style="font-size:10px;color:#94a3b8;flex:1;white-space:nowrap;overflow:hidden;
                  text-overflow:ellipsis">${f}</span>
    </div>

  </div>
</div>`}e.s(["default",0,function({hotspots:l}){let s=(0,i.useRef)(null),a=(0,i.useRef)(null),d=(0,i.useRef)(null),c=(0,i.useRef)(null),x=(0,i.useRef)([]);(0,i.useRef)(!1);let[p,f]=(0,i.useState)("idw"),[g,y]=(0,i.useState)(2),[u,m]=(0,i.useState)(!1),[b,v]=(0,i.useState)(null),w=(0,i.useCallback)((t,i,n)=>{if("markers"===i)return;m(!0);let s=t.getBounds(),d=s.getSouthWest(),x=s.getNorthEast(),h={minX:d.lng,maxX:x.lng,minY:d.lat,maxY:x.lat},p=l.map(e=>({x:e.lng,y:e.lat,value:e.risk})),f=o(p);v(f),setTimeout(()=>{try{let l=function(e,t,i,l=2,n){let s=n??o(e),a=Array(12e3);for(let o=0;o<100;o++)for(let n=0;n<120;n++){let d=t.minX+n/119*(t.maxX-t.minX),c=t.minY+o/99*(t.maxY-t.minY),x="kriging"===i?function(e,t,i,o){let l=e.length;if(0===l)return 0;if(1===l)return e[0].value;let n=e=>{var t,i,r,l,n,s;return"spherical"===o.model?function(e,t,i,r){if(0===e)return 0;if(e>=r)return i;let o=e/r;return t+(i-t)*(1.5*o-.5*o**3)}(e,o.nugget,o.sill,o.range):"exponential"===o.model?(t=o.nugget,i=o.sill,r=o.range,0===e?0:t+(i-t)*(1-Math.exp(-3*e/r))):(l=o.nugget,n=o.sill,s=o.range,0===e?0:l+(n-l)*(1-Math.exp(-3*(e/s)**2)))},s=l+1,a=Array.from({length:s},()=>Array(s).fill(0));for(let t=0;t<l;t++){for(let i=0;i<l;i++){let r=Math.sqrt((e[t].x-e[i].x)**2+(e[t].y-e[i].y)**2);a[t][i]=n(r)}a[t][l]=1,a[l][t]=1}a[l][l]=0;let d=e.map(e=>n(Math.sqrt((e.x-t)**2+(e.y-i)**2)));d.push(1);let c=function(e,t){let i=e.length,r=e.map((e,i)=>[...e,t[i]]);for(let e=0;e<i;e++){let t=e;for(let o=e+1;o<i;o++)Math.abs(r[o][e])>Math.abs(r[t][e])&&(t=o);if([r[e],r[t]]=[r[t],r[e]],1e-12>Math.abs(r[e][e]))return null;for(let t=e+1;t<i;t++){let o=r[t][e]/r[e][e];for(let l=e;l<=i;l++)r[t][l]-=o*r[e][l]}}let o=Array(i).fill(0);for(let e=i-1;e>=0;e--){o[e]=r[e][i]/r[e][e];for(let t=e+1;t<i;t++)o[e]-=r[e][t]/r[e][e]*o[t]}return o}(a,d);if(!c)return r(e,t,i,2);let x=0;for(let t=0;t<l;t++)x+=c[t]*e[t].value;return x}(e,d,c,s):r(e,d,c,l);a[120*o+n]=x}return a}(p,h,i,n,f);a.current||(a.current=document.createElement("canvas"));let s=a.current;s.width=120,s.height=100,s.getContext("2d").putImageData(function(e,t=!0){let i=0,r=10;if(t){for(let t of(i=1/0,r=-1/0,e))t<i&&(i=t),t>r&&(r=t);let t=(r-i)*.08;i=Math.max(0,i-t),r=Math.min(10,r+t)}let o=new Uint8ClampedArray(48e3);for(let t=0;t<e.length;t++){let[l,n,s,a]=function(e,t,i){let r=Math.max(0,Math.min(1,(e-t)/(i-t||1))),o=[[59,130,246],[34,197,94],[132,204,22],[245,158,11],[239,68,68]],l=r*(o.length-1),n=Math.floor(l),s=Math.min(n+1,o.length-1),a=l-n,d=Math.round(o[n][0]+a*(o[s][0]-o[n][0])),c=Math.round(o[n][1]+a*(o[s][1]-o[n][1])),x=Math.round(o[n][2]+a*(o[s][2]-o[n][2]));return[d,c,x,Math.round((.55+.35*r)*255)]}(e[t],i,r);o[4*t]=l,o[4*t+1]=n,o[4*t+2]=s,o[4*t+3]=a}return new ImageData(o,120,100)}(l),0,0);let g=s.toDataURL("image/png"),y=[[d.lat,d.lng],[x.lat,x.lng]];c.current&&c.current.remove(),e.A(71400).then(e=>{c.current=e.imageOverlay(g,y,{opacity:.82,zIndex:400}),c.current.addTo(t)})}finally{m(!1)}},0)},[l]),k=(0,i.useCallback)(e=>{c.current&&(c.current.remove(),c.current=null),x.current.forEach(t=>e.removeLayer(t)),x.current=[]},[]),$=(0,i.useCallback)((e,t)=>{l.forEach(i=>{let r=(n[i.behavior]??{color:"#f59e0b"}).color,o=t.circle([i.lat,i.lng],{radius:250+60*i.risk,fillColor:r,fillOpacity:.14,color:r,weight:1.5,opacity:.45}).addTo(e),l=t.circleMarker([i.lat,i.lng],{radius:9,fillColor:r,fillOpacity:.95,color:"#fff",weight:2}).bindPopup(h(i),{maxWidth:310,className:"lelp-rich-popup"}).addTo(e);l.on("mouseover",function(){this.openPopup()}),x.current.push(o,l)})},[l]);return(0,i.useEffect)(()=>{if(!s.current)return;let t=!1;return e.A(71400).then(e=>{let i;if(t||!s.current||s.current._leaflet_id)return;delete e.Icon.Default.prototype._getIconUrl,e.Icon.Default.mergeOptions({iconRetinaUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",iconUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"});let r=e.map(s.current,{zoomControl:!0,attributionControl:!0}).setView([10.79,106.68],12);d.current=r,e.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap contributors © CARTO",maxZoom:19}).addTo(r),l.forEach(t=>{let i=(n[t.behavior]??{color:"#f59e0b"}).color;e.circleMarker([t.lat,t.lng],{radius:8,fillColor:i,fillOpacity:.95,color:"#fff",weight:2.5}).bindPopup(h(t),{maxWidth:310,className:"lelp-rich-popup"}).addTo(r).on("mouseover",function(){this.openPopup()})}),w(r,"idw",2),r.on("moveend zoomend",()=>{clearTimeout(i),i=setTimeout(()=>{"markers"!==p&&w(r,p,g)},400)})}),()=>{t=!0,d.current?.remove(),d.current=null}},[]),(0,i.useEffect)(()=>{let t=d.current;t&&(k(t),"markers"===p?e.A(71400).then(e=>$(t,e)):w(t,p,g))},[p,g]),(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:12},children:[(0,t.jsxs)("div",{className:"card",style:{padding:"10px 16px",display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"},children:[(0,t.jsx)("div",{style:{fontSize:12,fontWeight:600,color:"var(--text-muted)",letterSpacing:".04em",textTransform:"uppercase"},children:"Interpolation"}),(0,t.jsx)("div",{style:{display:"flex",gap:6},children:[["idw","IDW","Inverse Distance Weighting"],["kriging","Kriging","Ordinary Kriging (spherical variogram)"],["markers","Point Markers","Simple circle markers"]].map(([e,i,r])=>(0,t.jsx)("button",{title:r,onClick:()=>f(e),style:{padding:"6px 14px",borderRadius:7,fontSize:12,fontWeight:600,cursor:"pointer",background:p===e?"var(--accent-dim)":"var(--bg-raised)",color:p===e?"var(--accent)":"var(--text-muted)",border:p===e?"1px solid rgba(245,158,11,.3)":"1px solid var(--border-subtle)",transition:"all .15s ease"},children:i},e))}),"idw"===p&&(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:10},children:[(0,t.jsx)("span",{style:{fontSize:12,color:"var(--text-muted)"},children:"Power (p):"}),[1,2,3,4].map(e=>(0,t.jsx)("button",{onClick:()=>y(e),style:{width:30,height:28,borderRadius:6,fontSize:12,fontWeight:700,cursor:"pointer",background:g===e?"var(--accent-dim)":"var(--bg-raised)",color:g===e?"var(--accent)":"var(--text-muted)",border:g===e?"1px solid rgba(245,158,11,.3)":"1px solid var(--border-subtle)"},children:e},e)),(0,t.jsx)("span",{style:{fontSize:11,color:"var(--text-muted)"},children:1===g?"← smoother":g>=3?"sharper →":""})]}),"kriging"===p&&b&&(0,t.jsxs)("div",{style:{display:"flex",gap:14,fontSize:11,color:"var(--text-muted)"},children:[(0,t.jsxs)("span",{children:["nugget ",(0,t.jsx)("strong",{style:{color:"var(--text-secondary)"},children:b.nugget.toFixed(3)})]}),(0,t.jsxs)("span",{children:["sill ",(0,t.jsx)("strong",{style:{color:"var(--text-secondary)"},children:b.sill.toFixed(3)})]}),(0,t.jsxs)("span",{children:["range ",(0,t.jsxs)("strong",{style:{color:"var(--text-secondary)"},children:[b.range.toFixed(4),"°"]})]}),(0,t.jsxs)("span",{children:["model ",(0,t.jsx)("strong",{style:{color:"var(--accent)"},children:b.model})]})]}),u&&(0,t.jsxs)("div",{style:{marginLeft:"auto",display:"flex",alignItems:"center",gap:8},children:[(0,t.jsx)("div",{style:{width:12,height:12,border:"2px solid var(--accent)",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}),(0,t.jsxs)("span",{style:{fontSize:11,color:"var(--text-muted)"},children:["Computing ",p.toUpperCase(),"…"]})]})]}),(0,t.jsxs)("div",{style:{position:"relative"},children:[(0,t.jsx)("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"}),(0,t.jsx)("div",{ref:s,style:{height:"calc(100vh - 180px)",minHeight:620,borderRadius:12,overflow:"hidden",border:"1px solid var(--border-subtle)"}}),"markers"!==p&&(0,t.jsxs)("div",{style:{position:"absolute",bottom:24,left:16,zIndex:1e3,background:"rgba(8,13,22,0.88)",backdropFilter:"blur(8px)",border:"1px solid var(--border-mid)",borderRadius:10,padding:"10px 14px"},children:[(0,t.jsx)("div",{style:{fontSize:11,fontWeight:600,color:"var(--text-muted)",marginBottom:7,textTransform:"uppercase",letterSpacing:".05em"},children:"Risk Score"}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:8},children:[(0,t.jsx)("span",{style:{fontSize:10,color:"#3b82f6"},children:"Low"}),(0,t.jsx)("div",{style:{width:130,height:8,borderRadius:4,background:"linear-gradient(to right, #3b82f6, #22c55e, #84cc16, #f59e0b, #ef4444)"}}),(0,t.jsx)("span",{style:{fontSize:10,color:"#ef4444"},children:"High"})]}),(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",marginTop:4},children:[(0,t.jsx)("span",{style:{fontSize:10,color:"#3b82f6"},children:"Safe"}),(0,t.jsx)("span",{style:{fontSize:10,color:"#84cc16"},children:"Moderate"}),(0,t.jsx)("span",{style:{fontSize:10,color:"#ef4444"},children:"High Risk"})]})]}),(0,t.jsx)("div",{style:{position:"absolute",top:12,right:12,zIndex:1e3,background:"rgba(8,13,22,0.85)",backdropFilter:"blur(8px)",border:"1px solid var(--border-mid)",borderRadius:8,padding:"6px 12px"},children:(0,t.jsx)("span",{style:{fontSize:11,fontWeight:700,color:"var(--accent)"},children:"idw"===p?`IDW  p=${g}`:"kriging"===p?"Ordinary Kriging":"Circle Markers"})}),(0,t.jsxs)("div",{style:{position:"absolute",bottom:24,right:16,zIndex:1e3,background:"rgba(8,13,22,0.85)",backdropFilter:"blur(8px)",border:"1px solid var(--border-subtle)",borderRadius:10,padding:"10px 14px",maxWidth:220},children:["idw"===p&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{style:{fontSize:11,fontWeight:700,color:"var(--text-primary)",marginBottom:4},children:"Inverse Distance Weighting"}),(0,t.jsxs)("div",{style:{fontSize:10,color:"var(--text-muted)",lineHeight:1.5},children:["Deterministic interpolation. Risk at any location = weighted avg of known points, weight ∝ 1/dist",(0,t.jsx)("sup",{children:"p"}),". Higher p → sharper transitions."]})]}),"kriging"===p&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{style:{fontSize:11,fontWeight:700,color:"var(--text-primary)",marginBottom:4},children:"Ordinary Kriging"}),(0,t.jsx)("div",{style:{fontSize:10,color:"var(--text-muted)",lineHeight:1.5},children:"Geostatistical BLUE estimator. Uses a spherical variogram to model spatial autocorrelation. Solves λ·Γ = γ₀ for optimal unbiased weights."})]}),"markers"===p&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{style:{fontSize:11,fontWeight:700,color:"var(--text-primary)",marginBottom:4},children:"Point Markers"}),(0,t.jsx)("div",{style:{fontSize:10,color:"var(--text-muted)",lineHeight:1.5},children:"Raw hotspot locations. No interpolation — shows exact CCTV/submission detection sites."})]})]}),(0,t.jsx)("div",{style:{position:"absolute",top:12,left:16,zIndex:1e3,background:"rgba(8,13,22,0.75)",backdropFilter:"blur(6px)",border:"1px solid var(--border-subtle)",borderRadius:7,padding:"5px 10px"},children:(0,t.jsx)("span",{style:{fontSize:10,color:"var(--text-muted)"},children:"Hover a marker to inspect"})})]})]})}],96284)},29260,e=>{e.n(e.i(96284))},71400,e=>{e.v(t=>Promise.all(["static/chunks/06r9_3ub2r-4z.js"].map(t=>e.l(t))).then(()=>t(32322)))}]);