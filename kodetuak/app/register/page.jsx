"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Register(){
  const [f,setF]=useState({username:"", password:"", ulangi:"", email:"", no_hp:""});
  const [load,setLoad]=useState(false)
  const on=(k,v)=>setF({...f,[k]:v})

  const submit=async(e)=>{
    e.preventDefault()
    if(f.password!==f.ulangi) return alert("Password tidak sama")
    if(f.password.length<6) return alert("Password min 6")
    setLoad(true)
    const cleanUser=f.username.toLowerCase().trim().replace(/\s/g,'')
    const {data:exist}=await supabase.from('profiles').select('username').eq('username',cleanUser).maybeSingle()
    if(exist){
      alert("Username sudah dipakai"); setLoad(false); return
    }
    const {data, error}=await supabase.auth.signUp({
      email:f.email,
      password:f.password,
      options:{data:{username:cleanUser, no_hp:f.no_hp}}
    })
    if(error){
      alert(error.message); setLoad(false); return
    }
    if(data.user){
      await supabase.from('profiles').insert({id:data.user.id, username:cleanUser, email:f.email, no_hp:f.no_hp})
    }
    alert("Berhasil daftar! Cek email untuk verifikasi jika ada")
    location.href="/login"
    setLoad(false)
  }

  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#000', padding:'20px'}}>
      <form onSubmit={submit} style={{background:'#fff', padding:'24px', borderRadius:'16px', width:'100%', maxWidth:'360px', display:'flex', flexDirection:'column', gap:'10px'}}>

        {/* LOGO */}
        <div style={{display:'flex', justifyContent:'center', marginBottom:'5px'}}>
          <img
            src="/logo5.png"
            alt="Kodetuak Logo"
            style={{width:'110px', height:'110px', objectFit:'contain'}}
          />
        </div>

        <h1 style={{fontWeight:'900', textAlign:'center', marginTop:'0', letterSpacing:'1px'}}>REGISTER</h1>

        <input value={f.username} onChange={e=>on('username',e.target.value)} placeholder="Username" style={s} required />
        <input value={f.password} onChange={e=>on('password',e.target.value)} type="password" placeholder="Password" style={s} required />
        <input value={f.ulangi} onChange={e=>on('ulangi',e.target.value)} type="password" placeholder="Ulangi Password" style={s} required />
        <input value={f.email} onChange={e=>on('email',e.target.value)} type="email" placeholder="Email asli" style={s} required />
        <input value={f.no_hp} onChange={e=>on('no_hp',e.target.value)} placeholder="No HP" style={s} required />

        <button disabled={load} style={{padding:'12px', borderRadius:'10px', background:'black', color:'white', fontWeight:'700', border:'none', cursor:'pointer', marginTop:'6px'}}>
          {load?'...':'DAFTAR'}
        </button>
        <a href="/login" style={{textAlign:'center', fontSize:'13px', color:'#666', textDecoration:'none'}}>Sudah punya? Login</a>
      </form>
    </div>
  )
}

const s={padding:'12px', borderRadius:'10px', border:'1px solid #ddd', width:'100%', boxSizing:'border-box', outline:'none'}
