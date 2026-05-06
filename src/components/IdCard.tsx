import { QRCodeSVG } from "qrcode.react";
import KsitmLogo from "./KsitmLogo";
import { getCollegeColor, type ProgrammeLevel, type ProgrammeMode } from "@/lib/programmes";

export interface IdCardData {
  application_type: "student" | "staff";
  first_name: string; middle_name?: string; last_name: string;
  photo_url?: string; photo_data?: string;
  signature_url?: string; signature_data?: string;
  reference_number?: string;
  // student
  programme?: string; college?: string; matric_number?: string;
  current_level?: string; session?: string;
  programme_level?: ProgrammeLevel; student_type?: ProgrammeMode;
  // staff
  designation?: string; department?: string; staff_id?: string;
  appointment_date?: string;
  // emergency
  emergency_contact_name?: string; emergency_contact_phone?: string;
}

interface Props { data: IdCardData; side?: "front" | "back"; scale?: number; }

// Credit card 85.6mm x 54mm at ~3.78px/mm = 324 x 204 baseline
export default function IdCard({ data, side = "front", scale = 1 }: Props) {
  const w = 540 * scale;
  const h = 340 * scale;
  const accent = getCollegeColor(data.application_type, data.programme_level, data.student_type, data.college);
  const isStudent = data.application_type === "student";
  const photo = data.photo_data || data.photo_url;
  const signature = data.signature_data || data.signature_url;
  const fullName = [data.first_name, data.middle_name, data.last_name].filter(Boolean).join(" ").toUpperCase();

  if (side === "back") {
    return (
      <div
        className="relative overflow-hidden rounded-2xl text-white holo-shimmer"
        style={{ width: w, height: h, background: 'var(--gradient-id-front)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="absolute inset-0 geo-pattern opacity-50" />
        <div className="relative h-full flex flex-col p-5">
          <div className="text-accent italic font-display text-lg">"Beyond Know How"</div>
          <div className="mt-3 text-[10px] leading-tight opacity-90">
            <div className="font-semibold">Katsina State Institute of Technology and Management</div>
            <div>P.M.B 2156, Katsina, Katsina State, Nigeria</div>
            <div>www.ksitm.edu.ng · info@ksitm.edu.ng</div>
          </div>
          <div className="mt-3 p-2 rounded-md bg-white/5 border border-white/10 text-[10px]">
            <div className="font-semibold text-accent uppercase tracking-wider">Emergency Contact</div>
            <div>{data.emergency_contact_name || "—"}</div>
            <div className="opacity-80">{data.emergency_contact_phone || "—"}</div>
          </div>
          <div className="mt-3 flex items-end justify-between flex-1">
            <div className="text-[9px] leading-tight max-w-[60%] opacity-90">
              This card remains the property of KSITM. If found, please return to the Registrar's Office.
              <div className="mt-1">Lost card: +234 803 000 0000</div>
            </div>
            {signature && (
              <div className="text-right">
                <img src={signature} alt="signature" className="h-10 object-contain inline-block bg-white/95 rounded px-1" />
                <div className="text-[8px] uppercase tracking-widest opacity-70 mt-1">Signature</div>
              </div>
            )}
          </div>
          <div className="mt-2 font-mono text-[9px] opacity-80">
            S/N: {data.reference_number || "KSITM-PENDING"}
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-orange" />
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl text-white holo-shimmer"
      style={{ width: w, height: h, background: 'var(--gradient-id-front)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="absolute inset-0 geo-pattern opacity-60" />
      {/* Header band */}
      <div className="relative bg-primary/90 backdrop-blur-sm px-4 py-2 flex items-center gap-2 border-b" style={{ borderColor: accent }}>
        <KsitmLogo size={28} />
        <div className="flex-1">
          <div className="text-[8px] font-bold tracking-widest uppercase leading-tight">Katsina State Institute of</div>
          <div className="text-[8px] font-bold tracking-widest uppercase leading-tight">Technology and Management</div>
        </div>
      </div>
      {/* Body */}
      <div className="relative px-4 py-3 flex gap-3">
        <div className="shrink-0">
          <div className="rounded-full p-[3px]" style={{ background: accent }}>
            <div className="rounded-full p-[2px] bg-white">
              {photo ? (
                <img src={photo} alt="photo" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-[9px] text-muted-foreground">PHOTO</div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-bold text-base leading-tight uppercase truncate">{fullName || "FULL NAME"}</div>
          <div className="mt-1 inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest"
            style={{ background: isStudent ? 'hsl(var(--accent))' : 'white', color: isStudent ? 'white' : 'hsl(var(--primary))' }}>
            {isStudent ? "Student" : "Staff"}
          </div>
          <div className="mt-2 space-y-0.5 text-[10px]">
            {isStudent ? (
              <>
                <div className="opacity-90"><span className="opacity-60">Programme:</span> {data.programme || "—"}</div>
                <div className="opacity-90"><span className="opacity-60">College:</span> {data.college || "—"}</div>
                <div className="font-mono text-accent text-[12px] mt-1">{data.matric_number || "MATRIC/NO"}</div>
                <div className="opacity-80 text-[9px]">{data.current_level || "—"} · Session {data.session || "—"}</div>
              </>
            ) : (
              <>
                <div className="opacity-90"><span className="opacity-60">Designation:</span> {data.designation || "—"}</div>
                <div className="opacity-90"><span className="opacity-60">Department:</span> {data.department || "—"}</div>
                <div className="font-mono text-accent text-[12px] mt-1">{data.staff_id || "STAFF/ID"}</div>
                <div className="opacity-80 text-[9px]">Appointed {data.appointment_date || "—"}</div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="absolute bottom-0 inset-x-0 px-4 py-2 flex items-end justify-between">
        <div className="text-[9px]">
          <div className="opacity-70">Valid: {data.session || "2024/2025"}</div>
          <div className="font-mono opacity-80">{data.reference_number || "KSITM-PENDING"}</div>
        </div>
        <div className="bg-white p-1 rounded">
          <QRCodeSVG value={data.reference_number || "KSITM-PENDING"} size={42} />
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-orange" />
    </div>
  );
}
