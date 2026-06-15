import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { PageHeader, Card, Btn, Table, Tr, Td, Input, Alert } from '../components/UI'

export default function Products() {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name:'', sku:'', unit_price:'' })
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => { api.get('/api/products').then(r => setProducts(r.data)) }, [])

  const handleCreate = async (e) => {
    e.preventDefault(); setError('')
    try {
      const res = await api.post('/api/products', { ...form, unit_price:parseFloat(form.unit_price) })
      setProducts([...products, res.data]); setShowForm(false); setForm({ name:'', sku:'', unit_price:'' })
    } catch(err) { setError(err.response?.data?.detail || 'Error') }
  }

  return (
    <div style={s.page}>
      <PageHeader
        title='Productos'
        subtitle={`${products.length} producto${products.length !== 1 ? 's' : ''} en catálogo`}
        action={user?.role === 'admin' && <Btn onClick={() => setShowForm(!showForm)}>+ Nuevo producto</Btn>}
      />
      {showForm && (
        <Card style={{ padding:'24px', marginBottom:'24px' }}>
          <h3 style={s.formTitle}>Nuevo producto</h3>
          <Alert msg={error} />
          <form onSubmit={handleCreate} style={s.formGrid}>
            <Input placeholder='Nombre *' value={form.name} onChange={e => setForm({...form, name:e.target.value})} required />
            <Input placeholder='SKU *' value={form.sku} onChange={e => setForm({...form, sku:e.target.value})} required />
            <Input type='number' step='0.01' placeholder='Precio unitario *' value={form.unit_price} onChange={e => setForm({...form, unit_price:e.target.value})} required />
            <div />
            <div style={{ display:'flex', gap:'8px', gridColumn:'1/-1' }}>
              <Btn type='submit'>Crear producto</Btn>
              <Btn variant='secondary' onClick={() => setShowForm(false)}>Cancelar</Btn>
            </div>
          </form>
        </Card>
      )}
      <Card>
        <Table headers={['Nombre', 'SKU', 'Precio unitario']} empty={products.length === 0 ? 'Sin productos aún.' : null}>
          {products.map(p => (
            <Tr key={p.id}>
              <Td><span style={{ fontWeight:600, color:'var(--navy-800)' }}>{p.name}</span></Td>
              <Td><span style={{ fontFamily:'monospace', fontSize:'12px', background:'var(--slate-100)', padding:'2px 8px', borderRadius:'4px' }}>{p.sku}</span></Td>
              <Td><span style={{ fontWeight:600, color:'var(--navy-700)' }}>${parseFloat(p.unit_price).toLocaleString('es')}</span></Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}
const s = { page:{ maxWidth:'1280px', margin:'0 auto', padding:'32px 24px' }, formTitle:{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'18px', color:'var(--navy-900)', marginBottom:'20px' }, formGrid:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' } }
