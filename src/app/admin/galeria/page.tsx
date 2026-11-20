
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/admin";
import LogoutButton from "@/components/admin/LogoutButton";
import GalleryForm from "@/components/admin/GalleryForm";
import DeleteGalleryButton from "@/components/admin/DeleteGalleryButton";

export const instant = false;

export default async function AdminGalleryPage() {
  await connection();

  const authorized = await isAdmin();

  if (!authorized) {
    redirect("/admin/login");
  }

  const supabase = await createClient();

  const { data: images, error } = await supabase
    .from("gallery")
    .select(
      "id, title, description, image_url, category, alt_text, is_active, display_order, created_at"
    )
    .order("display_order", { ascending: true });

  return (
    <main className="min-h-screen bg-[#f8f3eb] p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="text-sm font-medium text-[#a77b56]">
            PASTELARIA
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-[#68452f]">
            Gestão da galeria
          </h1>

          <p className="mt-3 text-[#8b735e]">
            Consulta e gere as fotografias apresentadas na galeria do site.
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
            Adicionar fotografia
          </h2>

          <GalleryForm />
        </section>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#68452f]">
            Fotografias existentes
          </h2>

          <p className="mt-1 text-sm text-[#8b735e]">
            {images?.length ?? 0} fotografias encontradas
          </p>
        </div>

        {error ? (
          <div className="rounded-xl bg-red-50 p-5 text-red-700">
            Erro ao carregar fotografias: {error.message}
          </div>
        ) : images && images.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <article
                key={image.id}
                className="overflow-hidden rounded-2xl border border-[#eadfd2] bg-white shadow-sm"
              >
                <div className="aspect-[4/3] bg-[#f3eadd]">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || image.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-[#68452f]">
                    {image.title}
                  </h3>

                  {image.description && (
                    <p className="mt-2 text-sm text-[#8b735e]">
                      {image.description}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    {image.category && (
                      <span className="rounded-full bg-[#f3eadd] px-3 py-1 text-[#79543a]">
                        {image.category}
                      </span>
                    )}

                    <span
                      className={`rounded-full px-3 py-1 ${
                        image.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {image.is_active ? "Ativa" : "Inativa"}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/admin/galeria/${image.id}/editar`}
                      className="rounded-lg border border-[#d8c5b2] px-4 py-2 text-sm font-semibold text-[#68452f] transition hover:bg-[#f3eadd]"
                    >
                      Editar
                    </Link>

                    <DeleteGalleryButton
                      imageId={image.id}
                      imageUrl={image.image_url}
                      imageTitle={image.title}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#eadfd2] bg-white p-10 text-center">
            <h3 className="text-lg font-semibold text-[#68452f]">
              Ainda não existem fotografias
            </h3>

            <p className="mt-2 text-sm text-[#8b735e]">
              Quando adicionares fotografias, estas aparecerão aqui.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
