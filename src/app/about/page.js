import Link from 'next/link';
import styles from './page.module.css';

const majors = [
  { code: 'SE', name: 'Software Engineering', desc: 'Full-stack, mobile, and web development' },
  { code: 'KE', name: 'Knowledge Engineering', desc: 'AI, machine learning, data science, and NLP' },
  { code: 'BIS', name: 'Business Information Systems', desc: 'ERP, business analysis, and data analytics' },
  { code: 'CS', name: 'Cybersecurity', desc: 'Pen testing, security analysis, and SOC work' },
  { code: 'CN', name: 'Computer Networking', desc: 'Network engineering, ISP, and infrastructure' },
  { code: 'ES', name: 'Embedded Systems', desc: 'IoT, firmware, and hardware design' },
  { code: 'HPC', name: 'High Performance Computing', desc: 'Distributed systems, DevOps, and cloud' },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>University of Information Technology</p>
          <h1 className={styles.heroTitle}>About InfoTern</h1>
          <p className={styles.heroSubtitle}>
            Built by UIT students, for UIT students, to make internship choices clearer,
            better informed, and easier to discuss with seniors.
          </p>
        </div>
      </section>

      <div className="container">
        <div className={styles.grid2}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>The Problem</h2>
            <ul className={styles.list}>
              <li>Students often lack practical information about internship companies.</li>
              <li>Major compatibility, working hours, facilities, and culture can be unclear.</li>
              <li>It is difficult to find seniors who interned at a specific company.</li>
              <li>Interview preparation is harder without company-specific guidance.</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Our Solution</h2>
            <ul className={styles.list}>
              <li>Company profiles collect the details students usually ask around for.</li>
              <li>Major-based filters help narrow choices quickly.</li>
              <li>Senior reviews share ratings, pros, cons, and interview tips.</li>
              <li>Mentor connections make follow-up questions easier.</li>
            </ul>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className="section-title" style={{ textAlign: 'center' }}>Platform Features</h2>
          <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-10)' }}>
            Everything UIT students need before choosing an internship.
          </p>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h3>Company Directory</h3>
              <p>Browse detailed profiles with working hours, location, facilities, stipend, and available roles.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Senior Reviews</h3>
              <p>Read honest reviews with ratings, pros and cons, and interview tips from real interns.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Smart Matching</h3>
              <p>Get company recommendations based on your major, priorities, and preferences.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Senior Connect</h3>
              <p>Message senior mentors through Telegram, Facebook, or email for direct advice.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Major-Based Filtering</h3>
              <p>Filter by SE, KE, BIS, CS, CN, ES, or HPC to focus on relevant options.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Interview Prep</h3>
              <p>Use company-specific preparation notes from seniors who already passed the process.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className="section-title" style={{ textAlign: 'center' }}>Supported UIT Majors</h2>
          <div className={styles.majorsGrid}>
            {majors.map(m => (
              <Link key={m.code} href={`/companies?major=${m.code}`} className={styles.majorCard}>
                <span className={styles.majorCode}>{m.code}</span>
                <div>
                  <h3 className={styles.majorName}>{m.name}</h3>
                  <p className={styles.majorDesc}>{m.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Ready to find your internship?</h2>
          <p className={styles.ctaText}>Start exploring companies, reading reviews, or finding your best match.</p>
          <div className={styles.ctaButtons}>
            <Link href="/companies" className="btn btn-primary btn-lg">Browse Companies</Link>
            <Link href="/match" className="btn btn-secondary btn-lg">Smart Match</Link>
            <Link href="/reviews/new" className="btn btn-secondary btn-lg">Write Review</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
