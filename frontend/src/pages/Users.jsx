import { useState, useEffect } from "react"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import { PageHeader, Card, Btn, Badge, Table, Tr, Td, Input, Select, Alert } from "../components/UI"

export default function Users() {
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"user" })
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState(null)
  const { user: currentUser } = useAuth()

  useEffect(() => { api.get("/api/users").then(r => setUsers(r.data)) }, [])

  const handleCreate = async (e) => {
    e.preventDefault(); setError("")
    try {
      const res = await api.post("/api/users", form)
      setUsers([...users, res.data]); setShowForm(false); setForm({ name:"", email:"", password:"", role:"user" })
    } catch(err) { setError(err.response?.data?.detail || "Error al crear usuario") }
  }

  const handleDelete = async (id) => {
    if (id === currentUser.id) { alert("No puedes eliminarte a ti mismo"); return }
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return
    setDeleting(id)
    try {
      await api.delete(`/api/users/${id}`)
      setUsers(users.filter(u => u.id !== id))
    } catch(err) { alert(err.response?.data?.detail || "Error al eliminar") }
    finally { setDeleting(null) }
  }

  return (
    <div style={s.page}>
      <PageHeader
        title="Gestión de usuarios"
        subtitle={`${users.length} usuario${users.length !== 1 ? "s" : ""} en el sistema`}
        action={<Btn onClick={() => setShowForm(!showForm)}>+ Nuevo usuario</Btn>}
      />
      {showForm && (
        <Card style={{ padding:"24px", marginBottom:"24px" }}>
          <h3 style={s.formTitle}>Nuevo usuario</h3>
          <Alert msg={error} />
          <form onSubmit={handleCreate} style={s.formGrid}>
            <Input placeholder="Nombre completo *" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required />
            <Input type="email" placeholder="Email *" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
            <Input type="password" placeholder="Contraseña *" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required />
            <Select value={form.role} onChange={e => setForm({...form, role:e.target.value})}>
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </Select>
            <div style={{ display:"flex", gap:"8px", gridColumn:"1/-1" }}>
              <Btn type="submit">Crear usuario</Btn>
              <Btn variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Btn>
            </div>
          </form>
        </Card>
      )}
      <Card>
        <Table headers={["Nombre","Email","Rol","Creado",""]}
          empty={users.length === 0 ? "Sin usuarios." : null}>
          {users.map(u => (
            <Tr key={u.id}>
              <Td>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:"linear-gradient(135deg, var(--navy-600), var(--navy-400))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:700, color:"white", flexShrink:0 }}>{u.name?.[0]?.toUpperCase()}</div>
                  <span style={{ fontWeight:600, color:"var(--navy-800)" }}>{u.name}</span>
                </div>
              </Td>
              <Td style={{ color:"var(--slate-600)" }}>{u.email}</Td>
              <Td><Badge label={u.role} color={u.role} /></Td>
              <Td style={{ color:"var(--slate-400)", fontSize:"13px" }}>{new Date(u.created_at).toLocaleDateString("es")}</Td>
              <Td>
                {u.id !== currentUser.id && (
                  <Btn variant="danger" onClick={() => handleDelete(u.id)} disabled={deleting === u.id}
                    style={{ padding:"5px 12px", fontSize:"12px" }}>
                    {deleting === u.id ? "..." : "Eliminar"}
                  </Btn>
                )}
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}
const s = { page:{ maxWidth:"1280px", margin:"0 auto", padding:"32px 24px" }, formTitle:{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"18px", color:"var(--navy-900)", marginBottom:"20px" }, formGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" } }
