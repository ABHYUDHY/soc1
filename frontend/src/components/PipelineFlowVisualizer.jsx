import React from 'react'

const stages = ['Log', 'Detection', 'AI', 'Risk', 'Mitigation', 'Execution', 'Logging']

export default function PipelineFlowVisualizer({ live }) {
  const activeIndex = live.length % stages.length

  return (
    <div className='card'>
      <h3>Pipeline Flow</h3>
      <div className='pipeline'>
        {stages.map((stage, index) => (
          <div key={stage} className={`pipeline-stage ${index === activeIndex ? 'active' : ''}`}>
            {stage}
          </div>
        ))}
      </div>
    </div>
  )
}
