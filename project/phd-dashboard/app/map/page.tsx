'use client'
import { HOTSPOTS, BEHAVIORS, getBehaviorByCode } from '@/lib/mock-data'
import { useState } from 'react'
import { MapPin, Layers, Filter } from 'lucide-react'
import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('@/components/map-view'), { ssr: false, loading: () => (
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-raised)', borderRadius: 12, minHeight: 500 }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🗺️</div>
      <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading map…</div>
    </div>
  </div>
)})

export default function MapPage() {
  const [activeBehaviors, setActiveBehaviors] = useState<string[]>(BEHAVIORS.slice(0,3).map(b => b.code))

  const toggleBehavior = (code: string) =>
    setActiveBehaviors(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.01em' }}>School Zone Heatmap</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 13 }}>Ho Chi Minh City · Live detection density · PostGIS spatial data</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: 'rgba(34,197,94,.08)', borderRadius: 8, border: '1px solid rgba(34,197,94,.2)' }}>
          <div className="live-dot" />
          <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>6 cameras live</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 270px', gap: 20, alignItems: 'start' }}>
        <MapView hotspots={HOTSPOTS} />

        {/* Control panel — sticky, scrollable */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 20, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          {/* Behavior filter */}
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Filter size={13} style={{ color: 'var(--accent)' }} />
              <span style={{ fontWeight: 600, fontSize: 13 }}>Behavior Filter</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {BEHAVIORS.map(b => (
                <div key={b.code} onClick={() => toggleBehavior(b.code)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px',
                  borderRadius: 8, cursor: 'pointer',
                  background: activeBehaviors.includes(b.code) ? `${b.color}12` : 'var(--bg-raised)',
                  border: `1px solid ${activeBehaviors.includes(b.code) ? `${b.color}35` : 'var(--border-subtle)'}`,
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: activeBehaviors.includes(b.code) ? b.color : 'var(--bg-overlay)', flexShrink: 0, transition: 'background .15s' }} />
                  <span style={{ fontSize: 12, color: activeBehaviors.includes(b.code) ? 'var(--text-primary)' : 'var(--text-muted)', flex: 1 }}>{b.code}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{b.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hotspot list */}
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <MapPin size={13} style={{ color: '#ef4444' }} />
              <span style={{ fontWeight: 600, fontSize: 13 }}>Risk Hotspots</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {HOTSPOTS.sort((a,b) => b.risk - a.risk).map(h => {
                const beh = getBehaviorByCode(h.behavior)
                return (
                  <div key={h.id} style={{ padding: '10px 12px', background: 'var(--bg-raised)', borderRadius: 9, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', flex: 1, marginRight: 8 }}>{h.school.replace('THPT ','').replace('THCS ','')}</div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: h.risk > 6 ? '#ef4444' : h.risk > 4 ? '#f59e0b' : '#22c55e', flexShrink: 0 }}>{h.risk}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 6, height: 6, borderRadius: 2, background: beh.color }} />
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{h.behavior}</span>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{h.count} detections</span>
                    </div>
                    <div className="progress-bar" style={{ marginTop: 7 }}>
                      <div className="progress-fill" style={{ width: `${(h.risk/10)*100}%`, background: h.risk > 6 ? '#ef4444' : '#f59e0b' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
