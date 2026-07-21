
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS enquiries_user_id_idx ON public.enquiries(user_id);

DROP POLICY IF EXISTS "Users can view their own enquiries" ON public.enquiries;
CREATE POLICY "Users can view their own enquiries"
ON public.enquiries FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
