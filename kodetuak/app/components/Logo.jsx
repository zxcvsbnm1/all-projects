export default function Logo() {
  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'24px'}}>
      <img 
        src="/logo5.png" 
        alt="kodetuak" 
        style={{width:'80px', height:'80px', borderRadius:'50%', boxShadow:'0 0 30px rgba(250,204,21,0.4)'}} 
      />
      <h1 style={{marginTop:'12px', fontSize:'28px', fontWeight:'900', letterSpacing:'-0.5px', color:'#facc15'}}>kodetuak</h1>
      <p style={{fontSize:'14px', color:'#6b7280', marginTop:'2px'}}>Login Terlebih dahulu</p>
    </div>
  )
}
