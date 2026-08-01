const highlights = [
  {
    title: '24/7 access',
    text: 'Locate the nearest emergency pharmacy quickly when every minute matters.',
  },
  {
    title: 'Trusted data',
    text: 'Designed to surface duty pharmacies with clear, dependable information.',
  },
  {
    title: 'Morocco-first',
    text: 'Built around Moroccan emergency pharmacy discovery and local coverage.',
  },
]

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="eyebrow">PharmaGarde</div>
        <h1>Find the right emergency pharmacy in seconds.</h1>
        <p className="lead">
          PharmaGarde is a fast, user-friendly pharmacy discovery experience for Morocco,
          focused on emergency duty coverage and easier access to trusted care.
        </p>

        <div className="cta-row">
          <a className="primary-btn" href="#highlights">
            Explore features
          </a>
          <a className="secondary-btn" href="#support">
            Contact support
          </a>
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
        <h2>Deployment status</h2>
        <p>
          This project is now configured as a deployable Next.js app for Vercel and builds
          successfully with the expected app directory structure.
        </p>
      </section>
    </main>
  )
}
