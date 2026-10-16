export default function sitemap() {
  const base = "https://scholarvault-app.vercel.app";
  const pages = ["", "notes", "quizzes", "prompts", "motions", "about", "privacy"];
  return pages.map((p) => ({
    url: `${base}/${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.8,
  }));
}
