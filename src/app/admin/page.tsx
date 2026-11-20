
import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/supabase/admin";

export const instant = false;

const sections = [
  {
    title: "Produtos",
    description: "Adicionar, editar e remover produtos.",
    href: "/admin/produtos",
  },
  {
    title: "Categorias",
    description: "Gerir as categorias da pastelaria.",
    href: "/admin/categorias",
  },
  {
    title: "Galeria",
    description: "Gerir as fotografias da pastelaria.",
    href: "/admin/galeria",
  },
  {
    title: "Informações",
    description: "Atualizar contactos e informações comerciais.",
    href: "/admin/informacoes",
  },
];

export default async function AdminPage() {
  await connection();

  const authorized = await isAdmin();

  if (!authorized) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#f8f3eb] p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="text-sm font-medium text-[#a77b56]">
            PASTELARIA
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-[#68452f]">
            Painel de administração
          </h1>

          <p className="mt-3 text-[#8b735e]">
            Bem-vinda! Aqui poderás gerir os conteúdos da pastelaria.
          </p>

          <div className="mt-6">
            <LogoutButton />
          </div>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="block rounded-2xl border border-[#eadfd2] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#c9ad94] hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-[#68452f]">
                {item.title}
              </h2>

              <p className="mt-2 text-sm text-[#8b735e]">
                {item.description}
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-[#a77b56]">
                Gerir secção →
              </span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
