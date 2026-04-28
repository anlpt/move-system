'use client'
import { SCHOOLS, BEHAVIORS } from '@/lib/mock-data'
import { School, Camera, Users, Wifi, WifiOff, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function SchoolsPage() {
  const [selected, setSelected] = useState(SCHOOLS[0].id)
  const school = SCHOOLS.find(s => s.id === selected) ?? SCHOOLS[0]
  const schoolBehaviors = BEHAVIORS.map(b => ({ name: b.code, count: Math.round(b.count * school.submissions / 6425), color: b.color }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.01em' }}>School Management</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 13 }}>Pilot schools · Camera status · Student activity</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, alignItems: 'start' }}>
        {/* School list */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '.05em', textTransform: 'uppercase' }}>
            {SCHOOLS.length} Schools
          </div>
          {SCHOOLS.map(s => (
            <div key={s.id} onClick={() => setSelected(s.id)} style={{
              padding: '12px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)',
              background: selected === s.id ? 'rgba(245,158,11,.05)' : undefined,
              borderLeft: selected === s.id ? '3px solid var(--accent)' : '3px solid transparent',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: selected === s.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.district}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Camera size={10} />{s.cameras}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Users size={10} />{s.students.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  {s.pilot && <span className="badge badge-amber">Pilot</span>}
                  <span style={{ fontSize: 11, color: s.risk > 6 ? '#ef4444' : s.risk > 4 ? '#f59e0b' : '#22c55e', fontWeight: 700 }}>
                    Risk {s.risk}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* School detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header card */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <School size={20} style={{ color: '#3b82f6' }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 17, fontWeight: 700 }}>{school.name}</h2>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{school.district} · Ho Chi Minh City</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {school.pilot && <span className="badge badge-amber">Pilot Site</span>}
                <span className="badge badge-low">Active</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 20 }}>
              {[
                { label: 'CCTV Cameras',   value: school.cameras,                     color: '#3b82f6' },
                { label: 'Students',        value: school.students.toLocaleString(),    color: '#8b5cf6' },
                { label: 'Submissions',     value: school.submissions,                 color: '#f59e0b' },
                { label: 'Risk Score',      value: `${school.risk}/10`,                color: school.risk > 6 ? '#ef4444' : '#f59e0b' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ padding: 14, background: 'var(--bg-raised)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color, marginTop: 4 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Camera status */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Camera Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Array.from({ length: school.cameras }, (_, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--bg-raised)', borderRadius: 9, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: i === 1 ? 'rgba(239,68,68,.1)' : 'rgba(34,197,94,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Camera size={15} style={{ color: i === 1 ? '#ef4444' : '#22c55e' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Gate {String.fromCharCode(65 + i)} — {['Main Entrance','Side Gate','Back Gate','East Wing'][i] ?? 'Camera'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>1080p · 25fps · FOV 90°</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {i === 1 ? <WifiOff size={13} style={{ color: '#ef4444' }} /> : <Wifi size={13} style={{ color: '#22c55e' }} />}
                    <span style={{ fontSize: 12, color: i === 1 ? '#ef4444' : '#22c55e', fontWeight: 600 }}>{i === 1 ? 'Offline' : 'Live'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detection breakdown */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Detections by Behavior Class</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={schoolBehaviors} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" />
                <XAxis dataKey="name" tick={{ fill: '#4b6280', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#4b6280', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-mid)', borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {schoolBehaviors.map((b, i) => (
                    <rect key={i} fill={b.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
