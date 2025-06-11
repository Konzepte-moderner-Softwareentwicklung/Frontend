import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passkey, setPasskey] = useState("");
  const [authMode, setAuthMode] = useState<"password" | "passkey">("password");
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (token: string) => {
    setToken(token);
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (authMode === "passkey") {
        // TODO: Implement passkey authentication
        console.log("Passkey login attempt with email:", email);
        // Mock token for passkey
        const mockToken = "passkey_token_" + Date.now();
        await handleLogin(mockToken);
      } else {
        // TODO: Implement password authentication
        console.log("Password login attempt with:", { email, password });
        // Mock token for password login
        const mockToken = "password_token_" + Date.now();
        await handleLogin(mockToken);
      }
    } catch (error) {
      console.error("Login failed:", error);
      // TODO: Handle login error (show error message to user)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-green-200 p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-green-800">Sign in to My Cargonaut</h1>
        <div className="mb-6 flex justify-center gap-2">
          <button
            className={`px-4 py-2 rounded-l-lg border border-green-600 text-green-800 font-medium transition-colors ${authMode === 'password' ? 'bg-green-100' : 'bg-white hover:bg-green-50'}`}
            onClick={() => setAuthMode('password')}
            type="button"
          >
            Password
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg border border-green-600 text-green-800 font-medium transition-colors ${authMode === 'passkey' ? 'bg-green-100' : 'bg-white hover:bg-green-50'}`}
            onClick={() => setAuthMode('passkey')}
            type="button"
          >
            Passkey
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {authMode === 'password' && (
            <>
              <div>
                <label className="block text-green-700 font-medium mb-1" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-green-700 font-medium mb-1" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-white"
                  required
                />
              </div>
            </>
          )}
          {authMode === 'passkey' && (
            <div>
              <label className="block text-green-700 font-medium mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-white"
                required
              />
              {/* Passkey input as a placeholder, not required for login */}
              <input
                id="passkey"
                type="text"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-green-100 bg-green-50 mt-4 text-green-700 placeholder:text-green-400"
                placeholder="Passkey (not required, for demo only)"
                disabled
              />
            </div>
          )}
          <Button
            type="submit"
            className="w-full bg-green-700 text-white font-semibold py-2.5 rounded-lg hover:bg-green-800 transition-colors border border-green-700 mt-2"
          >
            Sign in
          </Button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-green-700">Don't have an account?</span>
          <a href="/register" className="ml-2 text-green-800 font-medium hover:underline">Register</a>
        </div>
      </div>
    </div>
  );
} 