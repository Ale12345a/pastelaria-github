
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function GalleryForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [altText, setAltText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("O título é obrigatório.");
      return;
    }

    if (!image) {
      setError("Seleciona uma fotografia.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(image.type)) {
      setError("A fotografia deve estar em formato JPG, PNG ou WebP.");
      return;
    }

    if (image.size > 5 * 1024 * 1024) {
      setError("A fotografia não pode ultrapassar 5 MB.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `gallery/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("demo-bucket")
      .upload(filePath, image);

    if (uploadError) {
      setError(`Erro ao carregar fotografia: ${uploadError.message}`);
      setLoading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("demo-bucket")
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase.from("gallery").insert({
      title: title.trim(),
      description: description.trim() || null,
      category: category.trim() || null,
      alt_text: altText.trim() || title.trim(),
      image_url: publicUrl,
      is_active: isActive,
    });

    if (insertError) {
      await supabase.storage.from("demo-bucket").remove([filePath]);

      setError(`Erro ao guardar fotografia: ${insertError.message}`);
      setLoading(false);
      return;
    }

    setTitle("");
    setDescription("");
    setCategory("");
    setAltText("");
    setImage(null);
    setIsActive(true);

    const fileInput = document.getElementById(
      "gallery-image"
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = "";
    }

    setSuccess("Fotografia adicionada com sucesso!");

    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          placeholder="Ex.: Pastéis de nata"
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
          rows={3}
          maxLength={500}
          placeholder="Uma pequena descrição da fotografia..."
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
          placeholder="Ex.: Pastelaria, Bolos, Espaço..."
          className="w-full rounded-lg border border-[#e5d8c8] px-4 py-3 text-[#4b3628] outline-none focus:border-[#a77b56]"
        />
      </div>

      <div>
        <label
          htmlFor="gallery-alt"
          className="mb-2 block text-sm font-medium text-[#68452f]"
        >
          Texto alternativo da fotografia
        </label>

        <input
          id="gallery-alt"
          type="text"
          value={altText}
          onChange={(event) => setAltText(event.target.value)}
          maxLength={250}
          placeholder="Descreve brevemente o que aparece na fotografia"
          className="w-full rounded-lg border border-[#e5d8c8] px-4 py-3 text-[#4b3628] outline-none focus:border-[#a77b56]"
        />
      </div>

      <div>
        <label
          htmlFor="gallery-image"
          className="mb-2 block text-sm font-medium text-[#68452f]"
        >
          Fotografia * (JPG, PNG ou WebP, máximo 5 MB)
        </label>

        <input
          id="gallery-image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) =>
            setImage(event.target.files?.[0] ?? null)
          }
          required
          className="w-full rounded-lg border border-[#e5d8c8] bg-white px-4 py-3 text-sm text-[#4b3628]"
        />
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

      {success && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#79543a] px-5 py-3 font-semibold text-white transition hover:bg-[#60412d] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "A carregar fotografia..." : "Adicionar fotografia"}
      </button>
    </form>
  );
}
