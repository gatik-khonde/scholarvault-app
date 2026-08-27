import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://scholarvault-app.vercel.app"),
  title: "ScholarVault — WSC Study Guides, Debate Motions & MCQ Archives",
  description:
    "Free World Scholar's Cup (WSC) study guides: topic notes, Scholar's Challenge quizzes, Collaborative Writing prompts, Team Debate motions, and full 120-question MCQ archives.",
  keywords: [
    "WSC study guide",
    "WSC debate guide",
    "World Scholar's Cup study guide",
    "World Scholars Cup debate motions",
    "Scholar's Challenge quizzes",
    "Team Debate motions WSC",
    "Collaborative Writing prompts WSC",
    "WSC MCQ archive",
  ],
  openGraph: {
    title: "ScholarVault — WSC Study Guides & Debate Guide",
    description:
      "Free World Scholar's Cup study guides, debate motions, quizzes, writing prompts, and MCQ archives — all in one vault.",
    url: "https://scholarvault-app.vercel.app",
    siteName: "ScholarVault",
    images: ["/alpaca.png"],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ScholarVault — WSC Study Guides & Debate Guide",
    description:
      "Free World Scholar's Cup study guides, debate motions, quizzes, and MCQ archives — all in one vault.",
    images: ["/alpaca.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-6ZQPC1VK17"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6ZQPC1VK17');
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
