
"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Category = {
  id: string;
  name: string;
};

type CategoryImage = {
  id: string;
  category_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
};

type Props = {
  categories: Category[];
  initialImages: CategoryImage[];
};

export default function CategoryImageManager({
  categories,
  initialImages,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState(
    categories[0]?.id ?? ""
  );

  const [images, setImages] = useState(initialImages);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  //const [primaryImageId, setPrimaryImageId] = useState<string | null>(null);
  const [savingPrimary, setSavingPrimary] = useState(false);
  const [message, setMessage] = useState("");

  const supabase = createClient();

  const categoryImages = images.filter(
    (image) => image.category_id === selectedCategory
  );

  async function handleUpload() {
    if (!selectedCategory || files.length === 0) {
      setMessage("Seleciona uma categoria e pelo menos uma fotografia.");
      return;
    }

    const invalidFile = files.find(
      (file) =>
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 5 * 1024 * 1024
    );

    if (invalidFile) {
      setMessage(
        "Utiliza apenas fotografias JPG, PNG ou WebP com um máximo de 5 MB cada."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    const uploadedImages: CategoryImage[] = [];

    try {
      for (const file of files) {
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const filePath = `category-images/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("demo-bucket")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from("demo-bucket")
          .getPublicUrl(filePath);

        const { data: imageData, error: insertError } = await supabase
          .from("category_images")
          .insert({
            category_id: selectedCategory,
            image_url: urlData.publicUrl,
            alt_text: file.name.replace(/\.[^/.]+$/, ""),
            display_order: images.length + uploadedImages.length,
            is_primary: false,
          })
          .select(
            "id, category_id, image_url, alt_text, display_order, is_primary"
          )
          .single();

        if (insertError) {
          throw insertError;
        }

        if (imageData) {
          uploadedImages.push(imageData as CategoryImage);
        }
      }

      setImages((current) => [...current, ...uploadedImages]);
      setFiles([]);
      setMessage("Fotografias adicionadas com sucesso!");
    } catch (error) {
      console.error(error);
      setMessage(
        "Ocorreu um erro ao carregar as fotografias. Verifica a ligação e tenta novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSetPrimary(image: CategoryImage) {
    setSavingPrimary(true);
    setMessage("");

    try {
      const { error: resetError } = await supabase
        .from("category_images")
        .update({ is_primary: false })
        .eq("category_id", selectedCategory);

      if (resetError) {
        throw resetError;
      }

      const { error: updateError } = await supabase
        .from("category_images")
        .update({ is_primary: true })
        .eq("id", image.id);

      if (updateError) {
        throw updateError;
      }

      setImages((current) =>
        current.map((item) => ({
          ...item,
          is_primary: item.id === image.id,
        }))
      );

      setMessage("Fotografia principal atualizada com sucesso!");
    } catch (error) {
      console.error(error);
      setMessage(
        "Não foi possível definir a fotografia principal. Tenta novamente."
      );
    } finally {
      setSavingPrimary(false);
    }
  }

  async function handleDelete(image: CategoryImage) {
    setDeletingImageId(image.id);
    setMessage("");

    const { error } = await supabase
      .from("category_images")
      .delete()
      .eq("id", image.id);

    if (error) {
      setMessage(`Não foi possível remover a fotografia: ${error.message}`);
      setDeletingImageId(null);
      return;
    }

    setImages((current) =>
      current.filter((item) => item.id !== image.id)
    );

    setImageToDelete(null);
    setDeletingImageId(null);
    setMessage("Fotografia removida da categoria.");
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-[#eadfd2] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#68452f]">
          Adicionar fotografias
        </h2>

        <p className="mt-2 text-sm text-[#8b735e]">
          Escolhe uma categoria e seleciona uma ou várias fotografias.
        </p>

        <div className="mt-6">
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-semibold text-[#68452f]"
          >
            Categoria
          </label>

          <select
            id="category"
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(event.target.value);
              setMessage("");
              setImageToDelete(null);
              //setPrimaryImageId(null);
            }}
            className="w-full rounded-lg border border-[#d8c5b2] bg-white px-4 py-3 text-[#68452f] outline-none focus:border-[#79543a]"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <label
            htmlFor="photos"
            className="mb-2 block text-sm font-semibold text-[#68452f]"
          >
            Fotografias
          </label>

          <input
            id="photos"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(event) =>
              setFiles(Array.from(event.target.files ?? []))
            }
            className="w-full rounded-lg border border-[#d8c5b2] p-3 text-sm text-[#68452f] file:mr-4 file:rounded-lg file:border-0 file:bg-[#eee2d1] file:px-4 file:py-2 file:font-semibold file:text-[#68452f]"
          />

          <p className="mt-2 text-xs text-[#8b735e]">
            Formatos JPG, PNG e WebP. Máximo de 5 MB por fotografia.
          </p>

          {files.length > 0 && (
            <p className="mt-3 text-sm font-medium text-[#79543a]">
              {files.length} fotografia(s) selecionada(s).
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleUpload}
          disabled={loading || files.length === 0 || !selectedCategory}
          className="mt-6 rounded-lg bg-[#79543a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#60412d] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "A carregar fotografias..." : "Adicionar fotografias"}
        </button>

        {message && (
          <p className="mt-4 text-sm font-medium text-[#79543a]" role="status">
            {message}
          </p>
        )}
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-[#68452f]">
            Fotografias existentes
          </h2>

          <p className="mt-1 text-sm text-[#8b735e]">
            {categoryImages.length} fotografia(s) nesta categoria.
          </p>

          <p className="mt-2 text-sm text-[#8b735e]">
            Escolhe uma fotografia para aparecer como imagem principal da
            categoria no website.
          </p>
        </div>

        {categoryImages.length === 0 ? (
          <div className="rounded-2xl border border-[#eadfd2] bg-white p-10 text-center">
            <p className="text-[#8b735e]">
              Ainda não existem fotografias nesta categoria.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categoryImages.map((image) => (
              <article
                key={image.id}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
                  image.is_primary
                    ? "border-[#79543a] ring-2 ring-[#79543a]/20"
                    : "border-[#eadfd2]"
                }`}
              >
                <div className="relative h-56">
                  <Image
                    src={image.image_url}
                    alt={image.alt_text || "Fotografia da categoria"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    unoptimized={image.image_url.startsWith("http")}
                  />

                  {image.is_primary && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#79543a] px-3 py-1.5 text-xs font-semibold text-white shadow">
                      Fotografia principal
                    </span>
                  )}
                </div>

                <div className="space-y-3 p-4">
                  <p className="truncate text-sm text-[#68452f]">
                    {image.alt_text || "Fotografia"}
                  </p>

                  {image.is_primary ? (
                    <p className="text-sm font-semibold text-[#79543a]">
                      Esta é a fotografia principal.
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(image)}
                      disabled={savingPrimary}
                      className="w-full rounded-lg bg-[#79543a] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#60412d] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {savingPrimary
                        ? "A atualizar..."
                        : "Definir como principal"}
                    </button>
                  )}

                  {imageToDelete === image.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(image)}
                        disabled={deletingImageId === image.id}
                        className="flex-1 rounded-lg bg-red-700 px-3 py-2 text-xs font-semibold text-white hover:bg-red-800 disabled:opacity-50"
                      >
                        {deletingImageId === image.id
                          ? "A remover..."
                          : "Confirmar remoção"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setImageToDelete(null)}
                        disabled={deletingImageId === image.id}
                        className="rounded-lg border border-[#d8c5b2] px-3 py-2 text-xs font-semibold text-[#68452f] disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setImageToDelete(image.id)}
                      className="w-full rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                    >
                      Remover fotografia
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
