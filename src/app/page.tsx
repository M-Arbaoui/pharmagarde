const highlights = [
  {
    title: '24/7 emergency coverage',
    text: 'Quickly discover duty pharmacies nearby when urgent medical needs arise.',
  },
  {
    title: 'Trusted local discovery',
    text: 'Built to surface essential pharmacy information with clarity and speed.',
  },
  {
    title: 'Morocco-ready UX',
    text: 'A simple, mobile-friendly experience tailored for people who need answers fast.',
  },
]

const facts = [
  { label: 'Coverage', value: 'City + district' },
  { label: 'Use case', value: 'Urgent pharmacy lookup' },
  { label: 'Status', value: 'Ready for Vercel' },
]

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="eyebrow">PharmaGarde</div>
        <h1>Find the right emergency pharmacy in seconds.</h1>
        <p className="lead">
          PharmaGarde helps users locate nearby duty pharmacies quickly and confidently,
          with a clean, fast experience designed for urgent situations.
        </p>

        <div className="cta-row">
          <a className="primary-btn" href="#highlights">
            Explore features
          </a>
          <a className="secondary-btn" href="#support">
            Deployment notes
          </a>
        </div>

        <div className="stats-row">
          {facts.map((fact) => (
            <div key={fact.label} className="stat-pill">
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section id="highlights" className="grid-cards">
        {highlights.map((item) => (
          <article key={item.title} className="info-card">
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section id="support" className="support-card">
        <h2>Deployment checkpoint</h2>
        <p>
          The app shell has been restored and verified with a successful production build.
          Vercel can now recognize the project as a Next.js application instead of failing
          on the missing app directory error.
        </p>
      </section>
    </main>
  )
}
