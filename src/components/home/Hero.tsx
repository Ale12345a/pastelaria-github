
import Link from "next/link";

type HeroProps = {
  slogan?: string | null;
  description?: string | null;
};

export default function Hero({
  slogan = "Cada dia tem o seu sabor. Cada momento merece ser especial.",
  description = "Feito com dedicação, servido com carinho e pensado para tornar cada momento ainda mais especial.",
}: HeroProps) {
  const sloganParts = (slogan ?? "").split(". ");
  const firstPart = sloganParts[0];
  const secondPart = sloganParts.length > 1
    ? sloganParts.slice(1).join(". ")
    : "";

  return (
    <section className="overflow-hidden bg-[#eee2d1]">
      <div className="mx-auto grid min-h-[580px] max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div className="max-w-xl">
          <span className="inline-block rounded-full border border-[#c9ad94] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a77d61]">
            Pastelaria · Padaria · Cafetaria
          </span>

          <h1 className="mt-8 font-heading text-5xl leading-tight text-[#49372c] md:text-6xl">
            {firstPart}
            {sloganParts.length > 1 && "."}
            {secondPart && (
              <span className="mt-2 block text-[#a77d61]">
                {secondPart}
              </span>
            )}
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-8 text-[#70513e]">
            {description}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/produtos"
              className="rounded-full bg-[#70513e] px-8 py-4 font-semibold text-white transition hover:bg-[#49372c]"
            >
              Descobrir produtos
            </Link>

            <Link
              href="/encomendas"
              className="rounded-full border border-[#70513e] px-8 py-4 font-semibold text-[#70513e] transition hover:bg-white"
            >
              Fazer encomenda
            </Link>
          </div>
        </div>

        <div className="relative flex min-h-[380px] items-center justify-center overflow-hidden rounded-[2rem] bg-[#e5cfc0] p-10">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#f4e6d9] opacity-70" />

          <div className="absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-[#cda990] opacity-40" />

          <div className="relative z-10 max-w-sm text-center">
            <span className="text-6xl">♡</span>

            <h2 className="mt-6 font-heading text-4xl text-[#49372c]">
              Feito com carinho
            </h2>

            <p className="mt-4 leading-7 text-[#70513e]">
              Pequenos prazeres, grandes momentos e sabores que
              ficam na memória.
            </p>

            <div className="mx-auto mt-8 h-px w-20 bg-[#a77d61]" />

            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#a77d61]">
              Pastelaria
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
