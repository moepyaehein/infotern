'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { companies } from '@/data/companies';
import { MAJORS } from '@/data/majors';
import { filterCompanies } from '@/lib/utils';
import { fetchCompanies } from '@/lib/companiesApi';
import CompanyCard from '@/components/CompanyCard';
import Icon from '@/components/Icon';
import styles from './page.module.css';

function CompaniesContent() {
  const searchParams = useSearchParams();
  const initialMajor = searchParams.get('major');

  const [search, setSearch] = useState('');
  const [selectedMajors, setSelectedMajors] = useState(initialMajor ? [initialMajor] : []);
  const [minRating, setMinRating] = useState(0);
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

  const filteredCompanies = useMemo(() => {
    return filterCompanies(allCompanies, { search, majors: selectedMajors, minRating });
  }, [allCompanies, search, selectedMajors, minRating]);

  const toggleMajor = (code) => {
    setSelectedMajors(prev =>
      prev.includes(code) ? prev.filter(m => m !== code) : [...prev, code]
    );
  };

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <h1 className="section-title">Company Directory</h1>
          <p className="section-subtitle">
            Explore {allCompanies.length} companies offering internships for UIT students
          </p>
        </div>

        <div className={styles.layout}>
          {/* Filter Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                <Icon name="search" size={18} />
                Search
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Company, role, or industry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="company-search-input"
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                <Icon name="graduate" size={18} />
                Filter by Major
              </label>
              <div className={styles.majorFilters}>
                {MAJORS.map(major => (
                  <button
                    key={major.code}
                    className={`${styles.majorBtn} ${selectedMajors.includes(major.code) ? styles.majorBtnActive : ''}`}
                    onClick={() => toggleMajor(major.code)}
                    style={selectedMajors.includes(major.code) ? { borderColor: major.color, color: major.color } : {}}
                    id={`filter-major-${major.code}`}
                  >
                    {major.code}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                <Icon name="star" size={18} />
                Minimum Rating
              </label>
              <div className={styles.ratingFilters}>
                {[0, 3, 3.5, 4, 4.5].map(rating => (
                  <button
                    key={rating}
                    className={`${styles.ratingBtn} ${minRating === rating ? styles.ratingBtnActive : ''}`}
                    onClick={() => setMinRating(rating)}
                  >
                    {rating === 0 ? 'All' : `${rating}+`}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterInfo}>
              Showing {filteredCompanies.length} of {allCompanies.length} companies
            </div>
          </aside>

          {/* Results Grid */}
          <div className={styles.results}>
            {filteredCompanies.length === 0 ? (
              <div className={styles.noResults}>
                <span className={styles.noResultsIcon}>
                  <Icon name="search" size={42} />
                </span>
                <h3>No companies found</h3>
                <p>Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {filteredCompanies.map((company, i) => (
                  <div key={company.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                    <CompanyCard company={company} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompaniesLoading() {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className="section-title">Company Directory</h1>
          <p className="section-subtitle">Loading companies...</p>
        </div>
      </div>
    </div>
  );
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={<CompaniesLoading />}>
      <CompaniesContent />
    </Suspense>
  );
}
