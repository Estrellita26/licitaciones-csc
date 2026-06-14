import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"

const VALID_TRANSITIONS = {
  activa: ["por_cobrar", "perdida"],
  por_cobrar: ["finalizada"],
  finalizada: [],
  perdida: []
}

export default function TenderDetail() {
  const { id } = useParams()
  const [tender, setTender] = useState(null)
  const [products, setProducts] = useState([])
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [form, setForm] = useState({ product_id: "", quantity: 1 })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadTender()
    api.get("/api/products").then(r => setProducts(r.data))
  }, [id])

  const loadTender = async () => {
    const res = await api.get(`/api/tenders/${id}`)
    setTender(res.data)
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await api.post(`/api/tenders/${id}/products`, { product_id: parseInt(form.product_id), quantity: parseInt(form.quantity) })
      setSuccess("Producto agregado exitosamente")
      setShowAddProduct(false)
      setForm({ product_id: "", quantity: 1 })
      loadTender()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || "Error al agregar producto")
    }
  }

  const handleStatusChange = async (newStatus) => {
    setError("")
    try {
      await api.patch(`/api/tenders/${id}/status`, { status: newStatus })
      loadTender()
    } catch (err) {
      setError(err.response?.data?.detail || "Error al cambiar estado")
    }
  }

  if (!tender) return <div style={{padding:"24px"}}>Cargando...</div>

  const budget = parseFloat(tender.max_budget)
  const total = parseFloat(tender.total_amount)
  const percentage = budget > 0 ? Math.min((total / budget) * 100, 100) : 0
  const barColor = percentage > 90 ? "#e74c3c" : percentage > 70 ? "#f39c12" : "#27ae60"
  const statusColors = { activa:"#27ae60", por_cobrar:"#f39c12", perdida:"#e74c3c", finalizada:"#7f8c8d" }
  const nextStatuses = VALID_TRANSITIONS[tender.status] || []

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2>{tender.title}</h2>
          <span style={{...styles.badge, background:statusColors[tender.status]}}>{tender.status}</span>
        </div>
        <p style={{color:"#666"}}>{tender.description}</p>
        <p><strong>Cliente:</strong> {tender.client?.name}</p>

        <div style={styles.budgetSection}>
          <div style={styles.budgetRow}>
            <span>Presupuesto: ${budget.toFixed(2)}</span>
            <span>Total: ${total.toFixed(2)}</span>
            <span>{percentage.toFixed(1)}% utilizado</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width:`${percentage}%`, background:barColor}} />
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {nextStatuses.length > 0 && (
          <div style={styles.statusSection}>
            <strong>Cambiar estado:</strong>
            {nextStatuses.map(s => (
              <button key={s} style={{...styles.btnStatus, background:statusColors[s]}} onClick={() => handleStatusChange(s)}>
                → {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3>Productos</h3>
          {tender.status === "activa" && (
            <button style={styles.btnPrimary} onClick={() => setShowAddProduct(!showAddProduct)}>+ Agregar Producto</button>
          )}
        </div>

        {showAddProduct && (
          <form onSubmit={handleAddProduct} style={{marginBottom:"16px"}}> 
            <select style={styles.input} value={form.product_id} onChange={e => setForm({...form, product_id:e.target.value})} required>
              <option value="">Seleccionar producto</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} - ${parseFloat(p.unit_price).toFixed(2)}</option>)}
            </select>
            <input style={styles.input} type="number" min="1" placeholder="Cantidad" value={form.quantity} onChange={e => setForm({...form, quantity:e.target.value})} required />
            <div style={{display:"flex", gap:"8px"}}>
              <button style={styles.btnPrimary} type="submit">Agregar</button>
              <button style={styles.btnSecondary} type="button" onClick={() => setShowAddProduct(false)}>Cancelar</button>
            </div>
          </form>
        )}

        <table style={styles.table}>
          <thead><tr>
            <th style={styles.th}>Producto</th>
            <th style={styles.th}>SKU</th>
            <th style={styles.th}>Cantidad</th>
            <th style={styles.th}>Precio Unit.</th>
            <th style={styles.th}>Subtotal</th>
          </tr></thead>
          <tbody>
            {tender.products?.map(p => (
              <tr key={p.id}>
                <td style={styles.td}>{p.product?.name}</td>
                <td style={styles.td}>{p.product?.sku}</td>
                <td style={styles.td}>{p.quantity}</td>
                <td style={styles.td}>${parseFloat(p.unit_price).toFixed(2)}</td>
                <td style={styles.td}>${(parseFloat(p.unit_price) * p.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  container: { padding:"24px", maxWidth:"900px", margin:"0 auto" },
  card: { background:"white", padding:"24px", borderRadius:"8px", boxShadow:"0 2px 8px rgba(0,0,0,0.1)", marginBottom:"20px" },
  cardHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" },
  badge: { padding:"6px 14px", borderRadius:"12px", color:"white", fontSize:"13px", fontWeight:"bold" },
  budgetSection: { marginTop:"16px" },
  budgetRow: { display:"flex", gap:"24px", marginBottom:"8px", fontSize:"14px" },
  progressBar: { height:"12px", background:"#eee", borderRadius:"6px", overflow:"hidden" },
  progressFill: { height:"100%", borderRadius:"6px", transition:"width 0.3s" },
  statusSection: { display:"flex", gap:"8px", alignItems:"center", marginTop:"16px", flexWrap:"wrap" },
  error: { background:"#fee", color:"#c00", padding:"10px", borderRadius:"4px", margin:"12px 0", fontSize:"14px" },
  success: { background:"#efe", color:"#060", padding:"10px", borderRadius:"4px", margin:"12px 0", fontSize:"14px" },
  input: { display:"block", width:"100%", padding:"10px", margin:"8px 0", border:"1px solid #ddd", borderRadius:"4px", fontSize:"14px", boxSizing:"border-box" },
  table: { width:"100%", borderCollapse:"collapse" },
  th: { padding:"10px 12px", background:"#f5f5f5", textAlign:"left", fontSize:"13px", borderBottom:"2px solid #ddd" },
  td: { padding:"10px 12px", borderBottom:"1px solid #eee", fontSize:"14px" },
  btnPrimary: { background:"#1e3a5f", color:"white", border:"none", padding:"10px 20px", borderRadius:"4px", cursor:"pointer", fontSize:"14px" },
  btnSecondary: { background:"#95a5a6", color:"white", border:"none", padding:"10px 20px", borderRadius:"4px", cursor:"pointer", fontSize:"14px" },
  btnStatus: { color:"white", border:"none", padding:"8px 16px", borderRadius:"4px", cursor:"pointer", fontSize:"13px" }
}
