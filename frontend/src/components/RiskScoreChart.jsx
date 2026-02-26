import React, { useMemo } from 'react'

const levels = ['Low', 'Medium', 'High', 'Critical']
const colors = {
  Low: '#00ff9d',
  Medium: '#00d5ff',
  High: '#ffaa00',
  Critical: '#ff3f6b',
}

function buildTrend(incidents) {
  const buckets = new Map()
  incidents.forEach((incident) => {
    const ts = new Date(incident.created_at)
    const bucket = `${ts.getFullYear()}-${ts.getMonth() + 1}-${ts.getDate()} ${ts.getHours()}:00`
    buckets.set(bucket, (buckets.get(bucket) || 0) + 1)
  })

  return [...buckets.entries()]
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .slice(-8)
    .map(([, count]) => count)
}

export default function RiskScoreChart({ incidents }) {
  const { distribution, maxCount, trend } = useMemo(() => {
    const distribution = levels.map((level) => ({
      level,
      count: incidents.filter((incident) => incident.risk_level === level).length,
    }))
    const maxCount = Math.max(1, ...distribution.map((entry) => entry.count))
    const trend = buildTrend(incidents)
    return { distribution, maxCount, trend }
  }, [incidents])

  return (
    <div className='card'>
      <h3>Risk Charts</h3>
      <div className='risk-chart-list'>
        {distribution.map((entry) => {
          const widthPct = Math.round((entry.count / maxCount) * 100)
          return (
            <div key={entry.level} className='risk-row'>
              <span className='risk-label'>{entry.level}</span>
              <div className='risk-track'>
                <div
                  className='risk-fill'
                  style={{ width: `${widthPct}%`, background: colors[entry.level] }}
                />
              </div>
              <span className='risk-count'>{entry.count}</span>
            </div>
          )
        })}
      </div>

      <h4 className='sub-title'>Incident Trend (latest 8 buckets)</h4>
      <div className='trend-chart'>
        {trend.length === 0 && <span className='subtle'>No incident trend data yet.</span>}
        {trend.map((count, idx) => {
          const peak = Math.max(1, ...trend)
          const height = Math.max(8, Math.round((count / peak) * 64))
          return <div key={idx} className='trend-bar' style={{ height }} title={`Count: ${count}`} />
        })}
      </div>
    </div>
  )
}
