export const metadata = {
  title: "Privacy Policy — ScholarVault",
  description: "How ScholarVault handles your data, cookies, and third-party services.",
};

export default function PrivacyPage() {
  return (
    <>
      <header>
        <div className="nav-inner">
          <a href="/" className="brand">
            <img src="/alpaca.png" alt="ScholarVault alpaca" style={{ width: 34, height: 34, objectFit: "contain" }} />
            <span className="brand-name">ScholarVault</span>
          </a>
          <nav className="links">
            <a href="/#notes">Notes</a>
            <a href="/#quizzes">Quizzes</a>
            <a href="/#prompts">Writing Prompts</a>
            <a href="/#motions">Debate Motions</a>
            <a href="/#mcq">MCQ Archives</a>
            <a href="/about">About</a>
          </nav>
          <a href="/" className="owner-btn"><span>← Back to vault</span></a>
        </div>
      </header>

      <section className="hero" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="hero-inner" style={{ gridTemplateColumns: "1fr", textAlign: "center" }}>
          <div>
            <p className="eyebrow">Legal</p>
            <h1 style={{ fontSize: "40px" }}>Privacy Policy</h1>
            <p className="lede" style={{ margin: "16px auto 0", maxWidth: "560px" }}>
              How ScholarVault handles your data, cookies, and third-party services.
            </p>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap" style={{ maxWidth: "720px" }}>
          <div className="about-content">
            <p style={{ fontSize: "14px", opacity: 0.6, marginBottom: "24px" }}>Last updated: August 26, 2026</p>

            <h2>Overview</h2>
            <p>ScholarVault is a free World Scholar&apos;s Cup study resource website. We are committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights.</p>

            <h2>Data We Collect</h2>
            <p>ScholarVault does not require users to create an account or submit personal information to browse content. The only data we collect is:</p>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
              <li><strong>Anonymous usage data</strong> — page views, session duration, and general traffic patterns via Google Analytics.</li>
              <li><strong>Owner login data</strong> — a single password used by the site owner to publish and manage content. This is stored securely and not shared.</li>
              <li><strong>Content submissions</strong> — notes, quizzes, prompts, motions, and MCQ links published by the site owner. These are public and visible to all visitors.</li>
            </ul>

            <h2>Cookies</h2>
            <p>We use cookies and similar technologies for the following purposes:</p>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
              <li><strong>Google Analytics</strong> — to understand how visitors use our site (e.g., which pages are most visited, how long visitors stay). This helps us improve content.</li>
              <li><strong>Google AdSense</strong> — to display advertisements and serve ads based on your visit and other sites on the internet.</li>
            </ul>
            <p>You can disable cookies in your browser settings. However, some features of the site may not function properly without them.</p>

            <h2>Third-Party Services</h2>
            <p>We use the following third-party services that may collect data:</p>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
              <li><strong>Google Analytics</strong> — collects anonymous traffic data. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google&apos;s Privacy Policy</a></li>
              <li><strong>Google AdSense</strong> — serves ads and may use cookies to personalize ad content. <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">How Google uses data from sites that use its services</a></li>
              <li><strong>Google Docs / Google Forms</strong> — linked content opens on Google&apos;s platform and is subject to Google&apos;s privacy policy.</li>
              <li><strong>Vercel</strong> — hosts our website. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel Privacy Policy</a></li>
              <li><strong>Upstash</strong> — stores our content data (notes, quizzes, etc.). <a href="https://upstash.com/privacy" target="_blank" rel="noopener noreferrer">Upstash Privacy Policy</a></li>
            </ul>

            <h2>How We Use Your Data</h2>
            <p>We use collected data to:</p>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
              <li>Understand how visitors use our site and improve content</li>
              <li>Display relevant advertisements via Google AdSense</li>
              <li>Maintain and operate the website</li>
            </ul>

            <h2>Data Sharing</h2>
            <p>We do not sell, trade, or rent your data to third parties. Anonymous usage data may be shared with the third-party services listed above as part of their normal operation.</p>

            <h2>Children&apos;s Privacy</h2>
            <p>ScholarVault is designed for students participating in the World Scholar&apos;s Cup. We do not knowingly collect personal information from children. If you believe a child has provided personal data, please contact us and we will delete it.</p>

            <h2>Your Rights</h2>
            <p>Since we do not collect personal data from visitors, there is no personal data to access, modify, or delete. If you have concerns, you can:</p>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
              <li>Disable cookies in your browser</li>
              <li>Use an ad blocker to prevent ad-related tracking</li>
              <li>Contact us with any questions</li>
            </ul>

            <h2>Contact</h2>
            <p>If you have any questions about this privacy policy, you can reach us at: <a href="mailto:scholarvault@gmail.com">scholarvault@gmail.com</a></p>

            <h2>Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.</p>

            <div style={{ marginTop: "36px", textAlign: "center" }}>
              <a className="btn btn-primary" href="/">Back to ScholarVault →</a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <img src="/alpaca.png" alt="ScholarVault alpaca" className="footer-alpaca" style={{ width: 36 }} />
          <div className="brand-name" style={{ fontFamily: "'Fraunces',serif", color: "var(--dark-blue)" }}>ScholarVault</div>
          <p>Prepare to excel · a study library for the World Scholar&apos;s Cup</p>
        </div>
      </footer>
    </>
  );
}
