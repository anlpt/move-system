'use client'
import { QUIZ_QUESTIONS, getBehaviorByCode } from '@/lib/mock-data'
import { HelpCircle, Plus, Play, Eye, EyeOff, BookOpen } from 'lucide-react'

const DIFFICULTY_COLORS: Record<string, string> = {
  EASY: '#22c55e',
  MEDIUM: '#f59e0b',
  HARD: '#ef4444',
}

export default function QuizPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.01em' }}>Quiz Bank</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 13 }}>Hazard perception questions · Behavior education · R2S mobile module</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: 'var(--accent-dim)', border: '1px solid rgba(245,158,11,.3)', borderRadius: 9, color: 'var(--accent)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={14} /> Add Question
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Questions', value: QUIZ_QUESTIONS.length,                              color: '#3b82f6' },
          { label: 'Active',          value: QUIZ_QUESTIONS.filter(q => q.active).length,        color: '#22c55e' },
          { label: 'Total Plays',     value: QUIZ_QUESTIONS.reduce((s,q) => s+q.plays, 0).toLocaleString(), color: '#f59e0b' },
          { label: 'Avg per Question',value: Math.round(QUIZ_QUESTIONS.reduce((s,q) => s+q.plays,0)/QUIZ_QUESTIONS.length).toLocaleString(), color: '#8b5cf6' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color, marginTop: 6, lineHeight: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Difficulty breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {(['EASY','MEDIUM','HARD'] as const).map(diff => {
          const qs = QUIZ_QUESTIONS.filter(q => q.difficulty === diff)
          return (
            <div key={diff} className="card" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${DIFFICULTY_COLORS[diff]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookOpen size={18} style={{ color: DIFFICULTY_COLORS[diff] }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>{diff}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: DIFFICULTY_COLORS[diff], lineHeight: 1.1 }}>{qs.length} questions</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{qs.reduce((s,q) => s+q.plays,0).toLocaleString()} plays</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Question bank table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>All Questions</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {['All','EASY','MEDIUM','HARD'].map(f => (
              <button key={f} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', cursor: 'pointer' }}>{f}</button>
            ))}
          </div>
        </div>
        <table className="data-table">
          <thead><tr><th>ID</th><th>Question</th><th>Behavior</th><th>Difficulty</th><th>Plays</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {QUIZ_QUESTIONS.map(q => {
              const beh = getBehaviorByCode(q.behavior)
              const diffColor = DIFFICULTY_COLORS[q.difficulty] || '#64748b'
              return (
                <tr key={q.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{q.id}</td>
                  <td>
                    <div style={{ color: 'var(--text-primary)', fontSize: 13, maxWidth: 360 }}>{q.text.length > 70 ? q.text.slice(0,70)+'…' : q.text}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 7, height: 7, borderRadius: 2, background: beh.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: beh.color, fontWeight: 600 }}>{q.behavior}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: `${diffColor}18`, color: diffColor }}>{q.difficulty}</span>
                  </td>
                  <td style={{ fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>{q.plays.toLocaleString()}</td>
                  <td>
                    {q.active
                      ? <span className="badge badge-low"><Eye size={9} /> Active</span>
                      : <span className="badge" style={{ background: 'rgba(100,116,139,.12)', color: '#64748b' }}><EyeOff size={9} /> Hidden</span>
                    }
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(59,130,246,.1)', border: '1px solid rgba(59,130,246,.2)', color: '#3b82f6', cursor: 'pointer', fontSize: 11 }}>Edit</button>
                      <button style={{ padding: '4px 8px', borderRadius: 6, background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Play size={9} />
                      </button>
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
