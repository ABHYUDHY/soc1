import React from 'react'
import API from './api'
export default ({ cases, refresh }) => <div className='card'><h3>Case Management</h3>{cases.map(c=><div key={c.id}><b>{c.status}</b> - {c.assigned_analyst}<button onClick={async()=>{await API.patch(`/cases/${c.id}`,{status:'Investigating',note:'Reviewed'});refresh()}}>Set Investigating</button></div>)}</div>
