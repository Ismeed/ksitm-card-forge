import { useRef } from "react";
import { Camera } from "lucide-react";

interface Props { value: string; onChange: (data: string) => void; }

export default function PhotoUpload({ value, onChange }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Max 2MB"); return; }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <div className="flex items-center gap-4">
      <button type="button" onClick={() => ref.current?.click()}
        className="relative w-28 h-28 rounded-full p-[3px] bg-gradient-orange shadow-glow-orange hover:scale-105 transition-transform">
        <div className="w-full h-full rounded-full bg-secondary overflow-hidden flex items-center justify-center">
          {value ? <img src={value} alt="" className="w-full h-full object-cover" />
            : <Camera className="w-8 h-8 text-muted-foreground" />}
        </div>
      </button>
      <div className="text-sm text-muted-foreground">
        <div className="font-semibold text-foreground">Passport Photograph</div>
        <div>Front-facing · Max 2MB · JPG/PNG</div>
      </div>
      <input ref={ref} type="file" accept="image/jpeg,image/png" className="hidden" onChange={onPick} />
    </div>
  );
}
