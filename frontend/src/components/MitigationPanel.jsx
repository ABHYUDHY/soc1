import React, { useState } from 'react'
import API from './api'

export default function MitigationPanel({ incident, onDone }) {
  const [command, setCommand] = useState('echo isolate_host')
  const [action, setAction] = useState('approve')
  const [out, setOut] = useState('')

  const run = async () => {
    if (!incident) {
      setOut('Select an incident first.')
      return
    }

    const { data } = await API.post('/mitigation/execute', {
      incident_id: incident.id,
      action,
      command,
    })
    setOut(data.output)
    onDone()
  }

  return (
    <div className='card'>
      <h3>Mitigation Queue</h3>
      <div className='form-grid'>
        <label>
          Analyst decision
          <select value={action} onChange={(event) => setAction(event.target.value)}>
            <option value='approve'>Approve</option>
            <option value='modify'>Modify</option>
          </select>
        </label>
        <label>
          Execution command
          <input value={command} onChange={(event) => setCommand(event.target.value)} />
        </label>
      </div>
      <div className='inline-actions'>
        <button onClick={run}>Execute</button>
      </div>
      {out && <pre className='json-block'>{out}</pre>}
    </div>
  )
}
