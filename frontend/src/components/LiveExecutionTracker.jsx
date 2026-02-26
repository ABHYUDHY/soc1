import React from 'react'

export default function LiveExecutionTracker({ live }) {
  const progress = Math.min(100, live.length * 5)
  return (
    <div className='card'>
      <h3>Live Execution Tracker</h3>
      <progress max='100' value={progress} />
      <div className='subtle'>{progress}% execution activity window</div>
    </div>
  )
}
