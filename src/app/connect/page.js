'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { seniors } from '@/data/seniors';
import { companies } from '@/data/companies';
import { MAJORS } from '@/data/majors';
import SeniorCard from '@/components/SeniorCard';
import Icon from '@/components/Icon';
import { getCurrentUser } from '@/lib/authApi';
import { fetchCompanies } from '@/lib/companiesApi';
import { getSupabaseSeniors, saveSeniorProfile } from '@/lib/seniorsApi';
import styles from './page.module.css';

const emptyProfile = {
  name: '',
  major: 'SE',
  graduationYear: new Date().getFullYear(),
  companyId: companies[0]?.id || '',
  role: '',
  bio: '',
  telegram: '',
  facebook: '',
  available: true,
};

export default function ConnectPage() {
  const [majorFilter, setMajorFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [remoteSeniors, setRemoteSeniors] = useState([]);
  const [allCompanies, setAllCompanies] = useState(companies);
  const [ownProfile, setOwnProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileForm, setProfileForm] = useState(emptyProfile);
  const [formOpen, setFormOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([getCurrentUser(), getSupabaseSeniors(), fetchCompanies()]).then((results) => {
      if (!isMounted) return;

      const [authResult, seniorsResult, companiesResult] = results;

      if (authResult.status === 'fulfilled') {
        setCurrentUser(authResult.value.user);
      }

      if (seniorsResult.status === 'fulfilled') {
        setRemoteSeniors(seniorsResult.value.seniors || []);
        setOwnProfile(seniorsResult.value.ownProfile || null);
      }

      if (
        companiesResult.status === 'fulfilled' &&
        companiesResult.value.companies?.length
      ) {
        setAllCompanies(companiesResult.value.companies);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ownProfile) return;

    setProfileForm({
      name: ownProfile.name || '',
      major: ownProfile.major || 'SE',
      graduationYear: ownProfile.graduationYear || new Date().getFullYear(),
      companyId: ownProfile.companyId || allCompanies[0]?.id || companies[0]?.id || '',
      role: ownProfile.role || '',
      bio: ownProfile.bio || '',
      telegram: ownProfile.contact?.telegram || '',
      facebook: ownProfile.contact?.facebook || '',
      available: ownProfile.available ?? true,
    });
  }, [allCompanies, ownProfile]);

  const allSeniors = useMemo(() => {
    return [...remoteSeniors, ...seniors];
  }, [remoteSeniors]);

  const filteredSeniors = useMemo(() => {
    return allSeniors.filter((senior) => {
      if (majorFilter && senior.major !== majorFilter) return false;
      if (companyFilter && senior.companyId !== companyFilter) return false;
      if (availableOnly && !senior.available) return false;
      return true;
    });
  }, [allSeniors, majorFilter, companyFilter, availableOnly]);

  function updateProfileField(event) {
    const { name, value, type, checked } = event.target;
    setProfileForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const payload = await saveSeniorProfile(profileForm);
      setOwnProfile(payload.senior);
      setStatus('success');
      setMessage(payload.message);
      setFormOpen(false);
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1 className="section-title">Senior Connect</h1>
            <p className="section-subtitle">
              Connect with {allSeniors.filter((senior) => senior.available).length} senior mentors who&apos;ve been through the internship process
            </p>
          </div>
        </div>

        <div className={styles.banner}>
          <div className={styles.bannerIcon}>
            <Icon name="learning" size={22} />
          </div>
          <div className={styles.bannerText}>
            <strong>How it works:</strong> Browse senior profiles, find someone from your major or target company,
            and reach out via Telegram, Facebook, or Email. Be respectful and specific with your questions!
          </div>
        </div>

        <div className={styles.joinPanel}>
          <div>
            <span className={styles.joinEyebrow}>For UIT seniors</span>
            <h2>Become a mentor</h2>
            <p>
              Share your internship experience with juniors. Your profile will be reviewed by an admin before it appears publicly.
            </p>
            {ownProfile && (
              <div className={styles.pendingBadge}>
                {ownProfile.approved ? 'Your mentor profile is approved.' : 'Your mentor profile is waiting for admin approval.'}
              </div>
            )}
            {message && (
              <div className={`${styles.formMessage} ${styles[status] || ''}`}>
                {message}
              </div>
            )}
          </div>

          {currentUser ? (
            <button
              type="button"
              className={styles.joinButton}
              onClick={() => setFormOpen((open) => !open)}
            >
              {formOpen ? 'Close form' : ownProfile ? 'Update profile' : 'Join as senior'}
            </button>
          ) : (
            <Link href="/auth" className={styles.joinButton}>
              Login to join
            </Link>
          )}
        </div>

        {formOpen && (
          <form className={styles.profileForm} onSubmit={handleProfileSubmit}>
            <label className={styles.field}>
              <span>Name</span>
              <input
                name="name"
                value={profileForm.name}
                onChange={updateProfileField}
                placeholder="Moe Pyae Hein"
              />
            </label>

            <label className={styles.field}>
              <span>Major</span>
              <select name="major" value={profileForm.major} onChange={updateProfileField}>
                {MAJORS.map((major) => (
                  <option key={major.code} value={major.code}>
                    {major.code} - {major.name}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>Graduation year</span>
              <input
                name="graduationYear"
                type="number"
                min="2000"
                max="2100"
                value={profileForm.graduationYear}
                onChange={updateProfileField}
              />
            </label>

            <label className={styles.field}>
              <span>Internship company</span>
              <select name="companyId" value={profileForm.companyId} onChange={updateProfileField}>
                {allCompanies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>Role</span>
              <input
                name="role"
                value={profileForm.role}
                onChange={updateProfileField}
                placeholder="Frontend Developer"
              />
            </label>

            <label className={styles.field}>
              <span>Telegram</span>
              <input
                name="telegram"
                value={profileForm.telegram}
                onChange={updateProfileField}
                placeholder="@username"
              />
            </label>

            <label className={`${styles.field} ${styles.fieldWide}`}>
              <span>Bio</span>
              <textarea
                name="bio"
                value={profileForm.bio}
                onChange={updateProfileField}
                placeholder="Tell juniors what you can help with..."
              />
            </label>

            <label className={styles.field}>
              <span>Facebook</span>
              <input
                name="facebook"
                value={profileForm.facebook}
                onChange={updateProfileField}
                placeholder="facebook.com/username"
              />
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="available"
                checked={profileForm.available}
                onChange={updateProfileField}
                className={styles.checkbox}
              />
              <span className={styles.checkboxCustom} />
              Available for juniors
            </label>

            <button className={styles.submitProfile} type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Saving...' : 'Submit for approval'}
            </button>
          </form>
        )}

        <div className={styles.filters}>
          <div className={styles.filterItem}>
            <select
              className="select-field"
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
              id="connect-major-filter"
            >
              <option value="">All Majors</option>
              {MAJORS.map((major) => (
                <option key={major.code} value={major.code}>{major.code} - {major.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterItem}>
            <select
              className="select-field"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              id="connect-company-filter"
            >
              <option value="">All Companies</option>
              {allCompanies.map((company) => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>
          <label className={styles.checkboxLabel} id="connect-available-toggle">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxCustom} />
            Available only
          </label>
        </div>

        <div className={styles.resultInfo}>
          Showing {filteredSeniors.length} senior{filteredSeniors.length !== 1 ? 's' : ''}
        </div>

        {filteredSeniors.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>
              <Icon name="users" size={42} />
            </span>
            <h3>No seniors found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredSeniors.map((senior, i) => (
              <div key={senior.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                <SeniorCard
                  senior={senior}
                  company={allCompanies.find((company) => company.id === senior.companyId)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
