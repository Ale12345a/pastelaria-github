
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function OrderSection() {
  const supabase = await createClient();

  const { data: businessInfo } = await supabase
    .from("business_info")
    .select("name, whatsapp_url")
    .limit(1)
    .maybeSingle();

  const name = businessInfo?.name ?? "Pastelaria";
  const whatsappUrl = businessInfo?.whatsapp_url;

  return (
    <section className="bg-[#eee2d1] px-6 py-24">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#70513e] px-8 py-16 text-center shadow-lg md:px-16">
        <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ead2ca]">
          Momentos especiais
        </span>

        <h2 className="mx-auto mt-5 max-w-3xl font-heading text-3xl leading-tight text-white md:text-5xl">
          Há momentos que merecem um sabor especial.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#f2e7df] md:text-lg">
          Um aniversário, uma celebração ou simplesmente uma surpresa
          para alguém especial. Conta-nos o que procuras e vamos
          ajudar-te a preparar a tua encomenda.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/encomendas"
            className="rounded-full bg-white px-8 py-4 font-semibold text-[#49372c] transition hover:bg-[#f1dfd5]"
          >
            Fazer uma encomenda
          </Link>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/60 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              Falar pelo WhatsApp
            </a>
          )}
        </div>

        <p className="mt-10 text-sm text-[#ead2ca]">
          {name} · Feito com dedicação, servido com carinho.
        </p>
      </div>
    </section>
  );
}
