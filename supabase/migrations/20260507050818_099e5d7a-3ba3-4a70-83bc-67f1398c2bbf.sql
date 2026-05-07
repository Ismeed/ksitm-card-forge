CREATE OR REPLACE FUNCTION public.submit_application(payload jsonb)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_ref text;
BEGIN
  INSERT INTO public.applications (
    application_type, first_name, middle_name, last_name, date_of_birth, gender, state_of_origin,
    phone, email, photo_url, signature_url,
    emergency_contact_name, emergency_contact_relationship, emergency_contact_phone,
    student_type, programme_level, college, programme, matric_number, year_of_admission, current_level, session,
    staff_id, department, designation, employment_type, appointment_date, unit
  ) VALUES (
    (payload->>'application_type')::application_type,
    payload->>'first_name', payload->>'middle_name', payload->>'last_name',
    (payload->>'date_of_birth')::date, payload->>'gender', payload->>'state_of_origin',
    payload->>'phone', payload->>'email', payload->>'photo_url', payload->>'signature_url',
    payload->>'emergency_contact_name', payload->>'emergency_contact_relationship', payload->>'emergency_contact_phone',
    NULLIF(payload->>'student_type','')::student_type,
    NULLIF(payload->>'programme_level','')::programme_level,
    payload->>'college', payload->>'programme', payload->>'matric_number',
    NULLIF(payload->>'year_of_admission','')::int,
    payload->>'current_level', payload->>'session',
    payload->>'staff_id', payload->>'department', payload->>'designation',
    payload->>'employment_type',
    NULLIF(payload->>'appointment_date','')::date,
    payload->>'unit'
  )
  RETURNING reference_number INTO new_ref;
  RETURN new_ref;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_application(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_application(jsonb) TO anon, authenticated;