import React from 'react'
export default ({ incident }) => <div className='card'><h3>Playbook</h3><div>{incident?.mitigation?.title}</div><ol>{(incident?.mitigation?.steps||[]).map((s,i)=><li key={i}>{s}</li>)}</ol></div>
