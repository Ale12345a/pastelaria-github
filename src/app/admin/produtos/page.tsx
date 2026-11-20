
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/admin";
import LogoutButton from "@/components/admin/LogoutButton";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import CategoryImageManager from "@/components/admin/CategoryImageManager";

export const instant = false;

type Category = {
  id: string;
  name: string;
};

type CategoryImage = {
  id: string;
  category_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
};

export default async function AdminProductsPage() {
  await connection();

  const authorized = await isAdmin();

  if (!authorized) {
    redirect("/admin/login");
  }

  const supabase = await createClient();

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  const { data: images, error: imagesError } = await supabase
    .from("category_images")
    .select("id, category_id, image_url, alt_text, display_order, is_primary")
    .order("display_order", { ascending: true });

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      price,
      is_active,
      is_featured,
      categories (
        name
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#f8f3eb] p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="text-sm font-medium text-[#a77b56]">
            PASTELARIA
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-[#68452f]">
            Gestão de fotografias
          </h1>

          <p className="mt-3 text-[#8b735e]">
            Gere as fotografias das categorias e os antigos registos de produtos.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-lg border border-[#d8c5b2] px-5 py-2.5 text-sm font-semibold text-[#68452f] hover:bg-[#f3eadd]"
            >
              Voltar ao painel
            </Link>

            <LogoutButton />
          </div>
        </header>

        {categoriesError || imagesError ? (
          <div className="rounded-xl bg-red-50 p-5 text-red-700">
            Não foi possível carregar as categorias ou fotografias.
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-[#8b735e]">
            Ainda não existem categorias disponíveis.
          </div>
        ) : (
          <CategoryImageManager
            categories={categories as Category[]}
            initialImages={(images ?? []) as CategoryImage[]}
          />
        )}

        <section className="mt-16">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#68452f]">
              Produtos antigos
            </h2>

            <p className="mt-1 text-sm text-[#8b735e]">
              Consulta, edita ou elimina os registos antigos de produtos.
            </p>
          </div>

          {productsError ? (
            <div className="rounded-xl bg-red-50 p-5 text-red-700">
              Erro ao carregar produtos: {productsError.message}
            </div>
          ) : products && products.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-[#eadfd2] bg-white shadow-sm">
              <div className="divide-y divide-[#f0e7dc]">
                {products.map((product) => {
                  const category = product.categories as unknown as
                    | { name: string }
                    | { name: string }[]
                    | null;

                  const categoryName = Array.isArray(category)
                    ? category[0]?.name ?? "Sem categoria"
                    : category?.name ?? "Sem categoria";

                  return (
                    <div
                      key={product.id}
                      className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#68452f]">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-sm text-[#a77b56]">
                          {categoryName}
                        </p>

                        {product.description && (
                          <p className="mt-2 text-sm text-[#8b735e]">
                            {product.description}
                          </p>
                        )}

                        <p className="mt-2 text-sm text-[#68452f]">
                          {product.price !== null
                            ? `${Number(product.price).toFixed(2)} €`
                            : "Preço não definido"}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href={`/admin/produtos/${product.id}/editar`}
                          className="rounded-lg border border-[#d8c5b2] px-4 py-2 text-sm font-semibold text-[#68452f] transition hover:bg-[#f3eadd]"
                        >
                          Editar
                        </Link>

                        <DeleteProductButton
                          productId={product.id}
                          productName={product.name}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#eadfd2] bg-white p-8 text-center text-[#8b735e]">
              Não existem produtos antigos.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
