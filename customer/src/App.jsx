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

function Layout({search, setSearch, cart}) {
  return (
    <>
      <Header search={search} setSearch={setSearch} cart={cart}/>
      <Outlet />
      <Footer />
    </>
  )
}

function App() {
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState("")
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
  if (!token) {
    return  
  }

  api.get('/cart')
    .then(res => setCart(res.data.items))
    .catch(() => setCart([]))

}, [token])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route element={<Layout search={search} setSearch={setSearch} cart={cart}/>}>
          <Route path='/' element={<Dashboard search={search} cart={cart} setCart={setCart}/>}></Route>
          <Route path="/cart" element={<ProtectedRoute> <Cart cart={cart} setCart={setCart} /> </ProtectedRoute>}></Route>
          <Route path="/profile" element={<ProtectedRoute> <Profile setToken={setToken} setCart={setCart} /> </ProtectedRoute>} />
          <Route path="/address" element={<ProtectedRoute> <Address /> </ProtectedRoute>} />  
          <Route path="/checkout" element={<ProtectedRoute> <Checkout setCart={setCart}/> </ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute> <ProductDetail setCart={setCart}/> </ProtectedRoute>} />
          <Route path="/category/:slug" element={ <CategoryProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
