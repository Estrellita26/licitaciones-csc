import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import PrivateRoute from "./components/PrivateRoute"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Tenders from "./pages/Tenders"
import TenderDetail from "./pages/TenderDetail"
import Clients from "./pages/Clients"
import Products from "./pages/Products"
import Users from "./pages/Users"

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout><Tenders /></Layout></PrivateRoute>} />
          <Route path="/tenders/:id" element={<PrivateRoute><Layout><TenderDetail /></Layout></PrivateRoute>} />
          <Route path="/clients" element={<PrivateRoute><Layout><Clients /></Layout></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><Layout><Products /></Layout></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute adminOnly={true}><Layout><Users /></Layout></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
