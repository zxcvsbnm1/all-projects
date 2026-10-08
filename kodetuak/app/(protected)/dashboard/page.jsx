"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function Dashboard(){
  const [active, setActive] = useState('sdp')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    (async()=>{
      setLoading(true)
      const { data } = await supabase.from(active).select('*').limit(100).order('id', {ascending:false})
      setData(data||[])
      setLoading(false)
    })()
  }, [active])

  return (
    <div style={{padding:'12px'}}>
      <div style={{display:'flex', gap:'10px', marginBottom:'15px'}}>
        {['sdp','hkp','sgp'].map(t=>(
          <button key={t} onClick={()=>setActive(t)} style={{padding:'12px 22px', borderRadius:'10px', border:'none', fontWeight:'800', background: active===t?'#FFD700':'#222', color: active===t?'black':'white'}}>{t.toUpperCase()}</button>
        ))}
      </div>

      <div style={{background:'white', borderRadius:'14px', overflow:'hidden'}}>
        <div style={{padding:'12px 16px', fontWeight:'800', background:'white', color:'black', display:'flex', justifyContent:'space-between', borderBottom:'1px solid #eee'}}>
          <span>TABEL {active.toUpperCase()}</span>
          <span style={{color:'#666'}}>{data.length} data</span>
        </div>

        {loading? <div style={{padding:'20px', color:'black'}}>Loading...</div> :
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f5f5f5'}}>
                {data[0] && Object.keys(data[0]).map(k=>(
                  <th key={k} style={{padding:'12px', textAlign:'left', color:'black', borderBottom:'1px solid #ddd', fontSize:'13px'}}>{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row,i)=>(
                <tr key={i} style={{borderBottom:'1px solid #eee'}}>
                  {Object.values(row).map((v,idx)=>(
                    <td key={idx} style={{padding:'12px', color:'black', fontSize:'13px'}}>{String(v??'')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        }
      </div>
    </div>
  )
}
