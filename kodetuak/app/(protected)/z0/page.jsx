"use client"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const ALL_TABLES = ['sgpsenin','sgprabu','sgpkamis','sgpsabtu','sgpminggu','sgpsenin_kamis','sgprabu_sb_mg','sdpsenin','sdpselasa','sdprabu','sdpkamis','sdpjumat','sdpsabtu','sdpminggu','hkpsenin','hkpselasa','hkprabu','hkpkamis','hkpjumat','hkpsabtu','hkpminggu','sdpool','hkpool','sgpool','hkloto','sdl','ankara','ciangmai','malibu4d','malibucity','paris','pataya','rome','santafe','sanghaipagi','sanghaimalam','seoul','xiamen']

export default function Zo() {
  const [table, setTable] = useState(ALL_TABLES[0])
  const [jml, setJml] = useState(0)
  const [rows, setRows] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(()=>{
    (async()=>{
      const { data } = await supabase.rpc('is_admin')
      setIsAdmin(data === true)
    })()
  },[])

  const load = async ()=>{
    const { count } = await supabase.from(table).select("*", { count: "exact", head: true })
    setJml(count||0)
    const { data } = await supabase.from(table).select("id,hasil").order("id",{ascending:true})
    if(!data){setRows([]);return}
    let tmp = data.map(r=>{
      let h=String(r.hasil).padStart(4,'0')
      return {id:r.id,hasil:r.hasil,hd:h.substr(0,2),ht:h.substr(1,2),hb:h.substr(2,2)}
    })
    if(tmp.length>0){
      tmp[0].d=tmp[0].hd; tmp[0].t=tmp[0].ht; tmp[0].b=tmp[0].hb
      for(let i=1;i<tmp.length;i++){
        tmp[i].d=String((parseInt(tmp[i-1].d)+1)%100).padStart(2,'0')
        tmp[i].t=String((parseInt(tmp[i-1].t)+1)%100).padStart(2,'0')
        tmp[i].b=String((parseInt(tmp[i-1].b)+1)%100).padStart(2,'0')
      }
    }
    tmp=tmp.map((c,idx)=>{
      let cd=false,ct=false,cb=false
      for(let k=idx-1;k<=idx+1;k++){
        if(!tmp[k]) continue
        if(tmp[k].d===c.hd||tmp[k].t===c.hd||tmp[k].b===c.hd) cd=true
        if(tmp[k].d===c.ht||tmp[k].t===c.ht||tmp[k].b===c.ht) ct=true
        if(tmp[k].d===c.hb||tmp[k].t===c.hb||tmp[k].b===c.hb) cb=true
      }
      return {...c,cd,ct,cb}
    })
    setRows(tmp)
  }

  useEffect(()=>{ load() },[table])

  const hapus = async(id)=>{
    if(!confirm(`Hapus ID DASAR ${id} dari ${table}?`)) return
    const { error } = await supabase.from(table).delete().eq('id',id)
    if(error) alert("GAGAL: "+error.message)
    else load()
  }

  return (
    <div className="w-full max-w-[100vw] min-h-[100dvh] bg-[#0a7a00] p-2 box-border overflow-x-hidden pb-[180px]">
      <div className="w-full bg-white rounded-xl p-2.5 box-border border-2 border-black">
        <div className="flex flex-wrap gap-2 items-center">
          <select value={table} onChange={e=>setTable(e.target.value)} className="flex-1 min-w-[150px] p-3 border-2 border-black rounded-lg font-black bg-white text-black text-[16px]">
            {ALL_TABLES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <div className="text-sm text-black">Aktif: <b>{table}</b> {isAdmin && <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs ml-1">ADMIN</span>}</div>
        </div>
        <div className="mt-2 p-2.5 bg-zinc-900 text-white rounded-lg text-sm font-bold">Jumlah: <b className="text-green-300">{jml}</b></div>
      </div>

      <div className="w-full mt-3 bg-white rounded-xl overflow-hidden box-border border-2 border-black">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse min-w-[750px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-zinc-900 text-white text-[12px]">
                <th className="border-2 border-black p-2.5 bg-zinc-900">id</th>
                <th className="border-2 border-black p-2.5 bg-zinc-900">hasil</th>
                <th className="border-2 border-black p-2.5 bg-zinc-900">hd</th>
                <th className="border-2 border-black p-2.5 bg-zinc-900">ht</th>
                <th className="border-2 border-black p-2.5 bg-zinc-900">hb</th>
                <th className="border-2 border-black p-2.5 bg-zinc-900">d</th>
                <th className="border-2 border-black p-2.5 bg-zinc-900">t</th>
                <th className="border-2 border-black p-2.5 bg-zinc-900">b</th>
                <th className="border-2 border-black p-2.5 bg-zinc-900">dpn</th>
                <th className="border-2 border-black p-2.5 bg-zinc-900">tgh</th>
                <th className="border-2 border-black p-2.5 bg-zinc-900">blk</th>
                {isAdmin && <th className="border-2 border-black p-2.5 bg-zinc-900">HAPUS</th>}
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {rows.map((r,i)=>(
                <tr key={r.id}>
                  <td className="border border-zinc-400 p-2 text-center text-black bg-white font-bold">{r.id}</td>
                  <td className="border border-zinc-400 p-2 text-center text-black bg-white font-black">{r.hasil}</td>
                  <td className="border border-zinc-400 p-2 text-center text-black bg-white">{r.hd}</td>
                  <td className="border border-zinc-400 p-2 text-center text-black bg-white">{r.ht}</td>
                  <td className="border border-zinc-400 p-2 text-center text-black bg-white">{r.hb}</td>
                  <td className="border border-zinc-400 p-2 text-center text-black bg-[#e6f0ff] font-black">{r.d}</td>
                  <td className="border border-zinc-400 p-2 text-center text-black bg-[#e6ffe6] font-black">{r.t}</td>
                  <td className="border border-zinc-400 p-2 text-center text-black bg-[#fff0e6] font-black">{r.b}</td>
                  <td className="border border-zinc-400 p-2 text-center font-bold" style={{background:r.cd?'#173d23':'#ffffff',color:r.cd?'#7cff9e':'#000000'}}>{r.cd?'depan':'-'}</td>
                  <td className="border border-zinc-400 p-2 text-center font-bold" style={{background:r.ct?'#1a2f4d':'#ffffff',color:r.ct?'#7cc4ff':'#000000'}}>{r.ct?'tengah':'-'}</td>
                  <td className="border border-zinc-400 p-2 text-center font-bold" style={{background:r.cb?'#4d2f1a':'#ffffff',color:r.cb?'#ffca7c':'#000000'}}>{r.cb?'belakang':'-'}</td>
                  {isAdmin && <td className="border border-zinc-400 p-2 text-center bg-white">{i===0? <button onClick={()=>hapus(r.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-black border border-black">HAPUS</button> : <span className="text-black">-</span>}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-yellow-300 text-black text-[11px] p-2 text-center font-black border-t-2 border-black">👉 Geser tabel ke kiri untuk lihat semua kolom</div>
      </div>
    </div>
  )
}
