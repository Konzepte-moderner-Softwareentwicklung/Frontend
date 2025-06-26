import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "@/pages/Home.tsx";
import Chat from "@/components/pages/chat/chat.tsx";
import Drives from "@/components/pages/Drives.tsx";
import Profile from "@/components/pages/profile/profile.tsx";
import AGB from "./pages/AGB";
import Impressum from "./pages/Impressum";
import Kontakt from "./pages/Kontakt";
import Login from "./components/pages/login/Login";
import "./i18next/config"
import Register from "@/components/pages/register/Register.tsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/Drives" element={<Drives />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/agb" element={<AGB />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/kontakt" element={<Kontakt />} />
      <Route path="/register" element={<Register />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
