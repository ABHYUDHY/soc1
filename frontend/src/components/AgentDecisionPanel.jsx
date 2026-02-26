import React from 'react'

export default function AgentDecisionPanel({ live }) {
  const events = live.slice(-8).reverse()
  return (
    <div className='card'>
      <h3>Planner / Executor / Auditor</h3>
      <div className='stack-list'>
        {events.map((entry, index) => (
          <div className='list-item static' key={`${entry.type || 'event'}-${index}`}>
            <strong>{entry.type || 'event'}</strong>
            <small className='subtle'>{entry.message || JSON.stringify(entry)}</small>
          </div>
        ))}
        {events.length === 0 && <small className='subtle'>No agent events received yet.</small>}
      </div>
    </div>
  )
}
