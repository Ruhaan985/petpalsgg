-- Convert has_role from SECURITY DEFINER to SECURITY INVOKER.
-- RLS on user_roles ("Users can view their own roles": auth.uid() = user_id)
-- means has_role(auth.uid(), 'admin') still returns correctly for the caller.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$function$;

-- Re-grant execute (INVOKER requires callers to have EXECUTE; RLS is enforced on the underlying table)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- grant_admin_for_designated_email() stays SECURITY DEFINER (it's a trigger on auth.users
-- inserting into user_roles which authenticated cannot write). Ensure no direct EXECUTE.
REVOKE EXECUTE ON FUNCTION public.grant_admin_for_designated_email() FROM PUBLIC, anon, authenticated;