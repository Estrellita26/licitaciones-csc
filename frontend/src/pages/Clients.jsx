import { useState, useEffect } from "react"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"

export default function Clients() {
  const [clients, setClients] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name:"", email:"", phone:"" })
  const [error, setError] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    api.get("/api/clients").then(r => setClients(r.data))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const res = await api.post("/api/clients", form)
      setClients([...clients, res.data])
      setShowForm(false)
      setForm({ name:"", email:"", phone:"" })
    } catch (err) {
      setError(err.response?.data?.detail || "Error al crear cliente")
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Clientes</h2>
        {user?.role === "admin" && <button style={styles.btnPrimary} onClick={() => setShowForm(!showForm)}>+ Nuevo Cliente</button>}
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3>Crear Cliente</h3>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleCreate}>
            <input style={styles.input} placeholder="Nombre *" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required />
            <input style={styles.input} placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
            <input style={styles.input} placeholder="Teléfono" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} />
            <div style={{display:"flex", gap:"8px"}}>
              <button style={styles.btnPrimary} type="submit">Crear</button>
              <button style={styles.btnSecondary} type="button" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <table style={styles.table}>
        <thead><tr>
          <th style={styles.th}>Nombre</th>
          <th style={styles.th}>Email</th>
          <th style={styles.th}>Teléfono</th>
        </tr></thead>
        <tbody>
          {clients.map(c => (
            <tr key={c.id}>
              <td style={styles.td}>{c.name}</td>
              <td style={styles.td}>{c.email || "-"}</td>
              <td style={styles.td}>{c.phone || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  container: { padding:"24px" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" },
  formCard: { background:"white", padding:"20px", borderRadius:"8px", boxShadow:"0 2px 8px rgba(0,0,0,0.1)", marginBottom:"20px" },
  error: { background:"#fee", color:"#c00", padding:"10px", borderRadius:"4px", marginBottom:"12px", fontSize:"14px" },
  input: { display:"block", width:"100%", padding:"10px", margin:"8px 0", border:"1px solid #ddd", borderRadius:"4px", fontSize:"14px", boxSizing:"border-box" },
  table: { width:"100%", borderCollapse:"collapse", background:"white", borderRadius:"8px", overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.1)" },
  th: { padding:"12px 16px", background:"#1e3a5f", color:"white", textAlign:"left", fontSize:"14px" },
  td: { padding:"12px 16px", borderBottom:"1px solid #eee", fontSize:"14px" },
  btnPrimary: { background:"#1e3a5f", color:"white", border:"none", padding:"10px 20px", borderRadius:"4px", cursor:"pointer", fontSize:"14px" },
  btnSecondary: { background:"#95a5a6", color:"white", border:"none", padding:"10px 20px", borderRadius:"4px", cursor:"pointer", fontSize:"14px" }
}
