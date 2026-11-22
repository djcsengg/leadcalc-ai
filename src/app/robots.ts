import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://leadcalc.ai";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/calculators", "/c/*", "/builder", "/pricing"],
        disallow: [
          "/api/*",
          "/dashboard",
          "/dashboard/*",
          "/leads",
          "/leads/*",
          "/embed/*",
        ],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/calculators", "/c/*"],
        disallow: ["/api/*", "/dashboard", "/leads"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
