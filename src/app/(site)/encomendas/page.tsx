
import type { Metadata } from "next";
import { connection } from "next/server";
import OrderForm from "@/components/orders/OrderForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Fazer uma Encomenda",
  description:
    "Faz a tua encomenda. Contacta-nos para bolos, produtos de pastelaria e ocasiões especiais.",
};

export const instant = false;

export default async function EncomendasPage() {
  await connection();

  const supabase = await createClient();

  const { data: businessInfo } = await supabase
    .from("business_info")
    .select("phone, address, opening_hours, whatsapp_url")
    .limit(1)
    .maybeSingle();

  return (
    <div className="bg-[#faf6ef]">
      <section className="bg-[#eee2d1] px-6 py-20 text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#a77d61]">
          Estamos à tua disposição
        </span>

        <h1 className="mt-4 font-heading text-4xl text-[#49372c] md:text-6xl">
          Faz a tua encomenda
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#70513e]">
          Tens uma ocasião especial ou simplesmente vontade de
          experimentar algo diferente? Envia-nos o teu pedido.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2">
        <div className="pt-4">
          <h2 className="font-heading text-3xl text-[#49372c]">
            Vamos preparar algo especial?
          </h2>

          <p className="mt-6 leading-8 text-[#70513e]">
            Preenche o formulário com os detalhes da tua encomenda.
            Depois, serás encaminhado para o nosso WhatsApp para
            enviares o pedido.
          </p>

          <div className="mt-10 space-y-6">
            {businessInfo?.phone && (
              <div>
                <h3 className="font-semibold text-[#49372c]">
                  Telefone / WhatsApp
                </h3>
                <p className="mt-1 text-[#70513e]">
                  {businessInfo.phone}
                </p>
              </div>
            )}

            {businessInfo?.address && (
              <div>
                <h3 className="font-semibold text-[#49372c]">
                  Morada
                </h3>
                <p className="mt-1 leading-7 text-[#70513e]">
                  {businessInfo.address}
                </p>
              </div>
            )}

            {businessInfo?.opening_hours && (
              <div>
                <h3 className="font-semibold text-[#49372c]">
                  Horário
                </h3>
                <p className="mt-1 whitespace-pre-line text-[#70513e]">
                  {businessInfo.opening_hours}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
          <h2 className="mb-8 font-heading text-2xl text-[#49372c]">
            Formulário de encomenda
          </h2>

          <OrderForm whatsappUrl={businessInfo?.whatsapp_url} />
        </div>
      </section>
    </div>
  );
}
