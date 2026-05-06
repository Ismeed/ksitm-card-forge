import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import KsitmLogo from "@/components/KsitmLogo";
import { LayoutDashboard, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function AdminLayout() {
  const { loading, isAdmin } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin/login");
  }, [loading, isAdmin, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!isAdmin) return null;

  const logout = async () => { await supabase.auth.signOut(); navigate("/admin/login"); };

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-[hsl(260_65%_8%)] border-r border-border flex flex-col">
        <Link to="/admin" className="flex items-center gap-2 p-5 border-b border-border">
          <KsitmLogo size={36} />
          <div>
            <div className="font-display font-bold leading-tight">KSITM</div>
            <div className="text-[10px] uppercase tracking-widest text-accent">Security Unit</div>
          </div>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {[
            { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
            { to: "/admin/applications", icon: FileText, label: "Applications" },
          ].map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                  isActive ? "bg-accent/15 text-accent border-l-2 border-accent" : "text-muted-foreground hover:bg-secondary"
                }`}>
              <item.icon className="w-4 h-4" /> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <Button onClick={logout} variant="ghost" size="sm" className="w-full justify-start">
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 relative">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] overflow-hidden">
          <div className="font-display text-[200px] font-bold whitespace-nowrap">Beyond Know How</div>
        </div>
        <div className="relative z-10 p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
