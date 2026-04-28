'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import {
  buildGrid, gridToImageData, estimateVariogram,
  type KrigingParams, type SpatialPoint
} from '@/lib/interpolation'

interface Hotspot {
  id: string; lat: number; lng: number
  school: string; risk: number; count: number; behavior: string
}

type InterpolationMethod = 'idw' | 'kriging' | 'markers'

interface Props { hotspots: Hotspot[] }

const GRID_COLS = 120
const GRID_ROWS = 100

// ── Behavior metadata ──────────────────────────────────────────────────────────
const BEHAVIOR_NAMES: Record<string, string> = {
  'RB-01': 'Helmet Non-Compliance',
  'RB-02': 'Phone Use While Riding',
  'RB-03': 'Wrong-Way Riding',
  'RB-04': 'Lane Violation',
  'RB-05': 'Red Light Running',
  'RB-06': 'Double / Triple Riding',
  'RB-07': 'Pedestrian Conflict',
  'RB-08': 'Abrupt Stop in Flow',
  'RB-09': 'Overloading',
  'RB-10': 'Speeding in School Zone',
}

// Each behavior gets its own unique accent color (matching globals.css --rb01–10)
const BEHAVIOR_SEVERITY: Record<string, { label: string; color: string }> = {
  'RB-01': { label: 'HIGH',     color: '#ef4444' },
  'RB-02': { label: 'HIGH',     color: '#f97316' },
  'RB-03': { label: 'HIGH',     color: '#eab308' },
  'RB-04': { label: 'MODERATE', color: '#84cc16' },
  'RB-05': { label: 'MODERATE', color: '#22c55e' },
  'RB-06': { label: 'MODERATE', color: '#06b6d4' },
  'RB-07': { label: 'HIGH',     color: '#3b82f6' },
  'RB-08': { label: 'MODERATE', color: '#8b5cf6' },
  'RB-09': { label: 'MODERATE', color: '#ec4899' },
  'RB-10': { label: 'HIGH',     color: '#f43f5e' },
}

// District lookup by hotspot id
const HOTSPOT_DISTRICT: Record<string, string> = {
  h01:'District 1', h02:'District 1', h03:'District 1',
  h04:'District 3', h05:'District 3', h06:'District 3',
  h07:'District 5', h08:'District 5', h09:'District 5',
  h10:'District 6', h11:'District 6',
  h12:'District 7', h13:'District 7',
  h14:'District 8', h15:'District 8',
  h16:'District 10',h17:'District 10',
  h18:'Tân Bình',   h19:'Tân Bình',   h20:'Tân Bình',
  h21:'Bình Thạnh', h22:'Bình Thạnh', h23:'Bình Thạnh',
  h24:'Phú Nhuận',  h25:'Phú Nhuận',
  h26:'Gò Vấp',     h27:'Gò Vấp',     h28:'Gò Vấp',
  h29:'Thủ Đức',    h30:'Thủ Đức',
}

// ── Inline SVG scenes — one per behavior class ────────────────────────────────
// Road background shared across all scenes
const BG = `
  <rect width="320" height="155" fill="#0a1520"/>
  <rect x="0" y="98" width="320" height="57" fill="#060c14"/>
  <line x1="0" y1="127" x2="320" y2="127" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="18,12"/>
  <line x1="0" y1="98"  x2="320" y2="98"  stroke="#1e293b" stroke-width="1"/>
`
// Motorcycle silhouette helper (cx = horizontal center)
function moto(cx: number, col = '#475569'): string {
  const rw = cx - 58, fw = cx + 58
  return `
    <circle cx="${rw}" cy="113" r="14" fill="none" stroke="${col}" stroke-width="2.5"/>
    <circle cx="${rw}" cy="113" r="3"  fill="${col}"/>
    <circle cx="${fw}" cy="113" r="14" fill="none" stroke="${col}" stroke-width="2.5"/>
    <circle cx="${fw}" cy="113" r="3"  fill="${col}"/>
    <line   x1="${rw}" y1="99" x2="${rw+42}" y2="85" stroke="${col}" stroke-width="3"/>
    <line   x1="${rw+42}" y1="85" x2="${fw}" y2="99" stroke="${col}" stroke-width="3"/>
    <line   x1="${rw}" y1="99" x2="${fw}"    y2="99" stroke="${col}" stroke-width="2"/>
    <line   x1="${fw-12}" y1="85" x2="${fw+14}" y2="79" stroke="${col}" stroke-width="2.5"/>
  `
}
// Stick-figure rider
function rider(cx: number, col = '#64748b'): string {
  const bx = cx - 14
  return `
    <ellipse cx="${bx}" cy="81" rx="13" ry="10" fill="${col}"/>
    <circle  cx="${bx}" cy="67" r="9"           fill="${col}"/>
  `
}

const BEHAVIOR_SCENES: Record<string, string> = {
  // RB-01: No Helmet — rider visible bare head + red circle-slash
  'RB-01': `<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${BG}
    ${moto(160)}${rider(160, '#64748b')}
    <circle cx="146" cy="67" r="14" fill="none" stroke="#ef4444" stroke-width="2.5"/>
    <line   x1="136" y1="57" x2="156" y2="77"  stroke="#ef4444" stroke-width="2.5"/>
    <text x="160" y="148" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold" font-family="system-ui">NO HELMET DETECTED</text>
  </svg>`,

  // RB-02: Phone use — phone rectangle near rider's face
  'RB-02': `<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${BG}
    ${moto(160)}${rider(160, '#64748b')}
    <rect x="118" y="59" width="14" height="20" rx="2" fill="#1d4ed8" stroke="#60a5fa" stroke-width="1.5"/>
    <rect x="120" y="62" width="10" height="12" rx="1" fill="#93c5fd" opacity=".7"/>
    <line x1="132" y1="67" x2="146" y2="67" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,2"/>
    <text x="160" y="148" text-anchor="middle" fill="#f97316" font-size="10" font-weight="bold" font-family="system-ui">PHONE USE WHILE RIDING</text>
  </svg>`,

  // RB-03: Wrong-way — two arrows going right, one motorcycle going left
  'RB-03': `<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${BG}
    <polygon points="230,115 250,107 250,123" fill="#22c55e" opacity=".6"/>
    <line x1="170" y1="115" x2="248" y2="115" stroke="#22c55e" stroke-width="2" opacity=".6"/>
    <polygon points="240,130 260,122 260,138" fill="#22c55e" opacity=".4"/>
    <line x1="180" y1="130" x2="258" y2="130" stroke="#22c55e" stroke-width="1.5" opacity=".4"/>
    ${moto(120, '#ef4444')}${rider(120, '#ef4444')}
    <polygon points="70,108 50,115 70,122" fill="#ef4444"/>
    <text x="100" y="148" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold" font-family="system-ui">WRONG-WAY RIDING</text>
  </svg>`,

  // RB-04: Lane violation — solid white line, motorcycle crossing it
  'RB-04': `<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${BG}
    <line x1="160" y1="98" x2="160" y2="155" stroke="#e2e8f0" stroke-width="2.5"/>
    ${moto(195)}${rider(195, '#64748b')}
    <line x1="154" y1="88" x2="170" y2="100" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="4,3"/>
    <circle cx="160" cy="93" r="8" fill="none" stroke="#f59e0b" stroke-width="2"/>
    <text x="175" y="148" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold" font-family="system-ui">LANE VIOLATION</text>
  </svg>`,

  // RB-05: Red light running — traffic light + stop line
  'RB-05': `<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${BG}
    <rect x="60"  y="18" width="28" height="72" rx="5" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <circle cx="74" cy="34" r="9" fill="#ef4444" filter="url(#glow)"/>
    <circle cx="74" cy="54" r="9" fill="#1e293b" stroke="#374151" stroke-width="1"/>
    <circle cx="74" cy="74" r="9" fill="#1e293b" stroke="#374151" stroke-width="1"/>
    <line x1="74" y1="90" x2="74" y2="155" stroke="#334155" stroke-width="2"/>
    <line x1="0"  y1="103" x2="320" y2="103" stroke="#e2e8f0" stroke-width="2.5"/>
    ${moto(200, '#ef4444')}${rider(200, '#ef4444')}
    <text x="200" y="148" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold" font-family="system-ui">RED LIGHT RUNNING</text>
  </svg>`,

  // RB-06: Triple riding — 3 figures on one motorcycle
  'RB-06': `<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${BG}
    ${moto(160)}
    <ellipse cx="130" cy="82" rx="11" ry="9" fill="#475569"/>
    <circle  cx="130" cy="70" r="8"          fill="#475569"/>
    <ellipse cx="152" cy="79" rx="11" ry="9" fill="#64748b"/>
    <circle  cx="152" cy="67" r="8"          fill="#64748b"/>
    <ellipse cx="173" cy="82" rx="10" ry="8" fill="#475569"/>
    <circle  cx="173" cy="71" r="7"          fill="#475569"/>
    <text x="160" y="16" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold" font-family="system-ui">× 3</text>
    <text x="160" y="148" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold" font-family="system-ui">TRIPLE RIDING DETECTED</text>
  </svg>`,

  // RB-07: Pedestrian conflict — crosswalk stripes, person, motorcycle approaching
  'RB-07': `<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${BG}
    <rect x="200" y="98" width="18" height="57" fill="#1e293b"/>
    <rect x="222" y="98" width="18" height="57" fill="#1e293b"/>
    <rect x="244" y="98" width="18" height="57" fill="#1e293b"/>
    <circle cx="230" cy="72" r="8" fill="#94a3b8"/>
    <line   x1="230" y1="80" x2="230" y2="100" stroke="#94a3b8" stroke-width="4"/>
    <line   x1="218" y1="88" x2="242" y2="88"  stroke="#94a3b8" stroke-width="3"/>
    <line   x1="230" y1="100" x2="220" y2="115" stroke="#94a3b8" stroke-width="3"/>
    <line   x1="230" y1="100" x2="240" y2="115" stroke="#94a3b8" stroke-width="3"/>
    ${moto(100, '#ef4444')}${rider(100, '#ef4444')}
    <line x1="140" y1="107" x2="200" y2="107" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="5,4" opacity=".7"/>
    <text x="160" y="148" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold" font-family="system-ui">PEDESTRIAN CONFLICT</text>
  </svg>`,

  // RB-08: Abrupt stop — skid marks behind motorcycle
  'RB-08': `<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${BG}
    <line x1="60"  y1="106" x2="160" y2="106" stroke="#475569" stroke-width="4" stroke-linecap="round" stroke-dasharray="6,8" opacity=".7"/>
    <line x1="65"  y1="118" x2="165" y2="118" stroke="#475569" stroke-width="4" stroke-linecap="round" stroke-dasharray="6,8" opacity=".5"/>
    ${moto(205)}${rider(205, '#64748b')}
    <text x="45" y="88" fill="#f59e0b" font-size="22" font-weight="bold" font-family="system-ui" opacity=".8">!</text>
    <text x="160" y="148" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold" font-family="system-ui">ABRUPT STOP IN TRAFFIC</text>
  </svg>`,

  // RB-09: Overloading — wide cargo boxes on both sides
  'RB-09': `<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${BG}
    ${moto(160)}
    <rect x="60"  y="86" width="38" height="30" rx="3" fill="#854d0e" stroke="#a16207" stroke-width="1.5"/>
    <rect x="222" y="86" width="38" height="30" rx="3" fill="#854d0e" stroke="#a16207" stroke-width="1.5"/>
    <rect x="68"  y="72" width="30" height="22" rx="3" fill="#92400e" stroke="#a16207" stroke-width="1.5"/>
    <rect x="222" y="72" width="30" height="22" rx="3" fill="#92400e" stroke="#a16207" stroke-width="1.5"/>
    ${rider(160, '#64748b')}
    <text x="160" y="148" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold" font-family="system-ui">OVERLOADED VEHICLE</text>
  </svg>`,

  // RB-10: Speeding in school zone — school sign + speed lines
  'RB-10': `<svg viewBox="0 0 320 155" xmlns="http://www.w3.org/2000/svg">${BG}
    <polygon points="65,22 95,22 105,38 95,54 65,54 55,38" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
    <text x="80" y="35" text-anchor="middle" fill="#1a2035" font-size="9"  font-weight="bold" font-family="system-ui">SCHOOL</text>
    <text x="80" y="46" text-anchor="middle" fill="#1a2035" font-size="8"  font-weight="bold" font-family="system-ui">ZONE</text>
    <line x1="40" y1="72"  x2="75"  y2="72"  stroke="#ef4444" stroke-width="2" opacity=".5"/>
    <line x1="35" y1="80"  x2="75"  y2="80"  stroke="#ef4444" stroke-width="2" opacity=".7"/>
    <line x1="30" y1="88"  x2="75"  y2="88"  stroke="#ef4444" stroke-width="2" opacity=".9"/>
    ${moto(200, '#ef4444')}${rider(200, '#ef4444')}
    <text x="160" y="148" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold" font-family="system-ui">SPEEDING IN SCHOOL ZONE</text>
  </svg>`,
}

// ── Mini hourly bar chart (6 AM → 8 PM) ──────────────────────────────────────
// Generates a school-zone detection pattern seeded by the hotspot's risk score
function hourlyMiniChart(h: Hotspot, accentColor: string): string {
  const peak = h.risk / 10
  const raw = [8, 72, 95, 68, 22, 14, 10, 18, 55, 82, 90, 62, 24, 10]
  const hours = ['6','7','8','9','10','11','12','13','15','16','17','18','19','20']
  const vals = raw.map(v => Math.min(100, Math.round(v * (0.7 + peak * 0.6))))

  const W = 266, H = 42, pad = 4
  const bw = (W - pad * 2) / vals.length - 2
  // Peak bars use accent color, lower bars are muted version
  const bars = vals.map((v, i) => {
    const bh = Math.max(2, (v / 100) * H)
    const x  = pad + i * ((W - pad * 2) / vals.length)
    const y  = H - bh
    const opacity = v > 60 ? '.95' : v > 30 ? '.55' : '.28'
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="1.5" fill="${accentColor}" opacity="${opacity}"/>`
  }).join('')

  const labels = hours.map((hr, i) => {
    if (i % 2 !== 0) return ''
    const x = pad + i * ((W - pad * 2) / vals.length) + bw / 2
    return `<text x="${x.toFixed(1)}" y="${H + 10}" text-anchor="middle" fill="#475569" font-size="7" font-family="system-ui">${hr}</text>`
  }).join('')

  return `<svg viewBox="0 0 ${W} ${H + 14}" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block">
    ${bars}${labels}
  </svg>`
}

// ── Rich popup HTML ───────────────────────────────────────────────────────────
function buildPopupHtml(h: Hotspot): string {
  const sev        = BEHAVIOR_SEVERITY[h.behavior] ?? { label: 'MODERATE', color: '#f59e0b' }
  const ac         = sev.color                           // primary accent: unique per behavior
  const ac18       = `${ac}18`                           // 10% tint for card bg
  const ac35       = `${ac}35`                           // 20% tint for borders
  const behName    = BEHAVIOR_NAMES[h.behavior]   ?? h.behavior
  const district   = HOTSPOT_DISTRICT[h.id]        ?? 'HCMC'
  const confidence = Math.min(98, Math.round(76 + h.risk * 2.1))
  const scene      = BEHAVIOR_SCENES[h.behavior]   ?? BEHAVIOR_SCENES['RB-01']
  const chart      = hourlyMiniChart(h, ac)

  // Risk meter bar — 0..10 mapped to width %
  const riskW      = Math.round(h.risk / 10 * 100)

  return `
<div style="width:296px;font-family:'Segoe UI',system-ui,sans-serif;overflow:hidden;
            box-shadow:0 0 28px ${ac}28,0 20px 48px rgba(0,0,0,.7)">

  <!-- 3 px accent strip at top -->
  <div style="height:3px;background:linear-gradient(90deg,${ac}00,${ac},${ac}90,${ac}00)"></div>

  <!-- behavior scene SVG -->
  <div style="position:relative;height:155px;overflow:hidden;background:#080d16;line-height:0">
    ${scene}
    <!-- gradient fade into content section -->
    <div style="position:absolute;bottom:0;left:0;right:0;height:36px;
                background:linear-gradient(transparent,#0f1623)"></div>
    <!-- capture badge (uses accent color) -->
    <div style="position:absolute;top:9px;left:9px;display:flex;align-items:center;gap:5px;
                background:rgba(8,13,22,.82);border:1px solid ${ac35};border-radius:6px;padding:3px 9px">
      <div style="width:6px;height:6px;border-radius:50%;background:${ac};
                  box-shadow:0 0 6px ${ac}"></div>
      <span style="font-size:9px;font-weight:700;color:${ac};letter-spacing:.07em">BEHAVIOR CAPTURE</span>
    </div>
    <!-- risk badge -->
    <div style="position:absolute;top:9px;right:9px;
                background:rgba(8,13,22,.82);border:1px solid ${ac35};border-radius:6px;padding:3px 10px">
      <span style="font-size:10px;font-weight:800;color:${ac}">RISK&nbsp;${h.risk}</span>
    </div>
  </div>

  <!-- content body -->
  <div style="padding:11px 13px 13px;background:#0f1623">

    <!-- school name + district -->
    <div style="margin-bottom:10px">
      <div style="font-size:13px;font-weight:700;color:#f1f5f9;line-height:1.3">${h.school}</div>
      <div style="display:flex;align-items:center;gap:6px;margin-top:3px">
        <span style="font-size:10px;color:#475569">${district} · Ho Chi Minh City</span>
        <span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:4px;
                     background:${ac18};color:${ac};border:1px solid ${ac35}">${sev.label}</span>
      </div>
    </div>

    <!-- 3-stat row — all tinted with accent -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin-bottom:10px">
      <div style="background:${ac18};border-radius:8px;padding:7px 4px;text-align:center;
                  border:1px solid ${ac35}">
        <div style="font-size:18px;font-weight:800;color:${ac};line-height:1.1">${h.risk}</div>
        <div style="font-size:8px;color:#475569;margin-top:2px;letter-spacing:.05em">RISK SCORE</div>
      </div>
      <div style="background:rgba(255,255,255,.04);border-radius:8px;padding:7px 4px;text-align:center;
                  border:1px solid rgba(255,255,255,.07)">
        <div style="font-size:18px;font-weight:800;color:#f1f5f9;line-height:1.1">${h.count}</div>
        <div style="font-size:8px;color:#475569;margin-top:2px;letter-spacing:.05em">DETECTIONS</div>
      </div>
      <div style="background:rgba(255,255,255,.04);border-radius:8px;padding:7px 4px;text-align:center;
                  border:1px solid rgba(255,255,255,.07)">
        <div style="font-size:18px;font-weight:800;color:#f1f5f9;line-height:1.1">${confidence}%</div>
        <div style="font-size:8px;color:#475569;margin-top:2px;letter-spacing:.05em">CONFIDENCE</div>
      </div>
    </div>

    <!-- risk level bar -->
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
      <span style="font-size:9px;color:#475569;font-weight:600;letter-spacing:.04em;white-space:nowrap">RISK LEVEL</span>
      <div style="flex:1;height:5px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${riskW}%;border-radius:3px;
                    background:linear-gradient(90deg,${ac}80,${ac})"></div>
      </div>
      <span style="font-size:9px;font-weight:700;color:${ac}">${h.risk}/10</span>
    </div>

    <!-- hourly chart -->
    <div style="background:rgba(255,255,255,.03);border-radius:8px;padding:8px 9px 4px;
                margin-bottom:10px;border:1px solid rgba(255,255,255,.06)">
      <div style="font-size:9px;color:#475569;font-weight:600;letter-spacing:.05em;margin-bottom:6px">
        HOURLY DETECTION PATTERN
      </div>
      ${chart}
    </div>

    <!-- behavior tag — accent border left -->
    <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;
                background:${ac18};border-radius:8px;border:1px solid ${ac35};border-left:3px solid ${ac}">
      <span style="font-size:10px;font-weight:700;color:${ac};flex-shrink:0">${h.behavior}</span>
      <span style="font-size:10px;color:#94a3b8;flex:1;white-space:nowrap;overflow:hidden;
                  text-overflow:ellipsis">${behName}</span>
    </div>

  </div>
</div>`
}

// ── Spatial helpers ────────────────────────────────────────────────────────────
function toSpatialPoints(hotspots: Hotspot[]): SpatialPoint[] {
  return hotspots.map(h => ({ x: h.lng, y: h.lat, value: h.risk }))
}

export default function MapView({ hotspots }: Props) {
  const mapRef         = useRef<HTMLDivElement>(null)
  const canvasRef      = useRef<HTMLCanvasElement | null>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const overlayRef     = useRef<L.ImageOverlay | null>(null)
  const markersRef     = useRef<L.Layer[]>([])
  const initStarted    = useRef(false)

  const [method, setMethod]       = useState<InterpolationMethod>('idw')
  const [idwPower, setIdwPower]   = useState(2)
  const [computing, setComputing] = useState(false)
  const [variogram, setVariogram] = useState<KrigingParams | null>(null)

  const renderSurface = useCallback((m: L.Map, currentMethod: InterpolationMethod, power: number) => {
    if (currentMethod === 'markers') return
    setComputing(true)
    const bounds = m.getBounds()
    const sw = bounds.getSouthWest(), ne = bounds.getNorthEast()
    const spatialBounds = { minX: sw.lng, maxX: ne.lng, minY: sw.lat, maxY: ne.lat }
    const points = toSpatialPoints(hotspots)
    const kp = estimateVariogram(points)
    setVariogram(kp)
    setTimeout(() => {
      try {
        const grid = buildGrid(points, spatialBounds, GRID_COLS, GRID_ROWS,
          currentMethod as 'idw' | 'kriging', power, kp)
        if (!canvasRef.current) canvasRef.current = document.createElement('canvas')
        const canvas = canvasRef.current
        canvas.width = GRID_COLS; canvas.height = GRID_ROWS
        const ctx = canvas.getContext('2d')!
        ctx.putImageData(gridToImageData(grid, GRID_COLS, GRID_ROWS, 0, 10), 0, 0)
        const dataUrl = canvas.toDataURL('image/png')
        const leafletBounds: L.LatLngBoundsLiteral = [[sw.lat, sw.lng], [ne.lat, ne.lng]]
        if (overlayRef.current) overlayRef.current.remove()
        import('leaflet').then(L => {
          overlayRef.current = L.imageOverlay(dataUrl, leafletBounds, { opacity: 0.82, zIndex: 400 })
          overlayRef.current.addTo(m)
        })
      } finally { setComputing(false) }
    }, 0)
  }, [hotspots])

  const clearOverlays = useCallback((m: L.Map) => {
    if (overlayRef.current) { overlayRef.current.remove(); overlayRef.current = null }
    markersRef.current.forEach(l => m.removeLayer(l))
    markersRef.current = []
  }, [])

  const addMarkers = useCallback((m: L.Map, L: typeof import('leaflet')) => {
    hotspots.forEach(h => {
      const color = (BEHAVIOR_SEVERITY[h.behavior] ?? { color: '#f59e0b' }).color
      const ring = L.circle([h.lat, h.lng], {
        radius: 250 + h.risk * 60,
        fillColor: color, fillOpacity: 0.14, color, weight: 1.5, opacity: 0.45,
      }).addTo(m)
      const dot = L.circleMarker([h.lat, h.lng], {
        radius: 9, fillColor: color, fillOpacity: 0.95, color: '#fff', weight: 2,
      }).bindPopup(buildPopupHtml(h), { maxWidth: 310, className: 'lelp-rich-popup' }).addTo(m)
      dot.on('mouseover', function(this: L.CircleMarker) { this.openPopup() })
      markersRef.current.push(ring, dot)
    })
  }, [hotspots])

  useEffect(() => {
    if (!mapRef.current) return
    let aborted = false
    import('leaflet').then(L => {
      if (aborted || !mapRef.current) return
      if ((mapRef.current as HTMLElement & { _leaflet_id?: number })._leaflet_id) return
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })
      const map = L.map(mapRef.current!, { zoomControl: true, attributionControl: true })
        .setView([10.7900, 106.6800], 12)
      mapInstanceRef.current = map
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO', maxZoom: 19,
      }).addTo(map)

      // Permanent dot markers with rich popup on hover
      hotspots.forEach(h => {
        const color = (BEHAVIOR_SEVERITY[h.behavior] ?? { color: '#f59e0b' }).color
        const marker = L.circleMarker([h.lat, h.lng], {
          radius: 8, fillColor: color, fillOpacity: 0.95, color: '#fff', weight: 2.5,
        }).bindPopup(buildPopupHtml(h), { maxWidth: 310, className: 'lelp-rich-popup' }).addTo(map)
        marker.on('mouseover', function(this: L.CircleMarker) { this.openPopup() })
      })

      renderSurface(map, 'idw', 2)
      let timer: ReturnType<typeof setTimeout>
      map.on('moveend zoomend', () => {
        clearTimeout(timer)
        timer = setTimeout(() => { if (method !== 'markers') renderSurface(map, method, idwPower) }, 400)
      })
    })
    return () => { aborted = true; mapInstanceRef.current?.remove(); mapInstanceRef.current = null }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return
    clearOverlays(map)
    if (method === 'markers') import('leaflet').then(L => addMarkers(map, L))
    else renderSurface(map, method, idwPower)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, idwPower])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="card" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '.04em', textTransform: 'uppercase' }}>
          Interpolation
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {([
            ['idw',     'IDW',          'Inverse Distance Weighting'],
            ['kriging', 'Kriging',       'Ordinary Kriging (spherical variogram)'],
            ['markers', 'Point Markers', 'Simple circle markers'],
          ] as const).map(([val, label, title]) => (
            <button key={val} title={title} onClick={() => setMethod(val)} style={{
              padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: method === val ? 'var(--accent-dim)' : 'var(--bg-raised)',
              color:      method === val ? 'var(--accent)'     : 'var(--text-muted)',
              border:     method === val ? '1px solid rgba(245,158,11,.3)' : '1px solid var(--border-subtle)',
              transition: 'all .15s ease',
            }}>{label}</button>
          ))}
        </div>
        {method === 'idw' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Power (p):</span>
            {[1, 2, 3, 4].map(p => (
              <button key={p} onClick={() => setIdwPower(p)} style={{
                width: 30, height: 28, borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                background: idwPower === p ? 'var(--accent-dim)' : 'var(--bg-raised)',
                color:      idwPower === p ? 'var(--accent)'     : 'var(--text-muted)',
                border:     idwPower === p ? '1px solid rgba(245,158,11,.3)' : '1px solid var(--border-subtle)',
              }}>{p}</button>
            ))}
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {idwPower === 1 ? '← smoother' : idwPower >= 3 ? 'sharper →' : ''}
            </span>
          </div>
        )}
        {method === 'kriging' && variogram && (
          <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--text-muted)' }}>
            <span>nugget <strong style={{ color: 'var(--text-secondary)' }}>{variogram.nugget.toFixed(3)}</strong></span>
            <span>sill <strong style={{ color: 'var(--text-secondary)' }}>{variogram.sill.toFixed(3)}</strong></span>
            <span>range <strong style={{ color: 'var(--text-secondary)' }}>{variogram.range.toFixed(4)}°</strong></span>
            <span>model <strong style={{ color: 'var(--accent)' }}>{variogram.model}</strong></span>
          </div>
        )}
        {computing && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Computing {method.toUpperCase()}…</span>
          </div>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
        <div ref={mapRef} style={{ height: 'calc(100vh - 180px)', minHeight: 620, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)' }} />

        {method !== 'markers' && (
          <div style={{ position: 'absolute', bottom: 24, left: 16, zIndex: 1000, background: 'rgba(8,13,22,0.88)', backdropFilter: 'blur(8px)', border: '1px solid var(--border-mid)', borderRadius: 10, padding: '10px 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '.05em' }}>Risk Score</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, color: '#3b82f6' }}>Low</span>
              <div style={{ width: 130, height: 8, borderRadius: 4, background: 'linear-gradient(to right, #3b82f6, #22c55e, #84cc16, #f59e0b, #ef4444)' }} />
              <span style={{ fontSize: 10, color: '#ef4444' }}>High</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 10, color: '#3b82f6' }}>Safe</span>
              <span style={{ fontSize: 10, color: '#84cc16' }}>Moderate</span>
              <span style={{ fontSize: 10, color: '#ef4444' }}>High Risk</span>
            </div>
          </div>
        )}

        <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 1000, background: 'rgba(8,13,22,0.85)', backdropFilter: 'blur(8px)', border: '1px solid var(--border-mid)', borderRadius: 8, padding: '6px 12px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>
            {method === 'idw' ? `IDW  p=${idwPower}` : method === 'kriging' ? 'Ordinary Kriging' : 'Circle Markers'}
          </span>
        </div>

        <div style={{ position: 'absolute', bottom: 24, right: 16, zIndex: 1000, background: 'rgba(8,13,22,0.85)', backdropFilter: 'blur(8px)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px', maxWidth: 220 }}>
          {method === 'idw' && <>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Inverse Distance Weighting</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.5 }}>Deterministic interpolation. Risk at any location = weighted avg of known points, weight ∝ 1/dist<sup>p</sup>. Higher p → sharper transitions.</div>
          </>}
          {method === 'kriging' && <>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Ordinary Kriging</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.5 }}>Geostatistical BLUE estimator. Uses a spherical variogram to model spatial autocorrelation. Solves λ·Γ = γ₀ for optimal unbiased weights.</div>
          </>}
          {method === 'markers' && <>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Point Markers</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.5 }}>Raw hotspot locations. No interpolation — shows exact CCTV/submission detection sites.</div>
          </>}
        </div>

        <div style={{ position: 'absolute', top: 12, left: 16, zIndex: 1000, background: 'rgba(8,13,22,0.75)', backdropFilter: 'blur(6px)', border: '1px solid var(--border-subtle)', borderRadius: 7, padding: '5px 10px' }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Hover a marker to inspect</span>
        </div>
      </div>
    </div>
  )
}
