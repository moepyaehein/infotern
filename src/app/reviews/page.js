'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { reviews as seedReviews } from '@/data/reviews';
import { companies } from '@/data/companies';
import { MAJORS } from '@/data/majors';
import { filterReviews } from '@/lib/utils';
import { getStoredReviews } from '@/lib/storage';
import { fetchCompanies } from '@/lib/companiesApi';
import { fetchReviews } from '@/lib/reviewsApi';
import ReviewCard from '@/components/ReviewCard';
import Icon from '@/components/Icon';
import styles from './page.module.css';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(seedReviews);
  const [status, setStatus] = useState('loading');
  const [source, setSource] = useState('seed');
  const [allCompanies, setAllCompanies] = useState(companies);
  const [companyFilter, setCompanyFilter] = useState('');
  const [majorFilter, setMajorFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    let mounted = true;

    async function loadReviews() {
      try {
        const [reviewsPayload, companiesPayload] = await Promise.allSettled([
          fetchReviews(),
          fetchCompanies(),
        ]);

        if (!mounted) return;

        const localReviews = getStoredReviews();
        const payload = reviewsPayload.status === 'fulfilled'
          ? reviewsPayload.value
          : { configured: false, reviews: [] };

        if (
          companiesPayload.status === 'fulfilled' &&
          companiesPayload.value.companies?.length
        ) {
          setAllCompanies(companiesPayload.value.companies);
        }

        if (payload.configured && payload.reviews.length > 0) {
          setReviews(payload.reviews);
          setSource('supabase');
        } else {
          setReviews(localReviews.length > 0 ? localReviews : seedReviews);
          setSource(payload.configured ? 'empty-supabase' : 'seed');
        }
        setStatus('ready');
      } catch (error) {
        if (!mounted) return;
        const localReviews = getStoredReviews();
        setReviews(localReviews.length > 0 ? localReviews : seedReviews);
        setSource('seed');
        setStatus('fallback');
      }
    }

    loadReviews();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredReviews = useMemo(() => {
    return filterReviews(reviews, {
      companyId: companyFilter,
      major: majorFilter,
      sortBy,
    });
  }, [reviews, companyFilter, majorFilter, sortBy]);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className="section-title">Intern Reviews</h1>
            <p className="section-subtitle">
              Real experiences from {reviews.length} UIT seniors across {allCompanies.length} companies
            </p>
          </div>
          <Link href="/reviews/new" className="btn btn-primary" id="write-review-top-btn">
            <Icon name="edit" size={16} />
            Write a Review
          </Link>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterItem}>
            <select
              className="select-field"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              id="review-company-filter"
            >
              <option value="">All Companies</option>
              {allCompanies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterItem}>
            <select
              className="select-field"
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
              id="review-major-filter"
            >
              <option value="">All Majors</option>
              {MAJORS.map(m => (
                <option key={m.code} value={m.code}>{m.code} - {m.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterItem}>
            <select
              className="select-field"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="review-sort-filter"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        <div className={styles.resultInfo}>
          Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
          {status === 'loading' && ' - loading Supabase...'}
          {source === 'supabase' && ' - synced with Supabase'}
          {source === 'seed' && status !== 'loading' && ' - using local seed data'}
          {source === 'empty-supabase' && ' - Supabase connected, no rows yet'}
        </div>

        {/* Reviews List */}
        <div className={styles.reviewsList}>
          {filteredReviews.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>
                <Icon name="edit" size={42} />
              </span>
              <h3>No reviews found</h3>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            filteredReviews.map((review, i) => (
              <div key={review.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                <ReviewCard
                  review={review}
                  company={allCompanies.find((company) => company.id === review.companyId)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
