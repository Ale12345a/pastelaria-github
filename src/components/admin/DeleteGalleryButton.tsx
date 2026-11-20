
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type DeleteGalleryButtonProps = {
  imageId: string;
  imageUrl: string;
  imageTitle: string;
};

export default function DeleteGalleryButton({
  imageId,
  imageUrl,
  imageTitle,
}: DeleteGalleryButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `Tens a certeza de que pretendes eliminar a fotografia "${imageTitle}"?`
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");

    const supabase = createClient();

    // Identificar o caminho da fotografia no Storage.
    let filePath: string;

    try {
      const url = new URL(imageUrl);
      const marker = "/object/public/demo-bucket/";
      const markerIndex = url.pathname.indexOf(marker);

      if (markerIndex === -1) {
        setError("Não foi possível identificar o ficheiro no Storage.");
        setLoading(false);
        return;
      }

      filePath = decodeURIComponent(
        url.pathname.substring(markerIndex + marker.length)
      );
    } catch {
      setError("O endereço da fotografia é inválido.");
      setLoading(false);
      return;
    }

    // Primeiro, eliminar o registo da tabela gallery.
    const { data, error: deleteError } = await supabase
      .from("gallery")
      .delete()
      .eq("id", imageId)
      .select("id");

    if (deleteError) {
      setError(`Não foi possível eliminar a fotografia: ${deleteError.message}`);
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      setError("A fotografia não foi encontrada ou não tens autorização.");
      setLoading(false);
      return;
    }

    // Depois, remover o ficheiro do Storage.
    const { error: storageError } = await supabase.storage
      .from("demo-bucket")
      .remove([filePath]);

    if (storageError) {
      setError(
        "A fotografia foi eliminada da galeria, mas não foi possível remover o ficheiro do Storage."
      );
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "A eliminar..." : "Eliminar"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
