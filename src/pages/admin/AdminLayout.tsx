import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import KsitmLogo from "@/components/KsitmLogo";
import { LayoutDashboard, FileText, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function AdminLayout() {
  const { loading, isAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin/login");
  }, [loading, isAdmin, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!isAdmin) return null;

  const logout = async () => { await supabase.auth.signOut(); navigate("/admin/login"); };

  const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/admin/applications", icon: FileText, label: "Applications" },
  ];

  const Sidebar = (
    <div className="h-full bg-[hsl(260_65%_8%)] border-r border-border flex flex-col w-60">
      <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 p-5 border-b border-border">
        <KsitmLogo size={36} />
        <div>
          <div className="font-display font-bold leading-tight">KSITM</div>
          <div className="text-[10px] uppercase tracking-widest text-accent">Security Unit</div>
        </div>
      </Link>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setOpen(false)}
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
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:block">{Sidebar}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative h-full">{Sidebar}</aside>
        </div>
      )}

      <main className="flex-1 relative min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[hsl(260_65%_8%)] border-b border-border">
          <button onClick={() => setOpen(true)} className="p-2 -ml-2 text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <KsitmLogo size={28} />
            <div className="text-xs uppercase tracking-widest text-accent">Security Unit</div>
          </div>
          <button onClick={logout} className="p-2 -mr-2 text-muted-foreground">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] overflow-hidden">
          <div className="font-display text-[200px] font-bold whitespace-nowrap">Beyond Know How</div>
        </div>
        <div className="relative z-10 p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>

        {/* Close button inside drawer */}
        {open && (
          <button onClick={() => setOpen(false)} className="fixed top-3 right-3 z-50 md:hidden p-2 bg-secondary rounded-lg">
            <X className="w-4 h-4" />
          </button>
        )}
      </main>
    </div>
  );
}
