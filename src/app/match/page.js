'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { companies } from '@/data/companies';
import { MAJORS, getMajorBadgeClass } from '@/data/majors';
import { fetchCompanies } from '@/lib/companiesApi';
import { getMatchedCompanies } from '@/lib/utils';
import Icon from '@/components/Icon';
import styles from './page.module.css';

const PRIORITIES = [
  { id: 'mentorship', label: 'Strong Mentorship', icon: 'mentorship' },
  { id: 'stipend', label: 'Good Stipend', icon: 'wallet' },
  { id: 'flexibility', label: 'Flexible Hours / WFH', icon: 'clock' },
  { id: 'learning', label: 'Learning & Training', icon: 'learning' },
  { id: 'culture', label: 'Fun Culture & Team', icon: 'culture' },
];

const SIZES = [
  { id: '', label: 'No Preference' },
  { id: 'small', label: 'Small (< 50)' },
  { id: 'medium', label: 'Medium (50-300)' },
  { id: 'large', label: 'Large (300+)' },
];

export default function MatchPage() {
  const [step, setStep] = useState(1);
  const [major, setMajor] = useState('');
  const [priorities, setPriorities] = useState([]);
  const [preferredSize, setPreferredSize] = useState('');
  const [results, setResults] = useState([]);
  const [allCompanies, setAllCompanies] = useState(companies);

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

  const togglePriority = (id) => {
    setPriorities(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleMatch = () => {
    const matched = getMatchedCompanies({ major, priorities, preferredSize }, allCompanies);
    setResults(matched);
    setStep(4);
  };

  const resetMatch = () => {
    setStep(1);
    setMajor('');
    setPriorities([]);
    setPreferredSize('');
    setResults([]);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className="section-title">Smart Match</h1>
          <p className="section-subtitle">
            Answer a few questions and we&apos;ll find the best internship companies for you
          </p>
        </div>

        {/* Progress Bar */}
        <div className={styles.progress}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`${styles.progressStep} ${step >= s ? styles.progressStepActive : ''}`}>
              <div className={styles.progressDot}>{step > s ? '✓' : s}</div>
              <span className={styles.progressLabel}>
                {s === 1 && 'Major'}
                {s === 2 && 'Priorities'}
                {s === 3 && 'Preferences'}
                {s === 4 && 'Results'}
              </span>
            </div>
          ))}
          <div className={styles.progressLine}>
            <div className={styles.progressFill} style={{ width: `${((step - 1) / 3) * 100}%` }} />
          </div>
        </div>

        {/* Step 1: Major */}
        {step === 1 && (
          <div className={styles.stepCard}>
            <h2 className={styles.stepTitle}>What&apos;s your major?</h2>
            <p className={styles.stepSubtitle}>Select your UIT department</p>
            <div className={styles.majorGrid}>
              {MAJORS.map(m => (
                <button
                  key={m.code}
                  className={`${styles.majorOption} ${major === m.code ? styles.majorOptionActive : ''}`}
                  onClick={() => setMajor(m.code)}
                  style={major === m.code ? { borderColor: m.color, boxShadow: `0 0 20px ${m.color}30` } : {}}
                  id={`match-major-${m.code}`}
                >
                  <span className={`badge ${m.badgeClass}`} style={{ padding: '4px 12px' }}>{m.code}</span>
                  <span className={styles.majorName}>{m.name}</span>
                </button>
              ))}
            </div>
            <button
              className="btn btn-primary btn-lg"
              disabled={!major}
              onClick={() => setStep(2)}
              id="match-next-1"
              style={{ alignSelf: 'flex-end' }}
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Priorities */}
        {step === 2 && (
          <div className={styles.stepCard}>
            <h2 className={styles.stepTitle}>What matters most to you?</h2>
            <p className={styles.stepSubtitle}>Select your top priorities (choose up to 3)</p>
            <div className={styles.priorityGrid}>
              {PRIORITIES.map(p => (
                <button
                  key={p.id}
                  className={`${styles.priorityOption} ${priorities.includes(p.id) ? styles.priorityOptionActive : ''}`}
                  onClick={() => togglePriority(p.id)}
                  disabled={priorities.length >= 3 && !priorities.includes(p.id)}
                  id={`match-priority-${p.id}`}
                >
                  <span className={styles.priorityIcon}>
                    <Icon name={p.icon} size={24} />
                  </span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
            <div className={styles.stepActions}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-primary btn-lg" onClick={() => setStep(3)} id="match-next-2">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Company Size */}
        {step === 3 && (
          <div className={styles.stepCard}>
            <h2 className={styles.stepTitle}>Preferred company size?</h2>
            <p className={styles.stepSubtitle}>What kind of environment do you prefer?</p>
            <div className={styles.sizeGrid}>
              {SIZES.map(s => (
                <button
                  key={s.id}
                  className={`${styles.sizeOption} ${preferredSize === s.id ? styles.sizeOptionActive : ''}`}
                  onClick={() => setPreferredSize(s.id)}
                  id={`match-size-${s.id || 'any'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className={styles.stepActions}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button className="btn btn-primary btn-lg" onClick={handleMatch} id="match-find-btn">
                Find My Match
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsHeader}>
              <h2 className={styles.resultsTitle}>Your Matches</h2>
              <button className="btn btn-secondary" onClick={resetMatch}>Try Again</button>
            </div>
            <div className={styles.resultsGrid}>
              {results.map((company, i) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.id}`}
                  className={`${styles.matchCard} animate-fade-in-up`}
                  style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
                  id={`match-result-${company.id}`}
                >
                  <div className={styles.matchPercent}>
                    <svg viewBox="0 0 100 100" className={styles.matchCircle}>
                      <circle cx="50" cy="50" r="42" className={styles.matchCircleBg} />
                      <circle
                        cx="50" cy="50" r="42"
                        className={styles.matchCircleFill}
                        strokeDasharray={`${company.matchPercentage * 2.64} 264`}
                        style={{ '--percent-color': company.matchPercentage >= 70 ? 'var(--accent-green)' : company.matchPercentage >= 50 ? 'var(--star-color)' : 'var(--accent-orange)' }}
                      />
                    </svg>
                    <span className={styles.matchValue}>{company.matchPercentage}%</span>
                  </div>
                  <div className={styles.matchInfo}>
                    <div className={styles.matchLogo}>
                      <Icon name={company.logo} size={26} />
                    </div>
                    <h3 className={styles.matchName}>{company.name}</h3>
                    <span className={styles.matchIndustry}>{company.industry}</span>
                    <div className={styles.matchRating}>
                      <Icon name="star" size={15} />
                      {company.rating}
                    </div>
                    <div className={styles.matchMajors}>
                      {company.majors.map(m => (
                        <span key={m} className={`badge ${getMajorBadgeClass(m)}`}>{m}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
