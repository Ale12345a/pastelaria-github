CREATE TABLE public.category_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  category_id UUID NOT NULL
    REFERENCES public.categories(id)
    ON DELETE CASCADE,

  image_url TEXT NOT NULL,
  alt_text TEXT,

  display_order INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.category_images
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view category images"
ON public.category_images
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage category images"
ON public.category_images
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());