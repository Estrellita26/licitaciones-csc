import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => { logout(); navigate("/login") }

  const navLinks = [
    { to: "/", label: "Licitaciones" },
    { to: "/clients", label: "Clientes" },
    { to: "/products", label: "Productos" },
    ...(user?.role === "admin" ? [{ to: "/users", label: "Usuarios" }] : [])
  ]

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        <div style={s.links}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} style={{
              ...s.link,
              ...(location.pathname === l.to ? s.linkActive : {})
            }}>{l.label}</Link>
          ))}
        </div>
        <div style={s.right}>
          <div style={s.userBadge}>
            <div style={s.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div style={s.userName}>{user?.name}</div>
              <div style={s.userRole}>{user?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={s.logoutBtn}>Salir</button>
        </div>
      </div>
    </nav>
  )
}

const s = {
  nav: { background:"var(--navy-900)", borderBottom:"1px solid var(--navy-700)", position:"sticky", top:0, zIndex:100 },
  inner: { maxWidth:"1280px", margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", gap:"32px", height:"64px" },
  links: { display:"flex", gap:"4px", flex:1 },
  link: { padding:"6px 14px", borderRadius:"6px", fontSize:"14px", fontWeight:500, color:"var(--slate-400)", textDecoration:"none" },
  linkActive: { color:"white", background:"var(--navy-700)" },
  right: { display:"flex", alignItems:"center", gap:"16px", marginLeft:"auto" },
  userBadge: { display:"flex", alignItems:"center", gap:"10px" },
  avatar: { width:"32px", height:"32px", borderRadius:"50%", background:"linear-gradient(135deg, var(--navy-500), var(--navy-400))", border:"2px solid var(--gold)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:600, color:"white" },
  userName: { fontSize:"13px", fontWeight:600, color:"white", lineHeight:1 },
  userRole: { fontSize:"11px", color:"var(--gold)", textTransform:"capitalize", lineHeight:1, marginTop:"2px" },
  logoutBtn: { padding:"7px 16px", background:"transparent", border:"1px solid var(--navy-600)", borderRadius:"6px", color:"var(--slate-400)", fontSize:"13px", fontWeight:500, cursor:"pointer" },
}
