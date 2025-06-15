
import Navbar from "./components/navbar"
import { BrowserRouter, Route } from "react-router-dom";

import Chat from "@/components/pages/chat/chat.tsx";
import Home from "@/components/pages/Home.tsx";
import Drives from "@/components/pages/Drives.tsx";
import Profile from "@/components/pages/profile/profile.tsx";

function App() {
  return (
    <>
    <Navbar/>
      <BrowserRouter>
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<Home />} />
        <Route path="/Drives" element={<Drives/>} />
        <Route path="/profile" element={<Profile />} />
      </BrowserRouter>
    </>
  )
}

export default App
