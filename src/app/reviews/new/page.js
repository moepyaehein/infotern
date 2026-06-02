'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { companies } from '@/data/companies';
import { MAJORS } from '@/data/majors';
import { addReview } from '@/lib/storage';
import { fetchCompanies } from '@/lib/companiesApi';
import { submitReview } from '@/lib/reviewsApi';
import StarRating from '@/components/StarRating';
import Icon from '@/components/Icon';
import styles from './page.module.css';

export default function WriteReviewPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allCompanies, setAllCompanies] = useState(companies);
  const [form, setForm] = useState({
    companyId: '',
    reviewerName: '',
    major: '',
    role: '',
    overallRating: 0,
    workLifeBalance: 0,
    learningOpportunity: 0,
    mentorship: 0,
    pros: '',
    cons: '',
    interviewTips: '',
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    if (
      form.overallRating < 1 ||
      form.workLifeBalance < 1 ||
      form.learningOpportunity < 1 ||
      form.mentorship < 1
    ) {
      setSubmitError('Please select all ratings before submitting.');
      setIsSubmitting(false);
      return;
    }

    const review = {
      ...form,
      graduationYear: new Date().getFullYear(),
    };

    try {
      await submitReview(review);
      setSubmitted(true);
    } catch (error) {
      addReview({
        ...review,
        id: `local_${Date.now()}`,
        helpful: 0,
        createdAt: new Date().toISOString(),
      });
      setSubmitError('Supabase is not ready yet, so this review was saved locally for now.');
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.success}>
            <div className={styles.successIcon}>
              <Icon name="check" size={46} />
            </div>
            <h1 className={styles.successTitle}>Review Submitted!</h1>
            <p className={styles.successText}>
              Thank you for sharing your internship experience. Your review will help future UIT students make better decisions!
            </p>
            {submitError && <p className={styles.warningText}>{submitError}</p>}
            <div className={styles.successActions}>
              <button onClick={() => router.push('/reviews')} className="btn btn-primary">
                View All Reviews
              </button>
              <button onClick={() => { setSubmitted(false); setForm({ companyId: '', reviewerName: '', major: '', role: '', overallRating: 0, workLifeBalance: 0, learningOpportunity: 0, mentorship: 0, pros: '', cons: '', interviewTips: '' }); }} className="btn btn-secondary">
                Write Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className="section-title">Write a Review</h1>
          <p className="section-subtitle">Share your internship experience to help your juniors</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>Basic Information</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Your Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your name"
                  value={form.reviewerName}
                  onChange={(e) => updateField('reviewerName', e.target.value)}
                  required
                  id="review-name-input"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Your Major</label>
                <select
                  className="select-field"
                  value={form.major}
                  onChange={(e) => updateField('major', e.target.value)}
                  required
                  id="review-major-select"
                >
                  <option value="">Select Major</option>
                  {MAJORS.map(m => (
                    <option key={m.code} value={m.code}>{m.code} - {m.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Company</label>
                <select
                  className="select-field"
                  value={form.companyId}
                  onChange={(e) => updateField('companyId', e.target.value)}
                  required
                  id="review-company-select"
                >
                  <option value="">Select Company</option>
                  {allCompanies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Your Role</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Frontend Developer"
                  value={form.role}
                  onChange={(e) => updateField('role', e.target.value)}
                  required
                  id="review-role-input"
                />
              </div>
            </div>
          </div>

          {/* Ratings */}
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>Ratings</h2>
            <div className={styles.ratingsGrid}>
              <StarRating label="Overall Experience" value={form.overallRating} onChange={(v) => updateField('overallRating', v)} size="lg" />
              <StarRating label="Work-Life Balance" value={form.workLifeBalance} onChange={(v) => updateField('workLifeBalance', v)} />
              <StarRating label="Learning Opportunity" value={form.learningOpportunity} onChange={(v) => updateField('learningOpportunity', v)} />
              <StarRating label="Mentorship Quality" value={form.mentorship} onChange={(v) => updateField('mentorship', v)} />
            </div>
          </div>

          {/* Text Reviews */}
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>Your Experience</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>What did you like? (Pros)</label>
              <textarea
                className="textarea-field"
                placeholder="What were the best parts of your internship?"
                value={form.pros}
                onChange={(e) => updateField('pros', e.target.value)}
                required
                id="review-pros-input"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>What could be better? (Cons)</label>
              <textarea
                className="textarea-field"
                placeholder="What were the challenges or downsides?"
                value={form.cons}
                onChange={(e) => updateField('cons', e.target.value)}
                required
                id="review-cons-input"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Interview Tips</label>
              <textarea
                className="textarea-field"
                placeholder="What should future candidates prepare for?"
                value={form.interviewTips}
                onChange={(e) => updateField('interviewTips', e.target.value)}
                id="review-tips-input"
              />
            </div>
          </div>

          {submitError && <p className={styles.warningText}>{submitError}</p>}

          <button type="submit" className="btn btn-primary btn-lg" id="submit-review-btn" style={{ width: '100%' }}>
            <Icon name="edit" size={17} />
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
