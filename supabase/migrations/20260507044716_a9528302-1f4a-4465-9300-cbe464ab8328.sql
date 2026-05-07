
-- Bootstrap function: first authenticated user becomes security_unit admin
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid;
  admin_count int;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  SELECT count(*) INTO admin_count FROM public.user_roles WHERE role = 'security_unit';
  IF admin_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'security_unit')
      ON CONFLICT (user_id, role) DO NOTHING;
    RETURN true;
  END IF;
  RETURN false;
END;
$$;

-- Ensure public submissions work cleanly: drop/recreate explicit policies
DROP POLICY IF EXISTS "Public can submit applications" ON public.applications;
CREATE POLICY "Public can submit applications"
  ON public.applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Storage: ensure both anon & authenticated can upload
DROP POLICY IF EXISTS "Public upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Public upload signatures" ON storage.objects;
CREATE POLICY "Public upload photos" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'applicant-photos');
CREATE POLICY "Public upload signatures" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'applicant-signatures');
