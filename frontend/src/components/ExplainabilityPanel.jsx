import React from 'react'
export default ({ incident }) => <div className='card'><h3>AI Analysis</h3><div>Classification: {incident?.classification}</div><div>Confidence: {Math.round((incident?.confidence || 0) * 100)}%</div><div>{incident?.reasoning}</div><ul>{(incident?.rag_references || []).map((r,i)=><li key={i}>{r}</li>)}</ul></div>
