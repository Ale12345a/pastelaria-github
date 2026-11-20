
import { connection } from "next/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/admin";
import EditCategoryForm from "@/components/admin/EditCategoryForm";

export const instant = false;

type EditCategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  await connection();

  const authorized = await isAdmin();

  if (!authorized) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const supabase = await createClient();

  const { data: category, error } = await supabase
    .from("categories")
    .select("id, name, description")
    .eq("id", id)
    .single();

  if (error || !category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8f3eb] p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10">
          <p className="text-sm font-medium text-[#a77b56]">
            PASTELARIA
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-[#68452f]">
            Editar categoria
          </h1>

          <p className="mt-3 text-[#8b735e]">
            Altera os dados da categoria abaixo.
          </p>

          <Link
            href="/admin/categorias"
            className="mt-6 inline-block rounded-lg border border-[#d8c5b2] px-5 py-2.5 text-sm font-semibold text-[#68452f] transition hover:bg-[#f3eadd]"
          >
            Voltar às categorias
          </Link>
        </header>

        <section className="rounded-2xl border border-[#eadfd2] bg-white p-6 shadow-sm">
          <EditCategoryForm category={category} />
        </section>
      </div>
    </main>
  );
}
