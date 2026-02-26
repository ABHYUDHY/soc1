import React from 'react'

export default function IncidentDrilldownDrawer({ incident }) {
  return (
    <div className='card'>
      <h3>Raw Event Drilldown</h3>
      <pre className='json-block'>{incident?.raw_log || 'No incident selected.'}</pre>
    </div>
  )
}
