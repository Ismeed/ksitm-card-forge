import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApplicationStore } from "@/lib/applicationStore";
import { StepPersonal, StepStudentAcademic, StepStaffEmployment, StepEmergency } from "@/components/wizard/Steps";
import IdCard from "@/components/IdCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { publicSupabase as supabase } from "@/lib/publicSupabase";
import { toast } from "sonner";
import KsitmLogo from "@/components/KsitmLogo";
import { Link } from "react-router-dom";

const studentLabels = ["Personal", "Academic", "Emergency", "Review"];
const staffLabels = ["Personal", "Employment", "Emergency", "Review"];

async function uploadDataUrl(bucket: string, prefix: string, dataUrl: string) {
  const blob = await (await fetch(dataUrl)).blob();
  const ext = blob.type.includes("png") ? "png" : "jpg";
  const path = `${prefix}-${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, blob, { contentType: blob.type });
  if (error) throw error;
  return path;
}

export default function ApplyPage() {
  const { type } = useParams<{ type: "student" | "staff" }>();
  const navigate = useNavigate();
  const { draft, set, reset } = useApplicationStore();
  const [confirm, setConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isStaff = type === "staff";
  const labels = isStaff ? staffLabels : studentLabels;

  useEffect(() => {
    if (!type) return;
    if (draft.application_type !== type) reset(type);
  }, [type]);

  const step = draft.step;
  const next = () => set({ step: Math.min(4, step + 1) });
  const prev = () => set({ step: Math.max(1, step - 1) });

  const submit = async () => {
    if (!confirm) { toast.error("Please confirm the declaration"); return; }
    setSubmitting(true);
    try {
      // publicSupabase is a separate anon client — no need to sign out
      let photo_url: string | null = null;
      let signature_url: string | null = null;
      if (draft.photo_data) photo_url = await uploadDataUrl("applicant-photos", "p", draft.photo_data);
      if (draft.signature_data) signature_url = await uploadDataUrl("applicant-signatures", "s", draft.signature_data);

      const payload: any = {
        application_type: draft.application_type,
        first_name: draft.first_name, middle_name: draft.middle_name || null, last_name: draft.last_name,
        date_of_birth: draft.date_of_birth, gender: draft.gender, state_of_origin: draft.state_of_origin,
        phone: draft.phone, email: draft.email, photo_url, signature_url,
        emergency_contact_name: draft.emergency_contact_name,
        emergency_contact_relationship: draft.emergency_contact_relationship,
        emergency_contact_phone: draft.emergency_contact_phone,
      };
      if (isStaff) {
        Object.assign(payload, {
          staff_id: draft.staff_id, department: draft.department, designation: draft.designation,
          employment_type: draft.employment_type, appointment_date: draft.appointment_date, unit: draft.unit,
        });
      } else {
        Object.assign(payload, {
          student_type: draft.student_type, programme_level: draft.programme_level,
          college: draft.college, programme: draft.programme, matric_number: draft.matric_number,
          year_of_admission: draft.year_of_admission ? parseInt(draft.year_of_admission) : null,
          current_level: draft.current_level, session: draft.session,
        });
      }

      const { data, error } = await supabase.from("applications").insert(payload).select("reference_number").single();
      if (error) throw error;
      reset(type!);
      navigate(`/success/${data.reference_number}`);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Submission failed");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <KsitmLogo size={36} />
            <div>
              <div className="font-display font-bold leading-tight">KSITM</div>
              <div className="text-[10px] text-accent italic leading-tight">Beyond Know How</div>
            </div>
          </Link>
          <div className="text-sm text-muted-foreground">
            {isStaff ? "Staff" : "Student"} ID Application
          </div>
        </div>
      </header>

      <div className="container max-w-5xl pt-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div className="h-full bg-gradient-orange shadow-glow-orange"
              animate={{ width: `${(step / 4) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
          <div className="grid grid-cols-4 mt-3 text-xs">
            {labels.map((l, i) => (
              <div key={l} className={`text-center font-semibold ${i + 1 <= step ? "text-accent" : "text-muted-foreground"}`}>
                {i + 1}. {l}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="glass-panel rounded-2xl p-6 md:p-8">
            <h2 className="font-display text-2xl mb-6">{labels[step - 1]}</h2>
            {step === 1 && <StepPersonal />}
            {step === 2 && (isStaff ? <StepStaffEmployment /> : <StepStudentAcademic />)}
            {step === 3 && <StepEmergency />}
            {step === 4 && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-3 text-sm">
                  <div className="glass-panel rounded-lg p-4">
                    <div className="text-accent font-semibold uppercase tracking-wider text-xs mb-2">Personal</div>
                    <div>{draft.first_name} {draft.middle_name} {draft.last_name}</div>
                    <div className="text-muted-foreground">{draft.email} · {draft.phone}</div>
                    <div className="text-muted-foreground">{draft.gender} · {draft.state_of_origin} · {draft.date_of_birth}</div>
                  </div>
                  <div className="glass-panel rounded-lg p-4">
                    <div className="text-accent font-semibold uppercase tracking-wider text-xs mb-2">{isStaff ? "Employment" : "Academic"}</div>
                    {isStaff ? (
                      <>
                        <div>{draft.designation} · {draft.department}</div>
                        <div className="text-muted-foreground">Staff ID: {draft.staff_id} · {draft.employment_type}</div>
                        <div className="text-muted-foreground">Unit: {draft.unit} · Appointed: {draft.appointment_date}</div>
                      </>
                    ) : (
                      <>
                        <div>{draft.programme}</div>
                        <div className="text-muted-foreground">{draft.college}</div>
                        <div className="text-muted-foreground">Matric: {draft.matric_number} · {draft.current_level} · {draft.session}</div>
                      </>
                    )}
                  </div>
                  <div className="glass-panel rounded-lg p-4">
                    <div className="text-accent font-semibold uppercase tracking-wider text-xs mb-2">Emergency Contact</div>
                    <div>{draft.emergency_contact_name} ({draft.emergency_contact_relationship})</div>
                    <div className="text-muted-foreground">{draft.emergency_contact_phone}</div>
                  </div>
                  <label className="flex items-start gap-2 mt-4 cursor-pointer">
                    <Checkbox checked={confirm} onCheckedChange={(v) => setConfirm(!!v)} />
                    <span className="text-sm">I confirm all information provided is accurate and complete.</span>
                  </label>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Live Preview</div>
                  <div style={{ transform: 'scale(0.85)' }}><IdCard data={{ ...draft } as any} /></div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={prev} disabled={step === 1}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              {step < 4 ? (
                <Button onClick={next} className="bg-gradient-orange hover:opacity-90">
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={submit} disabled={submitting || !confirm}
                  className="bg-gradient-orange hover:opacity-90 pulse-orange">
                  <Send className="w-4 h-4 mr-2" /> {submitting ? "Submitting..." : "Submit Application"}
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
