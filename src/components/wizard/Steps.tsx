import { useApplicationStore } from "@/lib/applicationStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NIGERIAN_STATES, getProgrammes, findProgramme, STAFF_UNITS } from "@/lib/programmes";
import PhotoUpload from "@/components/PhotoUpload";
import SignaturePad from "@/components/SignaturePad";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function StepPersonal() {
  const { draft, set } = useApplicationStore();
  return (
    <div className="space-y-5">
      <PhotoUpload value={draft.photo_data} onChange={(d) => set({ photo_data: d })} />
      <div className="grid md:grid-cols-3 gap-4">
        <Field label="First Name"><Input value={draft.first_name} onChange={e => set({ first_name: e.target.value })} /></Field>
        <Field label="Middle Name"><Input value={draft.middle_name} onChange={e => set({ middle_name: e.target.value })} /></Field>
        <Field label="Last Name"><Input value={draft.last_name} onChange={e => set({ last_name: e.target.value })} /></Field>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Field label="Date of Birth"><Input type="date" value={draft.date_of_birth} onChange={e => set({ date_of_birth: e.target.value })} /></Field>
        <Field label="Gender">
          <Select value={draft.gender} onValueChange={v => set({ gender: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
          </Select>
        </Field>
        <Field label="State of Origin">
          <Select value={draft.state_of_origin} onValueChange={v => set({ state_of_origin: v })}>
            <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
            <SelectContent className="max-h-60">{NIGERIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Phone Number"><Input value={draft.phone} onChange={e => set({ phone: e.target.value })} placeholder="+234..." /></Field>
        <Field label="Email Address"><Input type="email" value={draft.email} onChange={e => set({ email: e.target.value })} /></Field>
      </div>
      <Field label="Signature">
        <SignaturePad value={draft.signature_data} onChange={(d) => set({ signature_data: d })} />
      </Field>
    </div>
  );
}

export function StepStudentAcademic() {
  const { draft, set } = useApplicationStore();
  const programmes = getProgrammes(draft.programme_level, draft.student_type);

  const onProgramme = (name: string) => {
    const p = findProgramme(name, draft.programme_level, draft.student_type);
    set({ programme: name, college: p?.college || "" });
  };
  const levels = draft.programme_level === "ND" ? ["ND1","ND2"] : ["HND1","HND2"];

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Student Type">
          <div className="flex rounded-lg overflow-hidden border border-border">
            {(["full_time","part_time"] as const).map(t => (
              <button key={t} type="button"
                onClick={() => { set({ student_type: t, programme: "", college: "" }); }}
                className={`flex-1 py-2 text-sm font-semibold transition ${draft.student_type === t ? "bg-accent text-accent-foreground" : "bg-secondary"}`}>
                {t === "full_time" ? "Full-Time" : "Part-Time"}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Programme Level">
          <div className="flex rounded-lg overflow-hidden border border-border">
            {(["ND","HND"] as const).map(l => (
              <button key={l} type="button"
                disabled={l === "HND" && draft.student_type === "part_time"}
                onClick={() => set({ programme_level: l, programme: "", college: "", current_level: l + "1" })}
                className={`flex-1 py-2 text-sm font-semibold transition disabled:opacity-30 ${draft.programme_level === l ? "bg-accent text-accent-foreground" : "bg-secondary"}`}>
                {l}
              </button>
            ))}
          </div>
        </Field>
      </div>
      <Field label="Programme">
        <Select value={draft.programme} onValueChange={onProgramme}>
          <SelectTrigger><SelectValue placeholder="Select programme" /></SelectTrigger>
          <SelectContent className="max-h-72">
            {programmes.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="College"><Input value={draft.college} disabled placeholder="Auto-filled" /></Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Matriculation Number"><Input value={draft.matric_number} onChange={e => set({ matric_number: e.target.value })} /></Field>
        <Field label="Year of Admission"><Input type="number" min={2000} max={2030} value={draft.year_of_admission} onChange={e => set({ year_of_admission: e.target.value })} /></Field>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Current Level">
          <Select value={draft.current_level} onValueChange={v => set({ current_level: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Session"><Input value={draft.session} onChange={e => set({ session: e.target.value })} placeholder="2024/2025" /></Field>
      </div>
    </div>
  );
}

export function StepStaffEmployment() {
  const { draft, set } = useApplicationStore();
  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Staff ID Number"><Input value={draft.staff_id} onChange={e => set({ staff_id: e.target.value })} /></Field>
        <Field label="Department"><Input value={draft.department} onChange={e => set({ department: e.target.value })} /></Field>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Designation / Job Title"><Input value={draft.designation} onChange={e => set({ designation: e.target.value })} /></Field>
        <Field label="Employment Type">
          <Select value={draft.employment_type} onValueChange={v => set({ employment_type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-Time">Full-Time</SelectItem>
              <SelectItem value="Part-Time">Part-Time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Date of First Appointment"><Input type="date" value={draft.appointment_date} onChange={e => set({ appointment_date: e.target.value })} /></Field>
        <Field label="College / Administrative Unit">
          <Select value={draft.unit} onValueChange={v => set({ unit: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{STAFF_UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
      </div>
    </div>
  );
}

export function StepEmergency() {
  const { draft, set } = useApplicationStore();
  return (
    <div className="space-y-5">
      <Field label="Emergency Contact Full Name"><Input value={draft.emergency_contact_name} onChange={e => set({ emergency_contact_name: e.target.value })} /></Field>
      <Field label="Relationship to Applicant"><Input value={draft.emergency_contact_relationship} onChange={e => set({ emergency_contact_relationship: e.target.value })} placeholder="Parent, Guardian, Spouse..." /></Field>
      <Field label="Emergency Contact Phone Number"><Input value={draft.emergency_contact_phone} onChange={e => set({ emergency_contact_phone: e.target.value })} /></Field>
    </div>
  );
}
