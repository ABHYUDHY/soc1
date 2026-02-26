import React from 'react'

export default function ThreatIntelPanel({ incident }) {
  const intel = incident?.threat_intel || {}
  return (
    <div className='card'>
      <h3>Threat Intel</h3>
      <div className='kv-grid'>
        <div><span className='subtle'>Reputation</span><strong>{intel.reputation ?? 'N/A'}</strong></div>
        <div><span className='subtle'>Malicious Votes</span><strong>{intel.malicious_votes ?? 'N/A'}</strong></div>
        <div><span className='subtle'>Abuse Confidence</span><strong>{intel.abuse_confidence ?? 'N/A'}</strong></div>
      </div>
      <pre className='json-block'>{JSON.stringify(intel, null, 2)}</pre>
    </div>
  )
}
