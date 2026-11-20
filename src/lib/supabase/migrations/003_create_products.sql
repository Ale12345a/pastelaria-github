
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id)
    ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(10, 2),
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT products_price_nonnegative
    CHECK (price IS NULL OR price >= 0)
);

CREATE INDEX products_category_id_idx
ON public.products(category_id);

CREATE INDEX products_display_order_idx
ON public.products(display_order);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Produtos ativos visíveis publicamente"
ON public.products
FOR SELECT
TO anon, authenticated
USING (is_active = TRUE);
