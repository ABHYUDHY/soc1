import React from 'react'

export default function AuditLogsViewer({ live }) {
  return (
    <div className='card'>
      <h3>Audit Stream</h3>
      <div className='stack-list'>
        {live.slice(-10).reverse().map((event, index) => (
          <div className='list-item static' key={`${event.type || 'audit'}-${index}`}>
            <span className='subtle'>{event.type || 'audit'}</span>
            <code>{event.message || JSON.stringify(event)}</code>
          </div>
        ))}
      </div>
    </div>
  )
}
