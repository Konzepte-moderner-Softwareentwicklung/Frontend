import { Button } from "@/components/ui/button"
import Navbar from "./components/navbar"
import { Routes, Route } from 'react-router-dom';
import Home from "@/pages/Home.tsx";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

  )
}

export default App
