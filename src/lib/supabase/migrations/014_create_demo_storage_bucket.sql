-- Criar o bucket público para imagens da demonstração
INSERT INTO storage.buckets (id, name, public)
VALUES ('demo-bucket', 'demo-bucket', TRUE)
ON CONFLICT (id)
DO UPDATE SET public = TRUE;