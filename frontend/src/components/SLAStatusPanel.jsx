import React from 'react'

export default function SLAStatusPanel({ sla }) {
  return (
    <div className='card'>
      <h3>SLA Status</h3>
      <div className='stack-list'>
        {sla.map((item) => (
          <div className='list-item static' key={item.incident_id}>
            <span className={item.breached ? 'badge badge-critical' : 'badge badge-low'}>{item.breached ? 'BREACH' : 'IN SLA'}</span>
            <span>{Math.round(item.remaining_seconds / 60)} min remaining</span>
          </div>
        ))}
      </div>
    </div>
  )
}
