import React from 'react'
export default ({ live }) => <div className='card'><h3>Live Execution Tracker</h3><progress max='100' value={Math.min(100, live.length * 10)}></progress></div>
