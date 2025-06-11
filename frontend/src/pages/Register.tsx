import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function calculateAge(birthday: string) {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function Register() {
  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (email !== email2) {
      setError("Die E-Mail-Adressen stimmen nicht überein.");
      return;
    }
    if (calculateAge(birthday) < 18) {
      setError("Du musst mindestens 18 Jahre alt sein.");
      return;
    }
    // TODO: Implement registration logic (API call)
    // For now, just redirect to login
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-green-200 p-10">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-green-800 tracking-tight">Registrieren bei My Cargonaut</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-green-700 font-medium mb-1" htmlFor="vorname">Vorname</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z"/></svg>
                </span>
                <input
                  id="vorname"
                  type="text"
                  value={vorname}
                  onChange={(e) => setVorname(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-green-700 font-medium mb-1" htmlFor="nachname">Nachname</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z"/></svg>
                </span>
                <input
                  id="nachname"
                  type="text"
                  value={nachname}
                  onChange={(e) => setNachname(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-white"
                  required
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-green-700 font-medium mb-1" htmlFor="email">E-Mail</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2Z"/></svg>
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-green-700 font-medium mb-1" htmlFor="email2">E-Mail wiederholen</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2Z"/></svg>
                </span>
                <input
                  id="email2"
                  type="email"
                  value={email2}
                  onChange={(e) => setEmail2(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-white"
                  required
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-green-700 font-medium mb-1" htmlFor="password">Passwort</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 17a2 2 0 100-4 2 2 0 000 4Zm6-6V9a6 6 0 10-12 0v2a2 2 0 00-2 2v5a2 2 0 002 2h12a2 2 0 002-2v-5a2 2 0 00-2-2Zm-2 0H8"/></svg>
              </span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-white"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-green-700 font-medium mb-1" htmlFor="birthday">Geburtstag</label>
            <input
              id="birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-white"
              required
            />
            <p className="text-xs text-green-500 mt-1">Du musst mindestens 18 Jahre alt sein.</p>
          </div>
          {error && <div className="text-red-600 text-sm text-center animate-pulse duration-200">{error}</div>}
          <Button
            type="submit"
            className="w-full bg-green-700 text-white font-semibold py-2.5 rounded-lg hover:bg-green-800 transition-colors border border-green-700 mt-2 shadow-md"
          >
            Registrieren
          </Button>
        </form>
        <div className="mt-8 text-center">
          <span className="text-green-700">Du hast schon ein Konto?</span>
          <a href="/login" className="ml-2 text-green-800 font-medium hover:underline">Anmelden</a>
        </div>
      </div>
    </div>
  );
} 