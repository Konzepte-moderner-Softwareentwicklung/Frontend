import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar";
import Footer from "./components/footer";

import Home from "@/pages/Home.tsx";
import Chat from "@/pages/chat/chat.tsx";
import Drives from "@/pages/drives/Drives.tsx";
import Profile from "@/pages/profile/profile.tsx";
import DrivesDetail from "@/pages/drives/drivesOfferDetailPage.tsx"
import AGB from "./pages/AGB";
import Impressum from "./pages/Impressum";
import Kontakt from "./pages/Kontakt";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/drives" element={<Drives />} />
          <Route path="/drives/:id" element={<DrivesDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/agb" element={<AGB />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/kontakt" element={<Kontakt />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
