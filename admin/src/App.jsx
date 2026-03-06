import Sidebar from './components/sidebar'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import Products from './pages/Products/Products'
import Order from './pages/Order/Order'
import { Route, BrowserRouter, Routes, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import User from './pages/User/User'

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (token) {
      localStorage.setItem('token', token)
      window.history.replaceState({}, document.title, '/')
    }
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
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
