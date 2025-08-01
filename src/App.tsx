import { BrowserRouter, Route, Routes, } from "react-router-dom"
import DHPLoginPage from "./pages/Login"
import DHPRegisterPage from "./pages/Register"
import DHPHeroSection from "./pages/AboutUs"
import MarketPlace from "./pages/MarketPlace"
import HomePage from "./pages/HomePage"
import AboutUs from "./pages/AboutUs"
import DigRepo from "./pages/DigRepo"
import Elearning from './pages/Elearning';
import DHPDashboard from "./pages/Dashboard"
import AdminLogin from "./pages/adminLoginPage"
import { getUserInfo, isLoggedIn } from "./app/Localstorage"
import NotFound from "./comps/sharedComps/NotFound"
import ShoppingCartViewer from "./comps/MarketPlace/shoppingCart"




function App() {
  const tokenUser = isLoggedIn
  const isAdmin = getUserInfo?.type == 'admin' ? true : false;


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/elearning" element={<Elearning />} />
          <Route path="/resources" element={<DigRepo />} />
          <Route path="/market" element={<MarketPlace />} />
          <Route path="/market/cart" element={tokenUser && !isAdmin ? <ShoppingCartViewer /> : <MarketPlace />} />
          <Route path="/about" element={<DHPHeroSection />} />
          <Route path="/login" element={tokenUser && !isAdmin ? <HomePage /> : <DHPLoginPage />} />
          <Route path="/admin/dashboard" element={tokenUser && isAdmin ? <DHPDashboard /> : <AdminLogin />} />
          <Route path="/dhp/admin/login" element={tokenUser && isAdmin ? <DHPDashboard /> : <AdminLogin />} />
          <Route path="/register" element={tokenUser && !isAdmin ? <HomePage /> : <DHPRegisterPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App