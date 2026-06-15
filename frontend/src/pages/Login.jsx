import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../api/axios"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await api.post("/api/auth/login", { email, password })
      login(res.data.user, res.data.access_token)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.detail || "Credenciales incorrectas")
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#060d1f", position:"relative", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');
        @keyframes blob1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(80px,-60px)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-60px,80px)} }
        @keyframes glow { 0%,100%{opacity:0.7} 50%{opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeIn { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
        .login-card { animation: fadeIn 0.6s ease forwards; }
        .inp-l { transition: all 0.2s; outline: none; border-bottom: 1.5px solid rgba(255,255,255,0.2) !important; }
        .inp-l:focus { border-bottom: 1.5px solid #c9a84c !important; }
        .login-btn { transition: all 0.2s; }
        .login-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.15); }
      `}</style>

      {/* Background blobs */}
      <div style={{ position:"fixed", width:"500px", height:"500px", borderRadius:"50%", background:"radial-gradient(circle, rgba(20,50,110,0.6) 0%, transparent 70%)", top:"-100px", left:"-100px", animation:"blob1 12s ease-in-out infinite", filter:"blur(60px)", pointerEvents:"none" }} />
      <div style={{ position:"fixed", width:"400px", height:"400px", borderRadius:"50%", background:"radial-gradient(circle, rgba(42,79,150,0.4) 0%, transparent 70%)", bottom:"-80px", right:"-80px", animation:"blob2 15s ease-in-out infinite", filter:"blur(50px)", pointerEvents:"none" }} />

      {/* Outer glow border card */}
      <div className="login-card" style={{ width:"920px", height:"500px", borderRadius:"16px", border:"1.5px solid rgba(42,79,150,0.6)", boxShadow:"0 0 40px rgba(42,79,150,0.3), 0 0 80px rgba(42,79,150,0.15), inset 0 0 40px rgba(0,0,0,0.2)", display:"flex", overflow:"hidden", position:"relative", zIndex:1, animation:"glow 3s ease-in-out infinite" }}>

        {/* Left — dark form side */}
        <div style={{ flex:1.2, background:"#080f1f", display:"flex", flexDirection:"column", justifyContent:"center", padding:"50px 50px 50px 60px", position:"relative", zIndex:2 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"28px", color:"white", marginBottom:"36px", textAlign:"center" }}>Ingresar</h2>

          {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"6px", padding:"10px 14px", marginBottom:"16px", fontSize:"13px", color:"#f87171", textAlign:"center" }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"28px" }}>
            <div style={{ position:"relative" }}>
              <label style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:"8px" }}>Correo electrónico</label>
              <input className="inp-l" type="email" value={email} onChange={e => setEmail(e.target.value)} required
                style={{ width:"100%", background:"transparent", border:"none", borderBottom:"1.5px solid rgba(255,255,255,0.2)", padding:"8px 0", fontSize:"15px", color:"white", boxSizing:"border-box" }} />
            </div>
            <div style={{ position:"relative" }}>
              <label style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:"8px" }}>Contraseña</label>
              <input className="inp-l" type="password" value={password} onChange={e => setPassword(e.target.value)} required
                style={{ width:"100%", background:"transparent", border:"none", borderBottom:"1.5px solid rgba(255,255,255,0.2)", padding:"8px 0", fontSize:"15px", color:"white", boxSizing:"border-box" }} />
            </div>
            <button className="login-btn" type="submit" disabled={loading}
              style={{ padding:"13px", background:"linear-gradient(135deg, #1e3a6e, #2a4f96)", border:"none", borderRadius:"30px", fontSize:"15px", fontWeight:600, color:"white", cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1, marginTop:"4px", boxShadow:"0 4px 20px rgba(42,79,150,0.4)" }}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>

        {/* Right — blue gradient welcome side (Includes the diagonal cut natively) */}
        <div style={{ flex:1, background:"linear-gradient(145deg, #0f2040 0%, #1e3a6e 40%, #163058 100%)", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"44px 44px 44px 60px", position:"relative", overflow:"hidden", clipPath: "polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)", marginLeft: "-50px" }}>
          {/* Gold glow accent */}
          <div style={{ position:"absolute", width:"200px", height:"200px", borderRadius:"50%", background:"radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)", top:"-40px", right:"-40px" }} />
          <div style={{ position:"absolute", width:"150px", height:"150px", borderRadius:"50%", background:"radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)", bottom:"-30px", left:"-30px" }} />

          <div style={{ position:"relative", zIndex:1, textAlign:"center" }}>
            <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#c9a84c", margin:"0 auto 24px", animation:"pulse 2s ease infinite", boxShadow:"0 0 12px rgba(201,168,76,0.5)" }} />
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"30px", color:"white", lineHeight:1.2, marginBottom:"20px", letterSpacing:"-0.01em" }}>
              BIENVENIDO<br/>AL SISTEMA
            </h2>
            <div style={{ width:"40px", height:"2px", background:"linear-gradient(90deg, #c9a84c, #e8c96a)", borderRadius:"1px", margin:"0 auto 20px" }} />
            <p style={{ fontSize:"13.5px", color:"rgba(255,255,255,0.6)", lineHeight:1.6 }}>
              Gestión inteligente de licitaciones comerciales para Consultoría y Soluciones Caballero.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
