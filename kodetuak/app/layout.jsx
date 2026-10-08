import "./globals.css"

export const metadata = {
  title: "KODETUAK",
  description: "KODETUAK System",
  manifest: "/manifest.json",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#008000",
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body style={{ 
        margin: 0, 
        padding: 0, 
        background: '#fdf6e3', 
        fontFamily: 'system-ui, sans-serif',
        minHeight: '100dvh',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        touchAction: 'manipulation'
      }}>
        {children}
        <script dangerouslySetInnerHTML={{__html: `
          if('serviceWorker' in navigator){
            navigator.serviceWorker.register('/sw.js').catch(()=>{});
          }
        `}} />
      </body>
    </html>
  )
}
