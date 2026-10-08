"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

const daftar_view = ['seninhkp','selasahkp','rabuhkp','kamishkp','jumathkp','sabtuhkp','mingguhkp','polhk','seninsdp','selasasdp','rabusdp','kamissdp','jumatsdp','sabtusdp','minggusdp','polsd','seninsgp','rabusgp','kamissgp','sabtusgp','minggusgp','seninkamissgp','rabusabtuminggusgp','polsg']

function sliding(str, len){
  str = String(str)
  if(str.length < len) return [str]
  const out=[]
  for(let i=0; i<=str.length-len; i++) out.push(str.substr(i,len))
  return out
}

export default function KumPage(){
  const [view, setView] = useState(daftar_view[0])
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [idInput, setIdInput] = useState('')
  const [hasilInput, setHasilInput] = useState('')

  useEffect(()=>{
    const cekAdmin = async ()=>{
      const { data: { user } } = await supabase.auth.getUser()
      if(!user) return
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if(data?.role === 'admin') setIsAdmin(true)
    }
    cekAdmin()
  },[])

  const load = async (v) => {
    setLoading(true)
    const { data } = await supabase.from(v).select('id, hasil').order('id', {ascending:true})
    let kum=0
    let temp = (data||[]).map(r=>{
      const h = String(r.hasil).padStart(4,'0')
      const ka = kum
      kum += parseInt(r.hasil) || 0
      return { id:r.id, hasil:h, kum_awal:ka, kum_akhir:kum }
    })
    for(let i=0;i<temp.length;i++){
      const h4=temp[i].hasil
      const h3=h4.slice(-3)
      let cocok='-'
      for(let j=i;j>=0;j--){
        const k=String(temp[j].kum_awal)
        if(k.includes(h4)){ cocok='4D'; break; }
        if(k.includes(h3)){ cocok='3D'; }
      }
      temp[i].cocok=cocok
    }
    setRows(temp.reverse())
    setLoading(false)
  }

  const tambahRow = async () => {
    if(!idInput ||!hasilInput) return alert('Isi ID dan Hasil')
    const { error } = await supabase.from(view).insert([{ id: parseInt(idInput), hasil: hasilInput }])
    if(error) alert(error.message)
    else { setIdInput(''); setHasilInput(''); load(view) }
  }
  const updateRow = async () => {
    if(!idInput ||!hasilInput) return alert('Isi ID dan Hasil untuk update')
    const { error } = await supabase.from(view).update({ hasil: hasilInput }).eq('id', parseInt(idInput))
    if(error) alert(error.message)
    else { setIdInput(''); setHasilInput(''); load(view) }
  }
  const hapusRow = async (id) => {
    if(!confirm(`Hapus ID DASAR ${id} dari ${view}?`)) return
    const { error } = await supabase.from(view).delete().eq('id', id)
    if(error) alert(error.message)
    else load(view)
  }

  useEffect(()=>{ load(view) },[view])

  const box_kum = rows.map(r=>r.kum_akhir).join('*')
  let all4d=[], all3d=[]
  rows.forEach(r=>{
    const k=String(r.kum_akhir)
    all4d = [...all4d,...sliding(k,4)]
    all3d = [...all3d,...sliding(k,3)]
  })

  return (
    <div className="w-full max-w-[100vw] min-h-[100dvh] overflow-x-hidden box-border p-2 bg-[#0a7a00]">
      {/* PILIH TABEL + FORM - INI YANG TADI KEPOTONG, SUDAH FIX */}
      <div className="w-full max-w-full bg-white text-black p-2.5 rounded-xl mb-2.5 box-border overflow-hidden">
        <div className="w-full flex flex-wrap gap-2 items-end box-border">
          <div className="flex-1 min-w-[140px]">
            <div className="text-[11px] font-bold">Pilih Tabel:</div>
            <select value={view} onChange={e=>setView(e.target.value)} className="w-full p-2.5 bg-white text-black border-2 border-black rounded-lg font-bold text-sm">
              {daftar_view.map(v=><option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          {isAdmin && (
            <div className="w-full bg-[#ffffcc] p-2 rounded-lg flex flex-wrap gap-2 items-end border-2 border-black box-border mt-1">
              <div className="flex-1 min-w-[65px] max-w-[85px]">
                <div className="text-[11px] font-bold">ID</div>
                <input value={idInput} onChange={e=>setIdInput(e.target.value)} type="number" placeholder="530" className="w-full p-2.5 bg-white text-black border-2 border-black rounded-md font-bold text-sm text-center" />
              </div>
              <div className="flex-1 min-w-[75px] max-w-[100px]">
                <div className="text-[11px] font-bold">HASIL</div>
                <input value={hasilInput} onChange={e=>setHasilInput(e.target.value)} placeholder="1234" maxLength={4} className="w-full p-2.5 bg-white text-black border-2 border-black rounded-md font-bold text-sm text-center" />
              </div>
              <button onClick={tambahRow} className="flex-1 min-w-[75px] bg-[#ffeb00] text-black p-2.5 rounded-md font-black border-2 border-black text-[13px] leading-tight">+ Tambah</button>
              <button onClick={updateRow} className="flex-1 min-w-[65px] bg-[#008000] text-white p-2.5 rounded-md font-black border-2 border-black text-[13px]">Update</button>
            </div>
          )}
        </div>
      </div>

      {loading? <div className="text-white p-2">Loading...</div> :
        <div className="w-full max-w-full overflow-x-auto bg-white rounded-lg">
          <table className="w-full border-collapse bg-white text-black min-w-[400px]">
            <thead><tr><th style={th}>ID</th><th style={th}>Hasil</th><th style={th}>Kum Awal</th><th style={th}>Kum Akhir</th><th style={th}>Cocok</th>{isAdmin && <th style={th}>Aksi</th>}</tr></thead>
            <tbody>
              {rows.map((r, idx)=>{
                const cls = r.cocok==='4D'? {background:'#ff0000', color:'#fff'} : r.cocok==='3D'? {background:'#00cc00', color:'#fff'} : {}
                const isDasar = idx === rows.length - 1
                return (
                  <tr key={r.id} style={cls}>
                    <td style={td}><button onClick={()=>{setIdInput(String(r.id)); setHasilInput(r.hasil)}} style={{background:'none', border:'none', color:'blue', textDecoration:'underline', cursor:'pointer', fontWeight:'bold'}}>{r.id}</button></td>
                    <td style={td}>{r.hasil}</td><td style={td}>{r.kum_awal}</td><td style={td}>{r.kum_akhir}</td><td style={td}>{r.cocok}</td>
                    {isAdmin && <td style={td}>{isDasar? <button onClick={()=>hapusRow(r.id)} className="bg-black text-white border border-red-500 px-2 py-1 rounded text-xs font-bold">Hapus</button> : '-'}</td>}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      }

      <div className="mt-3 text-white text-sm">BOX Kum Akhir <span style={badge}>{rows.length} data</span>:</div>
      <textarea className="w-full bg-[#111] text-[#0f0] p-2.5 rounded-md font-mono min-h-[80px] box-border text-xs" readOnly value={box_kum}></textarea>

      <div className="mt-3 text-white text-sm">BOX 4D Kum Akhir <span style={badge}>{all4d.length} data</span>:</div>
      <textarea className="w-full bg-[#111] text-[#0f0] p-2.5 rounded-md font-mono min-h-[80px] box-border text-xs" readOnly value={all4d.join('*')}></textarea>

      <div className="mt-3 text-white text-sm">BOX 3D Kum Akhir <span style={badge}>{all3d.length} data</span>:</div>
      <textarea className="w-full bg-[#111] text-[#0f0] p-2.5 rounded-md font-mono min-h-[80px] box-border text-xs" readOnly value={all3d.join('*')}></textarea>

      {/* Tombol Fullscreen */}
      <button onClick={()=>document.documentElement.requestFullscreen?.()} className="fixed bottom-2 right-2 bg-yellow-300 text-black px-3 py-2 rounded-full font-black border-2 border-black z-50">⛶</button>
    </div>
  )
}

const th={border:'1px solid #999', padding:'5px', textAlign:'center', fontSize:'12px', background:'#222', color:'#fff', whiteSpace:'nowrap'}
const td={border:'1px solid #999', padding:'5px', textAlign:'center', fontSize:'12px', whiteSpace:'nowrap'}
const badge={background:'#fff', color:'#000', padding:'2px 8px', borderRadius:'10px', fontSize:'12px', marginLeft:'6px'}
