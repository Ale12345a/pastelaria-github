
CREATE TABLE public.business_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Pastelaria',
  slogan TEXT,
  description TEXT,
  address TEXT,
  phone TEXT,
  opening_hours TEXT,
  whatsapp_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  logo_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.business_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Informações da pastelaria visíveis publicamente"
ON public.business_info
FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO public.business_info (name)
VALUES ('Pastelaria');
