import React from 'react'
export default ({ incident }) => <div className='card'><h3>Incident Panel</h3>{incident ? <pre>{JSON.stringify(incident.parsed, null, 2)}</pre> : 'No incident selected'}</div>
