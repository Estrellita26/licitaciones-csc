import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>CSC Licitaciones</div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Licitaciones</Link>
        <Link to="/clients" style={styles.link}>Clientes</Link>
        <Link to="/products" style={styles.link}>Productos</Link>
        {user?.role === "admin" && <Link to="/users" style={styles.link}>Usuarios</Link>}
        <span style={styles.userInfo}>{user?.name}</span>
        <button onClick={handleLogout} style={styles.btn}>Salir</button>
      </div>
    </nav>
  )
}

const styles = {
  nav: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 24px", background:"#1e3a5f", color:"white" },
  brand: { fontWeight:"bold", fontSize:"18px", color:"white" },
  links: { display:"flex", gap:"16px", alignItems:"center" },
  link: { color:"white", textDecoration:"none", fontSize:"14px" },
  userInfo: { color:"#a0c4ff", fontSize:"14px" },
  btn: { background:"#e74c3c", color:"white", border:"none", padding:"6px 12px", borderRadius:"4px", cursor:"pointer" }
}
