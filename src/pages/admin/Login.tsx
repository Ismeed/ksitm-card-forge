import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "sonner";
import KsitmLogo from "@/components/KsitmLogo";
import { Shield } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password, options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (data.user) {
          // Self-assign security_unit role for first admin (production would gate this)
          await supabase.from("user_roles").insert({ user_id: data.user.id, role: "security_unit" });
        }
        toast.success("Account created. You can sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/admin");
      }
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-hero relative">
      <div className="absolute inset-0 geo-pattern opacity-50" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-8 w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-6">
          <KsitmLogo size={56} />
          <h1 className="font-display text-2xl mt-3 flex items-center gap-2"><Shield className="w-5 h-5 text-accent" />Security Unit Portal</h1>
          <div className="text-accent italic text-sm">Beyond Know How</div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
            <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
            <Input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-orange shadow-glow-orange">
            {loading ? "..." : mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
          <button type="button" onClick={() => setMode(m => m === "signin" ? "signup" : "signin")}
            className="text-xs text-muted-foreground hover:text-accent w-full text-center">
            {mode === "signin" ? "First admin? Create account" : "Have an account? Sign in"}
          </button>
        </form>
        <Link to="/" className="text-xs text-muted-foreground hover:text-accent block text-center mt-6">← Back to home</Link>
      </motion.div>
    </div>
  );
}
