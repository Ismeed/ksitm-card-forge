import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import KsitmLogo from "@/components/KsitmLogo";
import { GraduationCap, Briefcase, Search, Shield } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Nav */}
      <nav className="absolute top-0 inset-x-0 z-20">
        <div className="container flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <KsitmLogo size={44} />
            <div>
              <div className="font-display font-bold tracking-tight">KSITM</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">ID Card Portal</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/status"><Button variant="ghost" size="sm"><Search className="w-4 h-4 mr-1" />Check Status</Button></Link>
            <Link to="/admin/login"><Button variant="outline" size="sm"><Shield className="w-4 h-4 mr-1" />Security Unit</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-gradient-hero">
        <div className="absolute inset-0 geo-pattern opacity-50" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />

        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center pt-24 pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-block px-3 py-1 rounded-full border border-accent/40 bg-accent/10 text-xs uppercase tracking-widest text-accent mb-6">
              Katsina State Institute of Technology and Management
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] mb-4">
              Identity, <br />
              <motion.span className="text-gradient-orange inline-block"
                animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                Beyond Know How.
              </motion.span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mb-8">
              Apply for your official KSITM Student or Staff ID card. Fast, secure, and verified by the Security Unit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/apply/student">
                <Button size="lg" className="bg-gradient-orange shadow-glow-orange hover:scale-105 transition-transform w-full sm:w-auto">
                  <GraduationCap className="w-5 h-5 mr-2" /> Apply for Student ID
                </Button>
              </Link>
              <Link to="/apply/staff">
                <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground w-full sm:w-auto">
                  <Briefcase className="w-5 h-5 mr-2" /> Apply for Staff ID
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ duration: 0.9, delay: 0.2 }} className="hidden lg:flex justify-center">
            <div className="glass-panel rounded-3xl p-8 shadow-glow-purple">
              <PreviewCard />
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} KSITM · <span className="text-accent italic">Beyond Know How</span>
      </footer>
    </div>
  );
}

function PreviewCard() {
  // Sample preview using IdCard component
  const sample = {
    application_type: "student" as const,
    first_name: "Aisha", last_name: "Bello",
    programme: "HND Cyber Security and Data Protection",
    college: "College of Science and Technology",
    matric_number: "KSITM/HND/CYB/24/0042",
    current_level: "HND1", session: "2024/2025",
    programme_level: "HND" as const, student_type: "full_time" as const,
    reference_number: "KSITM-2025-00001",
  };
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const IdCard = require("@/components/IdCard").default;
  return <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }}><IdCard data={sample} /></div>;
}
