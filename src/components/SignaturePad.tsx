import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";

interface Props { value: string; onChange: (data: string) => void; }

export default function SignaturePad({ value, onChange }: Props) {
  const ref = useRef<SignatureCanvas>(null);
  const [tab, setTab] = useState<"draw" | "upload">("draw");

  const save = () => {
    if (!ref.current || ref.current.isEmpty()) return;
    onChange(ref.current.toDataURL("image/png"));
  };
  const clear = () => { ref.current?.clear(); onChange(""); };
  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(f);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 text-xs">
        <button type="button" onClick={() => setTab("draw")}
          className={`px-3 py-1 rounded-full border ${tab === "draw" ? "bg-accent text-accent-foreground border-accent" : "border-border"}`}>Draw</button>
        <button type="button" onClick={() => setTab("upload")}
          className={`px-3 py-1 rounded-full border ${tab === "upload" ? "bg-accent text-accent-foreground border-accent" : "border-border"}`}>Upload</button>
      </div>
      {tab === "draw" ? (
        <div className="space-y-2">
          <div className="rounded-lg border-2 border-primary bg-primary/30 overflow-hidden">
            <SignatureCanvas
              ref={ref}
              penColor="hsl(23 91% 60%)"
              canvasProps={{ width: 400, height: 140, className: "w-full h-[140px] block" }}
              onEnd={save}
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={clear}>Clear</Button>
            {value && <span className="text-xs text-muted-foreground self-center">✓ Captured</span>}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <input type="file" accept="image/*" onChange={onUpload}
            className="block w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-accent file:text-accent-foreground file:cursor-pointer" />
          {value && <img src={value} alt="signature" className="h-20 bg-white rounded p-1" />}
        </div>
      )}
    </div>
  );
}
