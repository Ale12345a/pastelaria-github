
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type DeleteCategoryButtonProps = {
  categoryId: string;
  categoryName: string;
};

export default function DeleteCategoryButton({
  categoryId,
  categoryName,
}: DeleteCategoryButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `Tens a certeza de que pretendes eliminar a categoria "${categoryName}"?`
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");

    const supabase = createClient();

    const { count, error: countError } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", categoryId);

    if (countError) {
      setError("Não foi possível verificar os produtos associados.");
      setLoading(false);
      return;
    }

    if (count && count > 0) {
      setError(
        "Não podes eliminar esta categoria enquanto existirem produtos associados. Altera primeiro a categoria desses produtos."
      );
      setLoading(false);
      return;
    }

    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (deleteError) {
      setError(`Não foi possível eliminar a categoria: ${deleteError.message}`);
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "A eliminar..." : "Eliminar"}
      </button>

      {error && (
        <p className="mt-2 max-w-xl text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
