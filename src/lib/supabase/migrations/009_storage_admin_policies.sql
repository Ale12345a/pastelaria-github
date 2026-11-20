
-- Permitir aos administradores listar imagens
CREATE POLICY "Administradores podem listar imagens"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'demo-bucket'
  AND public.is_admin()
);

-- Permitir aos administradores carregar imagens
CREATE POLICY "Administradores podem carregar imagens"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'demo-bucket'
  AND public.is_admin()
);

-- Permitir aos administradores atualizar imagens
CREATE POLICY "Administradores podem atualizar imagens"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'demo-bucket'
  AND public.is_admin()
)
WITH CHECK (
  bucket_id = 'demo-bucket'
  AND public.is_admin()
);

-- Permitir aos administradores eliminar imagens
CREATE POLICY "Administradores podem eliminar imagens"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'demo-bucket'
  AND public.is_admin()
);
