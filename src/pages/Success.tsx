import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Copy, CheckCircle2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import KsitmLogo from "@/components/KsitmLogo";

export default function Success() {
  const { ref } = useParams();
  const copy = () => { navigator.clipboard.writeText(ref || ""); toast.success("Reference copied"); };
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="glass-panel rounded-3xl p-8 md:p-12 max-w-lg w-full text-center">
        <motion.div initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }} className="flex justify-center mb-4">
          <KsitmLogo size={72} />
        </motion.div>
        <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-2" />
        <h1 className="font-display text-3xl mb-2">Application Submitted</h1>
        <p className="text-muted-foreground mb-6">Save your reference number — you'll need it to check your status.</p>
        <div className="bg-primary rounded-2xl p-6 mb-6 shadow-glow-purple">
          <div className="text-xs uppercase tracking-widest text-accent mb-2">Reference Number</div>
          <div className="font-mono text-2xl md:text-3xl font-bold text-gradient-orange break-all">{ref}</div>
          <Button onClick={copy} variant="outline" size="sm" className="mt-4">
            <Copy className="w-4 h-4 mr-2" /> Copy
          </Button>
        </div>
        <div className="flex justify-center mb-6">
          <div className="bg-white p-3 rounded-lg"><QRCodeSVG value={ref || ""} size={120} /></div>
        </div>
        <div className="flex gap-3 justify-center">
          <Link to="/"><Button variant="outline"><Home className="w-4 h-4 mr-2" />Home</Button></Link>
          <Link to={`/status?ref=${ref}`}><Button className="bg-gradient-orange">Check Status</Button></Link>
        </div>
        <div className="mt-6 text-accent italic text-sm">"Beyond Know How"</div>
      </motion.div>
    </div>
  );
}
