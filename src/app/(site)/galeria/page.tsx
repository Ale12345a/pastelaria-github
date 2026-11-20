
import type { Metadata } from "next";
import Image from "next/image";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Galeria",
  description:
    "Explora a nossa galeria e descobre diferentes produtos e criações.",
};

export const instant = false;

type GalleryItem = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  image_url: string;
  alt_text: string | null;
};

export default async function GaleriaPage() {
  await connection();

  const supabase = await createClient();

  const { data: galleryData, error } = await supabase
    .from("gallery")
    .select("id, title, category, description, image_url, alt_text")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const galleryItems = (galleryData ?? []) as GalleryItem[];

  return (
    <div className="bg-[#faf6ef]">
      <section className="bg-[#eee2d1] px-6 py-24 text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#a77d61]">
          Os nossos momentos
        </span>

        <h1 className="mt-4 font-heading text-4xl text-[#49372c] md:text-6xl">
          Galeria
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#70513e]">
          Descobre um pouco do nosso mundo através dos nossos produtos,
          criações e momentos especiais.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl text-[#49372c] md:text-4xl">
            Um olhar sobre as nossas criações
          </h2>

          <p className="mt-4 text-[#70513e]">
            Cada criação conta uma história.
          </p>
        </div>

        {error ? (
          <p className="py-10 text-center text-[#70513e]">
            Não foi possível carregar a galeria. Tenta novamente mais tarde.
          </p>
        ) : galleryItems.length === 0 ? (
          <p className="py-10 text-center text-[#70513e]">
            Ainda não existem fotografias disponíveis na galeria.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-3xl bg-white shadow-sm"
              >
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.alt_text || item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                    unoptimized={item.image_url.startsWith("http")}
                  />
                </div>

                <div className="p-5">
                  {item.category && (
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#a77d61]">
                      {item.category}
                    </p>
                  )}

                  <h3 className="mt-2 font-heading text-xl text-[#49372c]">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="mt-3 text-sm leading-6 text-[#70513e]">
                      {item.description}
                    </p>
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
