
"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { label: "Início", href: "/" },
  { label: "Sobre nós", href: "/sobre" },
  { label: "Produtos", href: "/produtos" },
  { label: "Encomendas", href: "/encomendas" },
  { label: "Contactos", href: "/contactos" },
];

type NavbarProps = {
  name?: string;
  logoUrl?: string | null;
};

export default function Navbar({
  name = "Pastelaria",
  logoUrl = null,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#faf6ef] shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3 font-heading text-2xl font-bold text-[#49372c]"
        >
          {logoUrl && (
            <img
              src={logoUrl}
              alt={`Logótipo de ${name}`}
              className="h-12 w-12 object-contain"
            />
          )}

          <span>{name}</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-[#70513e] transition hover:text-[#a77d61]"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/encomendas"
            className="rounded-full bg-[#70513e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#49372c]"
          >
            Fazer encomenda
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-[#e3d5c5] md:hidden"
        >
          <span
            className={`h-0.5 w-5 bg-[#49372c] transition ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-[#49372c] transition ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-[#49372c] transition ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-[#e3d5c5] bg-[#faf6ef] px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-semibold text-[#70513e] transition hover:text-[#a77d61]"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/encomendas"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-[#70513e] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#49372c]"
            >
              Fazer encomenda
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
