import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Clock, XCircle, ArrowLeft } from "lucide-react";
import KsitmLogo from "@/components/KsitmLogo";

export default function Status() {
  const [params] = useSearchParams();
  const [ref, setRef] = useState(params.get("ref") || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const check = async (r = ref) => {
    if (!r.trim()) return;
    setLoading(true); setError(""); setResult(null);
    const { data, error } = await supabase.rpc("check_application_status", { _ref: r.trim() });
    setLoading(false);
    if (error || !data?.length) { setError("No application found with that reference."); return; }
    setResult(data[0]);
  };

  useEffect(() => { if (params.get("ref")) check(params.get("ref")!); /* eslint-disable-next-line */ }, []);

  const statusUI = (s: string) => {
    if (s === "approved") return { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", label: "Approved" };
    if (s === "rejected") return { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10 border-destructive/30", label: "Rejected" };
    return { icon: Clock, color: "text-accent", bg: "bg-accent/10 border-accent/30", label: "Pending Review" };
  };

  return (
    <div className="min-h-screen p-6">
      <div className="container max-w-2xl">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to home
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <KsitmLogo size={48} />
          <div>
            <h1 className="font-display text-2xl">Check Application Status</h1>
            <div className="text-accent italic text-sm">Beyond Know How</div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 mb-6">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Reference Number</label>
          <div className="flex gap-2 mt-2">
            <Input value={ref} onChange={e => setRef(e.target.value)} placeholder="KSITM-2025-00001"
              onKeyDown={e => e.key === "Enter" && check()} className="font-mono" />
            <Button onClick={() => check()} disabled={loading} className="bg-gradient-orange">
              {loading ? "..." : "Check"}
            </Button>
          </div>
          {error && <div className="text-destructive text-sm mt-3">{error}</div>}
        </div>

        {result && (() => {
          const ui = statusUI(result.status);
          const Icon = ui.icon;
          return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className={`glass-panel rounded-2xl p-6 border-2 ${ui.bg}`}>
              <div className="flex items-center gap-4">
                <Icon className={`w-12 h-12 ${ui.color}`} />
                <div className="flex-1">
                  <div className={`font-display text-xl ${ui.color}`}>{ui.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {result.first_name} {result.last_name?.[0]}. · {result.application_type === "staff" ? "Staff" : "Student"} ID
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Submitted {new Date(result.submitted_at).toLocaleString()}
                  </div>
                </div>
              </div>
              {result.status === "approved" && (
                <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm">
                  ✅ Your ID card is ready. Visit the Security Unit to collect your card.
                </div>
              )}
              {result.status === "rejected" && result.reviewer_note && (
                <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
                  <div className="font-semibold mb-1">Reason:</div>{result.reviewer_note}
                </div>
              )}
            </motion.div>
          );
        })()}

        <div className="mt-12 text-center text-accent italic text-sm">"Beyond Know How"</div>
      </div>
    </div>
  );
}
