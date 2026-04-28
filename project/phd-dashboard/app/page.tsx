'use client'
import { BEHAVIORS, KPI, RECENT_DETECTIONS, TREND_DATA, getBehaviorByCode } from '@/lib/mock-data'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { TrendingUp, Camera, Clock, Cpu, AlertTriangle, CheckCircle, Users, MapPin } from 'lucide-react'

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  VALIDATED: { bg: 'rgba(34,197,94,.12)',   color: '#22c55e', label: 'Validated' },
  PENDING:   { bg: 'rgba(245,158,11,.12)',  color: '#f59e0b', label: 'Pending'   },
  FLAGGED:   { bg: 'rgba(239,68,68,.12)',   color: '#ef4444', label: 'Flagged'   },
  REJECTED:  { bg: 'rgba(100,116,139,.12)', color: '#64748b', label: 'Rejected'  },
}

const KPI_CARDS = [
  { label: 'Total Detections',  value: KPI.totalDetections.toLocaleString(), delta: KPI.detectionsDelta,       icon: AlertTriangle, color: '#ef4444' },
  { label: 'Active Schools',    value: KPI.activeSchools,                    delta: '6 pilot sites',           icon: MapPin,        color: '#3b82f6' },
  { label: 'Pending Reviews',   value: KPI.pendingReviews,                   delta: 'need annotation',         icon: Clock,         color: '#f59e0b' },
  { label: 'Model Accuracy',    value: `${(KPI.modelAccuracy*100).toFixed(1)}%`, delta: 'YOLOv8 mAP50',      icon: Cpu,           color: '#22c55e' },
  { label: 'Submissions Today', value: KPI.submissionsToday,                 delta: 'from students',           icon: Camera,        color: '#8b5cf6' },
  { label: 'Risk Hotspots',     value: KPI.hotspots,                         delta: 'locations flagged',       icon: TrendingUp,    color: '#f97316' },
  { label: 'Active Students',   value: KPI.studentsActive.toLocaleString(),  delta: 'in R2S app',              icon: Users,         color: '#06b6d4' },
  { label: 'Validated Today',   value: 42,                                   delta: 'approved by annotators',  icon: CheckCircle,   color: '#84cc16' },
]

export default function OverviewPage() {
  const trendSlice = TREND_DATA.slice(-14)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-.01em' }}>Platform Overview</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 13 }}>Ho Chi Minh City School Zones · April 11, 2026</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: 'rgba(34,197,94,.08)', borderRadius: 8, border: '1px solid rgba(34,197,94,.2)' }}>
          <div className="live-dot" />
          <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>Live · Updated 2 min ago</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {KPI_CARDS.map(({ label, value, delta, icon: Icon, color }, i) => (
          <div key={label} className="card stat-card fade-up" style={{ padding: 18, animationDelay: `${i*40}ms` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginTop: 6, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>{delta}</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Detection Trend — Last 14 Days</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Top 4 behavior classes</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendSlice} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" />
              <XAxis dataKey="date" tick={{ fill: '#4b6280', fontSize: 10 }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fill: '#4b6280', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-mid)', borderRadius: 8, fontSize: 12 }} />
              {[['RB-01','#ef4444'],['RB-02','#f97316'],['RB-03','#eab308'],['RB-05','#22c55e']].map(([k,c]) => (
                <Line key={k} type="monotone" dataKey={k} stroke={c} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            {[['RB-01','#ef4444','Helmet'],['RB-02','#f97316','Phone Use'],['RB-03','#eab308','Wrong-Way'],['RB-05','#22c55e','Red Light']].map(([code,color,label]) => (
              <div key={code} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 3, borderRadius: 2, background: color as string }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Behavior Distribution</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>All-time · 10 classes</div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={BEHAVIORS} dataKey="count" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2}>
                {BEHAVIORS.map(b => <Cell key={b.code} fill={b.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-mid)', borderRadius: 8, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 6 }}>
            {BEHAVIORS.slice(0, 5).map(b => (
              <div key={b.code} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: b.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', flex: 1 }}>{b.code} {b.name.split(' ')[0]}</span>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{b.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent detections */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Recent Detections</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Live feed from cameras and student submissions</div>
          </div>
          <a href="/move-website/project/phd-dashboard/out/review/" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>View queue →</a>
        </div>
        <table className="data-table">
          <thead><tr><th>Behavior</th><th>School</th><th>Confidence</th><th>Status</th><th>Time</th></tr></thead>
          <tbody>
            {RECENT_DETECTIONS.map(d => {
              const beh = getBehaviorByCode(d.behavior)
              const st = STATUS_STYLES[d.status]
              return (
                <tr key={d.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: beh.color, flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{d.behavior}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{beh.name}</span>
                    </div>
                  </td>
                  <td>{d.school}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ width: 60 }}>
                        <div className="progress-fill" style={{ width: `${d.confidence*100}%`, background: d.confidence > 0.85 ? '#22c55e' : d.confidence > 0.7 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <span style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>{(d.confidence*100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td><span className="badge" style={{ background: st.bg, color: st.color }}>{st.label}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{d.time}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
