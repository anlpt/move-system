'use client'
import { BEHAVIORS, TREND_DATA, HOURLY_DATA, SCHOOL_COMPARISON } from '@/lib/mock-data'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ComposedChart,
  ReferenceLine, Cell, ScatterChart, Scatter, ZAxis, ErrorBar,
} from 'recharts'
import { BarChart3, TrendingUp, Clock, Download, Sigma, Activity, ArrowUpDown } from 'lucide-react'

// ── Core statistics ───────────────────────────────────────────────────────────
const counts  = BEHAVIORS.map(b => b.count)
const N       = counts.length
const mean    = counts.reduce((s, v) => s + v, 0) / N
const std     = Math.sqrt(counts.reduce((s, v) => s + (v - mean) ** 2, 0) / N)
const sortedC = [...counts].sort((a, b) => a - b)
const median  = (sortedC[Math.floor(N/2 - 0.5)] + sortedC[Math.floor(N/2)]) / 2
const q1Pop   = sortedC[Math.floor(N * 0.25)]
const q3Pop   = sortedC[Math.floor(N * 0.75)]
const total   = counts.reduce((s, v) => s + v, 0)
const highPct = Math.round(
  BEHAVIORS.filter(b => b.severity === 'HIGH').reduce((s, b) => s + b.count, 0) / total * 100
)

// Z-scores sorted high → low
const zData = BEHAVIORS.map(b => ({
  code: b.code, name: b.name, color: b.color, severity: b.severity, count: b.count,
  z:         parseFloat(((b.count - mean) / std).toFixed(2)),
  pct:       parseFloat(((b.count / total) * 100).toFixed(1)),
  meanDaily: parseFloat((b.count / 30).toFixed(1)),
})).sort((a, b) => b.z - a.z)
const topZ = zData[0]

// Pareto
let running = 0
const paretoData = [...BEHAVIORS].sort((a, b) => b.count - a.count).map(b => {
  running += b.count
  return { code: b.code, count: b.count, color: b.color, cumPct: parseFloat(((running/total)*100).toFixed(1)) }
})
const paretoBreak = paretoData.findIndex(d => d.cumPct >= 80) + 1

// Box-plot stats (top 6)
interface BoxStat { code: string; name: string; color: string; min: number; q1: number; median: number; q3: number; max: number; mean: number }
const BOX_CODES = ['RB-01','RB-02','RB-03','RB-04','RB-05','RB-06'] as const
const boxStats: BoxStat[] = BOX_CODES.map(code => {
  const beh  = BEHAVIORS.find(b => b.code === code)!
  const vals = TREND_DATA.map(d => (d as unknown as Record<string,number>)[code] ?? 0)
  const sv   = [...vals].sort((a, b) => a - b)
  const n    = sv.length
  return {
    code, name: beh.name, color: beh.color,
    min: sv[0], q1: sv[Math.floor(n*.25)], median: sv[Math.floor(n*.5)],
    q3: sv[Math.floor(n*.75)], max: sv[n-1],
    mean: parseFloat((vals.reduce((s,v) => s+v, 0)/n).toFixed(1)),
  }
})
const highestIQR = [...boxStats].sort((a, b) => (b.q3-b.q1)-(a.q3-a.q1))[0]

// ── Pearson correlation matrix ────────────────────────────────────────────────
const BCODES = BEHAVIORS.map(b => b.code)
function pearsonR(a: number[], b: number[]): number {
  const n = a.length
  const ma = a.reduce((s,v) => s+v,0)/n, mb = b.reduce((s,v) => s+v,0)/n
  const num = a.reduce((s,v,i) => s+(v-ma)*(b[i]-mb), 0)
  const da  = Math.sqrt(a.reduce((s,v) => s+(v-ma)**2, 0))
  const db  = Math.sqrt(b.reduce((s,v) => s+(v-mb)**2, 0))
  return da*db===0 ? 0 : parseFloat((num/(da*db)).toFixed(2))
}
const bSeries    = BCODES.map(code => TREND_DATA.map(d => (d as unknown as Record<string,number>)[code] ?? 0))
const corrMatrix = bSeries.map(a => bSeries.map(b => pearsonR(a, b)))
let topCorrPair  = { i: 0, j: 1, r: 0 }
corrMatrix.forEach((row,i) => row.forEach((r,j) => { if (i!==j && Math.abs(r)>Math.abs(topCorrPair.r)) topCorrPair={i,j,r} }))

// ── 95% Confidence Intervals (t=2.045, df=29) ────────────────────────────────
const ciData = BOX_CODES.map(code => {
  const beh  = BEHAVIORS.find(b => b.code === code)!
  const vals = TREND_DATA.map(d => (d as unknown as Record<string,number>)[code] ?? 0)
  const n    = vals.length
  const m    = vals.reduce((s,v) => s+v,0)/n
  const s    = Math.sqrt(vals.reduce((s,v) => s+(v-m)**2,0)/n)
  return { code, mean: parseFloat(m.toFixed(1)), ci: parseFloat((2.045*s/Math.sqrt(n)).toFixed(2)), color: beh.color }
})
const widestCI = [...ciData].sort((a,b) => b.ci-a.ci)[0]

// ── Risk Impact scatter (normalized freq × risk index) ────────────────────────
const maxCount  = Math.max(...BEHAVIORS.map(b => b.count))
const impactData = BEHAVIORS.map(b => ({
  code: b.code, name: b.name, color: b.color,
  freq: parseFloat(((b.count/maxCount)*100).toFixed(1)),
  risk: parseFloat((b.severity==='HIGH' ? 5+(b.count/maxCount)*5 : 1+(b.count/maxCount)*4).toFixed(1)),
  z:    Math.round((b.count/maxCount)*60+20),
}))

// ── Normal distribution PDF ───────────────────────────────────────────────────
const normMin = mean - 3.2*std, normMax = mean + 3.2*std
const normPts = Array.from({length:80}, (_,i) => {
  const x = normMin + (normMax-normMin)*i/79
  const y = Math.exp(-0.5*((x-mean)/std)**2) / (std*Math.sqrt(2*Math.PI))
  return { x, y }
})
const normPeak = normPts[40].y

// ── BoxPlot SVG ───────────────────────────────────────────────────────────────
function BoxPlotViz({ data }: { data: BoxStat[] }) {
  const W=540,H=210,padL=36,padR=10,padT=12,padB=28
  const plotW=W-padL-padR, plotH=H-padT-padB
  const allV=data.flatMap(d=>[d.min,d.max]), minV=Math.min(...allV), maxV=Math.max(...allV), range=maxV-minV||1
  const vy=(v:number)=>padT+plotH-((v-minV)/range)*plotH
  const colW=plotW/data.length, bw=colW*0.38
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',display:'block'}}>
      {[0,.25,.5,.75,1].map(t => {
        const yp=padT+plotH*(1-t)
        return <g key={t}>
          <line x1={padL} y1={yp} x2={W-padR} y2={yp} stroke="rgba(255,255,255,.05)" strokeWidth="1"/>
          <text x={padL-4} y={yp+3.5} textAnchor="end" fill="#475569" fontSize="8" fontFamily="system-ui">{Math.round(minV+t*range)}</text>
        </g>
      })}
      {data.map((d,i) => {
        const cx=padL+(i+.5)*colW, x1=cx-bw/2
        const yMn=vy(d.min),yQ1=vy(d.q1),yMd=vy(d.median),yQ3=vy(d.q3),yMx=vy(d.max),yMe=vy(d.mean)
        return (
          <g key={d.code}>
            <line x1={cx} y1={yMx} x2={cx} y2={yQ3} stroke={d.color} strokeWidth="1.5" strokeDasharray="3,2" opacity=".7"/>
            <line x1={cx-6} y1={yMx} x2={cx+6} y2={yMx} stroke={d.color} strokeWidth="1.5"/>
            <line x1={cx} y1={yQ1} x2={cx} y2={yMn} stroke={d.color} strokeWidth="1.5" strokeDasharray="3,2" opacity=".7"/>
            <line x1={cx-6} y1={yMn} x2={cx+6} y2={yMn} stroke={d.color} strokeWidth="1.5"/>
            <rect x={x1} y={yQ3} width={bw} height={Math.max(1,yQ1-yQ3)} fill={`${d.color}22`} stroke={d.color} strokeWidth="1.5" rx="2"/>
            <line x1={x1} y1={yMd} x2={x1+bw} y2={yMd} stroke={d.color} strokeWidth="2.5"/>
            <polygon points={`${cx},${yMe-4.5} ${cx+4.5},${yMe} ${cx},${yMe+4.5} ${cx-4.5},${yMe}`} fill="#f1f5f9" opacity=".85"/>
            <text x={cx} y={H-5} textAnchor="middle" fill={d.color} fontSize="9" fontWeight="bold" fontFamily="system-ui">{d.code}</text>
          </g>
        )
      })}
      <g transform={`translate(${W-padR-112},${padT})`}>
        {[['whisker','Whisker (min/max)'],['box','IQR (Q1–Q3)'],['median','Median'],['mean','Mean ◆']].map(([s,label],i) => (
          <g key={s} transform={`translate(0,${i*16})`}>
            {s==='whisker'&&<line x1="0" y1="6" x2="12" y2="6" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,2"/>}
            {s==='box'    &&<rect x="0" y="1" width="12" height="10" fill="rgba(148,163,184,.15)" stroke="#94a3b8" strokeWidth="1.5" rx="1"/>}
            {s==='median' &&<line x1="0" y1="6" x2="12" y2="6" stroke="#f1f5f9" strokeWidth="2.5"/>}
            {s==='mean'   &&<polygon points="6,1 11,6 6,11 1,6" fill="#f1f5f9" opacity=".85"/>}
            <text x="16" y="9" fill="#64748b" fontSize="8" fontFamily="system-ui">{label}</text>
          </g>
        ))}
      </g>
    </svg>
  )
}

// ── Correlation Heatmap SVG ───────────────────────────────────────────────────
function CorrelationHeatmap() {
  const cs=26, lw=46, lh=18, cols=BEHAVIORS.map(b=>b.color)
  const W=lw+BCODES.length*cs, H=lh+BCODES.length*cs
  function corrFill(r: number): string {
    const base=[30,41,59], pos=[239,68,68], neg=[59,130,246], t=Math.abs(r), tg=r>=0?pos:neg
    return `rgb(${Math.round(base[0]+t*(tg[0]-base[0]))},${Math.round(base[1]+t*(tg[1]-base[1]))},${Math.round(base[2]+t*(tg[2]-base[2]))})`
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',display:'block'}}>
      {BCODES.map((c,j)=>(
        <text key={j} x={lw+(j+.5)*cs} y={lh-3} textAnchor="middle" fill={cols[j]} fontSize="7.5" fontWeight="700" fontFamily="system-ui">{c}</text>
      ))}
      {corrMatrix.map((row,i)=>(
        <g key={i} transform={`translate(0,${lh+i*cs})`}>
          <text x={lw-4} y={cs/2+3.5} textAnchor="end" fill={cols[i]} fontSize="7.5" fontWeight="700" fontFamily="system-ui">{BCODES[i]}</text>
          {row.map((r,j)=>(
            <g key={j} transform={`translate(${lw+j*cs},0)`}>
              <rect width={cs-1} height={cs-1} rx="2" fill={corrFill(r)}/>
              {Math.abs(r)>0.25&&(
                <text x={(cs-1)/2} y={(cs-1)/2+3} textAnchor="middle" fill={Math.abs(r)>.5?'#f1f5f9':'#94a3b8'} fontSize="6.5" fontFamily="system-ui">{r.toFixed(1)}</text>
              )}
            </g>
          ))}
        </g>
      ))}
    </svg>
  )
}

// ── Normal Distribution SVG ───────────────────────────────────────────────────
function NormalDistViz() {
  const W=520,H=115,pL=44,pR=10,pT=10,pB=28,pw=W-pL-pR,ph=H-pT-pB
  const xs=(v:number)=>pL+((v-normMin)/(normMax-normMin))*pw
  const ys=(v:number)=>pT+ph-(v/normPeak)*ph*.92
  const curvePts=normPts.map((p,i)=>`${i===0?'M':'L'}${xs(p.x).toFixed(1)},${ys(p.y).toFixed(1)}`).join(' ')
  const area=curvePts+` L${xs(normMax).toFixed(1)},${(pT+ph).toFixed(1)} L${xs(normMin).toFixed(1)},${(pT+ph).toFixed(1)} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',display:'block'}}>
      <defs>
        <linearGradient id="ng" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity=".22"/>
          <stop offset="100%" stopColor="#3b82f6" stopOpacity=".02"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#ng)"/>
      <path d={curvePts} fill="none" stroke="#3b82f6" strokeWidth="1.5"/>
      <line x1={xs(mean)} y1={pT} x2={xs(mean)} y2={pT+ph} stroke="rgba(255,255,255,.25)" strokeWidth="1" strokeDasharray="5,3"/>
      {[-1,1].map(s=><line key={s} x1={xs(mean+s*std)} y1={pT+8} x2={xs(mean+s*std)} y2={pT+ph} stroke="rgba(255,255,255,.1)" strokeWidth="1" strokeDasharray="3,3"/>)}
      {BEHAVIORS.map(b=>{
        const x=xs(b.count), baseY=pT+ph
        return (
          <g key={b.code}>
            <line x1={x} y1={pT+4} x2={x} y2={baseY} stroke={b.color} strokeWidth="1.5" strokeDasharray="2.5,2" opacity=".85"/>
            <circle cx={x} cy={pT+4} r="3" fill={b.color}/>
            <text x={x} y={H-3} textAnchor="middle" fill={b.color} fontSize="7" fontWeight="bold" fontFamily="system-ui">{b.code}</text>
          </g>
        )
      })}
      {[-2,-1,0,1,2].map(s=>(
        <text key={s} x={xs(mean+s*std)} y={pT+ph+11} textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="system-ui">
          {s===0?'μ':s>0?`+${s}σ`:`${s}σ`}
        </text>
      ))}
    </svg>
  )
}

// ── Insight box ───────────────────────────────────────────────────────────────
function Insight({ text }: { text: string }) {
  return (
    <div style={{ marginTop:13, padding:'8px 12px', background:'rgba(245,158,11,.05)',
      border:'1px solid rgba(245,158,11,.18)', borderLeft:'3px solid #f59e0b',
      borderRadius:7, fontSize:11.5, color:'#94a3b8', lineHeight:1.65 }}>
      <span style={{ color:'#f59e0b', fontWeight:700, marginRight:6 }}>↳ Insight:</span>{text}
    </div>
  )
}

const ttStyle = { background:'var(--bg-overlay)', border:'1px solid var(--border-mid)', borderRadius:8, fontSize:11 }
const ttCursor = { fill:'rgba(255,255,255,0.04)' }

// ─────────────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-.01em' }}>Analytics</h1>
          <p style={{ color:'var(--text-muted)', marginTop:4, fontSize:13 }}>
            Statistical analysis · Z-score normalization · Correlation & distribution research
          </p>
        </div>
        <button style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 16px', background:'var(--bg-raised)', border:'1px solid var(--border-mid)', borderRadius:8, color:'var(--text-secondary)', fontSize:13, cursor:'pointer' }}>
          <Download size={13}/> Export CSV
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:12 }}>
        {([
          { label:'Mean (μ)',     value:mean.toFixed(0),        sub:'detections / behavior',   icon:Sigma,       color:'#3b82f6' },
          { label:'Median',       value:median.toFixed(0),       sub:'center of distribution',  icon:ArrowUpDown, color:'#8b5cf6' },
          { label:'Std Dev (σ)',  value:std.toFixed(0),          sub:'spread across behaviors', icon:Activity,    color:'#f59e0b' },
          { label:'IQR',          value:(q3Pop-q1Pop).toFixed(0),sub:'Q3 − Q1 range',           icon:BarChart3,   color:'#22c55e' },
          { label:'Top z-score',  value:`+${topZ.z}σ`,          sub:topZ.code,                 icon:TrendingUp,  color:'#ef4444' },
          { label:'HIGH severity',value:`${highPct}%`,           sub:'of all detections',       icon:Clock,       color:'#f97316' },
        ] as const).map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="card" style={{ padding:'14px 16px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.05em', lineHeight:1.3 }}>{label}</div>
              <div style={{ width:28, height:28, borderRadius:7, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={14} style={{ color }}/>
              </div>
            </div>
            <div style={{ fontSize:22, fontWeight:800, lineHeight:1, color:'var(--text-primary)' }}>{value}</div>
            <div style={{ fontSize:10, color:'var(--text-muted)', marginTop:4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Z-Score — behavior-specific colors, fixed cursor ── */}
      <div className="card" style={{ padding:22 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
          <div>
            <div style={{ fontWeight:600, fontSize:14 }}>Behavior Z-Score Analysis</div>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:3 }}>
              Standard deviations from mean (μ = {mean.toFixed(0)}, σ = {std.toFixed(0)}) · each bar colored by behavior class
            </div>
          </div>
          <div style={{ display:'flex', gap:12, fontSize:11, color:'var(--text-muted)' }}>
            <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:10,height:10,borderRadius:2,background:'#ef4444',display:'inline-block' }}/>z &gt; 1σ</span>
            <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:10,height:10,borderRadius:2,background:'#f59e0b',display:'inline-block' }}/>0–1σ</span>
            <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:10,height:10,borderRadius:2,background:'#3b82f6',display:'inline-block' }}/>below avg</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={zData} layout="vertical" margin={{ top:0, right:60, bottom:0, left:8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" horizontal={false}/>
            <XAxis type="number" domain={['auto','auto']} tick={{ fill:'#4b6280', fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={v=>`${Number(v)>0?'+':''}${v}σ`}/>
            <YAxis type="category" dataKey="code" width={44} tick={{ fill:'#94a3b8', fontSize:11, fontWeight:600 }} tickLine={false} axisLine={false}/>
            <Tooltip contentStyle={ttStyle} cursor={ttCursor} formatter={v=>[`${Number(v)>0?'+':''}${v}σ`,'Z-score']}/>
            <ReferenceLine x={0}  stroke="rgba(255,255,255,.25)" strokeWidth={1.5}/>
            <ReferenceLine x={1}  stroke="#ef444430" strokeDasharray="4 3"/>
            <ReferenceLine x={-1} stroke="#3b82f630" strokeDasharray="4 3"/>
            <Bar dataKey="z" radius={[0,4,4,0]} activeBar={{ fillOpacity:1, stroke:'rgba(255,255,255,.15)', strokeWidth:1 }}>
              {zData.map(d => <Cell key={d.code} fill={d.color}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <Insight text={`${topZ.code} (${topZ.name}) is the strongest outlier at ${topZ.z}σ above mean — nearly ${Math.abs(topZ.z).toFixed(1)}× the standard deviation, indicating disproportionate prevalence compared to other behaviors. ${zData.filter(d=>d.z>1).length} behavior(s) exceed the +1σ threshold, confirming a right-skewed distribution.`}/>
      </div>

      {/* ── Pareto + Box Plot ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="card" style={{ padding:22 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>Pareto Analysis (80/20 Rule)</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:18 }}>Count per class (bars) + cumulative % (line) · dashed = 80% threshold</div>
          <ResponsiveContainer width="100%" height={230}>
            <ComposedChart data={paretoData} margin={{ top:4, right:44, bottom:0, left:-16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
              <XAxis dataKey="code" tick={{ fill:'#4b6280', fontSize:9 }} tickLine={false} axisLine={false}/>
              <YAxis yAxisId="left"  tick={{ fill:'#4b6280', fontSize:9 }} tickLine={false} axisLine={false}/>
              <YAxis yAxisId="right" orientation="right" domain={[0,100]} tick={{ fill:'#4b6280', fontSize:9 }} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`}/>
              <Tooltip contentStyle={ttStyle} cursor={ttCursor}/>
              <ReferenceLine yAxisId="right" y={80} stroke="#f59e0b" strokeDasharray="5 3" strokeWidth={1.5} label={{ value:'80%', fill:'#f59e0b', fontSize:10, position:'right' }}/>
              <Bar yAxisId="left" dataKey="count" radius={[3,3,0,0]} activeBar={{ fillOpacity:1, stroke:'rgba(255,255,255,.15)', strokeWidth:1 }}>
                {paretoData.map(d=><Cell key={d.code} fill={d.color}/>)}
              </Bar>
              <Line yAxisId="right" type="monotone" dataKey="cumPct" stroke="#f1f5f9" strokeWidth={2} dot={{ r:3, fill:'#f1f5f9' }}/>
            </ComposedChart>
          </ResponsiveContainer>
          <Insight text={`Only ${paretoBreak} of 10 behaviors account for ≥80% of all detections (${paretoData[paretoBreak-1]?.cumPct}%). Targeted interventions on ${paretoData.slice(0,paretoBreak).map(d=>d.code).join(', ')} alone could address the vast majority of school-zone violations.`}/>
        </div>

        <div className="card" style={{ padding:22 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>30-Day Distribution (Box Plot)</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:14 }}>Whiskers = min/max · box = IQR · line = median · ◆ = mean</div>
          <BoxPlotViz data={boxStats}/>
          <Insight text={`${highestIQR.code} has the widest IQR (${highestIQR.q3-highestIQR.q1} detections/day), indicating high daily variability — likely tied to enforcement presence. Behaviors with narrow IQRs (RB-05, RB-06) show more predictable patterns, suitable for automated alert thresholds.`}/>
        </div>
      </div>

      {/* ── 30-day trend ── */}
      <div className="card" style={{ padding:22 }}>
        <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>30-Day Detection Trend</div>
        <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:18 }}>Daily counts per behavior class · March – April 2026</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={TREND_DATA} margin={{ top:4, right:8, bottom:0, left:-20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
            <XAxis dataKey="date" tick={{ fill:'#4b6280', fontSize:10 }} tickLine={false} axisLine={false} interval={4}/>
            <YAxis tick={{ fill:'#4b6280', fontSize:10 }} tickLine={false} axisLine={false}/>
            <Tooltip contentStyle={ttStyle} cursor={{ stroke:'rgba(255,255,255,.08)', strokeWidth:1, fill:'rgba(255,255,255,.02)' }}/>
            <Legend wrapperStyle={{ fontSize:11, paddingTop:8 }}/>
            {(['RB-01','RB-02','RB-03','RB-04','RB-05'] as const).map(code => {
              const b = BEHAVIORS.find(x => x.code===code)!
              return <Line key={code} type="monotone" dataKey={code} stroke={b.color} strokeWidth={2} dot={false}/>
            })}
          </LineChart>
        </ResponsiveContainer>
        <Insight text={`Multi-behavior trends reveal synchronised spikes on school days (Mon–Fri) with dips on weekends, confirming school-zone correlation. RB-01 consistently leads all classes with a daily mean of ${zData.find(d=>d.code==='RB-01')?.meanDaily} detections. Correlated oscillations across behaviors suggest shared causal factors such as peak commuter traffic volume.`}/>
      </div>

      {/* ── Correlation Heatmap + 95% CI ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1.1fr .9fr', gap:20 }}>

        <div className="card" style={{ padding:22 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>Inter-Behavior Correlation Matrix</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:14 }}>
            Pearson r from 30-day daily series · <span style={{ color:'#ef4444' }}>■</span> positive · <span style={{ color:'#3b82f6' }}>■</span> negative · diagonal = self (r = 1.0)
          </div>
          <CorrelationHeatmap/>
          <Insight text={`Strongest pair: ${BCODES[topCorrPair.i]} ↔ ${BCODES[topCorrPair.j]} (r = ${topCorrPair.r}). High positive correlations suggest behavioral co-occurrence — riders who commit one violation are statistically more likely to commit another simultaneously, supporting a "risk profile clustering" hypothesis.`}/>
        </div>

        <div className="card" style={{ padding:22 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>95% Confidence Intervals</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:18 }}>
            Daily mean detection rate ± 95% CI (t-dist, df = 29) per behavior
          </div>
          <ResponsiveContainer width="100%" height={232}>
            <BarChart data={ciData} margin={{ top:4, right:16, bottom:0, left:-16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
              <XAxis dataKey="code" tick={{ fill:'#4b6280', fontSize:10 }} tickLine={false} axisLine={false}/>
              <YAxis tick={{ fill:'#4b6280', fontSize:10 }} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={ttStyle} cursor={ttCursor}
                formatter={(v,n) => [typeof v==='number'?v.toFixed(2):v, n==='mean'?'Daily Mean':'CI ±']}/>
              <Bar dataKey="mean" radius={[4,4,0,0]} activeBar={{ fillOpacity:1, stroke:'rgba(255,255,255,.15)', strokeWidth:1 }}>
                {ciData.map(d=><Cell key={d.code} fill={d.color} fillOpacity={0.85}/>)}
                <ErrorBar dataKey="ci" width={5} strokeWidth={2} stroke="#f1f5f9" opacity={0.7}/>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <Insight text={`${widestCI.code} shows the widest 95% CI (±${widestCI.ci}/day), indicating high day-to-day variability and lower statistical confidence. Narrower CIs on lower-frequency behaviors reflect more stable detection patterns, improving the reliability of trend-based predictions.`}/>
        </div>
      </div>

      {/* ── Risk Impact Scatter + Normal Distribution ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

        <div className="card" style={{ padding:22 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>Risk Impact Matrix</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:18 }}>
            Detection frequency index (x) vs. risk impact score (y) · bubble size = relative volume
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <ScatterChart margin={{ top:8, right:16, bottom:8, left:-16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
              <XAxis type="number" dataKey="freq" name="Frequency Index" domain={[0,110]}
                     tick={{ fill:'#4b6280', fontSize:9 }} tickLine={false} axisLine={false}
                     label={{ value:'Detection Frequency (%)', fill:'#475569', fontSize:9, position:'insideBottom', offset:-4 }}/>
              <YAxis type="number" dataKey="risk" name="Risk Score" domain={[0,11]}
                     tick={{ fill:'#4b6280', fontSize:9 }} tickLine={false} axisLine={false}/>
              <ZAxis type="number" dataKey="z" range={[200,1100]}/>
              <Tooltip contentStyle={ttStyle} cursor={{ stroke:'rgba(255,255,255,.1)' }}
                formatter={(v,n)=>[typeof v==='number'?v.toFixed(1):v, n==='freq'?'Freq. Index':'Risk Score']}
                labelFormatter={(_,p)=>p?.[0]?.payload?.name??''}/>
              <ReferenceLine x={50} stroke="rgba(255,255,255,.1)" strokeDasharray="5,4"
                label={{ value:'High freq →', fill:'#475569', fontSize:8, position:'insideTopRight' }}/>
              <ReferenceLine y={5} stroke="rgba(255,255,255,.1)" strokeDasharray="5,4"
                label={{ value:'High risk ↑', fill:'#475569', fontSize:8, position:'insideTopLeft' }}/>
              <Scatter data={impactData} isAnimationActive={false}>
                {impactData.map(d=><Cell key={d.code} fill={d.color} fillOpacity={0.82}/>)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <Insight text={`RB-01 and RB-02 occupy the critical quadrant (high frequency + high risk) — requiring immediate, scaled intervention. RB-07 (Pedestrian Conflict) sits in the high-risk/lower-frequency quadrant, demanding pre-emptive structural solutions despite lower current detection volume.`}/>
        </div>

        <div className="card" style={{ padding:22 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>Normal Distribution of Detection Counts</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:14 }}>
            Theoretical N(μ={mean.toFixed(0)}, σ={std.toFixed(0)}) · each behavior marked at its observed count
          </div>
          <NormalDistViz/>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:10 }}>
            {BEHAVIORS.map(b => (
              <div key={b.code} style={{ display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ width:8, height:8, borderRadius:2, background:b.color, display:'inline-block', flexShrink:0 }}/>
                <span style={{ fontSize:10, color:'var(--text-muted)' }}>{b.code}</span>
              </div>
            ))}
          </div>
          <Insight text={`The distribution is strongly right-skewed — RB-01 and RB-02 fall ${zData[0].z}σ and ${zData[1].z}σ above the mean, far outside the expected normal range. ${zData.filter(d=>d.z<0).length} behaviors fall below average, confirming that a minority of violation types drive the majority of risk.`}/>
        </div>
      </div>

      {/* ── School comparison + Time-of-day ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="card" style={{ padding:22 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>School Comparison</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:18 }}>Submissions by behavior class per school (stacked)</div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={SCHOOL_COMPARISON} margin={{ top:4, right:8, bottom:0, left:-20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
              <XAxis dataKey="name" tick={{ fill:'#4b6280', fontSize:9 }} tickLine={false} axisLine={false}/>
              <YAxis tick={{ fill:'#4b6280', fontSize:10 }} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={ttStyle} cursor={ttCursor}/>
              <Bar dataKey="helmet"   stackId="a" fill="#ef4444" activeBar={{ fillOpacity:1 }}/>
              <Bar dataKey="phone"    stackId="a" fill="#f97316" activeBar={{ fillOpacity:1 }}/>
              <Bar dataKey="wrongWay" stackId="a" fill="#eab308" activeBar={{ fillOpacity:1 }}/>
              <Bar dataKey="redLight" stackId="a" fill="#22c55e" activeBar={{ fillOpacity:1 }}/>
              <Bar dataKey="other"    stackId="a" fill="#3b82f6" radius={[3,3,0,0]} activeBar={{ fillOpacity:1 }}/>
            </BarChart>
          </ResponsiveContainer>
          <Insight text={`Lê Quý Đôn and Nguyễn Thị Minh Khai show the highest absolute detection volume. The consistent helmet non-compliance share (≈38%) across all schools suggests a systemic cultural factor rather than site-specific infrastructure, supporting a city-wide behavioral intervention strategy.`}/>
        </div>

        <div className="card" style={{ padding:22 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>Time-of-Day Distribution</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:18 }}>Detection frequency by hour · school day average</div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={HOURLY_DATA} margin={{ top:4, right:8, bottom:0, left:-20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
              <XAxis dataKey="hour" tick={{ fill:'#4b6280', fontSize:9 }} tickLine={false} axisLine={false}/>
              <YAxis tick={{ fill:'#4b6280', fontSize:10 }} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={ttStyle} cursor={ttCursor}/>
              <Bar dataKey="count" radius={[3,3,0,0]} activeBar={{ fillOpacity:1, stroke:'rgba(255,255,255,.15)', strokeWidth:1 }}>
                {HOURLY_DATA.map((e,i)=><Cell key={i} fill={e.count>180?'#ef4444':e.count>100?'#f59e0b':'#3b82f6'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <Insight text={`Two sharp peaks emerge at 07:30 (234 detections) and 17:30 (234 detections), precisely coinciding with school arrival and dismissal windows. Off-peak periods drop 73% below peak, confirming that enforcement and AI-monitoring resources should be concentrated within ±30 minutes of school bell times.`}/>
        </div>
      </div>

      {/* ── Behavior statistical table ── */}
      <div className="card" style={{ padding:22 }}>
        <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>Behavior Statistical Summary</div>
        <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:16 }}>Sorted by z-score · normalization metrics for comparative research analysis</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th><th>Behavior</th><th>Severity</th><th>Total</th>
              <th>Mean / Day</th><th style={{ width:90 }}>Z-Score</th>
              <th>Percentile</th><th style={{ width:140 }}>% Share</th>
            </tr>
          </thead>
          <tbody>
            {zData.map((b, i) => {
              const pctRank = Math.round(((N-1-i)/(N-1))*100)
              return (
                <tr key={b.code}>
                  <td><span style={{ fontFamily:'monospace', color:b.color, fontWeight:700 }}>{b.code}</span></td>
                  <td style={{ color:'var(--text-primary)' }}>{b.name}</td>
                  <td><span className={`badge badge-${b.severity==='HIGH'?'high':'moderate'}`}>{b.severity}</span></td>
                  <td style={{ fontVariantNumeric:'tabular-nums' }}>{b.count.toLocaleString()}</td>
                  <td style={{ fontVariantNumeric:'tabular-nums', color:'var(--text-secondary)' }}>{b.meanDaily}</td>
                  <td>
                    <span style={{ fontFamily:'monospace', fontWeight:700, fontSize:12, color:b.z>1?'#ef4444':b.z>0?'#f59e0b':'#3b82f6' }}>
                      {b.z>0?'+':''}{b.z}σ
                    </span>
                  </td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                      <div className="progress-bar" style={{ width:52 }}>
                        <div className="progress-fill" style={{ width:`${pctRank}%`, background:b.color }}/>
                      </div>
                      <span style={{ fontSize:11, color:'var(--text-muted)', fontVariantNumeric:'tabular-nums' }}>{pctRank}th</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div className="progress-bar" style={{ width:80 }}>
                        <div className="progress-fill" style={{ width:`${Math.min(100,b.pct*3)}%`, background:b.color }}/>
                      </div>
                      <span style={{ fontSize:11, fontVariantNumeric:'tabular-nums' }}>{b.pct}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}
