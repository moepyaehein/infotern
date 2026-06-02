'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { companies } from '@/data/companies';
import { reviews as seedReviews } from '@/data/reviews';
import { seniors as allSeniors } from '@/data/seniors';
import { getMajorBadgeClass } from '@/data/majors';
import { getStoredReviews } from '@/lib/storage';
import { fetchCompanies } from '@/lib/companiesApi';
import { fetchReviews } from '@/lib/reviewsApi';
import { getSupabaseSeniors } from '@/lib/seniorsApi';
import ReviewCard from '@/components/ReviewCard';
import SeniorCard from '@/components/SeniorCard';
import Icon from '@/components/Icon';
import styles from './page.module.css';

export default function CompanyDetailPage({ params }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviews, setReviews] = useState(seedReviews);
  const [allCompanies, setAllCompanies] = useState(companies);
  const [seniors, setSeniors] = useState(allSeniors);
  const [companiesLoaded, setCompaniesLoaded] = useState(false);
  const company = allCompanies.find(c => c.id === id);

  useEffect(() => {
    let mounted = true;

    async function loadPageData() {
      try {
        const [companiesPayload, reviewsPayload, seniorsPayload] = await Promise.allSettled([
          fetchCompanies(),
          fetchReviews(),
          getSupabaseSeniors(),
        ]);

        if (!mounted) return;

        if (
          companiesPayload.status === 'fulfilled' &&
          companiesPayload.value.companies?.length
        ) {
          setAllCompanies(companiesPayload.value.companies);
        }
        setCompaniesLoaded(true);

        if (
          reviewsPayload.status === 'fulfilled' &&
          reviewsPayload.value.configured &&
          reviewsPayload.value.reviews.length > 0
        ) {
          setReviews(reviewsPayload.value.reviews);
        } else {
          const localReviews = getStoredReviews();
          setReviews(localReviews.length > 0 ? localReviews : seedReviews);
        }

        if (
          seniorsPayload.status === 'fulfilled' &&
          seniorsPayload.value.seniors?.length
        ) {
          setSeniors([...seniorsPayload.value.seniors, ...allSeniors]);
        }
      } catch (error) {
        if (mounted) {
          setCompaniesLoaded(true);
          const localReviews = getStoredReviews();
          setReviews(localReviews.length > 0 ? localReviews : seedReviews);
        }
      }
    }

    loadPageData();

    return () => {
      mounted = false;
    };
  }, []);

  if (!company && !companiesLoaded) {
    return (
      <div className={styles.notFound}>
        <h1>Loading Company</h1>
        <p>Getting the latest company information...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className={styles.notFound}>
        <h1>Company Not Found</h1>
        <p>The company you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/companies" className="btn btn-primary">Back to Companies</Link>
      </div>
    );
  }

  const companyReviews = reviews.filter(r => r.companyId === id);
  const companySeniors = seniors.filter(s => s.companyId === id);

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Back link */}
        <Link href="/companies" className={styles.backLink}>Back to Companies</Link>

        {/* Company Header */}
        <div className={styles.companyHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.logoLarge}>
              <Icon name={company.logo} size={42} />
            </div>
            <div className={styles.headerInfo}>
              <h1 className={styles.companyName}>{company.name}</h1>
              <p className={styles.companyIndustry}>{company.industry}</p>
              <div className={styles.headerMeta}>
                <span className={styles.rating}>
                  <Icon name="star" size={17} />
                  {company.rating}
                </span>
                <span className={styles.reviewCount}>({company.totalReviews} reviews)</span>
                <span className={styles.size}>{company.size}</span>
              </div>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Link href="/reviews/new" className="btn btn-primary" id="write-review-btn">
              <Icon name="edit" size={16} />
              Write Review
            </Link>
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                <Icon name="website" size={16} />
                Website
              </a>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {['overview', 'reviews', 'seniors'].map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
              id={`tab-${tab}`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'reviews' && `Reviews (${companyReviews.length})`}
              {tab === 'seniors' && `Seniors (${companySeniors.length})`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className={styles.overview}>
              <div className={styles.overviewMain}>
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>About</h2>
                  <p className={styles.description}>{company.description}</p>
                </section>

                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Available Roles</h2>
                  <div className={styles.rolesList}>
                    {company.roles.map(role => (
                      <span key={role} className={styles.roleTag}>{role}</span>
                    ))}
                  </div>
                </section>

                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Compatible Majors</h2>
                  <div className={styles.majorsList}>
                    {company.majors.map(major => (
                      <span key={major} className={`badge ${getMajorBadgeClass(major)}`} style={{ padding: '6px 16px', fontSize: '0.875rem' }}>
                        {major}
                      </span>
                    ))}
                  </div>
                </section>

                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Facilities & Benefits</h2>
                  <div className={styles.facilitiesList}>
                    {company.facilities.map(facility => (
                      <span key={facility} className={styles.facilityTag}>
                        <Icon name="check" size={15} />
                        {facility}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              <aside className={styles.overviewSidebar}>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>Quick Info</h3>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      <Icon name="pin" size={14} />
                      Location
                    </span>
                    <span className={styles.infoValue}>{company.location}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      <Icon name="clock" size={14} />
                      Working Hours
                    </span>
                    <span className={styles.infoValue}>{company.workingHours}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      <Icon name="calendar" size={14} />
                      Intern Duration
                    </span>
                    <span className={styles.infoValue}>{company.internDuration}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      <Icon name="wallet" size={14} />
                      Stipend
                    </span>
                    <span className={styles.infoValue}>{company.stipend}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      <Icon name="building" size={14} />
                      Company Size
                    </span>
                    <span className={styles.infoValue}>{company.size}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      <Icon name="calendar" size={14} />
                      Founded
                    </span>
                    <span className={styles.infoValue}>{company.founded}</span>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className={styles.reviewsList}>
              {companyReviews.length === 0 ? (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}><Icon name="edit" size={40} /></span>
                  <h3>No reviews yet</h3>
                  <p>Be the first to review {company.name}!</p>
                  <Link href="/reviews/new" className="btn btn-primary">Write a Review</Link>
                </div>
              ) : (
                companyReviews.map(review => (
                  <ReviewCard key={review.id} review={review} showCompany={false} />
                ))
              )}
            </div>
          )}

          {activeTab === 'seniors' && (
            <div className={styles.seniorsGrid}>
              {companySeniors.length === 0 ? (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}><Icon name="users" size={40} /></span>
                  <h3>No senior mentors yet</h3>
                  <p>No seniors have registered as mentors for {company.name} yet.</p>
                </div>
              ) : (
                companySeniors.map(senior => (
                  <SeniorCard key={senior.id} senior={senior} company={company} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
