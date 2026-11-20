
import { connection } from "next/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/admin";
import EditProductForm from "@/components/admin/EditProductForm";

export const instant = false;

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  await connection();

  const authorized = await isAdmin();

  if (!authorized) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const supabase = await createClient();

  const { data: product, error: productError } = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      price,
      image_url,
      is_active,
      is_featured,
      category_id
    `)
    .eq("id", id)
    .single();

  if (productError || !product) {
    notFound();
  }

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  if (categoriesError) {
    return (
      <main className="min-h-screen bg-[#f8f3eb] p-8">
        <div className="mx-auto max-w-3xl rounded-xl bg-red-50 p-5 text-red-700">
          Não foi possível carregar as categorias: {categoriesError.message}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3eb] p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10">
          <p className="text-sm font-medium text-[#a77b56]">
            PASTELARIA
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-[#68452f]">
            Editar produto
          </h1>

          <p className="mt-3 text-[#8b735e]">
            Altera os dados do produto abaixo.
          </p>

          <Link
            href="/admin/produtos"
            className="mt-6 inline-block rounded-lg border border-[#d8c5b2] px-5 py-2.5 text-sm font-semibold text-[#68452f] hover:bg-[#f3eadd]"
          >
            Voltar aos produtos
          </Link>
        </header>

        <section className="rounded-2xl border border-[#eadfd2] bg-white p-6 shadow-sm">
          <EditProductForm
            product={product}
            categories={categories ?? []}
          />
        </section>
      </div>
    </main>
  );
}
