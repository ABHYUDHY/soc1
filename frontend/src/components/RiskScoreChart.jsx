import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
export default ({ incidents }) => { const data=['Low','Medium','High','Critical'].map(name=>({name,value:incidents.filter(i=>i.risk_level===name).length})); const colors=['#00ff9d','#00d5ff','#ffaa00','#ff3f6b']; return <div className='card' style={{height:260}}><h3>Severity Pie</h3><ResponsiveContainer><PieChart><Pie data={data} dataKey='value' outerRadius={80}>{data.map((_,i)=><Cell key={i} fill={colors[i]} />)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div> }
