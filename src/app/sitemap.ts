
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).replace(/\/$/, "");

  const routes = [
    "",
    "/sobre",
    "/produtos",
    "/galeria",
    "/encomendas",
    "/contactos",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date("2026-11-18"),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
