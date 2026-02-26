import React from 'react'

export default function IncidentPanel({ incident }) {
  if (!incident) {
    return <div className='card'><h3>Incident Details</h3><p className='subtle'>Select an incident to inspect normalized fields.</p></div>
  }

  return (
    <div className='card'>
      <h3>Incident Details</h3>
      <div className='kv-grid'>
        <div><span className='subtle'>ID</span><strong>{incident.id}</strong></div>
        <div><span className='subtle'>Severity</span><span className={`badge badge-${incident.severity}`}>{incident.severity}</span></div>
        <div><span className='subtle'>Risk</span><strong>{incident.risk_level} ({incident.risk_score.toFixed(2)})</strong></div>
        <div><span className='subtle'>Created</span><strong>{new Date(incident.created_at).toLocaleString()}</strong></div>
      </div>
      <pre className='json-block'>{JSON.stringify(incident.parsed, null, 2)}</pre>
    </div>
  )
}
