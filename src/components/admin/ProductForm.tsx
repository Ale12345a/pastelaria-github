
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Category = {
  id: string;
  name: string;
};

type ProductFormProps = {
  categories: Category[];
};

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProductForm({ categories }: ProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleImagesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (files.some((file) => !allowedTypes.includes(file.type))) {
      setError("Seleciona apenas imagens JPG, PNG ou WebP.");
      event.target.value = "";
      return;
    }

    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      setError("Cada imagem não pode ultrapassar 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!categoryId) {
      setError("Seleciona uma categoria.");
      return;
    }

    if (!name.trim()) {
      setError("O nome do produto é obrigatório.");
      return;
    }

    const numericPrice = price.trim() === "" ? null : Number(price);

    if (
      numericPrice !== null &&
      (!Number.isFinite(numericPrice) || numericPrice < 0)
    ) {
      setError("Introduz um preço válido.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const slug = createSlug(name);

    const uploadedImages: { image_url: string; display_order: number }[] = [];

    for (const [index, image] of images.entries()) {
      const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `products/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("demo-bucket")
        .upload(filePath, image, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setError(`Erro ao carregar fotografia: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("demo-bucket")
        .getPublicUrl(filePath);

      uploadedImages.push({
        image_url: publicUrlData.publicUrl,
        display_order: index,
      });
    }

    const imageUrl = uploadedImages[0]?.image_url ?? null;

    const { data: newProduct, error: insertError } = await supabase
      .from("products")
      .insert({
        name: name.trim(),
        slug,
        category_id: categoryId,
        description: description.trim() || null,
        price: numericPrice,
        image_url: imageUrl,
        is_active: isActive,
        is_featured: isFeatured,
      })
      .select("id")
      .single();

    if (insertError || !newProduct) {
      setError(
        insertError?.code === "23505"
          ? "Já existe um produto com este nome. Altera ligeiramente o nome."
          : `Não foi possível guardar o produto: ${insertError?.message ?? "Erro desconhecido."}`
      );
      setLoading(false);
      return;
    }

    if (uploadedImages.length > 0) {
      const { error: imagesError } = await supabase
        .from("product_images")
        .insert(
          uploadedImages.map((image) => ({
            product_id: newProduct.id,
            image_url: image.image_url,
            display_order: image.display_order,
          }))
        );

      if (imagesError) {
        setError(
          `O produto foi criado, mas houve um erro ao guardar as fotografias: ${imagesError.message}`
        );
        setLoading(false);
        return;
      }
    }

    router.push("/admin/produtos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-[#68452f]"
        >
          Nome do produto *
        </label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={100}
          placeholder="Ex.: Pastel de nata"
          className="w-full rounded-lg border border-[#e5d8c8] px-4 py-3 text-[#4b3628] outline-none focus:border-[#a77b56]"
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="mb-2 block text-sm font-medium text-[#68452f]"
        >
          Categoria *
        </label>

        <select
          id="category"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          required
          className="w-full rounded-lg border border-[#e5d8c8] bg-white px-4 py-3 text-[#4b3628] outline-none focus:border-[#a77b56]"
        >
          <option value="">Seleciona uma categoria</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-[#68452f]"
        >
          Descrição
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="Descreve o produto..."
          className="w-full rounded-lg border border-[#e5d8c8] px-4 py-3 text-[#4b3628] outline-none focus:border-[#a77b56]"
        />
      </div>

      <div>
        <label
          htmlFor="price"
          className="mb-2 block text-sm font-medium text-[#68452f]"
        >
          Preço (€)
        </label>

        <input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="Ex.: 1.50"
          className="w-full rounded-lg border border-[#e5d8c8] px-4 py-3 text-[#4b3628] outline-none focus:border-[#a77b56]"
        />
      </div>

      <div>
        <label
          htmlFor="images"
          className="mb-2 block text-sm font-medium text-[#68452f]"
        >
          Fotografias do produto
        </label>

        <input
          id="images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleImagesChange}
          className="w-full rounded-lg border border-[#e5d8c8] bg-white p-3 text-sm text-[#4b3628]"
        />

        <p className="mt-2 text-xs text-[#8b735e]">
          Podes selecionar várias fotografias. Formatos permitidos: JPG, PNG
          e WebP. Tamanho máximo: 5 MB por fotografia. A primeira será a
          fotografia principal.
        </p>

        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {imagePreviews.map((preview, index) => (
              <div key={preview}>
                <img
                  src={preview}
                  alt={`Pré-visualização ${index + 1}`}
                  className="h-40 w-full rounded-xl border border-[#eadfd2] object-cover"
                />
                <p className="mt-1 text-xs text-[#8b735e]">
                  {index === 0 ? "Fotografia principal" : `Fotografia ${index + 1}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-3 text-sm text-[#68452f]">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="h-4 w-4 accent-[#79543a]"
          />
          Produto ativo (visível no website)
        </label>

        <label className="flex items-center gap-3 text-sm text-[#68452f]">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(event) => setIsFeatured(event.target.checked)}
            className="h-4 w-4 accent-[#79543a]"
          />
          Destacar produto na página inicial
        </label>
      </div>

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
        {loading ? "A guardar produto..." : "Guardar produto"}
      </button>
    </form>
  );
}
