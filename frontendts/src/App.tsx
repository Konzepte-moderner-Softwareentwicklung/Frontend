
import Navbar from "./components/navbar"
import { Routes, Route } from "react-router-dom";

import Chat from "@/components/pages/chat/chat.tsx";
import Home from "@/components/pages/Home.tsx";
import Drives from "@/components/pages/Drives.tsx";
import Profile from "@/components/pages/profile/profile.tsx";

function App() {
  return (
    <>
    <Navbar/>
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<Home />} />
        <Route path="/Drives" element={<Drives/>} />
        <Route path="/profile" element={<Profile />} />
        </Routes>
    </>
  )
}

export default App
