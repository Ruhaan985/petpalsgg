ALTER TABLE public.enquiries
  ADD COLUMN IF NOT EXISTS order_stage text,
  ADD COLUMN IF NOT EXISTS order_stage_note text,
  ADD COLUMN IF NOT EXISTS order_stage_updated_at timestamptz;

ALTER TABLE public.enquiries DROP CONSTRAINT IF EXISTS enquiries_order_stage_check;
ALTER TABLE public.enquiries ADD CONSTRAINT enquiries_order_stage_check
  CHECK (order_stage IS NULL OR order_stage IN ('ordered','shipped','out_for_delivery','delivered','ready_to_collect'));