import React from 'react'
export default ({ sla }) => <div className='card'><h3>SLA Panel</h3>{sla.map(s=><div key={s.incident_id}><span className={s.breached?'badge badge-critical':'badge badge-low'}>{s.breached?'BREACH':'OK'}</span> {Math.round(s.remaining_seconds/60)} min</div>)}</div>
