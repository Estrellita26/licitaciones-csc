import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

export default function Tenders() {
  const [tenders, setTenders] = useState([])
  const [clients, setClients] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title:"", description:"", client_id:"", max_budget:"" })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    api.get("/api/tenders").then(r => setTenders(r.data))
    api.get("/api/clients").then(r => setClients(r.data))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const res = await api.post("/api/tenders", { ...form, client_id: parseInt(form.client_id), max_budget: parseFloat(form.max_budget) })
      setTenders([...tenders, res.data])
      setShowForm(false)
      setForm({ title:"", description:"", client_id:"", max_budget:"" })
    } catch (err) {
      setError(err.response?.data?.detail || "Error al crear licitación")
    }
  }

  const statusColors = { activa:"#27ae60", por_cobrar:"#f39c12", perdida:"#e74c3c", finalizada:"#7f8c8d" }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Licitaciones</h2>
        <button style={styles.btnPrimary} onClick={() => setShowForm(!showForm)}>+ Nueva Licitación</button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3>Crear Licitación</h3>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleCreate}>
            <input style={styles.input} placeholder="Título" value={form.title} onChange={e => setForm({...form, title:e.target.value})} required />
            <textarea style={styles.input} placeholder="Descripción" value={form.description} onChange={e => setForm({...form, description:e.target.value})} />
            <select style={styles.input} value={form.client_id} onChange={e => setForm({...form, client_id:e.target.value})} required>
              <option value="">Seleccionar cliente</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input style={styles.input} type="number" placeholder="Presupuesto máximo" value={form.max_budget} onChange={e => setForm({...form, max_budget:e.target.value})} required />
            <div style={{display:"flex", gap:"8px"}}>
              <button style={styles.btnPrimary} type="submit">Crear</button>
              <button style={styles.btnSecondary} type="button" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <table style={styles.table}>
        <thead><tr>
          <th style={styles.th}>Título</th>
          <th style={styles.th}>Cliente</th>
          <th style={styles.th}>Estado</th>
          <th style={styles.th}>Presupuesto</th>
          <th style={styles.th}>Total</th>
          <th style={styles.th}>Acciones</th>
        </tr></thead>
        <tbody>
          {tenders.map(t => (
            <tr key={t.id}>
              <td style={styles.td}>{t.title}</td>
              <td style={styles.td}>{t.client?.name || "-"}</td>
              <td style={styles.td}><span style={{...styles.badge, background:statusColors[t.status]}}>{t.status}</span></td>
              <td style={styles.td}>${parseFloat(t.max_budget).toFixed(2)}</td>
              <td style={styles.td}>${parseFloat(t.total_amount).toFixed(2)}</td>
              <td style={styles.td}><button style={styles.btnSmall} onClick={() => navigate(`/tenders/${t.id}`)}>Ver</button></td>
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
  badge: { padding:"4px 10px", borderRadius:"12px", color:"white", fontSize:"12px", fontWeight:"bold" },
  btnPrimary: { background:"#1e3a5f", color:"white", border:"none", padding:"10px 20px", borderRadius:"4px", cursor:"pointer", fontSize:"14px" },
  btnSecondary: { background:"#95a5a6", color:"white", border:"none", padding:"10px 20px", borderRadius:"4px", cursor:"pointer", fontSize:"14px" },
  btnSmall: { background:"#3498db", color:"white", border:"none", padding:"6px 12px", borderRadius:"4px", cursor:"pointer", fontSize:"12px" }
}
