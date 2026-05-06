import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusPill } from "./Dashboard";
import { Search } from "lucide-react";

export default function Applications() {
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [type, setType] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      let query = supabase.from("applications").select("*").order("submitted_at", { ascending: false });
      if (status !== "all") query = query.eq("status", status as any);
      if (type !== "all") query = query.eq("application_type", type as any);
      const { data } = await query.limit(200);
      let list = data || [];
      if (q.trim()) {
        const s = q.toLowerCase();
        list = list.filter((r: any) =>
          r.reference_number.toLowerCase().includes(s) ||
          (r.first_name + " " + r.last_name).toLowerCase().includes(s) ||
          (r.matric_number || "").toLowerCase().includes(s) ||
          (r.staff_id || "").toLowerCase().includes(s)
        );
      }
      setRows(list);
    };
    load();
  }, [q, status, type]);

  const exportCsv = () => {
    const headers = ["Reference","Name","Type","Programme/Designation","College/Dept","Status","Submitted"];
    const lines = [headers.join(",")];
    rows.forEach(r => lines.push([
      r.reference_number, `"${r.first_name} ${r.last_name}"`, r.application_type,
      `"${r.programme || r.designation || ""}"`, `"${r.college || r.department || ""}"`,
      r.status, new Date(r.submitted_at).toISOString()
    ].join(",")));
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `ksitm-applications-${Date.now()}.csv`; a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Applications</h1>
          <p className="text-muted-foreground text-sm">{rows.length} result(s)</p>
        </div>
        <button onClick={exportCsv} className="text-sm px-4 py-2 rounded-lg border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition">Export CSV</button>
      </div>

      <div className="glass-panel rounded-2xl p-4 grid md:grid-cols-4 gap-3">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search ref, name, matric, staff ID..." className="pl-9" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left p-3">Reference</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Programme / Designation</th>
              <th className="text-left p-3">Submitted</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t border-border hover:bg-primary/20 transition">
                <td className="p-3 font-mono text-xs">
                  <Link to={`/admin/applications/${r.id}`} className="text-accent hover:underline">{r.reference_number}</Link>
                </td>
                <td className="p-3">{r.first_name} {r.last_name}</td>
                <td className="p-3 capitalize">{r.application_type}</td>
                <td className="p-3 text-muted-foreground">{r.programme || r.designation || "—"}</td>
                <td className="p-3 text-muted-foreground text-xs">{new Date(r.submitted_at).toLocaleDateString()}</td>
                <td className="p-3"><StatusPill status={r.status} /></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} className="p-12 text-center text-muted-foreground">No applications match.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
