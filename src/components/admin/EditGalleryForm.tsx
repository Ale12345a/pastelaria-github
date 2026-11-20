
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type GalleryImage = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  alt_text: string | null;
  is_active: boolean;
};

type EditGalleryFormProps = {
  image: GalleryImage;
};

export default function EditGalleryForm({
  image,
}: EditGalleryFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(image.title);
  const [description, setDescription] = useState(
    image.description ?? ""
  );
  const [category, setCategory] = useState(image.category ?? "");
  const [altText, setAltText] = useState(image.alt_text ?? "");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(image.is_active);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("O título é obrigatório.");
      return;
    }

    if (newImage) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedTypes.includes(newImage.type)) {
        setError("A fotografia deve estar em formato JPG, PNG ou WebP.");
        return;
      }

      if (newImage.size > 5 * 1024 * 1024) {
        setError("A fotografia não pode ultrapassar 5 MB.");
        return;
      }
    }

    setLoading(true);

    const supabase = createClient();

    let imageUrl = image.image_url;

    if (newImage) {
      const extension = newImage.name.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `gallery/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("demo-bucket")
        .upload(filePath, newImage);

      if (uploadError) {
        setError(`Erro ao carregar nova fotografia: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("demo-bucket")
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    const { error: updateError } = await supabase
      .from("gallery")
      .update({
        title: title.trim(),
        description: description.trim() || null,
        category: category.trim() || null,
        alt_text: altText.trim() || title.trim(),
        image_url: imageUrl,
        is_active: isActive,
      })
      .eq("id", image.id);

    if (updateError) {
      setError(`Não foi possível atualizar a fotografia: ${updateError.message}`);
      setLoading(false);
      return;
    }

    router.push("/admin/galeria");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium text-[#68452f]">
          Fotografia atual
        </p>

        <img
          src={image.image_url}
          alt={image.alt_text || image.title}
          className="h-56 w-full rounded-xl border border-[#eadfd2] object-cover"
        />
      </div>

      <div>
        <label
          htmlFor="gallery-title"
          className="mb-2 block text-sm font-medium text-[#68452f]"
        >
          Título *
        </label>

        <input
          id="gallery-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          maxLength={150}
          className="w-full rounded-lg border border-[#e5d8c8] px-4 py-3 text-[#4b3628] outline-none focus:border-[#a77b56]"
        />
      </div>

      <div>
        <label
          htmlFor="gallery-description"
          className="mb-2 block text-sm font-medium text-[#68452f]"
        >
          Descrição
        </label>

        <textarea
          id="gallery-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          maxLength={500}
          className="w-full rounded-lg border border-[#e5d8c8] px-4 py-3 text-[#4b3628] outline-none focus:border-[#a77b56]"
        />
      </div>

      <div>
        <label
          htmlFor="gallery-category"
          className="mb-2 block text-sm font-medium text-[#68452f]"
        >
          Categoria
        </label>

        <input
          id="gallery-category"
          type="text"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          maxLength={100}
          className="w-full rounded-lg border border-[#e5d8c8] px-4 py-3 text-[#4b3628] outline-none focus:border-[#a77b56]"
        />
      </div>

      <div>
        <label
          htmlFor="gallery-alt"
          className="mb-2 block text-sm font-medium text-[#68452f]"
        >
          Texto alternativo
        </label>

        <input
          id="gallery-alt"
          type="text"
          value={altText}
          onChange={(event) => setAltText(event.target.value)}
          maxLength={250}
          className="w-full rounded-lg border border-[#e5d8c8] px-4 py-3 text-[#4b3628] outline-none focus:border-[#a77b56]"
        />
      </div>

      <div>
        <label
          htmlFor="gallery-image"
          className="mb-2 block text-sm font-medium text-[#68452f]"
        >
          Substituir fotografia (opcional)
        </label>

        <input
          id="gallery-image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) =>
            setNewImage(event.target.files?.[0] ?? null)
          }
          className="w-full rounded-lg border border-[#e5d8c8] bg-white px-4 py-3 text-sm text-[#4b3628]"
        />

        <p className="mt-1 text-xs text-[#8b735e]">
          JPG, PNG ou WebP. Máximo 5 MB. Se não escolheres uma imagem, mantém-se a atual.
        </p>
      </div>

      <label className="flex items-center gap-3 text-sm text-[#68452f]">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
          className="h-4 w-4 accent-[#79543a]"
        />
        Apresentar esta fotografia no site
      </label>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#79543a] px-5 py-3 font-semibold text-white transition hover:bg-[#60412d] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "A guardar alterações..." : "Guardar alterações"}
      </button>
    </form>
  );
}
