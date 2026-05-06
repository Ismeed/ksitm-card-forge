
-- Roles
CREATE TYPE public.app_role AS ENUM ('security_unit');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'security_unit'));

-- Enums
CREATE TYPE public.application_type AS ENUM ('student','staff');
CREATE TYPE public.application_status AS ENUM ('pending','approved','rejected');
CREATE TYPE public.student_mode AS ENUM ('full_time','part_time');
CREATE TYPE public.programme_level AS ENUM ('ND','HND');

-- Reference number sequence
CREATE SEQUENCE public.application_ref_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_reference_number()
RETURNS text LANGUAGE plpgsql AS $$
DECLARE
  next_val bigint;
BEGIN
  next_val := nextval('public.application_ref_seq');
  RETURN 'KSITM-' || to_char(now(), 'YYYY') || '-' || lpad(next_val::text, 5, '0');
END;
$$;

-- Applications
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number text UNIQUE NOT NULL DEFAULT public.generate_reference_number(),
  application_type public.application_type NOT NULL,
  status public.application_status NOT NULL DEFAULT 'pending',
  reviewer_note text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  first_name text NOT NULL,
  middle_name text,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL,
  state_of_origin text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  photo_url text,
  signature_url text,

  student_type public.student_mode,
  programme_level public.programme_level,
  college text,
  programme text,
  matric_number text,
  year_of_admission int,
  current_level text,
  session text,

  staff_id text,
  department text,
  designation text,
  employment_type text,
  appointment_date date,
  unit text,

  emergency_contact_name text NOT NULL,
  emergency_contact_relationship text NOT NULL,
  emergency_contact_phone text NOT NULL
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public submission)
CREATE POLICY "Public can submit applications" ON public.applications
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Admins can read all
CREATE POLICY "Admins read all applications" ON public.applications
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'security_unit'));

-- Admins can update
CREATE POLICY "Admins update applications" ON public.applications
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'security_unit'));

-- Public status check via SECURITY DEFINER function (limited fields)
CREATE OR REPLACE FUNCTION public.check_application_status(_ref text)
RETURNS TABLE (
  reference_number text,
  status public.application_status,
  application_type public.application_type,
  first_name text,
  last_name text,
  submitted_at timestamptz,
  reviewer_note text
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT reference_number, status, application_type, first_name, last_name, submitted_at, reviewer_note
  FROM public.applications WHERE reference_number = _ref LIMIT 1
$$;

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('applicant-photos','applicant-photos', false),
  ('applicant-signatures','applicant-signatures', false);

-- Anyone can upload to these buckets
CREATE POLICY "Public upload photos" ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'applicant-photos');
CREATE POLICY "Public upload signatures" ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'applicant-signatures');

-- Admins can read
CREATE POLICY "Admins read photos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'applicant-photos' AND public.has_role(auth.uid(), 'security_unit'));
CREATE POLICY "Admins read signatures" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'applicant-signatures' AND public.has_role(auth.uid(), 'security_unit'));
