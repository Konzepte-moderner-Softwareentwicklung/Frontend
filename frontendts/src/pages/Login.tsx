import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Logo from "@/assets/SVG/semi_androidMyCargonaut.svg"

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-600 to-blue-500">
      <Card className="w-full max-w-md shadow-xl p-6">
        <div className="flex justify-center mb-6">
          <button
            className={cn(
              "text-lg font-medium transition-colors",
              mode === "login" ? "text-black" : "text-gray-400 hover:text-black"
            )}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <span className="mx-2 text-gray-300">|</span>
          <button
            className={cn(
              "text-lg font-medium transition-colors",
              mode === "register" ? "text-black" : "text-gray-400 hover:text-black"
            )}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>
        <CardContent>
          {mode === "login" ? <LoginForm /> : <RegisterForm />}
        </CardContent>
      </Card>
    </div>
  );
}

function LoginForm() {
  return (
    <>
    <form className="flex flex-col space-y-4">
      <img src={Logo} className="w-50 h-50 mx-auto"/>
      <p className="text-base">E-Mail:</p>
      <Input type="email" placeholder="Email" required />
      <p className="mt-2 text-base">Password:</p>
      <Input type="password" placeholder="Password" required />
      <Button className="mt-2"type="submit">Login</Button>
    </form>
    </>
  );
}

function RegisterForm() {
  return (
    <form className="flex flex-col space-y-4">
      <Input type="text" placeholder="Name" required />
      <Input type="email" placeholder="Email" required />
      <Input type="password" placeholder="Password" required />
      <Input type="password" placeholder="Confirm Password" required />
      <Button type="submit">Register</Button>
    </form>
  );
}
