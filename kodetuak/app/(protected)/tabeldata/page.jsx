"use client"
import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
const TABLES = ["hkp6d","hkp","6dhkp","sdp6d","sdp","6dsdp","sgp","ceksdp","cekhkp","ceksgp","ceksgpsnkm","ceksgprbsbmg","ankaramingguan","newyorkmingguan","parismingguan"]

export default function TabelData(){
  const [table, setTable] = useState(TABLES[0])
  const [rows, setRows] = useState([])
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(false)

  async function load(e){
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.from(table).select("*").order("id",{ascending:true}).limit(100)
    setLoading(false)
    if(error){ alert(error.message); return }
    if(!data || data.length===0){ setRows([]); return }
    setFields(Object.keys(data[0]))
    setRows(data)
  }

  return (
    <div style={{padding:10, fontFamily:'Arial', background:'#f5f5f5', minHeight:'100vh'}}>
      <form onSubmit={load} style={{marginBottom:10, background:'white', padding:10, borderRadius:8}}>
        <select value={table} onChange={e=>setTable(e.target.value)} style={{padding:8, minWidth:120}}>
          {TABLES.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <button style={{marginLeft:8, padding:'8px 16px', background:'black', color:'white', borderRadius:6}}>Tampilkan Data</button>
      </form>

      {loading && <p>Loading...</p>}

      {rows.length>0 && (
        <div style={{background:'white', borderRadius:8, overflow:'auto'}}>
          <div style={{padding:8, fontWeight:'bold'}}>{table} - {rows.length} baris</div>
          <table style={{borderCollapse:'collapse', width:'100%', fontSize:13}}>
            <thead>
              <tr style={{background:'#222', color:'white'}}>
                {fields.map(f=><th key={f} style={{padding:8, border:'1px solid #ddd', whiteSpace:'nowrap'}}>{f}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={i} style={{background:i%2===0?'#fff':'#f9f9f9'}}>
                  {fields.map(col=>{
                    let v = r[col]
                    const isHari = ['senin','selasa','rabu','kamis','jumat','sabtu','minggu'].includes(col.toLowerCase())
                    if(isHari && v!=null &&!isNaN(v)) v = String(v).padStart(4,'0')
                    return <td key={col} style={{padding:6, border:'1px solid #ddd', textAlign:'center', whiteSpace:'nowrap'}}>{v?? '-'}</td>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
