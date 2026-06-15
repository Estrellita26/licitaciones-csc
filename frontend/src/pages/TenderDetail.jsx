import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { Card, Btn, Badge, Table, Tr, Td, Input, Select, Alert } from '../components/UI'

const TRANSITIONS = { activa:['por_cobrar','perdida'], por_cobrar:['finalizada'], finalizada:[], perdida:[] }
const STATUS_LABEL = { por_cobrar:'Por cobrar', finalizada:'Finalizada', perdida:'Perdida', activa:'Activa' }
const STATUS_VARIANT = { por_cobrar:'success', finalizada:'secondary', perdida:'danger', activa:'primary' }

export default function TenderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tender, setTender] = useState(null)
  const [products, setProducts] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ product_id:'', quantity:1 })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { load(); api.get('/api/products').then(r => setProducts(r.data)) }, [id])

  const load = async () => { const r = await api.get(`/api/tenders/${id}`); setTender(r.data) }

  const handleAddProduct = async (e) => {
    e.preventDefault(); setError('')
    try {
      await api.post(`/api/tenders/${id}/products`, { product_id:parseInt(form.product_id), quantity:parseInt(form.quantity) })
      setSuccess('Producto agregado'); setShowAdd(false); setForm({ product_id:'', quantity:1 }); load()
      setTimeout(() => setSuccess(''), 3000)
    } catch(err) { setError(err.response?.data?.detail || 'Error') }
  }

  const handleStatus = async (s) => { setError(''); try { await api.patch(`/api/tenders/${id}/status`, { status:s }); load() } catch(err) { setError(err.response?.data?.detail || 'Error') } }

  if (!tender) return <div style={{ padding:'48px', textAlign:'center', color:'var(--slate-400)' }}>Cargando...</div>

  const budget = parseFloat(tender.max_budget)
  const total = parseFloat(tender.total_amount)
  const pct = budget > 0 ? Math.min((total/budget)*100, 100) : 0
  const barColor = pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#10b981'
  const next = TRANSITIONS[tender.status] || []

  return (
    <div style={s.page}>
      <button onClick={() => navigate('/')} style={s.back}>← Volver a licitaciones</button>

      <div style={s.grid}>
        <div style={s.main}>
          <Card style={{ padding:'28px', marginBottom:'20px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' }}>
              <div>
                <h1 style={s.title}>{tender.title}</h1>
                {tender.description && <p style={s.desc}>{tender.description}</p>}
              </div>
              <Badge label={tender.status} color={tender.status} />
            </div>
            <div style={s.meta}>
              <div style={s.metaItem}><span style={s.metaLabel}>Cliente</span><span style={s.metaVal}>{tender.client?.name}</span></div>
              <div style={s.metaItem}><span style={s.metaLabel}>Presupuesto</span><span style={s.metaVal}>${budget.toLocaleString('es')}</span></div>
              <div style={s.metaItem}><span style={s.metaLabel}>Total acumulado</span><span style={{ ...s.metaVal, color: pct > 90 ? '#dc2626' : pct > 70 ? '#d97706' : '#16a34a', fontWeight:700 }}>${total.toLocaleString('es')}</span></div>
            </div>
            <div style={{ marginTop:'20px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'var(--slate-400)', marginBottom:'6px' }}>
                <span>Presupuesto utilizado</span>
                <span style={{ fontWeight:700, color:barColor }}>{pct.toFixed(1)}%</span>
              </div>
              <div style={{ height:'8px', background:'var(--slate-100)', borderRadius:'4px', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${pct}%`, background:barColor, borderRadius:'4px', transition:'width 0.4s' }} />
              </div>
            </div>
          </Card>

          <Card>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--slate-100)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'17px', color:'var(--navy-900)' }}>Productos</h2>
                <p style={{ fontSize:'13px', color:'var(--slate-400)', marginTop:'2px' }}>{tender.products?.length || 0} producto(s) en esta licitación</p>
              </div>
              {tender.status === 'activa' && <Btn onClick={() => setShowAdd(!showAdd)}>+ Agregar producto</Btn>}
            </div>
            {showAdd && (
              <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--slate-100)', background:'var(--slate-50)' }}>
                <Alert msg={error} />
                <form onSubmit={handleAddProduct} style={{ display:'flex', gap:'12px', alignItems:'flex-end' }}>
                  <div style={{ flex:2 }}>
                    <label style={s.label}>Producto</label>
                    <Select value={form.product_id} onChange={e => setForm({...form, product_id:e.target.value})} required>
                      <option value=''>Seleccionar...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} — ${parseFloat(p.unit_price).toLocaleString('es')}</option>)}
                    </Select>
                  </div>
                  <div style={{ flex:1 }}>
                    <label style={s.label}>Cantidad</label>
                    <Input type='number' value={form.quantity} onChange={e => setForm({...form, quantity:e.target.value})} required />
                  </div>
                  <Btn type='submit'>Agregar</Btn>
                  <Btn variant='secondary' onClick={() => setShowAdd(false)}>Cancelar</Btn>
                </form>
              </div>
            )}
            {success && <div style={{ padding:'12px 24px', background:'#f0fdf4', color:'#16a34a', fontSize:'14px', borderBottom:'1px solid #bbf7d0' }}>{success}</div>}
            <Table headers={['Producto', 'SKU', 'Cantidad', 'Precio unit.', 'Subtotal']}
              empty={tender.products?.length === 0 ? 'Sin productos aún.' : null}>
              {tender.products?.map(p => (
                <Tr key={p.id}>
                  <Td><span style={{ fontWeight:600 }}>{p.product?.name}</span></Td>
                  <Td><span style={{ fontFamily:'monospace', fontSize:'12px', background:'var(--slate-100)', padding:'2px 8px', borderRadius:'4px' }}>{p.product?.sku}</span></Td>
                  <Td style={{ color:'var(--slate-600)' }}>{p.quantity}</Td>
                  <Td style={{ color:'var(--slate-600)' }}>${parseFloat(p.unit_price).toLocaleString('es')}</Td>
                  <Td><span style={{ fontWeight:700, color:'var(--navy-700)' }}>${(parseFloat(p.unit_price)*p.quantity).toLocaleString('es')}</span></Td>
                </Tr>
              ))}
            </Table>
          </Card>
        </div>

        <div style={s.sidebar}>
          <Card style={{ padding:'20px' }}>
            <h3 style={s.sideTitle}>Cambiar estado</h3>
            {!error && next.length === 0 && <p style={{ fontSize:'13px', color:'var(--slate-400)' }}>Estado terminal, no hay transiciones disponibles.</p>}
            <Alert msg={error} />
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {next.map(s2 => (
                <Btn key={s2} variant={STATUS_VARIANT[s2]} onClick={() => handleStatus(s2)} style={{ justifyContent:'center', width:'100%' }}>
                  → {STATUS_LABEL[s2]}
                </Btn>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { maxWidth:'1280px', margin:'0 auto', padding:'32px 24px' },
  back: { background:'none', border:'none', color:'var(--slate-400)', fontSize:'13px', cursor:'pointer', marginBottom:'20px', padding:0, display:'flex', alignItems:'center', gap:'4px' },
  grid: { display:'grid', gridTemplateColumns:'1fr 260px', gap:'20px', alignItems:'start' },
  main: {},
  sidebar: {},
  title: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'24px', color:'var(--navy-900)', marginBottom:'6px' },
  desc: { fontSize:'14px', color:'var(--slate-400)', marginTop:'4px' },
  meta: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginTop:'20px', paddingTop:'20px', borderTop:'1px solid var(--slate-100)' },
  metaItem: { display:'flex', flexDirection:'column', gap:'4px' },
  metaLabel: { fontSize:'11px', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--slate-400)' },
  metaVal: { fontSize:'16px', fontWeight:600, color:'var(--navy-800)' },
  label: { fontSize:'12px', fontWeight:600, color:'var(--slate-600)', display:'block', marginBottom:'6px' },
  sideTitle: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'15px', color:'var(--navy-900)', marginBottom:'16px' },
}
