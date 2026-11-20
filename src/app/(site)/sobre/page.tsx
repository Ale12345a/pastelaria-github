
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description:
    "Conhece a nossa pastelaria, os nossos produtos e aquilo que nos inspira.",
};

export const instant = false;

export default async function SobrePage() {
  await connection();

  const supabase = await createClient();

  const { data: businessInfo } = await supabase
    .from("business_info")
    .select("name, slogan, description")
    .limit(1)
    .maybeSingle();

  const name = businessInfo?.name ?? "Pastelaria";

  const slogan =
    businessInfo?.slogan ??
    "Cada dia tem o seu sabor. Cada momento merece ser especial.";

  const description =
    businessInfo?.description ??
    "Feito com dedicação, servido com carinho e pensado para tornar cada momento ainda mais especial.";

  return (
    <div className="bg-[#faf6ef]">
      <section className="bg-[#eee2d1] px-6 py-24 text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#a77d61]">
          Sobre nós
        </span>

        <h1 className="mt-4 font-heading text-4xl text-[#49372c] md:text-6xl">
          {name}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#70513e]">
          {slogan}
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl text-[#49372c] md:text-4xl">
            Mais do que uma pastelaria
          </h2>

          <p className="mt-8 text-lg leading-8 text-[#70513e]">
            {description}
          </p>

          <p className="mt-5 text-lg leading-8 text-[#70513e]">
            Pastelaria, padaria, bolos especiais e refeições ligeiras,
            sempre com o objetivo de tornar cada visita num momento
            agradável.
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-16 text-center">
        <h2 className="font-heading text-3xl text-[#49372c]">
          Cada momento merece ser especial
        </h2>

        <p className="mx-auto mt-4 max-w-xl leading-7 text-[#70513e]">
          Descobre os nossos produtos ou entra em contacto connosco
          para fazer a tua encomenda.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/produtos"
            className="rounded-full bg-[#70513e] px-7 py-4 text-white transition hover:bg-[#49372c]"
          >
            Ver produtos
          </Link>

          <Link
            href="/contactos"
            className="rounded-full border border-[#70513e] px-7 py-4 text-[#70513e] transition hover:bg-[#faf6ef]"
          >
            Contactar
          </Link>
        </div>
      </section>
    </div>
  );
}
