
-- Categorias
GRANT SELECT, INSERT, UPDATE, DELETE
ON public.categories TO authenticated;

CREATE POLICY "Administradores podem gerir categorias"
ON public.categories
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- Produtos
GRANT SELECT, INSERT, UPDATE, DELETE
ON public.products TO authenticated;

CREATE POLICY "Administradores podem gerir produtos"
ON public.products
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- Galeria
GRANT SELECT, INSERT, UPDATE, DELETE
ON public.gallery TO authenticated;

CREATE POLICY "Administradores podem gerir galeria"
ON public.gallery
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- Informações da pastelaria
GRANT SELECT, INSERT, UPDATE, DELETE
ON public.business_info TO authenticated;

CREATE POLICY "Administradores podem gerir informações"
ON public.business_info
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
