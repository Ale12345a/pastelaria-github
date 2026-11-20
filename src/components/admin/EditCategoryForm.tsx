
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Category = {
  id: string;
  name: string;
  description: string | null;
};

type EditCategoryFormProps = {
  category: Category;
};

export default function EditCategoryForm({
  category,
}: EditCategoryFormProps) {
  const router = useRouter();

  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(
    category.description ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("O nome da categoria é obrigatório.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const slug = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const { error: updateError } = await supabase
      .from("categories")
      .update({
        name: name.trim(),
        slug,
        description: description.trim() || null,
      })
      .eq("id", category.id);

    if (updateError) {
      setError(
        updateError.code === "23505"
          ? "Já existe outra categoria com esse nome ou identificador."
          : `Não foi possível atualizar a categoria: ${updateError.message}`
      );

      setLoading(false);
      return;
    }

    router.push("/admin/categorias");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="category-name"
          className="mb-2 block text-sm font-medium text-[#68452f]"
        >
          Nome da categoria *
        </label>

        <input
          id="category-name"
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
          htmlFor="category-description"
          className="mb-2 block text-sm font-medium text-[#68452f]"
        >
          Descrição
        </label>

        <textarea
          id="category-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          maxLength={500}
          className="w-full rounded-lg border border-[#e5d8c8] px-4 py-3 text-[#4b3628] outline-none focus:border-[#a77b56]"
        />
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
        {loading ? "A guardar alterações..." : "Guardar alterações"}
      </button>
    </form>
  );
}
