
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Introduction() {
  const supabase = await createClient();

  const { data: businessInfo } = await supabase
    .from("business_info")
    .select("name")
    .limit(1)
    .maybeSingle();

  const name = businessInfo?.name ?? "Pastelaria";

  return (
    <section className="bg-[#faf6ef] px-6 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a77d61]">
            Bem-vindo à {name}
          </span>

          <h2 className="mt-5 font-heading text-3xl leading-tight text-[#49372c] md:text-5xl">
            O sabor dos pequenos momentos.
            <span className="mt-2 block text-[#a77d61]">
              A alegria das grandes ocasiões.
            </span>
          </h2>
        </div>

        <div>
          <p className="text-lg leading-8 text-[#70513e]">
            Há momentos que merecem ser acompanhados por algo especial.
            Na {name}, encontras pastelaria, padaria, bolos
            especiais e sugestões para diferentes ocasiões.
          </p>

          <p className="mt-5 text-lg leading-8 text-[#70513e]">
            Queremos tornar cada visita numa experiência agradável,
            com sabores para partilhar e momentos para recordar.
          </p>

          <Link
            href="/sobre"
            className="mt-8 inline-flex items-center gap-2 font-semibold text-[#a77d61] transition hover:text-[#49372c]"
          >
            Conhece a nossa história
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-3">
        {[
          {
            number: "01",
            title: "Dedicação",
            description: "A atenção aos detalhes faz a diferença.",
          },
          {
            number: "02",
            title: "Variedade",
            description: "Sugestões para diferentes gostos e ocasiões.",
          },
          {
            number: "03",
            title: "Momentos",
            description: "Sabores que acompanham o teu dia.",
          },
        ].map((item) => (
          <div
            key={item.number}
            className="rounded-2xl border border-[#e8dccf] bg-white p-7"
          >
            <span className="text-sm font-bold tracking-widest text-[#a77d61]">
              {item.number}
            </span>

            <h3 className="mt-4 font-heading text-2xl text-[#49372c]">
              {item.title}
            </h3>

            <p className="mt-3 leading-7 text-[#70513e]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
