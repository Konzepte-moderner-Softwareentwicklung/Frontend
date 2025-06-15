import Footer from "./components/footer"
import Navbar from "./components/navbar"
import { Routes, Route } from 'react-router-dom';
import Home from "@/pages/Home.tsx";

import AGB from "./pages/AGB"
import Impressum from "./pages/Impressum"
import Kontakt from "./pages/Kontakt"
import Login from "./pages/Login"

function App() {
  return (
    <>
    <Navbar/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    <Footer/>
    </>


  )
}

export default App
