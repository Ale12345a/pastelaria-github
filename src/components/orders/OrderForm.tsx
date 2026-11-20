
"use client";

import type { FormEvent } from "react";

type OrderFormProps = {
  whatsappUrl?: string | null;
};

export default function OrderForm({
  whatsappUrl = null,
}: OrderFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const nome = formData.get("nome");
    const telefone = formData.get("telefone");
    const tipo = formData.get("tipo");
    const data = formData.get("data");
    const detalhes = formData.get("detalhes");

    const mensagem = `
Olá! Gostaria de fazer uma encomenda.

Nome: ${nome}
Contacto: ${telefone || "Não indicado"}
Tipo de encomenda: ${tipo}
Data pretendida: ${data || "A combinar"}

Detalhes da encomenda:
${detalhes}
    `.trim();

    if (!whatsappUrl) {
      alert("O contacto WhatsApp ainda não está configurado.");
      return;
    }

    const url = new URL(whatsappUrl);
    url.searchParams.set("text", mensagem);

    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="nome" className="mb-2 block font-semibold text-[#49372c]">
          Nome *
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          placeholder="O teu nome"
          className="w-full rounded-xl border border-[#e3d5c5] bg-white px-4 py-3 outline-none transition focus:border-[#a77d61]"
        />
      </div>

      <div>
        <label htmlFor="telefone" className="mb-2 block font-semibold text-[#49372c]">
          Contacto telefónico
        </label>
        <input
          id="telefone"
          name="telefone"
          type="tel"
          placeholder="O teu número de telefone"
          className="w-full rounded-xl border border-[#e3d5c5] bg-white px-4 py-3 outline-none transition focus:border-[#a77d61]"
        />
      </div>

      <div>
        <label htmlFor="tipo" className="mb-2 block font-semibold text-[#49372c]">
          Tipo de encomenda *
        </label>
        <select
          id="tipo"
          name="tipo"
          required
          defaultValue=""
          className="w-full rounded-xl border border-[#e3d5c5] bg-white px-4 py-3 outline-none transition focus:border-[#a77d61]"
        >
          <option value="" disabled>
            Seleciona uma opção
          </option>
          <option value="Bolo de aniversário">Bolo de aniversário</option>
          <option value="Bolo de casamento">Bolo de casamento</option>
          <option value="Caixa de pequeno-almoço">Caixa de pequeno-almoço</option>
          <option value="Pastelaria e doces">Pastelaria e doces</option>
          <option value="Padaria">Padaria</option>
          <option value="Outra encomenda">Outra encomenda</option>
        </select>
      </div>

      <div>
        <label htmlFor="data" className="mb-2 block font-semibold text-[#49372c]">
          Data pretendida
        </label>
        <input
          id="data"
          name="data"
          type="date"
          className="w-full rounded-xl border border-[#e3d5c5] bg-white px-4 py-3 outline-none transition focus:border-[#a77d61]"
        />
      </div>

      <div>
        <label htmlFor="detalhes" className="mb-2 block font-semibold text-[#49372c]">
          Detalhes da encomenda *
        </label>
        <textarea
          id="detalhes"
          name="detalhes"
          required
          rows={5}
          placeholder="Indica o que pretendes encomendar, quantidades, preferências ou outras informações..."
          className="w-full resize-y rounded-xl border border-[#e3d5c5] bg-white px-4 py-3 outline-none transition focus:border-[#a77d61]"
        />
      </div>

      <p className="text-sm text-[#8b796b]">
        * Campos obrigatórios. A encomenda ficará sujeita à confirmação da pastelaria.
      </p>

      <button
        type="submit"
        className="w-full rounded-full bg-[#70513e] px-8 py-4 font-semibold text-white transition hover:bg-[#49372c]"
      >
        Continuar para WhatsApp
      </button>
    </form>
  );
}
