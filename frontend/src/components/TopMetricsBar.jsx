import React from 'react'
export default ({ metrics }) => <div className='card'><h3>Top Metrics</h3><div className='grid'><div><div className='metric'>{metrics.incidents}</div>Total Incidents</div><div><div className='metric'>{metrics.critical}</div>Critical Alerts</div><div><div className='metric'>{metrics.openCases}</div>Open Cases</div></div></div>
