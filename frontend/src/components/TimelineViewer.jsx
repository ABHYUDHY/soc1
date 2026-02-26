import React from 'react'

export default function TimelineViewer({ incidents }) {
  return (
    <div className='card'>
      <h3>Incident Timeline</h3>
      <div className='stack-list'>
        {incidents.slice(0, 8).map((incident) => (
          <div className='list-item static' key={incident.id}>
            <strong>{new Date(incident.created_at).toLocaleTimeString()}</strong>
            <span>{incident.classification}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
