import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import IdCard from "@/components/IdCard";
import FlippableIdCard from "@/components/FlippableIdCard";
import { StatusPill } from "./Dashboard";
import { ArrowLeft, Check, X, Download, Copy } from "lucide-react";
import { toast } from "sonner";
import { exportCardToPdf } from "@/lib/pdfExport";

async function signedUrl(bucket: string, path?: string | null) {
  if (!path) return undefined;
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 3600);
  return data?.signedUrl;
}

export default function ApplicationDetail() {
  const { id } = useParams();
  const [app, setApp] = useState<any>(null);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [signatureUrl, setSignatureUrl] = useState<string | undefined>();
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const { data } = await supabase.from("applications").select("*").eq("id", id!).single();
    setApp(data);
    if (data) {
      setPhotoUrl(await signedUrl("applicant-photos", data.photo_url));
      setSignatureUrl(await signedUrl("applicant-signatures", data.signature_url));
    }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const update = async (status: "approved" | "rejected", note?: string) => {
    setBusy(true);
    const { error } = await supabase.from("applications").update({
      status, reviewer_note: note || null, reviewed_at: new Date().toISOString(),
    }).eq("id", id!);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Application ${status}`);
    load();
  };

  const copyMessage = () => {
    const msg = `Dear ${app.first_name} ${app.last_name}, your KSITM ID Card (Ref: ${app.reference_number}) has been approved. Please visit the Security Unit to collect your card. — KSITM Security Unit`;
    navigator.clipboard.writeText(msg);
    toast.success("Notification copied");
  };

  const downloadPdf = async () => {
    if (!frontRef.current || !backRef.current) return;
    await exportCardToPdf(frontRef.current, backRef.current, app.reference_number);
  };

  if (!app) return <div className="text-muted-foreground">Loading...</div>;

  const cardData = { ...app, photo_url: photoUrl, signature_url: signatureUrl };

  return (
    <div className="space-y-6">
      <Link to="/admin/applications" className="inline-flex items-center text-sm text-muted-foreground hover:text-accent">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </Link>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="font-mono text-sm text-accent">{app.reference_number}</div>
          <h1 className="font-display text-3xl">{app.first_name} {app.middle_name} {app.last_name}</h1>
          <div className="flex gap-2 mt-2">
            <StatusPill status={app.status} />
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary capitalize">{app.application_type}</span>
          </div>
        </div>
        {app.status === "approved" && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={copyMessage}><Copy className="w-4 h-4 mr-2" />Copy Notification</Button>
            <Button onClick={downloadPdf} className="bg-gradient-orange"><Download className="w-4 h-4 mr-2" />Download Card PDF</Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Section title="Personal">
            <Row k="Email" v={app.email} /><Row k="Phone" v={app.phone} />
            <Row k="DOB" v={app.date_of_birth} /><Row k="Gender" v={app.gender} />
            <Row k="State of Origin" v={app.state_of_origin} />
          </Section>
          {app.application_type === "student" ? (
            <Section title="Academic">
              <Row k="Programme" v={app.programme} /><Row k="College" v={app.college} />
              <Row k="Matric No" v={app.matric_number} /><Row k="Level" v={app.current_level} />
              <Row k="Session" v={app.session} /><Row k="Type" v={app.student_type} />
            </Section>
          ) : (
            <Section title="Employment">
              <Row k="Staff ID" v={app.staff_id} /><Row k="Designation" v={app.designation} />
              <Row k="Department" v={app.department} /><Row k="Unit" v={app.unit} />
              <Row k="Type" v={app.employment_type} /><Row k="Appointed" v={app.appointment_date} />
            </Section>
          )}
          <Section title="Emergency Contact">
            <Row k="Name" v={app.emergency_contact_name} />
            <Row k="Relationship" v={app.emergency_contact_relationship} />
            <Row k="Phone" v={app.emergency_contact_phone} />
          </Section>

          {app.status === "pending" && (
            <div className="glass-panel rounded-2xl p-5 space-y-3">
              <h3 className="font-semibold">Review Decision</h3>
              <Textarea placeholder="Rejection reason (only required when rejecting)..." value={reason} onChange={e => setReason(e.target.value)} />
              <div className="flex gap-2">
                <Button onClick={() => update("approved")} disabled={busy} className="flex-1 bg-gradient-orange">
                  <Check className="w-4 h-4 mr-2" />Approve
                </Button>
                <Button onClick={() => update("rejected", reason)} disabled={busy || !reason.trim()}
                  variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  <X className="w-4 h-4 mr-2" />Reject
                </Button>
              </div>
            </div>
          )}
          {app.reviewer_note && app.status === "rejected" && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm">
              <div className="font-semibold text-destructive mb-1">Rejection reason</div>
              {app.reviewer_note}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-6 sticky top-6 self-start">
          <FlippableIdCard data={cardData} scale={0.95} />
          {/* Hidden full-scale renders for PDF export */}
          <div style={{ position: "absolute", left: -10000, top: -10000 }}>
            <div ref={frontRef}><IdCard data={cardData} side="front" /></div>
            <div ref={backRef} className="mt-2"><IdCard data={cardData} side="back" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">{title}</div>
      <div className="space-y-1.5 text-sm">{children}</div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: any }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/40 pb-1.5 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right">{v ?? "—"}</span>
    </div>
  );
}
