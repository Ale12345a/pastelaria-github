
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type CategoryImage = {
  id: string;
  image_url: string;
  alt_text: string | null;
};

type Props = {
  images: CategoryImage[];
};

export default function CategoryImageGallery({ images }: Props) {
  const [selectedImage, setSelectedImage] =
    useState<CategoryImage | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setSelectedImage(image)}
            aria-label={`Ampliar fotografia: ${image.alt_text || "Fotografia"}`}
            className="group relative block h-72 overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
          >
            <Image
              src={image.image_url}
              alt={image.alt_text || "Fotografia da categoria"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
              unoptimized={image.image_url.startsWith("http")}
            />
          </button>
        ))}
      </div>

      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fotografia ampliada"
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            aria-label="Fechar fotografia"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#49372c] transition hover:bg-[#eee2d1]"
          >
            ×
          </button>

          <div
            className="relative h-[85vh] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedImage.image_url}
              alt={selectedImage.alt_text || "Fotografia ampliada"}
              fill
              sizes="100vw"
              className="object-contain"
              unoptimized={selectedImage.image_url.startsWith("http")}
            />
          </div>
        </div>
      )}
    </>
  );
}
