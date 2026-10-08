"use client"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const TABLES_VIEW = ['vsnsdp','vslsdp','vrbsdp','vkmsdp','vjmsdp','vsbsdp','vmgsdp','vsnhkp','vslhkp','vrbhkp','vkmhkp','vjmhkp','vsbhkp','vmghkp','vsdpol','vhkpol','vsgpol','vsgpsn_km','vsgprbsbmg','vsnsgp','vrbsgp','vkmsgp','vsbsgp','vjmankaramingguan','vjmnewyorkmingguan','vjmparismingguan','vankaramingguan','vnewyork4d','vparis']

function cek_acak(c,d){ if(!c||!d) return false; let a=c.split(''),b=d.split(''); for(let x of a){ let i=b.indexOf(x); if(i===-1) return false; b.splice(i,1)} return true }

export default function Page(){
  const [active,setActive]=useState(0)
  const [data,setData]=useState([])
  const [isAdmin,setIsAdmin]=useState(false)
  const table_view=TABLES_VIEW[active]

  useEffect(()=>{
    (async()=>{
      const { data } = await supabase.rpc('is_admin')
      setIsAdmin(data===true)
    })()
  },[])

  const loadData = async ()=>{
    const { data: d, error } = await supabase.from(table_view).select("*").order("id",{ascending:true})
    if(error){ alert(error.message); return }
    setData(d||[])
  }

  useEffect(()=>{ loadData() },[active])

  // HAPUS VIEW LEWAT RPC (karena view tidak bisa di-delete langsung)
  const hapus = async (id)=>{
    if(!confirm(`Hapus ID DASAR ${id} dari ${table_view}?`)) return
    const { error } = await supabase.rpc('hapus_view', { p_view: table_view, p_id: id })
    if(error){
      alert("Gagal: "+error.message+"\n\nBelum mapping view ini. Cek SQL hapus_view")
    } else {
      setData(p=>p.filter(r=>r.id!==id))
    }
  }

  return (
    <div style={{fontFamily:'Arial',padding:10,background:'#111',color:'#eee',minHeight:'100vh'}}>
      <h2 style={{textAlign:'center'}}>KODETUAK {isAdmin && <span style={{background:'red',padding:'2px 8px',fontSize:'12px',borderRadius:'10px',marginLeft:'6px'}}>ADMIN</span>}</h2>
      <div style={{textAlign:'center'}}>
        <select value={active} onChange={e=>setActive(Number(e.target.value))} style={{padding:5,background:'#333',color:'#eee'}}>
          {TABLES_VIEW.map((n,i)=><option key={i} value={i}>{n.toUpperCase()}</option>)}
        </select>
      </div>
      <h3 style={{textAlign:'center'}}>TAB {table_view.toUpperCase()} - Total: {data.length}</h3>
      <table style={{borderCollapse:'collapse',width:'100%',fontSize:13}}>
        <thead><tr>
          <th style={{border:'1px solid #444',padding:6,background:'#222'}}>id</th>
          <th style={{border:'1px solid #444',padding:6,background:'#222'}}>hasil</th>
          <th style={{border:'1px solid #444',padding:6,background:'#222'}}>nilai1</th>
          <th style={{border:'1px solid #444',padding:6,background:'#222'}}>3d dpn</th>
          <th style={{border:'1px solid #444',padding:6,background:'#222'}}>3d blk</th>
          <th style={{border:'1px solid #444',padding:6,background:'#222'}}>3d</th>
          <th style={{border:'1px solid #444',padding:6,background:'#222'}}>4d</th>
          {isAdmin && <th style={{border:'1px solid #444',padding:6,background:'#222'}}>HAPUS</th>}
        </tr></thead>
        <tbody>
          {data.map((r,i)=>{
            const hasil=r.hasil??'0000',nilai1=r.nilai1??'000',d3d=r['3d_dpn']??r.d3_dpn??'000',d3b=r['3d_blkg']??r.d3_blkg??'000',d4=r['4d']??'0000'
            const s3d=(nilai1.includes(d3d)||nilai1.includes(d3b))?'COK':'-'
            const s4d=cek_acak(d4,nilai1)?'COK':'-'
            return(
              <tr key={r.id}>
                <td style={{border:'1px solid #444',padding:6,textAlign:'center'}}>{r.id}</td>
                <td style={{border:'1px solid #444',padding:6,textAlign:'center'}}><b>{hasil}</b></td>
                <td style={{border:'1px solid #444',padding:6,textAlign:'center'}}>{nilai1}</td>
                <td style={{border:'1px solid #444',padding:6,textAlign:'center'}}>{d3d}</td>
                <td style={{border:'1px solid #444',padding:6,textAlign:'center'}}>{d3b}</td>
                <td style={{border:'1px solid #444',padding:6,textAlign:'center',background:s3d==='COK'?'#4CAF50':'#f44336',fontWeight:'bold'}}>{s3d}</td>
                <td style={{border:'1px solid #444',padding:6,textAlign:'center',background:s4d==='COK'?'#4CAF50':'#f44336',fontWeight:'bold'}}>{s4d}</td>
                {isAdmin && <td style={{border:'1px solid #444',padding:6,textAlign:'center'}}>{i===0? <button onClick={()=>hapus(r.id)} style={{background:'red',color:'#fff',border:'none',padding:'5px 10px',borderRadius:'4px',fontWeight:'bold',cursor:'pointer'}}>HAPUS</button> : null}</td>}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
