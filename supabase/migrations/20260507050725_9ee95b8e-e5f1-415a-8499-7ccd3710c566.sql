GRANT INSERT ON public.applications TO anon, authenticated;
GRANT SELECT, UPDATE ON public.applications TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.application_ref_seq TO anon, authenticated;