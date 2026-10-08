"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const tables_view = ['vsnsdp','vslsdp','vrbsdp','vkmsdp','vjmsdp','vsbsdp','vmgsdp'];

function cek_acak(cari, dalam){
  if(!cari ||!dalam) return false;
  let arr_cari = cari.split('');
  let arr_dalam = dalam.split('');
  for(let d of arr_cari){
    let key = arr_dalam.indexOf(d);
    if(key === -1) return false;
    arr_dalam.splice(key, 1);
  }
  return true;
}

export default function ViewPage(){
  const [active, setActive] = useState(0);
  const [data, setData] = useState([]);
  const table_view = tables_view[active];
  useEffect(() => {
    async function load(){
      const { data } = await supabase.from(table_view).select('*').order('id', {ascending: true});
      setData(data || []);
    }
    load();
  }, [active]);
  return (
    <div style={{fontFamily:'Arial', padding:'10px', background:'#111', color:'#eee', minHeight:'100vh'}}>
      <h2 style={{textAlign:'center'}}>KODETUAK</h2>
      <div style={{textAlign:'center', margin:'10px'}}>
        <select value={active} onChange={e=>setActive(Number(e.target.value))} style={{padding:'8px', background:'#333', color:'#eee'}}>
          {tables_view.map((nama,i)=><option key={i} value={i}>{nama.toUpperCase()}</option>)}
        </select>
      </div>
      <div style={{textAlign:'center', margin:'10px', padding:'8px', background:'#222', borderRadius:'5px'}}>Total: <b>{data.length}</b> Baris - {table_view}</div>
      <table style={{borderCollapse:'collapse', width:'100%', fontSize:'13px'}}>
        <thead><tr><th>id</th><th>hasil</th><th>nilai1</th><th>3d dpn</th><th>3d blk</th><th>3d</th><th>4d</th></tr></thead>
        <tbody>
          {data.map(r=>{
            const status_3d = (r.nilai1?.includes(r['3d_dpn']) || r.nilai1?.includes(r['3d_blkg']))? 'COK' : '-';
            const status_4d = cek_acak(r['4d'], r.nilai1)? 'COK' : '-';
            return (<tr key={r.id}><td>{r.id}</td><td><b>{r.hasil}</b></td><td><code>{r.nilai1}</code></td><td>{r['3d_dpn']}</td><td>{r['3d_blkg']}</td><td style={{background: status_3d=='COK'? '#4CAF50':'#f44336'}}>{status_3d}</td><td style={{background: status_4d=='COK'? '#4CAF50':'#f44336'}}>{status_4d}</td></tr>)
          })}
        </tbody>
      </table>
    </div>
  )
}
