'use client'
import { LEADERBOARD, SCHOOLS } from '@/lib/mock-data'
import { UserCheck, UserX, Shield, Search, Download } from 'lucide-react'

const MOCK_USERS = [
  ...LEADERBOARD.map((u, i) => ({ ...u, role: 'STUDENT', consent: true,  email: `student${i+1}@school.edu.vn`, lastLogin: `${i+1}h ago` })),
  { rank: 0, name: 'Nguyễn Thị Lan', school: 'THPT Lê Quý Đôn', grade: 'N/A', points: 0, badges: 0, submissions: 0, trend: 'same', role: 'TEACHER',     consent: true,  email: 'lan.nguyen@school.edu.vn',   lastLogin: '30 min ago' },
  { rank: 0, name: 'Trần Văn Minh',  school: 'THPT Trần Phú',    grade: 'N/A', points: 0, badges: 0, submissions: 0, trend: 'same', role: 'ADMIN',       consent: true,  email: 'minh.tran@iscm.ueh.edu.vn', lastLogin: '1h ago' },
  { rank: 0, name: 'Le Phan Truong An', school: 'ISCM UEH',       grade: 'N/A', points: 0, badges: 0, submissions: 0, trend: 'same', role: 'RESEARCHER',  consent: true,  email: 'an.le@iscm.ueh.edu.vn',     lastLogin: '5 min ago' },
]

const ROLE_BADGE: Record<string, { bg: string; color: string }> = {
  STUDENT:    { bg: 'rgba(59,130,246,.12)',  color: '#3b82f6' },
  TEACHER:    { bg: 'rgba(139,92,246,.12)',  color: '#8b5cf6' },
  ADMIN:      { bg: 'rgba(245,158,11,.12)',  color: '#f59e0b' },
  RESEARCHER: { bg: 'rgba(34,197,94,.12)',   color: '#22c55e' },
  POLICE:     { bg: 'rgba(239,68,68,.12)',   color: '#ef4444' },
}

export default function UsersPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.01em' }}>User Management</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 13 }}>Consent tracking · Role management · Decree 13/2023 compliance</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', background: 'var(--bg-raised)', border: '1px solid var(--border-mid)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer' }}>
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* Compliance banner */}
      <div style={{ padding: '12px 16px', background: 'rgba(59,130,246,.06)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Shield size={16} style={{ color: '#3b82f6', flexShrink: 0 }} />
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Vietnam Decree 13/2023/ND-CP</strong> — All students under 18 require guardian consent before data collection.
          <span style={{ color: '#22c55e', fontWeight: 600, marginLeft: 8 }}>100% consent rate in current cohort ✓</span>
        </div>
      </div>

      {/* Role stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {Object.entries({ STUDENT: 10, TEACHER: 6, ADMIN: 2, RESEARCHER: 3, POLICE: 1 }).map(([role, count]) => {
          const s = ROLE_BADGE[role]
          return (
            <div key={role} className="card" style={{ padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{count}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>{role}</div>
            </div>
          )
        })}
      </div>

      {/* User table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Search size={13} style={{ color: 'var(--text-muted)' }} />
          <input placeholder="Search users…" style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, flex: 1 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            {['All','STUDENT','TEACHER','ADMIN','RESEARCHER'].map(f => (
              <button key={f} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', cursor: 'pointer' }}>{f}</button>
            ))}
          </div>
        </div>
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>School</th><th>Consent</th><th>Last Login</th><th></th></tr></thead>
          <tbody>
            {MOCK_USERS.map((u, i) => {
              const roleStyle = ROLE_BADGE[u.role]
              return (
                <tr key={i}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{u.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{u.email}</td>
                  <td><span className="badge" style={{ background: roleStyle.bg, color: roleStyle.color }}>{u.role}</span></td>
                  <td style={{ fontSize: 12 }}>{u.school.replace('THPT ','').replace('THCS ','')}</td>
                  <td>
                    {u.consent
                      ? <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#22c55e', fontSize: 12 }}><UserCheck size={13} /> Consented</span>
                      : <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#ef4444', fontSize: 12 }}><UserX size={13} /> Missing</span>
                    }
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{u.lastLogin}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(59,130,246,.1)', border: '1px solid rgba(59,130,246,.2)', color: '#3b82f6', cursor: 'pointer', fontSize: 11 }}>View</button>
                      <button style={{ padding: '4px 10px', borderRadius: 6, background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 11 }}>Edit</button>
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
