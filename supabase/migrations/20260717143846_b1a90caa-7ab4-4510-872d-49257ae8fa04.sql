ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS interested_items text[] NOT NULL DEFAULT '{}';

DROP POLICY IF EXISTS "Anyone can submit an enquiry" ON public.enquiries;

CREATE POLICY "Anyone can submit an enquiry" ON public.enquiries
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 100
  AND char_length(email) BETWEEN 3 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (phone IS NULL OR char_length(phone) <= 40)
  AND (pet_name IS NULL OR char_length(pet_name) <= 100)
  AND (message IS NULL OR char_length(message) <= 2000)
  AND status = 'pending'
  AND array_length(interested_items, 1) IS NULL OR array_length(interested_items, 1) <= 5
);