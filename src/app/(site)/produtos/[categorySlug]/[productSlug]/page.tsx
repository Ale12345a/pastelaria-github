
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  category_id: string;
};

type Category = {
  name: string;
  slug: string;
};

type ProductImage = {
  id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
};

type Props = {
  params: Promise<{
    categorySlug: string;
    productSlug: string;
  }>;
};

async function getProduct(categorySlug: string, productSlug: string) {
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("slug", categorySlug)
    .maybeSingle();

  if (!category) return null;

  const { data: product } = await supabase
    .from("products")
    .select("id, name, slug, description, image_url, category_id")
    .eq("slug", productSlug)
    .eq("category_id", category.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!product) return null;

  const { data: images } = await supabase
    .from("product_images")
    .select("id, image_url, alt_text, display_order")
    .eq("product_id", product.id)
    .order("display_order", { ascending: true });

  const productImages = (images ?? []) as ProductImage[];

  if (productImages.length === 0 && product.image_url) {
    productImages.push({
      id: "main-image",
      image_url: product.image_url,
      alt_text: product.name,
      display_order: 0,
    });
  }

  return {
    product: product as Product,
    category: category as Category,
    images: productImages,
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  await connection();

  const { categorySlug, productSlug } = await params;
  const result = await getProduct(categorySlug, productSlug);

  return {
    title: result?.product.name ?? "Produto",
    description:
      result?.product.description ??
      "Descobre os nossos produtos de pastelaria.",
  };
}

export default async function ProdutoPage({ params }: Props) {
  await connection();

  const { categorySlug, productSlug } = await params;
  const result = await getProduct(categorySlug, productSlug);

  if (!result) notFound();

  const { product, category, images } = result;

  return (
    <main className="min-h-screen bg-[#faf6ef]">
      <section className="bg-[#eee2d1] px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href={`/produtos/${category.slug}`}
            className="text-sm font-semibold text-[#a77d61] hover:underline"
          >
            ← Voltar a {category.name}
          </Link>

          <h1 className="mt-6 font-heading text-4xl text-[#49372c] md:text-5xl">
            {product.name}
          </h1>

          {product.description && (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#70513e]">
              {product.description}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        {images.length === 0 ? (
          <div className="rounded-3xl bg-white px-6 py-16 text-center text-[#70513e] shadow-sm">
            Ainda não existem fotografias disponíveis para este produto.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative aspect-square overflow-hidden rounded-3xl bg-[#eee2d1] shadow-sm"
              >
                <Image
                  src={image.image_url}
                  alt={image.alt_text || product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-300 hover:scale-105"
                  unoptimized={image.image_url.startsWith("http")}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
