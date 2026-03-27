import Sidebar from './components/Sidebar/Sidebar'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import Products from './pages/Products/Products'
import Order from './pages/Order/Order'
import { Route, BrowserRouter, Routes, Outlet } from 'react-router-dom'
import User from './pages/User/User'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Banner from './pages/Banner/Banner'
import api from './services/api'
import { useEffect } from "react"

function App() {
  useEffect(() => {
      api.post('/ping').catch(() => {})
  
      const interval = setInterval(() => {
        api.post('/ping').catch(() => {})
      }, 30000)
  
      return () => clearInterval(interval)
    }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path='/orders' element={<Order />}/>
            <Route path='/user' element={ <User/> } />
            <Route path='/banner' element={<Banner />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  )
}

export default App
