import React, { useEffect, useMemo, useState } from 'react'
import API, { login } from './api'
import TopMetricsBar from './TopMetricsBar'
import IncidentFeed from './IncidentFeed'
import IncidentPanel from './IncidentPanel'
import IncidentDrilldownDrawer from './IncidentDrilldownDrawer'
import ExplainabilityPanel from './ExplainabilityPanel'
import MitigationPanel from './MitigationPanel'
import RiskScoreChart from './RiskScoreChart'
import MITREMap from './MITREMap'
import ThreatIntelPanel from './ThreatIntelPanel'
import TimelineViewer from './TimelineViewer'
import AuditLogsViewer from './AuditLogsViewer'
import PlaybookViewer from './PlaybookViewer'
import AgentDecisionPanel from './AgentDecisionPanel'
import CaseManagementPanel from './CaseManagementPanel'
import SLAStatusPanel from './SLAStatusPanel'
import TenantSwitcher from './TenantSwitcher'
import DataIngestionPanel from './DataIngestionPanel'
import PipelineFlowVisualizer from './PipelineFlowVisualizer'
import LiveExecutionTracker from './LiveExecutionTracker'

const POLL_MS = 4000

export default function AnalystDashboard() {
  const [incidents, setIncidents] = useState([])
  const [cases, setCases] = useState([])
  const [sla, setSla] = useState([])
  const [selected, setSelected] = useState(null)
  const [live, setLive] = useState([])
  const [auth, setAuth] = useState(null)
  const [tenant, setTenant] = useState('tenant-a')
  const [status, setStatus] = useState({ loading: true, error: '' })

  const selectedIncident = selected || incidents[0] || null

  const load = async () => {
    const [incidentResp, caseResp, slaResp] = await Promise.all([API.get('/incidents'), API.get('/cases'), API.get('/sla')])
    setIncidents(incidentResp.data)
    setCases(caseResp.data)
    setSla(slaResp.data)
  }

  useEffect(() => {
    let ws
    let timer
    const bootstrap = async () => {
      try {
        const session = await login()
        setAuth(session)
        setStatus({ loading: false, error: '' })
        await load()

        ws = new WebSocket((import.meta.env.VITE_WS_URL || 'ws://localhost:8000') + '/ws/live')
        ws.onmessage = (event) => {
          const packet = JSON.parse(event.data)
          setLive((prev) => [...prev.slice(-39), packet])
        }
        ws.onerror = () => setStatus((prev) => ({ ...prev, error: 'Live stream disconnected. Polling still active.' }))
        timer = setInterval(load, POLL_MS)
      } catch (error) {
        setStatus({ loading: false, error: error?.response?.data?.detail || 'Unable to connect to backend API.' })
      }
    }

    bootstrap()
    return () => {
      if (timer) clearInterval(timer)
      if (ws) ws.close()
    }
  }, [])

  const metrics = useMemo(() => {
    const critical = incidents.filter((incident) => incident.risk_level === 'Critical').length
    const high = incidents.filter((incident) => incident.risk_level === 'High').length
    return {
      incidents: incidents.length,
      critical,
      high,
      openCases: cases.length,
      uptime: auth ? 'Connected' : 'Offline',
    }
  }, [incidents, cases, auth])

  return (
    <div className='dashboard'>
      <TopMetricsBar metrics={metrics} auth={auth} />

      {status.error && <div className='alert-banner'>{status.error}</div>}
      {status.loading && <div className='alert-banner'>Connecting to SOC services…</div>}

      <div className='layout-grid'>
        <section className='column-span-12 row-toolbar'>
          <TenantSwitcher value={tenant} onChange={setTenant} auth={auth} />
          <DataIngestionPanel onIngest={load} tenant={tenant} />
        </section>

        <section className='column-span-8'>
          <IncidentFeed incidents={incidents} selectedId={selectedIncident?.id} onSelect={setSelected} />
        </section>
        <section className='column-span-4'>
          <PipelineFlowVisualizer live={live} />
        </section>

        <section className='column-span-4'>
          <RiskScoreChart incidents={incidents} />
        </section>
        <section className='column-span-4'>
          <LiveExecutionTracker live={live} />
        </section>
        <section className='column-span-4'>
          <SLAStatusPanel sla={sla} />
        </section>

        <section className='column-span-6'>
          <IncidentPanel incident={selectedIncident} />
        </section>
        <section className='column-span-6'>
          <IncidentDrilldownDrawer incident={selectedIncident} />
        </section>

        <section className='column-span-6'>
          <ExplainabilityPanel incident={selectedIncident} />
        </section>
        <section className='column-span-6'>
          <ThreatIntelPanel incident={selectedIncident} />
        </section>

        <section className='column-span-4'>
          <MITREMap incidents={incidents} />
        </section>
        <section className='column-span-4'>
          <PlaybookViewer incident={selectedIncident} />
        </section>
        <section className='column-span-4'>
          <MitigationPanel incident={selectedIncident} onDone={load} />
        </section>

        <section className='column-span-4'>
          <TimelineViewer incidents={incidents} />
        </section>
        <section className='column-span-4'>
          <CaseManagementPanel cases={cases} refresh={load} />
        </section>
        <section className='column-span-4'>
          <AgentDecisionPanel live={live} />
        </section>

        <section className='column-span-12'>
          <AuditLogsViewer live={live} />
        </section>
      </div>
    </div>
  )
}
