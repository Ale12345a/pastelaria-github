
import Link from "next/link";
import {
  CakeSlice,
  Croissant,
  Coffee,
  Wheat,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

const categoryStyles: Record<
  string,
  { icon: LucideIcon; color: string }
> = {
  pastelaria: {
    icon: Croissant,
    color: "bg-[#f1dfd5]",
  },
  bolos: {
    icon: CakeSlice,
    color: "bg-[#eadbd8]",
  },
  padaria: {
    icon: Wheat,
    color: "bg-[#eee2d1]",
  },
  "pequenos-almocos": {
    icon: Coffee,
    color: "bg-[#e5e2d3]",
  },
};

export default async function ProductCategories() {
  const supabase = await createClient();

  const { data: categoriesData, error } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .order("name");

  const categories = (categoriesData ?? []) as Category[];

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a77d61]">
            Descobre os nossos sabores
          </span>

          <h2 className="mt-4 font-heading text-3xl text-[#49372c] md:text-5xl">
            Um pouco de tudo, com muito carinho
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#70513e]">
            Explora as nossas categorias e descobre as opções
            disponíveis para os teus momentos especiais.
          </p>
        </div>

        {error ? (
          <p className="mt-14 text-center text-[#70513e]">
            Não foi possível carregar as categorias.
          </p>
        ) : categories.length === 0 ? (
          <p className="mt-14 text-center text-[#70513e]">
            Ainda não existem categorias disponíveis.
          </p>
        ) : (
          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const style = categoryStyles[category.slug] ?? {
                icon: Croissant,
                color: "bg-[#f1dfd5]",
              };

              const Icon = style.icon;

              return (
                <article
                  key={category.id}
                  className="group rounded-3xl border border-[#eee5dc] bg-[#faf6ef] p-7 transition duration-300 hover:-translate-y-2 hover:shadow-lg"
                >
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-2xl ${style.color}`}
                  >
                    <Icon
                      size={36}
                      strokeWidth={1.5}
                      className="text-[#70513e]"
                    />
                  </div>

                  <h3 className="mt-7 font-heading text-xl text-[#49372c]">
                    {category.name}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-[#70513e]">
                    {category.description ||
                      "Descobre as nossas sugestões nesta categoria."}
                  </p>

                  <Link
                    href={`/produtos/${category.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#a77d61] transition group-hover:text-[#49372c]"
                  >
                    Saber mais <span aria-hidden="true">→</span>
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-14 text-center">
          <Link
            href="/produtos"
            className="inline-block rounded-full bg-[#70513e] px-8 py-4 font-semibold text-white transition hover:bg-[#49372c]"
          >
            Ver todos os produtos
          </Link>
        </div>
      </div>
    </section>
  );
}
