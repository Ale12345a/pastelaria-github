
import Link from "next/link";

type FooterProps = {
  name?: string | null;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  openingHours?: string | null;
  whatsappUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
};

export default function Footer({
  name = "Pastelaria",
  description = "Feito com dedicação, servido com carinho e pensado para tornar cada momento ainda mais especial.",
  address = null,
  phone = null,
  openingHours = null,
  whatsappUrl = null,
  facebookUrl = null,
  instagramUrl = null,
}: FooterProps) {
  return (
    <footer className="bg-[#49372c] px-6 py-10 text-[#faf6ef]">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row">
        <div>
          <h2 className="mb-3 text-2xl font-bold">{name}</h2>

          <p className="max-w-sm text-sm leading-6 text-[#e8dccd]">
            {description}
          </p>

          <div className="mt-4 flex flex-col gap-2 text-sm">
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                WhatsApp
              </a>
            )}

            {facebookUrl && (
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Facebook
              </a>
            )}

            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Instagram
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold">Contactos</h3>

          {phone && <p className="text-sm">{phone}</p>}

          {address && (
            <p className="mt-2 max-w-xs text-sm leading-6">{address}</p>
          )}

          {openingHours && (
            <div className="mt-3">
              <h4 className="text-sm font-semibold">Horário</h4>
              <p className="mt-1 whitespace-pre-line text-sm">{openingHours}</p>
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold">Navegação</h3>

          <div className="flex flex-col gap-2 text-sm">
            <Link href="/sobre">Sobre nós</Link>
            <Link href="/produtos">Produtos</Link>
            <Link href="/galeria">Galeria</Link>
            <Link href="/contactos">Contactos</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-[#70513e] pt-5 text-center text-xs text-[#e8dccd]">
        © 2026 {name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
