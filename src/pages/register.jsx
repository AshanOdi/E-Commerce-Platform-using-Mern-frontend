import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AuthSidePanel from "../components/authSidePanel";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    if (pw !== confirmPw) {
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user",
        {
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: pw,
          // role and image are not sent — backend default will be used
        }
      );

      toast.success("Registration Successful");

      // Optionally auto-login or redirect after register:
      navigate("/login");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Registration Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex w-full flex-1">
      <AuthSidePanel />
      <div className="flex w-full flex-1 items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-pink-950/40 dark:via-background dark:to-purple-950/40 px-4 py-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <img
              src="/logo-icon.png"
              alt="Store logo"
              className="mx-auto mb-2 h-16 w-16 rounded-full object-cover"
            />
            <CardTitle className="font-heading text-2xl">Create your account</CardTitle>
            <CardDescription>Join us for personalized skincare picks</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                    type="text"
                    placeholder="Jane"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    type="text"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

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

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  onChange={(e) => setConfirmPw(e.target.value)}
                  value={confirmPw}
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" disabled={submitting} className="mt-2 h-11">
                {submitting ? "Creating account…" : "Register"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
