import Login from "./pages/Login/Login"
import Header from "./components/Header/Header"
import Dashboard from './pages/Dashboard/Dashboard'
import Footer from "./components/Footer/Footer"
import {BrowserRouter, Routes, Route, Outlet, useLocation} from "react-router-dom"
import Register from "./pages/Register/Register"
import { useEffect, useState } from "react"
import Cart from "./pages/Cart/Cart"
import Profile from "./pages/Profile/Profile"
import ProtectedRoute from "./components/ProjectedRoute/ProtectedRoute"
import Address from "./pages/Address/Address"
import Checkout from "./pages/Checkout/Checkout"
import api from "./services/api"
import ProductDetail from "./pages/ProductDetail/ProductDetail"
import CategoryProduct from "./pages/CategoryProduct/CategoryProduct"
import AboutUs from "./pages/AboutUs/AboutUs"
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword"
import ResetPassword from "./pages/ResetPassword/ResetPassword"
import OrderDetail from "./pages/OrderDetail/OrderDetail"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion"

function Layout({cart}) {
  return (
    <>
      <Header cart={cart}/>
      <Outlet />
      <Footer />
    </>
  )
}

function BodyClassController() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/register' ) {
      document.body.classList.add('auth-bg')
    } else {
      document.body.classList.remove('auth-bg')
    }
  }, [location])
  return null
}

function AuthRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  const [cart, setCart] = useState([])

  useEffect(() => {
    api.get('/cart')
      .then(res => setCart(res.data.items))
      .catch(() => setCart([]))
  }, [])

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

        <BodyClassController />

        <Routes>

          <Route path="/*" element={<AuthRoutes />} />

          <Route element={<Layout cart={cart}/>}>
            <Route path='/' element={<Dashboard cart={cart} setCart={setCart}/>}></Route>

            <Route path="/cart" element={<ProtectedRoute> <Cart cart={cart} setCart={setCart} /> </ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute> <Profile setCart={setCart} /> </ProtectedRoute>} />
            <Route path="/address" element={<ProtectedRoute> <Address /> </ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute> <Checkout setCart={setCart}/> </ProtectedRoute> } />
            <Route path="/product/:id" element={<ProtectedRoute> <ProductDetail setCart={setCart}/> </ProtectedRoute>} />
            <Route path="/category/:slug" element={<CategoryProduct />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/order/:id" element={<ProtectedRoute> <OrderDetail /></ProtectedRoute>} />
          </Route>

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

        </Routes>

      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={1000} />
    </>
  )
}

export default App