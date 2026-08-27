export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://scholarvault-app.vercel.app/sitemap.xml",
  };
}
