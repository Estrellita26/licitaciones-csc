import { useState, useEffect } from "react"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import { PageHeader, Card, Btn, Table, Tr, Td, Input, Alert } from "../components/UI"

export default function Clients() {
  const [clients, setClients] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name:"", email:"", phone:"" })
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState(null)
  const { user } = useAuth()

  useEffect(() => { api.get("/api/clients").then(r => setClients(r.data)) }, [])

  const handleCreate = async (e) => {
    e.preventDefault(); setError("")
    try {
      const res = await api.post("/api/clients", form)
      setClients([...clients, res.data]); setShowForm(false); setForm({ name:"", email:"", phone:"" })
    } catch(err) { setError(err.response?.data?.detail || "Error al crear cliente") }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) return
    setDeleting(id)
    try {
      await api.delete(`/api/clients/${id}`)
      setClients(clients.filter(c => c.id !== id))
    } catch(err) { alert(err.response?.data?.detail || "Error al eliminar") }
    finally { setDeleting(null) }
  }

  return (
    <div style={s.page}>
      <PageHeader
        title="Clientes"
        subtitle={`${clients.length} cliente${clients.length !== 1 ? "s" : ""} registrado${clients.length !== 1 ? "s" : ""}`}
        action={user?.role === "admin" && <Btn onClick={() => setShowForm(!showForm)}>+ Nuevo cliente</Btn>}
      />
      {showForm && (
        <Card style={{ padding:"24px", marginBottom:"24px" }}>
          <h3 style={s.formTitle}>Nuevo cliente</h3>
          <Alert msg={error} />
          <form onSubmit={handleCreate} style={s.formGrid}>
            <Input placeholder="Nombre *" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required />
            <Input placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
            <Input placeholder="Teléfono" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} />
            <div />
            <div style={{ display:"flex", gap:"8px", gridColumn:"1/-1" }}>
              <Btn type="submit">Crear cliente</Btn>
              <Btn variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Btn>
            </div>
          </form>
        </Card>
      )}
      <Card>
        <Table headers={user?.role === "admin" ? ["Nombre","Email","Teléfono",""] : ["Nombre","Email","Teléfono"]}
          empty={clients.length === 0 ? "Sin clientes aún." : null}>
          {clients.map(c => (
            <Tr key={c.id}>
              <Td><span style={{ fontWeight:600, color:"var(--navy-800)" }}>{c.name}</span></Td>
              <Td style={{ color:"var(--slate-600)" }}>{c.email || "—"}</Td>
              <Td style={{ color:"var(--slate-600)" }}>{c.phone || "—"}</Td>
              {user?.role === "admin" && (
                <Td>
                  <Btn variant="danger" onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                    style={{ padding:"5px 12px", fontSize:"12px" }}>
                    {deleting === c.id ? "..." : "Eliminar"}
                  </Btn>
                </Td>
              )}
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}
const s = { page:{ maxWidth:"1280px", margin:"0 auto", padding:"32px 24px" }, formTitle:{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"18px", color:"var(--navy-900)", marginBottom:"20px" }, formGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" } }
