"use client"
import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const TABEL_LIST = ['vslhkp','vmghkp','sdpsn_1v','sdpsnv','sdpsl_1v','sdpslv','sdprbv','sdprb_1v','sdpkmv','sdpjmv','sdpsbv','sdpmgv','sgpsnv','sgprbv','sgpkmv','sgpsbv','sgpmgv','hkpsnv','hkpslv','hkprbv','hkpkmv','hkpjmv','hkpsbv','hkpmgv','6dsdpv','6dhkpv','4dsgppv']

function cek_bbfs(cari, di_dalam){
  const count = a => a.reduce((m,c)=>{m[c]=(m[c]||0)+1; return m},{})
  const a = count(String(cari).split('')), b = count(String(di_dalam).split(''))
  for(let k in a) if((b[k]||0) < a[k]) return false
  return true
}

export default function Page(){
  const [tabel, setTabel] = useState(TABEL_LIST[0])
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  async function load(e){
    e.preventDefault()
    setLoading(true)
    const { data } = await supabase.from(tabel).select("id,hasil,nilai1").order("id",{ascending:true}).limit(100)
    const mapped = (data||[]).map(r=>{
      const h6 = String(r.hasil).padStart(6,'0')
      const n6 = String(r.nilai1).padStart(6,'0')
      const e4 = h6.slice(-4)
      const t1 = e4.slice(0,3), t2 = e4.slice(1,3)
      const arr=[]; if(n6.includes(t1)) arr.push(t1); if(n6.includes(t2)) arr.push(t2)
      return { id:r.id, hasil:h6, bbfs:n6, tigaD: arr.join('-')||'-', empatD: cek_bbfs(e4,n6)? 'Cocok':'-', n1:e4 }
    })
    setRows(mapped); setLoading(false)
  }

  return (
    <div style={{padding:10, fontFamily:'Arial', background:'#f5f5f5', minHeight:'100vh'}}>
      <form onSubmit={load} style={{background:'white', padding:12, borderRadius:10, display:'flex', gap:8, alignItems:'center'}}>
        <select value={tabel} onChange={e=>setTabel(e.target.value)} style={{padding:'10px 12px', flex:1, border:'1px solid #ddd', borderRadius:8}}>
          {TABEL_LIST.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <button style={{padding:'10px 16px', background:'black', color:'white', borderRadius:8, fontWeight:'bold'}}>Tampilkan Data</button>
      </form>

      {loading && <p>Loading...</p>}

      {rows.length>0 && (
        <div style={{marginTop:12, background:'white', borderRadius:8, overflow:'hidden'}}>
          <div style={{padding:'10px 12px', fontWeight:'bold'}}>{tabel} - {rows.length} baris</div>
          <div style={{overflowX:'auto'}}>
            <table style={{borderCollapse:'collapse', width:'100%', fontSize:14}}>
              <thead>
                <tr style={{background:'#222', color:'white'}}>
                  <th style={{padding:8, border:'1px solid #333'}}>id</th>
                  <th style={{padding:8, border:'1px solid #333'}}>result</th>
                  <th style={{padding:8, border:'1px solid #333'}}>bbfs</th>
                  <th style={{padding:8, border:'1px solid #333'}}>3d</th>
                  <th style={{padding:8, border:'1px solid #333'}}>4d</th>
                  <th style={{padding:8, border:'1px solid #333'}}>n1</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r=>(
                  <tr key={r.id} style={{background: r.id%2===0? '#fff':'#fafafa'}}>
                    <td style={{padding:8, border:'1px solid #ddd', textAlign:'center'}}>{r.id}</td>
                    <td style={{padding:8, border:'1px solid #ddd', textAlign:'center'}}>{r.hasil}</td>
                    <td style={{padding:8, border:'1px solid #ddd', textAlign:'center'}}>{r.bbfs}</td>
                    <td style={{padding:8, border:'1px solid #ddd', textAlign:'center'}}>{r.tigaD}</td>
                    <td style={{padding:8, border:'1px solid #ddd', textAlign:'center', fontWeight: r.empatD==='Cocok'?'bold':'normal', color: r.empatD==='Cocok'?'green':'black'}}>{r.empatD}</td>
                    <td style={{padding:8, border:'1px solid #ddd', textAlign:'center'}}>{r.n1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
