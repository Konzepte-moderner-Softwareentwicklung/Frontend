import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar";
import Footer from "./components/footer";

import Home from "@/pages/Home.tsx";
import Chat from "@/pages/chat/chat.tsx";
import Drives from "@/pages/drives/Drives.tsx";
import Profile from "@/pages/profile/profile.tsx";
import DrivesDetail from "@/pages/drives/drivesOfferDetailPage.tsx"
import SearchDetail from "@/pages/drives/drivesSearchDetailPage.tsx"
import AGB from "./pages/AGB";
import Impressum from "./pages/Impressum";
import Kontakt from "./pages/Kontakt";
import Login from "./pages/Login/Login";
import Register from './pages/Register/Register';
import "./i18next/config"
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/drives" element={<Drives />} />
          <Route path="/drives/:id" element={<DrivesDetail />} />
          <Route path="/drives/:id/search" element={<SearchDetail/>}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/agb" element={<AGB />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/kontakt" element={<Kontakt />} />
      </Routes>
      <Toaster />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
