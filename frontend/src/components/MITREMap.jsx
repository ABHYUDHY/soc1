import React from 'react'
export default ({ incidents }) => <div className='card'><h3>MITRE Map</h3>{incidents.slice(0,6).map(i=><div key={i.id}>{i.mitre.tactic} | {i.mitre.technique_id} | {i.mitre.description}</div>)}</div>
