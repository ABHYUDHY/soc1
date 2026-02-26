import React, { useState } from 'react'
import API from './api'

export default function CaseManagementPanel({ cases, refresh }) {
  const [note, setNote] = useState('Reviewed by SOC analyst')

  const updateCase = async (id, status) => {
    await API.patch(`/cases/${id}`, { status, note })
    refresh()
  }

  return (
    <div className='card'>
      <h3>Case Management</h3>
      <label>
        Update note
        <input value={note} onChange={(event) => setNote(event.target.value)} />
      </label>
      <div className='stack-list'>
        {cases.map((record) => (
          <div className='list-item static' key={record.id}>
            <div>
              <strong>{record.id.slice(0, 8)}</strong>
              <div className='subtle'>{record.assigned_analyst}</div>
            </div>
            <span className='badge badge-medium'>{record.status}</span>
            <div className='inline-actions'>
              <button onClick={() => updateCase(record.id, 'Investigating')}>Investigating</button>
              <button onClick={() => updateCase(record.id, 'Resolved')}>Resolved</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
