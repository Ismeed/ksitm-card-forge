import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";

function Counter({ value }: { value: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf: number; const start = performance.now();
    const animate = (t: number) => {
      const p = Math.min(1, (t - start) / 800);
      setN(Math.round(p * value));
      if (p < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{n}</>;
}

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [recent, setRecent] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase.from("applications")
      .select("id, reference_number, first_name, last_name, application_type, status, submitted_at")
      .order("submitted_at", { ascending: false }).limit(8);
    setRecent(data || []);
    const { data: all } = await supabase.from("applications").select("status");
    const s = { total: 0, pending: 0, approved: 0, rejected: 0 };
    (all || []).forEach((a: any) => { s.total++; (s as any)[a.status]++; });
    setStats(s);
  };

  useEffect(() => { load(); const i = setInterval(load, 60000); return () => clearInterval(i); }, []);

  const cards = [
    { label: "Total", value: stats.total, icon: FileText, color: "text-foreground" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-accent" },
    { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-destructive" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of ID card applications</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-panel rounded-2xl p-5 border-l-4 border-accent">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
              <c.icon className={`w-5 h-5 ${c.color}`} />
            </div>
            <div className={`font-display text-4xl mt-3 ${c.color}`}><Counter value={c.value} /></div>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl">Recent Applications</h2>
          <Link to="/admin/applications" className="text-xs text-accent hover:underline">View all →</Link>
        </div>
        <div className="space-y-2">
          {recent.length === 0 && <div className="text-sm text-muted-foreground py-8 text-center">No applications yet.</div>}
          {recent.map(r => (
            <Link key={r.id} to={`/admin/applications/${r.id}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition">
              <div>
                <div className="font-semibold">{r.first_name} {r.last_name}</div>
                <div className="text-xs text-muted-foreground font-mono">{r.reference_number}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary capitalize">{r.application_type}</span>
                <StatusPill status={r.status} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: any = {
    pending: "bg-accent/15 text-accent",
    approved: "bg-emerald-500/15 text-emerald-400",
    rejected: "bg-destructive/15 text-destructive",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${map[status]}`}>{status}</span>;
}
