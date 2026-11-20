
import { connection } from "next/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();

  const supabase = await createClient();

  const { data: businessInfo } = await supabase
    .from("business_info")
    .select(
      "name, logo_url, description, address, phone, opening_hours, whatsapp_url, facebook_url, instagram_url"
    )
    .limit(1)
    .maybeSingle();

  return (
    <>
      <Navbar
        name={businessInfo?.name ?? "Pastelaria"}
        logoUrl={businessInfo?.logo_url ?? null}
      />

      <main>{children}</main>

      <Footer
        name={businessInfo?.name}
        description={businessInfo?.description}
        address={businessInfo?.address}
        phone={businessInfo?.phone}
        openingHours={businessInfo?.opening_hours}
        whatsappUrl={businessInfo?.whatsapp_url}
        facebookUrl={businessInfo?.facebook_url}
        instagramUrl={businessInfo?.instagram_url}
      />
    </>
  );
}
