CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enquiry_id uuid REFERENCES public.enquiries(id) ON DELETE SET NULL,
  amount_paise integer NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'created',
  razorpay_order_id text NOT NULL,
  razorpay_payment_id text,
  items text[] NOT NULL DEFAULT '{}'::text[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX payments_razorpay_order_id_key ON public.payments (razorpay_order_id);
CREATE INDEX payments_enquiry_id_idx ON public.payments (enquiry_id);

GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all payments"
ON public.payments FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view payments for their own enquiries"
ON public.payments FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.enquiries e
  WHERE e.id = payments.enquiry_id AND e.user_id = auth.uid()
));

CREATE OR REPLACE FUNCTION public.set_payments_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.set_payments_updated_at() FROM anon, authenticated;

CREATE TRIGGER payments_set_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.set_payments_updated_at();