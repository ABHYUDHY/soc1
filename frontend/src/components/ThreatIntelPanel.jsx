import React from 'react'
export default ({ incident }) => <div className='card'><h3>Threat Intel</h3><pre>{JSON.stringify(incident?.threat_intel, null, 2)}</pre></div>
