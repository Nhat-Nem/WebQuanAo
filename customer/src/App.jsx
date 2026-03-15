import Login from "./pages/Login/Login"
import Header from "./components/Header/Header"
import Dashboard from './pages/Dashboard/Dashboard'
import Footer from "./components/Footer/Footer"
import {BrowserRouter, Routes, Route, Outlet} from "react-router-dom"
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

function Layout({cart}) {
  return (
    <>
      <Header cart={cart}/>
      <Outlet />
      <Footer />
    </>
  )
}

function App() {
  const [cart, setCart] = useState([])

  useEffect(() => {

    api.get('/cart')
      .then(res => setCart(res.data.items))
      .catch(() => setCart([]))

  }, [])

  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route element={<Layout cart={cart}/>}>
            <Route path='/' element={<Dashboard cart={cart} setCart={setCart}/>}></Route>
            <Route path="/cart" element={<ProtectedRoute> <Cart cart={cart} setCart={setCart} /> </ProtectedRoute>}></Route>
            <Route path="/profile" element={<ProtectedRoute> <Profile setCart={setCart} /> </ProtectedRoute>} />
            <Route path="/address" element={<ProtectedRoute> <Address /> </ProtectedRoute>} />  
            <Route path="/checkout" element={<ProtectedRoute> <Checkout setCart={setCart}/> </ProtectedRoute>} />
            <Route path="/product/:id" element={<ProtectedRoute> <ProductDetail setCart={setCart}/> </ProtectedRoute>} />
            <Route path="/category/:slug" element={ <CategoryProduct />} />
            <Route path="/about-us" element={ <AboutUs /> } /> 
            <Route path="/order/:id" element={<ProtectedRoute> <OrderDetail /> </ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={1000} />

    </>
  )
}

export default App;
