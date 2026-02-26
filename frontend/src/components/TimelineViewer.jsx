import React from 'react'
export default ({ incidents }) => <div className='card'><h3>Incident Timeline</h3>{incidents.map(i=><div key={i.id}>{new Date(i.created_at).toLocaleTimeString()} - {i.classification}</div>)}</div>
