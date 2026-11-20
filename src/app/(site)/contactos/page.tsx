
import type { Metadata } from "next";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export const metadata: Metadata = {
  title: "Contactos e Localização",
  description:
    "Entra em contacto connosco. Consulta os contactos e as informações disponíveis.",
};

export default async function ContactosPage() {
  await connection();

  const supabase = await createClient();

  const { data: businessInfo } = await supabase
    .from("business_info")
    .select(
      "name, address, phone, opening_hours, whatsapp_url, facebook_url, instagram_url"
    )
    .limit(1)
    .maybeSingle();

  const address = businessInfo?.address ?? "";

  const mapsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : null;

  return (
    <div className="bg-[#faf6ef]">
      <section className="bg-[#eee2d1] px-6 py-24 text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#a77d61]">
          Estamos aqui para ti
        </span>

        <h1 className="mt-4 font-heading text-4xl text-[#49372c] md:text-6xl">
          Contactos
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#70513e]">
          Gostavas de saber mais sobre os nossos produtos ou fazer uma
          encomenda? Entra em contacto connosco.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2">
        <div className="space-y-8">
          {address && (
            <div>
              <h2 className="font-heading text-2xl text-[#49372c]">
                Morada
              </h2>

              <p className="mt-3 leading-7 text-[#70513e]">
                {address}
              </p>

              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block font-semibold text-[#a77d61] underline underline-offset-4"
                >
                  Ver localização no Google Maps
                </a>
              )}
            </div>
          )}

          {(businessInfo?.phone || businessInfo?.whatsapp_url) && (
            <div>
              <h2 className="font-heading text-2xl text-[#49372c]">
                Telefone e WhatsApp
              </h2>

              {businessInfo?.phone && (
                <p className="mt-3 text-[#70513e]">
                  {businessInfo.phone}
                </p>
              )}

              {businessInfo?.whatsapp_url && (
                <a
                  href={businessInfo.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block font-semibold text-[#a77d61] underline underline-offset-4"
                >
                  Enviar mensagem pelo WhatsApp
                </a>
              )}
            </div>
          )}

          {businessInfo?.opening_hours && (
            <div>
              <h2 className="font-heading text-2xl text-[#49372c]">
                Horário
              </h2>

              <p className="mt-3 whitespace-pre-line text-[#70513e]">
                {businessInfo.opening_hours}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="font-heading text-2xl text-[#49372c]">
            Segue-nos nas redes sociais
          </h2>

          <p className="mt-4 leading-7 text-[#70513e]">
            Acompanha as nossas novidades, produtos e momentos especiais.
          </p>

          <div className="mt-8 space-y-5">
            {businessInfo?.facebook_url && (
              <a
                href={businessInfo.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl bg-[#eee2d1] px-6 py-4 font-semibold text-[#49372c] transition hover:bg-[#e3d2bd]"
              >
                Facebook
              </a>
            )}

            {businessInfo?.instagram_url && (
              <a
                href={businessInfo.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl bg-[#eee2d1] px-6 py-4 font-semibold text-[#49372c] transition hover:bg-[#e3d2bd]"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
