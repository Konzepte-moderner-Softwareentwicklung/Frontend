import { Card, CardContent } from "@/components/ui/card.tsx";
import { useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import Logo from "@/assets/SVG/semi_androidMyCargonaut.svg";
import { DatePicker } from "@/components/DatePicker.tsx";
import { register } from "@/api/user_api.tsx";
import toast from "react-hot-toast";
import { Navigate, Router, useNavigate } from "react-router-dom";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [date, setDate] = useState<Date>();
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    toast("Passwörter stimmen nicht überein");
    return;
  }

  const today = new Date();
  const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  if (date && date > eighteenYearsAgo || date === undefined) {
    toast("Sie müssen mindestens 18 Jahre alt sein");
    return;
  }

  const pwRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
  if (!pwRegex.test(password)) {
    toast("Passwort muss mindestens einen Großbuchstaben und eine Ziffer enthalten");
    return;
  }

  try {
    const result = await register(firstName, lastName, email, password);
    console.log("Resultat:", result);
    if (result.status === 409) {
      toast("E-Mail bereits registriert");
      return;
    }
    toast("Registrierung erfolgreich");
    if (result?.id) {
        navigate("/login");
      }
  } catch (error: any) {
    if (error.response) {
      console.error("Server error:", error.response.status, error.response.data);
      alert("Registration failed: " + (error.response.data?.message || "Unknown error"));
    } else {
      console.error("Unexpected error:", error.message);
      alert("Something went wrong. Please try again.");
    }
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-600 to-blue-500">
      <Card className="w-full max-w-2xl shadow-xl p-6">
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-full flex justify-center">
              <img src={Logo} className="w-32 h-32" alt="Logo" />
            </div>

            {/* First Column */}
            <div>
              <label className="text-base">Vorname:</label>
              <Input
                type="text"
                placeholder="Vorname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-base">Nachname:</label>
              <Input
                type="text"
                placeholder="Nachname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-base">Password:</label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-base">E-Mail:</label>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-base">Confirm Password:</label>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-base">Geburtsdatum:</label>
              <DatePicker
                date={date}
                setDate={setDate}
                placeholder="Select login date"
              />
            </div>

            <div className="col-span-full">
              <Button type="submit" className="w-full">
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}