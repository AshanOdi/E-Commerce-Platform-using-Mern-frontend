import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user/login",
        {
          email: email,
          password: pw,
        }
      );
      toast.success("Login Successful");
      login(response.data.token); // updates AuthContext's user state immediately

      // Role-based redirect: send admins to the admin dashboard, everyone
      // else to the storefront.
      if (response.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-row items-center justify-center bg-[url('/loginpage.jpg')] bg-cover bg-center">
      <div className="hidden h-full w-1/2 md:block" />
      <Card className="mx-4 w-full max-w-md bg-white/80 shadow-2xl backdrop-blur-md">
        <CardHeader className="text-center">
          <img
            src="/logo-icon.png"
            alt="Store logo"
            className="mx-auto mb-2 h-16 w-16 rounded-full object-cover"
          />
          <CardTitle className="font-heading text-2xl">Welcome back</CardTitle>
          <CardDescription>Log in to continue shopping</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                onChange={(e) => setPw(e.target.value)}
                value={pw}
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" disabled={submitting} className="mt-2 h-11">
              {submitting ? "Logging in…" : "Log In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
