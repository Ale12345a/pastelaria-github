
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Os Nossos Produtos",
  description:
    "Descobre a nossa pastelaria, bolos para ocasiões especiais, pequenos-almoços, caixas especiais e refeições ligeiras.",
};

export const instant = false;

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

type CategoryImage = {
  category_id: string;
  image_url: string;
  is_primary: boolean;
};

const fallbackImages: Record<string, string> = {
  "pastelaria-e-doces": "/images/products/pastelaria.svg",
  "bolos-para-momentos-especiais": "/images/products/pastelaria.svg",
  "pequenos-almoços": "/images/products/pastelaria.svg",
  "caixas-especiais": "/images/products/pastelaria.svg",
  "refeicoes-ligeiras": "/images/products/pastelaria.svg",
};

export default async function ProdutosPage() {
  await connection();

  const supabase = await createClient();

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .order("name");

  const { data: imagesData } = await supabase
    .from("category_images")
    .select("category_id, image_url, is_primary")
    .order("display_order", { ascending: true });

  const categories = (categoriesData ?? []) as Category[];
  const images = (imagesData ?? []) as CategoryImage[];

  return (
    <div className="bg-[#faf6ef]">
      <section className="bg-[#eee2d1] px-6 py-24 text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#a77d61]">
          O que temos para ti
        </span>

        <h1 className="mt-4 font-heading text-4xl text-[#49372c] md:text-6xl">
          Os nossos produtos
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#70513e]">
          Descobre as nossas sugestões, preparadas para acompanhar
          os teus momentos especiais.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-14 text-center">
          <h2 className="font-heading text-3xl text-[#49372c] md:text-4xl">
            Descobre as nossas categorias
          </h2>

          <p className="mt-4 text-[#70513e]">
            Escolhe uma categoria para descobrir as nossas fotografias.
          </p>
        </div>

        {categories.length === 0 ? (
          <p className="py-10 text-center text-[#70513e]">
            Ainda não existem categorias disponíveis.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const categoryImages = images.filter(
                (image) => image.category_id === category.id
              );

              const primaryImage = categoryImages.find(
                (image) => image.is_primary
              );

              const categoryImage =
                primaryImage ?? categoryImages[0];

              const image =
                categoryImage?.image_url ??
                fallbackImages[category.slug] ??
                "/images/products/pastelaria.svg";

              return (
                <Link
                  key={category.id}
                  href={`/produtos/${category.slug}`}
                  className="group overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-lg"
                >
                  <div className="relative h-72">
                    <Image
                      src={image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                      unoptimized={image.startsWith("http")}
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="font-heading text-xl text-[#49372c]">
                      {category.name}
                    </h3>

                    {category.description && (
                      <p className="mt-3 text-sm leading-6 text-[#70513e]">
                        {category.description}
                      </p>
                    )}

                    <span className="mt-5 inline-block font-semibold text-[#a77d61] underline underline-offset-4">
                      Ver fotografias
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="bg-white px-6 py-16 text-center">
        <h2 className="font-heading text-3xl text-[#49372c]">
          Tens uma ocasião especial?
        </h2>

        <p className="mx-auto mt-4 max-w-xl leading-7 text-[#70513e]">
          Fala connosco e descobre as possibilidades para a tua
          próxima celebração.
        </p>

        <Link
          href="/encomendas"
          className="mt-8 inline-block rounded-full bg-[#70513e] px-8 py-4 text-white transition hover:bg-[#49372c]"
        >
          Fazer uma encomenda
        </Link>
      </section>
    </div>
  );
}
