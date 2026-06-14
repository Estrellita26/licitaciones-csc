import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
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
    <div style={{ minHeight:"100vh", background:"#f0f4f8" }}>
      <Navbar />
      <div>{children}</div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout><Tenders /></Layout></PrivateRoute>} />
          <Route path="/tenders/:id" element={<PrivateRoute><Layout><TenderDetail /></Layout></PrivateRoute>} />
          <Route path="/clients" element={<PrivateRoute><Layout><Clients /></Layout></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><Layout><Products /></Layout></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute adminOnly><Layout><Users /></Layout></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
