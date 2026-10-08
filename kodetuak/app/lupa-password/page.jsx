"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
export default function Lupa(){
  const [input,setInput]=useState(""); const [load,setLoad]=useState(false)
  const submit=async(e)=>{
    e.preventDefault(); setLoad(true)
    let emailReal = input
    // jika input adalah username, cari email aslinya di profiles
    if(!input.includes('@')){
      const {data}=await supabase.from('profiles').select('email').eq('username', input.toLowerCase().trim()).single()
      if(!data){ alert("Username tidak ditemukan"); setLoad(false); return }
      emailReal = data.email
    }
    const {error}=await supabase.auth.resetPasswordForEmail(emailReal, {redirectTo: window.location.origin + '/update-password'})
    if(error) alert(error.message)
    else alert(`Link reset sudah dikirim ke ${emailReal}. Cek email!`)
    setLoad(false)
  }
  return (<div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#000', padding:'20px'}}><form onSubmit={submit} style={{background:'#fff', padding:'24px', borderRadius:'16px', width:'100%', maxWidth:'320px', display:'flex', flexDirection:'column', gap:'12px'}}><h1 style={{fontWeight:'800', textAlign:'center'}}>LUPA PASSWORD</h1><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Username atau Email kamu" style={{padding:'12px', borderRadius:'10px', border:'1px solid #ddd'}} required /><button disabled={load} style={{padding:'12px', borderRadius:'10px', background:'black', color:'white', fontWeight:'700', border:'none'}}>{load?'...':'KIRIM KE EMAIL'}</button><a href="/login" style={{textAlign:'center', fontSize:'13px', color:'#666'}}>Kembali Login</a></form></div>)
}
