import React from 'react'

export default function IncidentFeed({ incidents, selectedId, onSelect }) {
  return (
    <div className='card'>
      <div className='panel-title-row'>
        <h3>Incident Feed</h3>
        <small className='subtle'>{incidents.length} records</small>
      </div>
      <div className='stack-list'>
        {incidents.length === 0 && <div className='subtle'>No incidents yet. Use Data Ingestion to submit a real log.</div>}
        {incidents.map((incident) => (
          <button
            key={incident.id}
            className={`list-item ${selectedId === incident.id ? 'active' : ''}`}
            onClick={() => onSelect(incident)}
          >
            <span className={`badge badge-${incident.severity}`}>{incident.severity}</span>
            <strong>{incident.classification}</strong>
            <span className='subtle'>{incident.risk_level} • {incident.source}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
