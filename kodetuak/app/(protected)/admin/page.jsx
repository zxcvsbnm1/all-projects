"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const ALL_TABLES = ["sdp","hkp","sgp","seninsdp","selasasdp","rabusdp","kamissdp","jumatsdp","sabtusdp","minggusdp","seninhkp","selasahkp","rabuhkp","kamishkp","jumathkp","sabtuhkp","mingguhkp","seninsgp","rabusgp","kamissgp","sabtusgp","minggusgp","polsd","polhk","polsg","sdpsenin","sdpselasa","sdprabu","sdpkamis","sdpjumat","sdpsabtu","sdpminggu","hkpsenin","hkpselasa","hkprabu","hkpkamis","hkpjumat","hkpsabtu","hkpminggu","sgpsenin","sgprabu","sgpkamis","sgpsabtu","sgpminggu"]

export default function AdminPage(){
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")
  const [loading, setLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedTable, setSelectedTable] = useState("seninsdp")
  const [rows, setRows] = useState([])
  const [cols, setCols] = useState([])
  const [form, setForm] = useState({})
  const [editKey, setEditKey] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(()=>{(async()=>{
    const {data}=await supabase.rpc('is_admin');
    if(data!==true){ alert("Bukan admin!"); router.push("/dashboard") } else setIsAdmin(true)
  })()},[])

  const loadTableData = async ()=>{
    const { data, error } = await supabase.from(selectedTable).select("*").order("id",{ascending:false}).limit(100)
    if(error){
      const { data: d2 } = await supabase.from(selectedTable).select("*").limit(100)
      if(d2){ setRows(d2); setCols(d2.length? Object.keys(d2[0]):[]) }
    } else {
      setRows(data||[]); if(data?.length) setCols(Object.keys(data[0]))
    }
  }
  useEffect(()=>{ if(isAdmin){ loadTableData() } },[isAdmin, selectedTable])
  const getIdCol = ()=> cols.includes("id")? "id" : cols[0]

  const hapusRow = async (row)=>{
    const col = getIdCol(); const val = row[col]
    if(!confirm(`Hapus ${col}=${val}?`)) return
    const { error } = await supabase.from(selectedTable).delete().eq(col, val)
    if(error) alert(error.message); else loadTableData()
  }
  const simpanRow = async ()=>{
    let payload = {...form}
    if(payload.id &&!isNaN(payload.id)) payload.id = Number(payload.id)
    if(payload.hasil) payload.hasil = String(payload.hasil)
    if(editKey!==null){
      const col = getIdCol()
      const { error } = await supabase.from(selectedTable).update(payload).eq(col, editKey)
      if(error) alert("Gagal update: "+error.message)
      else { setShowForm(false); setEditKey(null); setForm({}); loadTableData() }
    } else {
      const { error } = await supabase.from(selectedTable).insert([payload])
      if(error) alert("Gagal simpan: "+error.message)
      else { setShowForm(false); setForm({}); loadTableData() }
    }
  }
  const mulaiEdit = (row)=>{ setForm(row); setEditKey(row[getIdCol()]); setShowForm(true) }
  const mulaiTambah = ()=>{
    const empty={}; cols.forEach(c=>{ empty[c]="" })
    if(cols.length===0){ empty["id"]=""; empty["hasil"]="" }
    setForm(empty); setEditKey(null); setShowForm(true)
  }

  if(!isAdmin) return <div className="p-5 bg-black text-white min-h-screen">Cek admin...</div>

  return(
    <div className="w-full max-w-[100vw] min-h-[100dvh] bg-black text-white overflow-x-hidden box-border">
      {/* HEADER */}
      <div className="w-full flex justify-between items-center p-3 box-border gap-2">
        <b className="text-yellow-300 text-sm truncate">KODETUAK / SUPER ADMIN</b>
        <button onClick={()=>router.push("/dashboard")} className="shrink-0 bg-zinc-800 border border-zinc-600 px-3 py-1.5 rounded-lg text-xs">Kembali</button>
      </div>

      <div className="w-full p-2 box-border">
        <div className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-700 box-border">
          <div className="text-yellow-300 font-extrabold text-sm break-words">📊 {selectedTable} ({rows.length})</div>

          <select value={selectedTable} onChange={e=>setSelectedTable(e.target.value)} className="w-full mt-2 p-3 bg-zinc-800 text-white border border-zinc-600 rounded-lg text-sm">
            {ALL_TABLES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>

          <div className="flex flex-wrap gap-2 mt-2 w-full">
            <button onClick={loadTableData} className="flex-1 min-w-[80px] bg-zinc-700 text-white py-2.5 rounded-lg text-sm font-bold">🔄 Refresh</button>
            <button onClick={mulaiTambah} className="flex-1 min-w-[120px] bg-yellow-300 text-black py-2.5 rounded-lg text-sm font-extrabold">+ Tambah Data</button>
            <button onClick={()=>document.documentElement.requestFullscreen?.()} className="shrink-0 bg-zinc-700 px-3 py-2.5 rounded-lg text-sm">⛶ Full</button>
          </div>

          {showForm && (
            <div className="w-full bg-zinc-800 p-3 rounded-lg mt-3 box-border">
              <div className="text-[11px] text-zinc-400 mb-2">Isi id harus unik</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                {Object.keys(form).map(k=>(
                  <div key={k} className="w-full">
                    <div className="text-[11px] text-yellow-300 mb-1">{k}</div>
                    <input value={form[k]??""} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={k} className="w-full p-3 bg-zinc-900 text-white border border-zinc-600 rounded-lg text-sm box-border"/>
                  </div>
                ))}
              </div>
              <button onClick={simpanRow} className="w-full mt-3 bg-green-500 text-white py-3 rounded-lg font-extrabold text-base">{editKey!==null? "Update" : "Simpan"}</button>
            </div>
          )}

          {/* TABEL - BISA DI SCROLL KESAMPING */}
          <div className="w-full mt-3 bg-white rounded-lg overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-[13px] text-black min-w-[500px]">
                <thead><tr className="bg-yellow-300">{cols.map(c=><th key={c} className="p-2 border border-zinc-200 whitespace-nowrap">{c}</th>)}<th className="p-2 border">Aksi</th></tr></thead>
                <tbody>
                  {rows.map((r,i)=>(
                    <tr key={i}>{cols.map(c=><td key={c} className="p-1.5 border border-zinc-100 text-center">{String(r[c]??"")}</td>)}
                    <td className="p-1 flex gap-1 justify-center"><button onClick={()=>mulaiEdit(r)} className="bg-zinc-800 text-white px-2.5 py-1 rounded text-xs">Edit</button><button onClick={()=>hapusRow(r)} className="bg-red-600 text-white px-2.5 py-1 rounded text-xs">Hapus</button></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
