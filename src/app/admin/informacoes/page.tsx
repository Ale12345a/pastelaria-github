
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/admin";
import BusinessInfoForm from "@/components/admin/BusinessInfoForm";

export const instant = false;

export default async function AdminInformacoesPage() {
  await connection();

  const admin = await isAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const supabase = await createClient();

  const { data: businessInfo, error } = await supabase
    .from("business_info")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Erro ao carregar informações:", error.message);
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <a
            href="/admin"
            className="text-sm text-[#8b5e3c] hover:underline"
          >
            ← Voltar ao painel
          </a>

          <h1 className="mt-4 text-3xl font-bold text-[#4a3024]">
            Informações da pastelaria
          </h1>

          <p className="mt-2 text-sm text-[#8b7767]">
            Gere os dados, contactos, apresentação e logótipo da pastelaria.
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Não foi possível carregar as informações da pastelaria.
            Verifica a ligação à base de dados e as permissões da tabela.
          </div>
        ) : (
          <BusinessInfoForm businessInfo={businessInfo} />
        )}
      </div>
    </main>
  );
}
