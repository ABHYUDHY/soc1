import React from 'react'
export default ({ incidents, onSelect }) => <div className='card'><h3>Incident Feed</h3>{incidents.map(i => <div key={i.id} onClick={() => onSelect(i)}><span className={`badge badge-${i.severity}`}>{i.severity}</span> {i.classification} - {i.risk_level}</div>)}</div>
