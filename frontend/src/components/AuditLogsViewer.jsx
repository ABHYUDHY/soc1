import React from 'react'
export default ({ live }) => <div className='card'><h3>Audit Stream</h3>{live.map((e,i)=><div key={i}>{e.message || e.type}</div>)}</div>
