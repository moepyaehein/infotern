'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { companies } from '@/data/companies';
import { reviews } from '@/data/reviews';
import { seniors } from '@/data/seniors';
import { MAJORS } from '@/data/majors';
import { fetchCompanies } from '@/lib/companiesApi';
import CompanyCard from '@/components/CompanyCard';
import StatsCounter from '@/components/StatsCounter';
import styles from './page.module.css';

export default function Home() {
  const [allCompanies, setAllCompanies] = useState(companies);
  const featuredCompanies = allCompanies.filter(c => c.featured).slice(0, 4);

  useEffect(() => {
    let mounted = true;

    fetchCompanies()
      .then((payload) => {
        if (mounted && payload.companies?.length) {
          setAllCompanies(payload.companies);
        }
      })
      .catch(() => {
        if (mounted) setAllCompanies(companies);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>University of Information Technology</p>
          <h1 className={styles.heroTitle}>InfoTern</h1>
          <p className={styles.heroSubtitle}>
            A UIT student internship platform for company discovery, senior reviews,
            mentor connection, and major-based internship matching.
          </p>
          <div className={styles.heroCTA}>
            <Link href="/companies" className="btn btn-primary btn-lg" id="hero-browse-btn">
              Browse Companies
            </Link>
            <Link href="/match" className="btn btn-secondary btn-lg" id="hero-match-btn">
              Find My Match
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            <StatsCounter end={allCompanies.length} label="Companies" icon="CO" />
            <StatsCounter end={reviews.length} label="Reviews" icon="RV" />
            <StatsCounter end={seniors.length} label="Senior Mentors" icon="SR" />
            <StatsCounter end={MAJORS.length} label="UIT Majors" icon="MJ" />
          </div>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <div className="container">
          <div className={styles.sectionIntro}>
            <h2 className="section-title">How InfoTern Works</h2>
            <p className="section-subtitle">A clear path from company research to confident internship decisions.</p>
          </div>

          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>01</div>
              <h3 className={styles.stepTitle}>Explore Companies</h3>
              <p className={styles.stepDesc}>
                Browse company profiles with working hours, facilities, roles, and major compatibility.
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>02</div>
              <h3 className={styles.stepTitle}>Read Senior Reviews</h3>
              <p className={styles.stepDesc}>
                Learn from UIT seniors who already completed internships there, including tips and tradeoffs.
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>03</div>
              <h3 className={styles.stepTitle}>Connect and Decide</h3>
              <p className={styles.stepDesc}>
                Contact senior mentors or use Smart Match to shortlist companies that fit your priorities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.featured}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title">Featured Companies</h2>
              <p className="section-subtitle">Top-rated companies hiring UIT interns.</p>
            </div>
            <Link href="/companies" className="btn btn-secondary" id="view-all-companies-btn">
              View All
            </Link>
          </div>

          <div className={styles.companiesGrid}>
            {featuredCompanies.map((company, i) => (
              <div key={company.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                <CompanyCard company={company} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaCard}>
            <span className={styles.ctaKicker}>For UIT seniors</span>
            <h2 className={styles.ctaTitle}>Already completed your internship?</h2>
            <p className={styles.ctaSubtitle}>
              Share your experience and help juniors make better decisions with real, practical advice.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/reviews/new" className="btn btn-primary btn-lg" id="cta-write-review-btn">
                Write a Review
              </Link>
              <Link href="/connect" className="btn btn-secondary btn-lg" id="cta-become-mentor-btn">
                Become a Mentor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
