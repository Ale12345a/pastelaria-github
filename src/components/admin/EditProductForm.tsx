
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  category_id: string;
};

type ProductImage = {
  id: string | null;
  image_url: string;
  display_order: number;
};

type EditProductFormProps = {
  product: Product;
  categories: Category[];
};

export default function EditProductForm({
  product,
  categories,
}: EditProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(product.name);
  const [categoryId, setCategoryId] = useState(product.category_id);
  const [description, setDescription] = useState(product.description ?? "");
  const [price, setPrice] = useState(
    product.price !== null ? String(product.price) : ""
  );

  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  const [imagesLoading, setImagesLoading] = useState(true);
  const [isActive, setIsActive] = useState(product.is_active);
  const [isFeatured, setIsFeatured] = useState(product.is_featured);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadImages() {
      const supabase = createClient();

      const { data, error: imagesError } = await supabase
        .from("product_images")
        .select("id, image_url, display_order")
        .eq("product_id", product.id)
        .order("display_order", { ascending: true });

      if (imagesError) {
        setError(
          `Não foi possível carregar as fotografias: ${imagesError.message}`
        );
        setImagesLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setExistingImages(data);
      } else if (product.image_url) {
        // Preservar a fotografia principal antiga, caso ainda não esteja na nova tabela.
        setExistingImages([
          {
            id: null,
            image_url: product.image_url,
            display_order: 0,
          },
        ]);
      }

      setImagesLoading(false);
    }

    loadImages();
  }, [product.id, product.image_url]);

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
    setNewImages((current) => [...current, ...files]);
    setNewImagePreviews((current) => [
      ...current,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);

    event.target.value = "";
  }

  function removeExistingImage(index: number) {
    const image = existingImages[index];

    if (image.id) {
      setRemovedImageIds((current) => [...current, image.id as string]);
    }

    setExistingImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index)
    );
  }

  function removeNewImage(index: number) {
    setNewImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index)
    );

    setNewImagePreviews((current) =>
      current.filter((_, imageIndex) => imageIndex !== index)
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("O nome do produto é obrigatório.");
      return;
    }

    if (!categoryId) {
      setError("Seleciona uma categoria.");
      return;
    }

    if (imagesLoading) {
      setError("Aguarda pelo carregamento das fotografias.");
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

    const uploadedImages: ProductImage[] = [];

    // Carregar as fotografias novas para o Storage.
    for (const [index, image] of newImages.entries()) {
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
        id: null,
        image_url: publicUrlData.publicUrl,
        display_order: existingImages.length + index,
      });
    }

    // Remover as associações das fotografias eliminadas.
    if (removedImageIds.length > 0) {
      const { error: deleteError } = await supabase
        .from("product_images")
        .delete()
        .in("id", removedImageIds);

      if (deleteError) {
        setError(
          `Não foi possível remover as fotografias: ${deleteError.message}`
        );
        setLoading(false);
        return;
      }
    }

    // Preparar as fotografias que devem continuar associadas ao produto.
    const finalImages = [...existingImages, ...uploadedImages];

    // Inserir fotografias novas e fotografias antigas ainda não migradas.
    const imagesToInsert = finalImages
      .filter((image) => image.id === null)
      .map((image, index) => ({
        product_id: product.id,
        image_url: image.image_url,
        display_order: existingImages.length + index,
      }));

    if (imagesToInsert.length > 0) {
      const { error: insertImagesError } = await supabase
        .from("product_images")
        .insert(imagesToInsert);

      if (insertImagesError) {
        setError(
          `Erro ao guardar as fotografias: ${insertImagesError.message}`
        );
        setLoading(false);
        return;
      }
    }

    const slug = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const mainImageUrl = finalImages[0]?.image_url ?? null;

    const { error: updateError } = await supabase
      .from("products")
      .update({
        name: name.trim(),
        slug,
        category_id: categoryId,
        description: description.trim() || null,
        price: numericPrice,
        image_url: mainImageUrl,
        is_active: isActive,
        is_featured: isFeatured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id);

    if (updateError) {
      setError(
        updateError.code === "23505"
          ? "Já existe outro produto com este nome. Altera ligeiramente o nome."
          : `Não foi possível atualizar o produto: ${updateError.message}`
      );
      setLoading(false);
      return;
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

        {imagesLoading ? (
          <p className="text-sm text-[#8b735e]">
            A carregar fotografias...
          </p>
        ) : (
          <>
            {existingImages.length > 0 && (
              <div className="mb-5">
                <p className="mb-3 text-sm font-medium text-[#68452f]">
                  Fotografias atuais:
                </p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {existingImages.map((image, index) => (
                    <div key={image.id ?? image.image_url}>
                      <img
                        src={image.image_url}
                        alt={`Fotografia atual ${index + 1}`}
                        className="h-40 w-full rounded-xl border border-[#eadfd2] object-cover"
                      />

                      <p className="mt-1 text-xs text-[#8b735e]">
                        {index === 0
                          ? "Fotografia principal"
                          : `Fotografia ${index + 1}`}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="mt-2 text-xs font-medium text-red-700 hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <input
              id="images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImagesChange}
              className="w-full rounded-lg border border-[#e5d8c8] bg-white p-3 text-sm text-[#4b3628]"
            />

            <p className="mt-2 text-xs text-[#8b735e]">
              Podes selecionar várias fotografias. Formatos permitidos: JPG,
              PNG e WebP. Tamanho máximo: 5 MB por fotografia.
            </p>

            {newImagePreviews.length > 0 && (
              <div className="mt-5">
                <p className="mb-3 text-sm font-medium text-[#68452f]">
                  Novas fotografias:
                </p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {newImagePreviews.map((preview, index) => (
                    <div key={preview}>
                      <img
                        src={preview}
                        alt={`Nova fotografia ${index + 1}`}
                        className="h-40 w-full rounded-xl border border-[#eadfd2] object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="mt-2 text-xs font-medium text-red-700 hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
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
        disabled={loading || imagesLoading}
        className="w-full rounded-lg bg-[#79543a] px-5 py-3 font-semibold text-white transition hover:bg-[#60412d] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "A guardar alterações..." : "Guardar alterações"}
      </button>
    </form>
  );
}
