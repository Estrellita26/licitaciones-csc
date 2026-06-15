import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { PageHeader, Card, Btn, Badge, Table, Tr, Td, Input, Select, Alert } from '../components/UI'

export default function Tenders() {
  const [tenders, setTenders] = useState([])
  const [clients, setClients] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title:'', description:'', client_id:'', max_budget:'' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/api/tenders').then(r => setTenders(r.data))
    api.get('/api/clients').then(r => setClients(r.data))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault(); setError('')
    try {
      const res = await api.post('/api/tenders', { ...form, client_id: parseInt(form.client_id), max_budget: parseFloat(form.max_budget) })
      setTenders([...tenders, res.data])
      setShowForm(false)
      setForm({ title:'', description:'', client_id:'', max_budget:'' })
    } catch(err) { setError(err.response?.data?.detail || 'Error al crear') }
  }

  return (
    <div style={s.page}>
      <PageHeader
        title='Licitaciones'
        subtitle={`${tenders.length} licitacion${tenders.length !== 1 ? 'es' : ''} en total`}
        action={<Btn onClick={() => setShowForm(!showForm)}>+ Nueva licitación</Btn>}
      />

      {showForm && (
        <Card style={{ padding:'24px', marginBottom:'24px' }}>
          <h3 style={s.formTitle}>Nueva licitación</h3>
          <Alert msg={error} />
          <form onSubmit={handleCreate} style={s.formGrid}>
            <Input placeholder='Título *' value={form.title} onChange={e => setForm({...form, title:e.target.value})} required />
            <Input placeholder='Descripción' value={form.description} onChange={e => setForm({...form, description:e.target.value})} />
            <Select value={form.client_id} onChange={e => setForm({...form, client_id:e.target.value})} required>
              <option value=''>Seleccionar cliente *</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Input type='number' placeholder='Presupuesto máximo *' value={form.max_budget} onChange={e => setForm({...form, max_budget:e.target.value})} required />
            <div style={{ display:'flex', gap:'8px', gridColumn:'1/-1' }}>
              <Btn type='submit'>Crear licitación</Btn>
              <Btn variant='secondary' onClick={() => setShowForm(false)}>Cancelar</Btn>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <Table headers={['Título', 'Cliente', 'Estado', 'Presupuesto', 'Total utilizado', '']}
          empty={tenders.length === 0 ? 'No hay licitaciones. Crea la primera.' : null}>
          {tenders.map(t => {
            const pct = t.max_budget > 0 ? Math.min((parseFloat(t.total_amount)/parseFloat(t.max_budget))*100,100) : 0
            return (
              <Tr key={t.id}>
                <Td><span style={{ fontWeight:600, color:'var(--navy-800)' }}>{t.title}</span></Td>
                <Td style={{ color:'var(--slate-600)' }}>{t.client?.name || '—'}</Td>
                <Td><Badge label={t.status} color={t.status} /></Td>
                <Td style={{ fontWeight:500 }}>${parseFloat(t.max_budget).toLocaleString('es')}</Td>
                <Td>
                  <div style={{ minWidth:'120px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'4px' }}>
                      <span style={{ color:'var(--slate-400)' }}>${parseFloat(t.total_amount).toLocaleString('es')}</span>
                      <span style={{ fontWeight:600, color: pct > 90 ? '#dc2626' : pct > 70 ? '#d97706' : '#16a34a' }}>{pct.toFixed(0)}%</span>
                    </div>
                    <div style={{ height:'4px', background:'var(--slate-100)', borderRadius:'2px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${pct}%`, background: pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#10b981', borderRadius:'2px', transition:'width 0.3s' }} />
                    </div>
                  </div>
                </Td>
                <Td><Btn variant='ghost' onClick={() => navigate(`/tenders/${t.id}`)} style={{ padding:'6px 12px', fontSize:'12px' }}>Ver detalle →</Btn></Td>
              </Tr>
            )
          })}
        </Table>
      </Card>
    </div>
  )
}

const s = {
  page: { maxWidth:'1280px', margin:'0 auto', padding:'32px 24px' },
  formTitle: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'18px', color:'var(--navy-900)', marginBottom:'20px' },
  formGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' },
}
