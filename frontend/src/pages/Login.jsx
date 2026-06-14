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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>CSC Licitaciones</h1>
        <h2 style={styles.subtitle}>Iniciar Sesión</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input style={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f0f4f8" },
  card: { background:"white", padding:"40px", borderRadius:"8px", boxShadow:"0 2px 10px rgba(0,0,0,0.1)", width:"360px" },
  title: { textAlign:"center", color:"#1e3a5f", margin:"0 0 4px" },
  subtitle: { textAlign:"center", color:"#666", margin:"0 0 24px", fontWeight:"normal", fontSize:"16px" },
  error: { background:"#fee", color:"#c00", padding:"10px", borderRadius:"4px", marginBottom:"16px", fontSize:"14px" },
  field: { marginBottom:"16px" },
  label: { display:"block", marginBottom:"6px", fontSize:"14px", color:"#333" },
  input: { width:"100%", padding:"10px", border:"1px solid #ddd", borderRadius:"4px", fontSize:"14px", boxSizing:"border-box" },
  btn: { width:"100%", padding:"12px", background:"#1e3a5f", color:"white", border:"none", borderRadius:"4px", fontSize:"16px", cursor:"pointer" }
}
