'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getCompanyById, formatDate } from '@/lib/utils';
import { getMajorBadgeClass } from '@/data/majors';
import Icon from './Icon';
import styles from './ReviewCard.module.css';

function renderStars(count) {
  return '★'.repeat(count) + '☆'.repeat(5 - count);
}

export default function ReviewCard({ review, showCompany = true, company: companyOverride = null }) {
  const [helpful, setHelpful] = useState(review.helpful || 0);
  const [voted, setVoted] = useState(false);

  const company = companyOverride || getCompanyById(review.companyId);

  const handleHelpful = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!voted) {
      setHelpful(prev => prev + 1);
      setVoted(true);
    } else {
      setHelpful(prev => prev - 1);
      setVoted(false);
    }
  };

  return (
    <div className={styles.card} id={`review-${review.id}`}>
      <div className={styles.cardHeader}>
        <div className={styles.reviewerInfo}>
          <span className={styles.reviewerName}>{review.reviewerName}</span>
          <div className={styles.reviewerMeta}>
            <span className={`badge ${getMajorBadgeClass(review.major)}`}>{review.major}</span>
            <span>{review.role}</span>
            {showCompany && company && (
              <>
                <span>at</span>
                <Link href={`/companies/${company.id}`} className={styles.companyLink}>
                  {company.name}
                </Link>
              </>
            )}
          </div>
        </div>
        <div className={styles.overallRating}>
          <Icon name="star" size={18} />
          <span>{review.overallRating}</span>
        </div>
      </div>

      <div className={styles.ratings}>
        <div className={styles.ratingItem}>
          <span className={styles.ratingLabel}>Work-Life Balance</span>
          <span className={styles.ratingStars}>{renderStars(review.workLifeBalance)}</span>
        </div>
        <div className={styles.ratingItem}>
          <span className={styles.ratingLabel}>Learning</span>
          <span className={styles.ratingStars}>{renderStars(review.learningOpportunity)}</span>
        </div>
        <div className={styles.ratingItem}>
          <span className={styles.ratingLabel}>Mentorship</span>
          <span className={styles.ratingStars}>{renderStars(review.mentorship)}</span>
        </div>
      </div>

      <div className={styles.reviewText}>
        <div className={styles.prosConsRow}>
          <div className={styles.prosSection}>
            <span className={styles.prosLabel}>
              <Icon name="check" size={15} />
              Pros
            </span>
            <p className={styles.prosText}>{review.pros}</p>
          </div>
          <div className={styles.consSection}>
            <span className={styles.consLabel}>
              <Icon name="edit" size={15} />
              Cons
            </span>
            <p className={styles.consText}>{review.cons}</p>
          </div>
        </div>

        <div className={styles.tipsSection}>
          <span className={styles.tipsLabel}>
            <Icon name="learning" size={15} />
            Interview Tips
          </span>
          <p className={styles.tipsText}>{review.interviewTips}</p>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <button
          className={`${styles.helpfulBtn} ${voted ? styles.helpfulBtnActive : ''}`}
          onClick={handleHelpful}
          id={`helpful-btn-${review.id}`}
        >
          <Icon name="users" size={15} />
          Helpful ({helpful})
        </button>
        <span className={styles.date}>{formatDate(review.createdAt)}</span>
      </div>
    </div>
  );
}
