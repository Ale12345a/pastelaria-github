
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/admin";
import LogoutButton from "@/components/admin/LogoutButton";
import CategoryForm from "@/components/admin/CategoryForm";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

export const instant = false;

export default async function AdminCategoriesPage() {
  await connection();

  const authorized = await isAdmin();

  if (!authorized) {
    redirect("/admin/login");
  }

  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, created_at")
    .order("name", { ascending: true });

  return (
    <main className="min-h-screen bg-[#f8f3eb] p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="text-sm font-medium text-[#a77b56]">
            PASTELARIA
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-[#68452f]">
            Gestão de categorias
          </h1>

          <p className="mt-3 text-[#8b735e]">
            Consulta e gere as categorias dos produtos da pastelaria.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-lg border border-[#d8c5b2] px-5 py-2.5 text-sm font-semibold text-[#68452f] transition hover:bg-[#f3eadd]"
            >
              Voltar ao painel
            </Link>

            <LogoutButton />
          </div>
        </header>

        <section className="mb-8 rounded-2xl border border-[#eadfd2] bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-[#68452f]">
            Adicionar categoria
          </h2>

          <CategoryForm />
        </section>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#68452f]">
            Categorias existentes
          </h2>

          <p className="mt-1 text-sm text-[#8b735e]">
            {categories?.length ?? 0} categorias encontradas
          </p>
        </div>

        {error ? (
          <div className="rounded-xl bg-red-50 p-5 text-red-700">
            Erro ao carregar categorias: {error.message}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-[#eadfd2] bg-white shadow-sm">
            <div className="divide-y divide-[#f0e7dc]">
              {categories.map((category) => (
                <div key={category.id} className="p-5">
                  <h3 className="font-semibold text-[#68452f]">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-sm text-[#a77b56]">
                    Slug: {category.slug}
                  </p>

                  {category.description && (
                    <p className="mt-2 text-sm text-[#8b735e]">
                      {category.description}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={`/admin/categorias/${category.id}/editar`}
                      className="rounded-lg border border-[#d8c5b2] px-4 py-2 text-sm font-semibold text-[#68452f] transition hover:bg-[#f3eadd]"
                    >
                      Editar
                    </Link>

                    <DeleteCategoryButton
                      categoryId={category.id}
                      categoryName={category.name}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#eadfd2] bg-white p-10 text-center">
            <h3 className="text-lg font-semibold text-[#68452f]">
              Ainda não existem categorias
            </h3>

            <p className="mt-2 text-sm text-[#8b735e]">
              Não foram encontradas categorias na base de dados.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
