
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id)
    ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Administradores podem consultar a lista"
ON public.admin_users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

GRANT SELECT ON public.admin_users TO authenticated;
