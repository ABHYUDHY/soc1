import React from 'react'

const Metric = ({ label, value }) => (
  <div className='metric-tile'>
    <div className='metric'>{value}</div>
    <div className='metric-label'>{label}</div>
  </div>
)

export default function TopMetricsBar({ metrics, auth }) {
  return (
    <div className='card metrics-card'>
      <div className='panel-title-row'>
        <h2>SOC Command Center</h2>
        <span className='badge badge-low'>{metrics.uptime}</span>
      </div>
      <div className='metrics-row'>
        <Metric label='Total Incidents' value={metrics.incidents} />
        <Metric label='Critical' value={metrics.critical} />
        <Metric label='High' value={metrics.high} />
        <Metric label='Open Cases' value={metrics.openCases} />
      </div>
      <small className='subtle'>Session: {auth?.token_type || 'N/A'} • Polling every 4 seconds</small>
    </div>
  )
}
