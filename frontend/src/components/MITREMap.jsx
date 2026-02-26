import React from 'react'

export default function MITREMap({ incidents }) {
  return (
    <div className='card'>
      <h3>MITRE ATT&CK</h3>
      <div className='stack-list'>
        {incidents.slice(0, 6).map((incident) => (
          <div key={incident.id} className='list-item static'>
            <strong>{incident.mitre.tactic}</strong>
            <span>{incident.mitre.technique_id}</span>
            <small className='subtle'>{incident.mitre.description}</small>
          </div>
        ))}
        {incidents.length === 0 && <small className='subtle'>No mapped incidents yet.</small>}
      </div>
    </div>
  )
}
