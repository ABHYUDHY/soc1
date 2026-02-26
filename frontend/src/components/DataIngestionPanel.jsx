import React, { useState } from 'react'
import API from './api'

const modeExamples = {
  manual_paste: 'event=failed_login|src_ip=10.1.2.3|username=alice|host=web-1',
  dataset: 'dataset: windows_auth_failures.csv',
  syslog: '<134>1 2024-01-10T13:00:00Z fw1 sudo - - Failed password for root from 10.5.2.1',
  firewall: 'ALLOW tcp src=10.20.1.5 dst=172.16.0.12 dpt=3389',
  windows: 'EventID=4625;AccountName=Administrator;IpAddress=192.168.1.20',
  api: '{"alert":"suspicious-process","process":"powershell.exe"}',
}

export default function DataIngestionPanel({ onIngest, tenant }) {
  const [payload, setPayload] = useState('')
  const [mode, setMode] = useState('manual_paste')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const submit = async () => {
    if (!payload.trim()) {
      setMessage('Enter log/IOC content before submission.')
      return
    }

    setSubmitting(true)
    setMessage('')
    try {
      await API.post('/ingest', { tenant_id: tenant, mode, payload })
      setMessage('Ingestion completed successfully.')
      setPayload('')
      onIngest()
    } catch (error) {
      setMessage(error?.response?.data?.detail || 'Ingestion failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='card'>
      <h3>Data Ingestion</h3>
      <div className='form-grid'>
        <label>
          Ingestion mode
          <select value={mode} onChange={(event) => setMode(event.target.value)}>
            {Object.keys(modeExamples).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
        <label>
          Log / payload
          <textarea
            rows='4'
            placeholder={modeExamples[mode]}
            value={payload}
            onChange={(event) => setPayload(event.target.value)}
          />
        </label>
      </div>
      <div className='inline-actions'>
        <button disabled={submitting} onClick={submit}>{submitting ? 'Submitting…' : 'Send to pipeline'}</button>
        {message && <small className='subtle'>{message}</small>}
      </div>
    </div>
  )
}
