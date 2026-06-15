
export const PageHeader = ({ title, subtitle, action }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'28px' }}>
    <div>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'26px', color:'var(--navy-900)', lineHeight:1.2 }}>{title}</h1>
      {subtitle && <p style={{ fontSize:'14px', color:'var(--slate-400)', marginTop:'4px' }}>{subtitle}</p>}
    </div>
    {action}
  </div>
)

export const Card = ({ children, style }) => (
  <div style={{ background:'white', borderRadius:'var(--radius)', border:'1px solid var(--slate-200)', boxShadow:'var(--shadow-sm)', ...style }}>{children}</div>
)

export const Btn = ({ children, onClick, variant='primary', type='button', disabled, style }) => {
  const variants = {
    primary: { background:'linear-gradient(135deg, var(--navy-700), var(--navy-500))', color:'white', border:'none' },
    secondary: { background:'white', color:'var(--slate-600)', border:'1.5px solid var(--slate-200)' },
    danger: { background:'#fef2f2', color:'#dc2626', border:'1.5px solid #fecaca' },
    success: { background:'#f0fdf4', color:'#16a34a', border:'1.5px solid #bbf7d0' },
    ghost: { background:'transparent', color:'var(--slate-600)', border:'none' },
  }
  return <button type={type} onClick={onClick} disabled={disabled} style={{ padding:'9px 18px', borderRadius:'var(--radius-sm)', fontSize:'13px', fontWeight:600, cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.6:1, display:'inline-flex', alignItems:'center', gap:'6px', ...variants[variant], ...style }}>{children}</button>
}

export const Badge = ({ label, color }) => {
  const colors = { activa:'#dcfce7;color:#15803d', por_cobrar:'#fef9c3;color:#a16207', perdida:'#fee2e2;color:#b91c1c', finalizada:'#f1f5f9;color:#475569', admin:'#eff6ff;color:#1d4ed8', user:'#f5f3ff;color:#6d28d9' }
  const [bg, col] = (colors[color] || colors[label] || '#f1f5f9;color:#475569').split(';color:')
  return <span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:700, letterSpacing:'0.04em', textTransform:'uppercase', background:bg, color:'#'+col }}>{label}</span>
}

export const Input = ({ value, onChange, placeholder, type='text', required, style }) => (
  <input value={value} onChange={onChange} placeholder={placeholder} type={type} required={required}
    style={{ width:'100%', padding:'10px 14px', border:'1.5px solid var(--slate-200)', borderRadius:'var(--radius-sm)', fontSize:'14px', color:'var(--slate-800)', background:'white', outline:'none', boxSizing:'border-box', ...style }} />
)

export const Select = ({ value, onChange, children, required }) => (
  <select value={value} onChange={onChange} required={required}
    style={{ width:'100%', padding:'10px 14px', border:'1.5px solid var(--slate-200)', borderRadius:'var(--radius-sm)', fontSize:'14px', color:'var(--slate-800)', background:'white', outline:'none', boxSizing:'border-box' }}>{children}</select>
)

export const Table = ({ headers, children, empty }) => (
  <div style={{ overflowX:'auto' }}>
    <table style={{ width:'100%', borderCollapse:'collapse' }}>
      <thead><tr>{headers.map(h => <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--slate-400)', borderBottom:'2px solid var(--slate-100)', whiteSpace:'nowrap' }}>{h}</th>)}</tr></thead>
      <tbody>{children}</tbody>
    </table>
    {empty && <div style={{ padding:'48px', textAlign:'center', color:'var(--slate-400)', fontSize:'14px' }}>{empty}</div>}
  </div>
)

export const Tr = ({ children, onClick }) => (
  <tr onClick={onClick} style={{ borderBottom:'1px solid var(--slate-100)', transition:'background 0.1s', cursor:onClick?'pointer':'default' }}
    onMouseEnter={e => { if(onClick) e.currentTarget.style.background='var(--slate-50)' }}
    onMouseLeave={e => { e.currentTarget.style.background='transparent' }}>{children}</tr>
)

export const Td = ({ children, style }) => (
  <td style={{ padding:'14px 16px', fontSize:'14px', color:'var(--slate-800)', ...style }}>{children}</td>
)

export const Alert = ({ msg, type='error' }) => {
  if (!msg) return null
  const styles = { error:'background:#fef2f2;border:1px solid #fecaca;color:#dc2626', success:'background:#f0fdf4;border:1px solid #bbf7d0;color:#16a34a' }
  return <div style={{ padding:'12px 16px', borderRadius:'var(--radius-sm)', fontSize:'14px', marginBottom:'16px', ...Object.fromEntries((styles[type]||styles.error).split(';').map(x => x.split(':'))) }}>{msg}</div>
}

