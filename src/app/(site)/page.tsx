
import { connection } from "next/server";
import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Introduction from "@/components/home/Introduction";
import ProductCategories from "@/components/home/ProductCategories";
import OrderSection from "@/components/home/OrderSection";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export const metadata: Metadata = {
  title: "Pastelaria | Produtos e Encomendas",
  description:
    "Descobre os nossos produtos de pastelaria, padaria, bolos especiais e pequenos-almoços.",
};

export default async function HomePage() {
  await connection();

  const supabase = await createClient();

  const { data: businessInfo } = await supabase
    .from("business_info")
    .select("slogan, description")
    .limit(1)
    .maybeSingle();

  return (
    <>
      <Hero
        slogan={businessInfo?.slogan}
        description={businessInfo?.description}
      />

      <Introduction />
      <ProductCategories />
      <OrderSection />
    </>
  );
}
