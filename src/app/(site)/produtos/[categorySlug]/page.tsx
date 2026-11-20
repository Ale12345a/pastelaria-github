
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CategoryImageGallery from "@/components/products/CategoryImageGallery";

export const instant = false;

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

type CategoryImage = {
  id: string;
  image_url: string;
  alt_text: string | null;
};

type Props = {
  params: Promise<{ categorySlug: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  await connection();

  const { categorySlug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("categories")
    .select("name")
    .eq("slug", categorySlug)
    .maybeSingle();

  return {
    title: data?.name ?? "Produtos",
    description: data?.name
      ? `Descobre as fotografias de ${data.name}.`
      : "Descobre as fotografias da nossa pastelaria.",
  };
}

export default async function CategoriaPage({ params }: Props) {
  await connection();

  const { categorySlug } = await params;
  const supabase = await createClient();

  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .eq("slug", categorySlug)
    .maybeSingle();

  if (categoryError || !categoryData) {
    notFound();
  }

  const category = categoryData as Category;

  const { data: imagesData, error: imagesError } = await supabase
    .from("category_images")
    .select("id, image_url, alt_text")
    .eq("category_id", category.id)
    .order("display_order", { ascending: true });

  const images = (imagesData ?? []) as CategoryImage[];

  return (
    <main className="min-h-screen bg-[#faf6ef]">
      <section className="bg-[#eee2d1] px-6 py-20 text-center">
        <Link
          href="/produtos"
          className="text-sm font-semibold text-[#a77d61] hover:underline"
        >
          ← Voltar aos produtos
        </Link>

        <h1 className="mt-5 font-heading text-4xl text-[#49372c] md:text-6xl">
          {category.name}
        </h1>

        {category.description && (
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#70513e]">
            {category.description}
          </p>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        {imagesError ? (
          <p className="py-10 text-center text-[#70513e]">
            Não foi possível carregar as fotografias. Tenta novamente mais tarde.
          </p>
        ) : images.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="font-heading text-2xl text-[#49372c]">
              Ainda não existem fotografias nesta categoria.
            </h2>

            <p className="mt-4 text-[#70513e]">
              Estamos a preparar novidades para ti.
            </p>

            <Link
              href="/produtos"
              className="mt-8 inline-block rounded-full bg-[#70513e] px-8 py-4 font-semibold text-white transition hover:bg-[#49372c]"
            >
              Ver outras categorias
            </Link>
          </div>
        ) : (
          <CategoryImageGallery images={images} />
        )}
      </section>
    </main>
  );
}
