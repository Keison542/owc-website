import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import { useStaffLogin } from "@workspace/api-client-react";

export default function StaffLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate: login, isPending } = useStaffLogin({
    mutation: {
      onSuccess: (data) => {
        localStorage.setItem("owc_staff_token", data.token);
        localStorage.setItem("owc_staff_user", JSON.stringify(data.user));
        navigate("/staff/dashboard");
      },
      onError: () => {
        setError("Invalid email or password. Please try again.");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    login({ data: { email, password } });
  };

  return (
    <div className="min-h-[100dvh] bg-secondary flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-4 mb-10 justify-center">
          <div className="w-14 h-14 bg-primary rounded flex items-center justify-center text-white font-serif font-bold text-2xl shadow">
            OWC
          </div>
          <div>
            <div className="font-serif font-bold text-xl text-white leading-none">Office of Workers Compensation</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Staff Portal</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-sm shadow-xl p-8">
          {/* Header with Back to Home link */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-serif font-bold">Staff Login</h1>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@owc.gov.pg"
                className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full border border-border rounded-sm px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-sm p-3 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary text-white py-3 rounded-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 text-sm"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          For access issues, contact the OWC IT Administrator.
        </p>
      </div>
    </div>
  );
}