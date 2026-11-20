
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type BusinessInfo = {
  id?: string;
  name: string;
  slogan: string | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  opening_hours: string | null;
  whatsapp_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  logo_url: string | null;
};

type Props = {
  businessInfo: BusinessInfo | null;
};

export default function BusinessInfoForm({ businessInfo }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    name: businessInfo?.name ?? "Pastelaria",
    slogan:
      businessInfo?.slogan ??
      "Cada dia tem o seu sabor. Cada momento merece ser especial.",
    description:
      businessInfo?.description ??
      "Feito com dedicação, servido com carinho e pensado para tornar cada momento ainda mais especial.",
    address:
      businessInfo?.address ??
      "",
    phone: businessInfo?.phone ?? "",
    opening_hours: businessInfo?.opening_hours ?? "",
    whatsapp_url:
      businessInfo?.whatsapp_url ??
      "",
    facebook_url:
      businessInfo?.facebook_url ??
      "",
    instagram_url:
      businessInfo?.instagram_url ??
      "",
    logo_url: businessInfo?.logo_url ?? "",
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(
    field: keyof typeof form,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      let logoUrl = form.logo_url;

      if (logo) {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
        ];

        if (!allowedTypes.includes(logo.type)) {
          throw new Error("O logótipo deve estar em JPG, PNG ou WebP.");
        }

        if (logo.size > 5 * 1024 * 1024) {
          throw new Error("O logótipo não pode ultrapassar 5 MB.");
        }

        const extension = logo.name.split(".").pop()?.toLowerCase() || "png";
        const filePath = `business/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("demo-bucket")
          .upload(filePath, logo, {
            contentType: logo.type,
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from("demo-bucket")
          .getPublicUrl(filePath);

        logoUrl = data.publicUrl;
      }

      const dataToSave = {
        ...form,
        logo_url: logoUrl || null,
        updated_at: new Date().toISOString(),
      };

      const { error: saveError } = businessInfo?.id
        ? await supabase
            .from("business_info")
            .update(dataToSave)
            .eq("id", businessInfo.id)
        : await supabase
            .from("business_info")
            .insert(dataToSave);

      if (saveError) {
        throw saveError;
      }

      setMessage("Informações guardadas com sucesso!");
      setLogo(null);

      router.refresh();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao guardar as informações."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-[#d8c7b5] bg-white px-4 py-3 text-sm text-[#4a3024] outline-none transition focus:border-[#8b5e3c]";

  const labelClass =
    "mb-2 block text-sm font-medium text-[#4a3024]";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-5 rounded-xl border border-[#eadfd3] bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold text-[#4a3024]">
            Identidade da pastelaria
          </h2>
          <p className="mt-1 text-sm text-[#8b7767]">
            Nome, frase de destaque e apresentação do negócio.
          </p>
        </div>

        <div>
          <label className={labelClass}>Nome da pastelaria</label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Frase de destaque</label>
          <input
            className={inputClass}
            value={form.slogan}
            onChange={(e) => handleChange("slogan", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Subtítulo / apresentação</label>
          <textarea
            className={inputClass}
            rows={4}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Logótipo</label>

          {form.logo_url && (
            <div className="mb-3">
              <p className="mb-2 text-xs text-[#8b7767]">
                Logótipo atual:
              </p>
              <img
                src={form.logo_url}
                alt="Logótipo atual da pastelaria"
                className="h-24 w-24 rounded-lg border border-[#eadfd3] object-contain p-2"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-[#6b5748] file:mr-4 file:rounded-lg file:border-0 file:bg-[#f3e9df] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#4a3024]"
            onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
          />

          <p className="mt-2 text-xs text-[#8b7767]">
            Formatos JPG, PNG ou WebP. Máximo de 5 MB.
          </p>
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-[#eadfd3] bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold text-[#4a3024]">
            Contactos e localização
          </h2>
          <p className="mt-1 text-sm text-[#8b7767]">
            Informações que serão apresentadas no site.
          </p>
        </div>

        <div>
          <label className={labelClass}>Morada</label>
          <textarea
            className={inputClass}
            rows={2}
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Telefone</label>
          <input
            className={inputClass}
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Horário de funcionamento</label>
          <input
            className={inputClass}
            value={form.opening_hours}
            onChange={(e) => handleChange("opening_hours", e.target.value)}
            placeholder="Ex.: 08:00–19:30"
          />
        </div>

        <div>
          <label className={labelClass}>Link do WhatsApp</label>
          <input
            className={inputClass}
            value={form.whatsapp_url}
            onChange={(e) => handleChange("whatsapp_url", e.target.value)}
            placeholder="https://wa.me/..."
          />
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-[#eadfd3] bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold text-[#4a3024]">
            Redes sociais
          </h2>
        </div>

        <div>
          <label className={labelClass}>Facebook</label>
          <input
            className={inputClass}
            value={form.facebook_url}
            onChange={(e) => handleChange("facebook_url", e.target.value)}
            placeholder="https://facebook.com/..."
          />
        </div>

        <div>
          <label className={labelClass}>Instagram</label>
          <input
            className={inputClass}
            value={form.instagram_url}
            onChange={(e) => handleChange("instagram_url", e.target.value)}
            placeholder="https://instagram.com/..."
          />
        </div>
      </section>

      {message && (
        <p className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
          {message}
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-[#79543b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5f402d] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "A guardar..." : "Guardar informações"}
      </button>
    </form>
  );
}
