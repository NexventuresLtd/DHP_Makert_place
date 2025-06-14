import { BrowserRouter, Route, Routes, } from "react-router-dom"
import DHPLoginPage from "./pages/Login"
import DHPRegisterPage from "./pages/Register"
import DHPHeroSection from "./pages/AboutUs"
import MarketPlace from "./pages/MarketPlace"
import HomePage from "./pages/HomePage"
import AboutUs from "./pages/AboutUs"
import DigRepo from "./pages/DigRepo"
import Elearning from './pages/Elearning';



function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />}/>
      <Route path="/home" element={<HomePage />}/>
      <Route path="/about" element={<AboutUs/>}/>
      <Route path="/elearning" element={<Elearning/>}/>
      <Route path="/resources" element={<DigRepo/>}/>
      <Route path="/market" element={<MarketPlace/>}/>
      <Route path="/about" element={<DHPHeroSection/>}/>
      <Route path="/login" element={<DHPLoginPage/>}/>
      <Route path="/register" element={<DHPRegisterPage/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App