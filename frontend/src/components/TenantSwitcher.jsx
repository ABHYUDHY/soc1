import React from 'react'

export default function TenantSwitcher({ value, onChange, auth }) {
  return (
    <div className='card compact-card'>
      <h3>Tenant Context</h3>
      <div className='form-grid'>
        <label>
          Active tenant
          <select value={value} onChange={(event) => onChange(event.target.value)}>
            <option value='tenant-a'>tenant-a</option>
            <option value='tenant-b'>tenant-b</option>
          </select>
        </label>
      </div>
      <small className='subtle'>Authenticated role: {auth?.token_type ? 'Manager session' : 'Offline'}</small>
    </div>
  )
}
