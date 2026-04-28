'use client'
import { useState } from 'react'
import { REVIEW_QUEUE, getBehaviorByCode } from '@/lib/mock-data'
import { Check, X, Flag, Filter, Search } from 'lucide-react'

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  PENDING:   { bg: 'rgba(245,158,11,.12)', color: '#f59e0b' },
  VALIDATED: { bg: 'rgba(34,197,94,.12)',  color: '#22c55e' },
  REJECTED:  { bg: 'rgba(100,116,139,.12)',color: '#64748b' },
  FLAGGED:   { bg: 'rgba(239,68,68,.12)',  color: '#ef4444' },
}

export default function ReviewPage() {
  const [filter, setFilter] = useState('ALL')
  const [selected, setSelected] = useState<string | null>(null)
  const queue = filter === 'ALL' ? REVIEW_QUEUE : REVIEW_QUEUE.filter(s => s.status === filter)
  const sel = queue.find(s => s.id === selected) ?? queue[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.01em' }}>Submission Review Queue</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 13 }}>Annotate detections · Approve or reject student submissions</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['ALL','PENDING','VALIDATED','REJECTED','FLAGGED'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              background: filter === f ? 'var(--accent-dim)' : 'var(--bg-raised)',
              color: filter === f ? 'var(--accent)' : 'var(--text-muted)',
              border: filter === f ? '1px solid rgba(245,158,11,.25)' : '1px solid var(--border-subtle)',
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'start' }}>
        {/* Queue list */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Search size={13} style={{ color: 'var(--text-muted)' }} />
            <input placeholder="Search by student or school…" style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, flex: 1 }} />
            <Filter size={13} style={{ color: 'var(--text-muted)' }} />
          </div>
          <table className="data-table">
            <thead><tr><th>Student</th><th>Behavior</th><th>Confidence</th><th>Match</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {queue.map(s => {
                const beh = getBehaviorByCode(s.behavior)
                const st = STATUS_STYLE[s.status]
                const match = s.behavior === s.userLabel
                return (
                  <tr key={s.id} onClick={() => setSelected(s.id)} style={{ cursor: 'pointer', background: selected === s.id ? 'rgba(245,158,11,.05)' : undefined }}>
                    <td>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 13 }}>{s.student}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{s.school}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 7, height: 7, borderRadius: 2, background: beh.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: beh.color }}>{s.behavior}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 13, color: s.confidence > 0.85 ? '#22c55e' : s.confidence > 0.7 ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>
                        {(s.confidence*100).toFixed(0)}%
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 11, color: match ? '#22c55e' : '#ef4444', fontWeight: 600 }}>{match ? '✓ Match' : '✗ Mismatch'}</span>
                    </td>
                    <td><span className="badge" style={{ background: st.bg, color: st.color }}>{s.status}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      {s.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.2)', color: '#22c55e', cursor: 'pointer', fontSize: 11 }}>✓</button>
                          <button style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: '#ef4444', cursor: 'pointer', fontSize: 11 }}>✗</button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {sel && (() => {
          const beh = getBehaviorByCode(sel.behavior)
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Image placeholder */}
              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{
                  height: 220, background: `linear-gradient(135deg, ${beh.color}18, var(--bg-overlay))`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, position: 'relative',
                }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: `${beh.color}25`, border: `2px solid ${beh.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 22 }}>📸</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Submission image</div>
                  {/* Simulated bbox */}
                  <div style={{ position: 'absolute', top: 40, left: 60, width: 120, height: 80, border: `2px solid ${beh.color}`, borderRadius: 4 }}>
                    <div style={{ position: 'absolute', top: -18, left: 0, fontSize: 10, color: beh.color, fontWeight: 600, background: `${beh.color}20`, padding: '1px 5px', borderRadius: 3 }}>{sel.behavior} · {(sel.confidence*100).toFixed(0)}%</div>
                  </div>
                </div>
                <div style={{ padding: 14 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>Submission ID: <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{sel.id}</span></div>
                  {[
                    ['Student',    sel.student],
                    ['School',     sel.school],
                    ['YOLO Label', sel.behavior],
                    ['User Label', sel.userLabel],
                    ['Confidence', `${(sel.confidence*100).toFixed(1)}%`],
                    ['Submitted',  sel.submittedAt],
                  ].map(([k,v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{k}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {sel.status === 'PENDING' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button style={{ padding: '10px', borderRadius: 9, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', color: '#22c55e', cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <Check size={14} /> Approve
                  </button>
                  <button style={{ padding: '10px', borderRadius: 9, background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <X size={14} /> Reject
                  </button>
                  <button style={{ gridColumn: 'span 2', padding: '10px', borderRadius: 9, background: 'var(--bg-raised)', border: '1px solid var(--border-mid)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <Flag size={13} /> Flag for Review
                  </button>
                </div>
              )}
            </div>
          )
        })()}
      </div>
    </div>
  )
}
