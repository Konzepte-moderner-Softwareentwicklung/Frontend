import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Offers from "@/pages/Offers";
import OfferDetail from "@/pages/OfferDetail";
import Register from "./pages/Register";
import Chats from "./pages/Chats";
import Chat from "@/components/Chat";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-svh bg-background">
          <Navigation />
          <main className="container mx-auto py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/chat/:offerId" element={<Chat />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/offers/:offerId" element={<OfferDetail />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
