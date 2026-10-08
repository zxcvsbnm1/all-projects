"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function Login(){
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [load,setLoad]=useState(false)

  useEffect(()=>{
    // Saat keyboard muncul, scroll input ke atas
    const onFocus = (e) => {
      setTimeout(()=>{
        e.target.scrollIntoView({ behavior:'smooth', block:'center' })
      }, 300)
    }
    const inputs = document.querySelectorAll('input')
    inputs.forEach(i=> i.addEventListener('focus', onFocus))
    return ()=> inputs.forEach(i=> i.removeEventListener('focus', onFocus))
  },[])

  const login=async(e)=>{
    e.preventDefault(); setLoad(true)
    const {data:profile}=await supabase.from('profiles').select('email').eq('username', username.toLowerCase().trim()).single()
    let emailToLogin = profile?.email
    if(!emailToLogin){ emailToLogin = username }
    const {error}=await supabase.auth.signInWithPassword({email:emailToLogin, password})
    if(error){ alert("Username / Password salah"); setLoad(false)}
    else location.href="/dashboard"
  }

  return (
    <div style={{
      minHeight:'100dvh', // pakai dvh bukan vh - auto mengecil saat keyboard naik
      display:'flex',
      alignItems:'flex-start', // INI KUNCI: taruh di atas, bukan center
      justifyContent:'center',
      background:'#fdf6e3',
      padding:'12px 20px 40px 20px',
      paddingTop:'max(12px, 4vh)',
      overflowY:'auto',
      width:'100%',
      maxWidth:'100vw',
      boxSizing:'border-box'
    }}>
      <form onSubmit={login} style={{
        background:'#fff',
        padding:'28px',
        borderRadius:'20px',
        width:'100%',
        maxWidth:'340px',
        display:'flex',
        flexDirection:'column',
        gap:'12px',
        boxShadow:'0 20px 50px rgba(0,0,0,0.12)',
        textAlign:'center',
        marginTop:'10px',
        marginBottom:'50px', // ruang extra biar bisa scroll di atas keyboard
        boxSizing:'border-box'
      }}>
        <img src="/logo5.png" alt="KODETUAK" style={{height:'105px', width:'auto', margin:'0 auto 10px auto', display:'block'}}/>
        <h1 style={{fontWeight:'900', margin:'0 0 12px 0', letterSpacing:'1px'}}>Selamat Datang di Kodetuak</h1>

        <input
          value={username}
          onChange={e=>setUsername(e.target.value)}
          placeholder="Username atau Email"
          style={{padding:'13px', borderRadius:'10px', border:'1px solid #ddd', textAlign:'left', fontSize:'16px'}} // 16px = anti auto-zoom
          required
        />
        <input
          value={password}
          onChange={e=>setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          style={{padding:'13px', borderRadius:'10px', border:'1px solid #ddd', textAlign:'left', fontSize:'16px'}}
          required
        />

        <button disabled={load} style={{padding:'13px', borderRadius:'10px', background:'black', color:'#FFD700', fontWeight:'700', border:'none'}}>{load?'...':'LOGIN'}</button>

        <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px', marginTop:'4px'}}>
          <Link href="/lupa-password" style={{color:'#666', textDecoration:'none'}}>Lupa Password?</Link>
          <Link href="/register" style={{color:'black', fontWeight:'700', textDecoration:'none'}}>Register</Link>
        </div>
      </form>
    </div>
  )
}
