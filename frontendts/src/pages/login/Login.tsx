import { Card, CardContent } from "@/components/ui/card";
import {useState} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/SVG/semi_androidMyCargonaut.svg";
import { getUserID, login } from "@/api/user_api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await login(email, password);
      sessionStorage.setItem("token", result.token);
      toast("Login erfolgreich");
    } catch (error: any) {
      if (error.response?.status === 500) {
      toast("Server interner Fehler");
      } else {
      toast.error('Login fehlgeschlagen');
      }
    }
    try {
      const result = await getUserID();
      sessionStorage.setItem("UserID", result);
      if (result) {
        navigate("/");
      }
    } catch (error: any) {
      toast("Server interner Fehler");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-600 to-blue-500">
      <Card className="w-full max-w-md shadow-xl p-6">
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <img src={Logo} className="w-40 h-40 mx-auto" alt="Logo" />
            <label className="text-base">E-Mail:</label>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="text-base">Password:</label>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}