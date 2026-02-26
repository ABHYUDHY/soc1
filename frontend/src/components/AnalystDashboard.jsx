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

export default function AnalystDashboard() {
  const [incidents, setIncidents] = useState([])
  const [cases, setCases] = useState([])
  const [sla, setSla] = useState([])
  const [selected, setSelected] = useState(null)
  const [live, setLive] = useState([])

  const load = async () => {
    const [i, c, s] = await Promise.all([API.get('/incidents'), API.get('/cases'), API.get('/sla')])
    setIncidents(i.data); setCases(c.data); setSla(s.data)
  }

  useEffect(() => {
    login().then(load)
    const ws = new WebSocket((import.meta.env.VITE_WS_URL || 'ws://localhost:8000') + '/ws/live')
    ws.onmessage = (e) => setLive((prev) => [...prev.slice(-20), JSON.parse(e.data)])
    const timer = setInterval(load, 5000)
    return () => { clearInterval(timer); ws.close() }
  }, [])

  const metrics = useMemo(() => ({ incidents: incidents.length, critical: incidents.filter(i => i.risk_level === 'Critical').length, openCases: cases.length }), [incidents, cases])

  return <div className='dashboard'>
    <TopMetricsBar metrics={metrics} />
    <div className='grid'>
      <TenantSwitcher />
      <DataIngestionPanel onIngest={load} />
      <PipelineFlowVisualizer />
      <LiveExecutionTracker live={live} />
      <IncidentFeed incidents={incidents} onSelect={setSelected} />
      <IncidentPanel incident={selected || incidents[0]} />
      <IncidentDrilldownDrawer incident={selected || incidents[0]} />
      <ExplainabilityPanel incident={selected || incidents[0]} />
      <MitigationPanel incident={selected || incidents[0]} />
      <RiskScoreChart incidents={incidents} />
      <MITREMap incidents={incidents} />
      <ThreatIntelPanel incident={selected || incidents[0]} />
      <TimelineViewer incidents={incidents} />
      <AuditLogsViewer live={live} />
      <PlaybookViewer incident={selected || incidents[0]} />
      <AgentDecisionPanel live={live} />
      <CaseManagementPanel cases={cases} refresh={load} />
      <SLAStatusPanel sla={sla} />
    </div>
  </div>
}
