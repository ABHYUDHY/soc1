import React, { useState } from 'react'
import API from './api'
export default ({ incident }) => { const [out,setOut]=useState(''); const run=async(action)=>{if(!incident)return; const {data}=await API.post('/mitigation/execute',{incident_id:incident.id,action,command:'echo isolate_host'}); setOut(data.output)}; return <div className='card'><h3>Mitigation Queue</h3><button onClick={()=>run('approve')}>Approve & Execute</button> <button onClick={()=>run('modify')}>Modify</button> <button onClick={()=>setOut('Rejected by analyst')}>Reject</button><div>{out}</div></div> }
