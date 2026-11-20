
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/admin";
import ProductForm from "@/components/admin/ProductForm";

export const instant = false;

export default async function NewProductPage() {
  await connection();

  const authorized = await isAdmin();

  if (!authorized) {
    redirect("/admin/login");
  }

  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  return (
    <main className="min-h-screen bg-[#f8f3eb] p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10">
          <p className="text-sm font-medium text-[#a77b56]">
            PASTELARIA
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-[#68452f]">
            Adicionar produto
          </h1>

          <p className="mt-3 text-[#8b735e]">
            Preenche os dados do novo produto.
          </p>

          <Link
            href="/admin/produtos"
            className="mt-6 inline-block rounded-lg border border-[#d8c5b2] px-5 py-2.5 text-sm font-semibold text-[#68452f] hover:bg-[#f3eadd]"
          >
            Voltar aos produtos
          </Link>
        </header>

        {error ? (
          <div className="rounded-xl bg-red-50 p-5 text-red-700">
            Erro ao carregar categorias: {error.message}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#eadfd2] bg-white p-6 shadow-sm">
            <ProductForm categories={categories ?? []} />
          </div>
        )}
      </div>
    </main>
  );
}
