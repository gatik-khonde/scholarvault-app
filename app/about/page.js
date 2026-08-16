"use client";

import Link from "next/link";

export default function AboutPage() {
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
            <p className="eyebrow">About</p>
            <h1 style={{ fontSize: 40 }}>What is ScholarVault?</h1>
            <p className="lede" style={{ margin: "16px auto 0", maxWidth: 560 }}>
              A quiet, distraction-free study library built for the World Scholars Cup — keeping notes, quizzes, prompts, motions, and MCQ sets all in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div className="about-content">
            <h2>The idea</h2>
            <p>
              ScholarVault was created to bring order to the chaos of WSC prep. Instead of scattering notes across shared drives, group chats, and random docs, everything lives here — organized by section, filterable by topic, and always one click away.
            </p>

            <h2>Meet the Founder</h2>
         <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
     <img src="/gatik-khonde-founder.jpeg" width="200" alt="Founder" />    
            <p>
               Gatik Khonde is the founder of ScholarVault, and is responsible for most the study resources on this website.
               Over the course of one season and a half, Gatik has achieved over 10 trophies, 28 gold medals and 12 silver medals.
               Gatik's favorite event of the World Scholar's Cup is the Team Debate. 
              At the Muscat Regional Round in 2026, Gatik and his team achieved the first place overall at Team Debate.
            </p>
           </div>
                        <h2>Meet the Team</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
          <div style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "18px", textAlign: "center" }}>
            <img src="/alpaca.png" alt="Natanel Zador" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }} />
            <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>Natanel Zador</h3>
            <p style={{ fontSize: "14px", opacity: 0.75 }}>Debate In Charge — manages debate motions and case prep</p>
          </div>
          <div style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "18px", textAlign: "center" }}>
            <img src="/alpaca.png" alt="Thorin Thompson" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }} />
            <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>Thorin Thompson</h3>
            <p style={{ fontSize: "14px", opacity: 0.75 }}>Debate In Charge — manages debate motions and case prep</p>
          </div>
          <div style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "18px", textAlign: "center" }}>
            <img src="/alpaca.png" alt="Ece Zeynep" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }} />
            <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>Ece Zeynep</h3>
            <p style={{ fontSize: "14px", opacity: 0.75 }}>Writing In Charge — manages writing prompts and essay prep</p>
          </div>
          <div style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "18px", textAlign: "center" }}>
            <img src="/alpaca.png" alt="Aakash Nair" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }} />
            <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>Aakash Nair</h3>
            <p style={{ fontSize: "14px", opacity: 0.75 }}>Notes &amp; Quizzes/Mocks In Charge — manages study notes, quizzes, and MCQ archives</p>
          </div>
          <div style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "18px", textAlign: "center" }}>
            <img src="/alpaca.png" alt="Andrew Trinh" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }} />
            <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>Andrew Trinh</h3>
            <p style={{ fontSize: "14px", opacity: 0.75 }}>Notes In Charge — manages published study notes</p>
          </div>
          <div style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "18px", textAlign: "center" }}>
            <img src="/alpaca.png" alt="Noga Kutas" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }} />
            <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>Noga Kutas</h3>
            <p style={{ fontSize: "14px", opacity: 0.75 }}>Quizzes &amp; Mocks In Charge — manages quizzes and MCQ archives</p>
          </div>
          <div style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "18px", textAlign: "center" }}>
            <img src="/alpaca.png" alt="Rainbow Lee" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }} />
            <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>Rainbow Lee</h3>
            <p style={{ fontSize: "14px", opacity: 0.75 }}>Quizzes/Mocks &amp; Advertisements In Charge — manages quizzes, MCQ archives, and promotions</p>
          </div>
        </div>


            <h2>Who it's for</h2>
            <p>
              Whether you're a scholar preparing for your first round or a veteran drilling for Worlds, ScholarVault is designed to be the one tab you keep open the night before.
            </p>

            <h2>Prepare to excel</h2>
            <p>
              That's the motto. Not because winning is everything — but because being prepared lets you actually enjoy the round. ScholarVault is here to help with the first part.
            </p>

            <div style={{ marginTop: 36, textAlign: "center" }}>
              <Link href="/" className="btn btn-primary">Browse the vault →</Link>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <img src="/alpaca.png" alt="ScholarVault alpaca" className="footer-alpaca" style={{ width: 36 }} />
          <div className="brand-name" style={{ fontFamily: "'Fraunces',serif", color: "var(--dark-blue)" }}>ScholarVault</div>
          <p>Prepare to excel · a study library for the World Scholars Cup</p>
          <p style={{ fontSize: 11, opacity: 0.7 }}>Alpaca icon by Freepik — [flaticon.com](https://flaticon.com)</p>
        </div>
      </footer>
    </>
  );
}
