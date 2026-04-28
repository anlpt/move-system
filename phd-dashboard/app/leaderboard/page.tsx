'use client'
import { LEADERBOARD, SCHOOL_LEADERBOARD } from '@/lib/mock-data'
import { Trophy, TrendingUp, TrendingDown, Minus, Star } from 'lucide-react'
import { useState } from 'react'

const TIER_COLORS = ['#f59e0b','#94a3b8','#cd7c2f','#64748b']
const TIER_LABELS = ['Gold','Silver','Bronze','']

export default function LeaderboardPage() {
  const [view, setView] = useState<'student'|'school'>('student')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.01em' }}>Leaderboard</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 13 }}>City-wide rankings · Updated daily · April 11, 2026</p>
        </div>
        <div style={{ display: 'flex', gap: 6, padding: 4, background: 'var(--bg-raised)', borderRadius: 9, border: '1px solid var(--border-subtle)' }}>
          {(['student','school'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '7px 16px', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer',
              background: view === v ? 'var(--accent-dim)' : 'transparent',
              color: view === v ? 'var(--accent)' : 'var(--text-muted)',
              border: view === v ? '1px solid rgba(245,158,11,.25)' : '1px solid transparent',
            }}>{v === 'student' ? 'Students' : 'Schools'}</button>
          ))}
        </div>
      </div>

      {/* Top 3 podium */}
      {view === 'student' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          {LEADERBOARD.slice(0, 3).map((u, i) => (
            <div key={u.rank} className="card" style={{
              padding: 20, textAlign: 'center', position: 'relative', overflow: 'hidden',
              border: i === 0 ? '1px solid rgba(245,158,11,.3)' : '1px solid var(--border-subtle)',
              background: i === 0 ? 'rgba(245,158,11,.04)' : 'var(--bg-surface)',
              order: i === 0 ? 0 : i === 1 ? -1 : 1,
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{'🥇🥈🥉'[i]}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{u.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{u.school.replace('THPT ','').replace('THCS ','')} · {u.grade}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: TIER_COLORS[i], marginTop: 12, lineHeight: 1 }}>{u.points.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>points</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{u.submissions}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>submissions</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>{u.badges}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>badges</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 600, fontSize: 13 }}>
          {view === 'student' ? 'All Students — City-wide Ranking' : 'School Rankings'}
        </div>
        <table className="data-table">
          <thead>
            {view === 'student'
              ? <tr><th>#</th><th>Student</th><th>School</th><th>Grade</th><th>Points</th><th>Submissions</th><th>Badges</th><th>Trend</th></tr>
              : <tr><th>#</th><th>School</th><th>District</th><th>Students</th><th>Submissions</th><th>Total Points</th><th>Avg Score</th></tr>
            }
          </thead>
          <tbody>
            {view === 'student'
              ? LEADERBOARD.map(u => (
                  <tr key={u.rank}>
                    <td>
                      <span style={{ fontWeight: 700, color: u.rank <= 3 ? TIER_COLORS[u.rank-1] : 'var(--text-muted)', fontSize: u.rank <= 3 ? 15 : 13 }}>
                        {u.rank <= 3 ? ['🥇','🥈','🥉'][u.rank-1] : `#${u.rank}`}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{u.name}</td>
                    <td style={{ fontSize: 12 }}>{u.school.replace('THPT ','').replace('THCS ','')}</td>
                    <td><span className="badge badge-blue">{u.grade}</span></td>
                    <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: 'var(--accent)' }}>{u.points.toLocaleString()}</td>
                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{u.submissions}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {Array.from({ length: Math.min(u.badges, 5) }, (_, i) => (
                          <Star key={i} size={10} fill="#f59e0b" stroke="none" />
                        ))}
                        {u.badges > 5 && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{u.badges-5}</span>}
                      </div>
                    </td>
                    <td>
                      {u.trend === 'up'   && <TrendingUp size={14} style={{ color: '#22c55e' }} />}
                      {u.trend === 'down' && <TrendingDown size={14} style={{ color: '#ef4444' }} />}
                      {u.trend === 'same' && <Minus size={14} style={{ color: '#64748b' }} />}
                    </td>
                  </tr>
                ))
              : SCHOOL_LEADERBOARD.map(s => (
                  <tr key={s.rank}>
                    <td><span style={{ fontWeight: 700, color: s.rank <= 3 ? TIER_COLORS[s.rank-1] : 'var(--text-muted)' }}>{s.rank <= 3 ? ['🥇','🥈','🥉'][s.rank-1] : `#${s.rank}`}</span></td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{s.name}</td>
                    <td style={{ fontSize: 12 }}>{s.district}</td>
                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{s.students.toLocaleString()}</td>
                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{s.submissions}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>{s.totalPoints.toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 60 }}><div className="progress-fill" style={{ width: `${s.avgScore}%`, background: '#22c55e' }} /></div>
                        <span style={{ fontSize: 12 }}>{s.avgScore}%</span>
                      </div>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
