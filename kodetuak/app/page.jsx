"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/login")
  }, [])

  return (
    <div style={{ minHeight:'100vh', background:'black', display:'flex', alignItems:'center', justifyContent:'center', color:'#FFD700', fontWeight:'900', fontSize:'32px' }}>
      kodetuak
    </div>
  )
}
