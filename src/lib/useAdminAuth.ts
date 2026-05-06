import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdminAuth() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id || null);
      if (session?.user) checkRole(session.user.id);
      else { setIsAdmin(false); setLoading(false); }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) { setUserId(data.session.user.id); checkRole(data.session.user.id); }
      else setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function checkRole(uid: string) {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "security_unit").maybeSingle();
    setIsAdmin(!!data);
    setLoading(false);
  }

  return { loading, isAdmin, userId };
}
