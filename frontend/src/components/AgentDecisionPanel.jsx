import React from 'react'
export default ({ live }) => <div className='card'><h3>Planner / Executor / Auditor</h3>{live.map((l,i)=><div key={i}>{JSON.stringify(l)}</div>)}</div>
