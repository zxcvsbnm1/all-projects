"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function ProtectedLayout({ children }) {
  const [open, setOpen] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (data?.role === 'admin') setIsAdmin(true)
      if (pathname === '/admin' && data?.role!== 'admin') {
        router.push('/dashboard')
      }
      setLoading(false)
    })()
  }, [pathname])

  if (loading) {
    return (
      <div style={{ background: '#008000', minHeight: '100vh', color: 'white', padding: '20px' }}>
        Loading...
      </div>
    )
  }

  const menu = [
   ...(isAdmin? [{ href: "/admin", label: "PANEL ADMIN", admin: true }] : []),
    { href: "/kum", label: "KUM" },
    { href: "/cxz", label: "CXZ" },
    { href: "/z0", label: "Z0" },
    { href: "/dashboard", label: "TABEL DATA" },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#008000', color: 'white' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '2px solid #000', background: '#008000' }}>
        <Link href="/dashboard">
          <img
            src="/logo5.png"
            alt="K"
            style={{
              height: '75px',
              width: '75px',
              objectFit: 'contain',
              background: '#000',
              borderRadius: '10px',
              padding: '2px'
            }}
          />
        </Link>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            location.href = "/login"
          }}
          style={{ background: '#222', color: '#ff6b6b', padding: '12px 18px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Logout
        </button>
      </header>

      <div style={{ padding: '12px' }}>
        <button
          onClick={() => setOpen(!open)}
          style={{ background: '#222', color: 'white', padding: '12px 18px', borderRadius: '12px', border: 'none', marginBottom: '12px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ☰ {open? 'Tutup' : 'Buka Menu'}
        </button>

        {open && (
          <div style={{ background: '#111', borderRadius: '16px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {menu.map((m) => (
              <Link
                key={m.label}
                href={m.href}
                style={{
                  background: m.admin? '#FFD700' : '#1c1c1c',
                  color: m.admin? 'black' : 'white',
                  padding: '14px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: m.admin? '900' : '600',
                  textAlign: m.admin? 'center' : 'left',
                }}
              >
                {m.admin? '🔐 ' : ''}{m.label}
              </Link>
            ))}
          </div>
        )}

        {children}
      </div>
    </div>
  )
}
