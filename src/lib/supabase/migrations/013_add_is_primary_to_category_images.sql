-- Adicionar indicação de imagem principal
ALTER TABLE public.category_images
ADD COLUMN is_primary BOOLEAN NOT NULL DEFAULT FALSE;

-- Garantir que cada categoria tem, no máximo,
-- uma imagem principal
CREATE UNIQUE INDEX category_images_one_primary_per_category
ON public.category_images (category_id)
WHERE is_primary = TRUE;