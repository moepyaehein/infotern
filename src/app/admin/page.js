'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { companies } from '@/data/companies';
import {
  createCompanyAdmin,
  deleteCompanyAdmin,
  deleteSeniorAdmin,
  fetchAdminSummary,
  updateCompanyAdmin,
  updateSeniorAdmin,
} from '@/lib/adminApi';
import styles from './page.module.css';

const emptyCompanyForm = {
  id: '',
  name: '',
  description: '',
  industry: '',
  location: '',
  mapUrl: '',
  size: 'Medium (50-100 employees)',
  founded: '',
  website: '',
  workingHours: '9:00 AM - 5:00 PM (Mon-Fri)',
  majorsText: 'SE, KE',
  rolesText: '',
  facilitiesText: '',
  internDuration: '3 months',
  stipend: '',
  rating: 0,
  totalReviews: 0,
  logo: 'building',
  featured: false,
  active: true,
};

function toCsv(values) {
  return (values || []).join(', ');
}

function fromCsv(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function serializeCompanyForm(form) {
  return {
    ...form,
    majors: fromCsv(form.majorsText),
    roles: fromCsv(form.rolesText),
    facilities: fromCsv(form.facilitiesText),
  };
}

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [companyForm, setCompanyForm] = useState(emptyCompanyForm);
  const [editingCompanyId, setEditingCompanyId] = useState('');

  async function loadAdmin() {
    setStatus('loading');
    setMessage('');

    try {
      const payload = await fetchAdminSummary();
      setData(payload);
      setStatus('ready');
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadAdmin();
  }, []);

  async function updateSenior(id, patch) {
    setMessage('');

    try {
      const payload = await updateSeniorAdmin(id, patch);
      setData((current) => ({
        ...current,
        seniors: current.seniors.map((senior) =>
          senior.id === id ? payload.senior : senior
        ),
      }));
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function removeSenior(id) {
    setMessage('');

    try {
      await deleteSeniorAdmin(id);
      setData((current) => ({
        ...current,
        seniors: current.seniors.filter((senior) => senior.id !== id),
      }));
    } catch (error) {
      setMessage(error.message);
    }
  }

  function updateCompanyField(event) {
    const { name, value, type, checked } = event.target;
    setCompanyForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function editCompany(company) {
    setEditingCompanyId(company.id);
    setCompanyForm({
      ...emptyCompanyForm,
      ...company,
      majorsText: toCsv(company.majors),
      rolesText: toCsv(company.roles),
      facilitiesText: toCsv(company.facilities),
    });
  }

  function resetCompanyForm() {
    setEditingCompanyId('');
    setCompanyForm(emptyCompanyForm);
  }

  async function submitCompany(event) {
    event.preventDefault();
    setMessage('');

    try {
      const payload = editingCompanyId
        ? await updateCompanyAdmin(editingCompanyId, serializeCompanyForm(companyForm))
        : await createCompanyAdmin(serializeCompanyForm(companyForm));

      setData((current) => {
        const exists = current.companies.some((company) => company.id === payload.company.id);
        return {
          ...current,
          companies: exists
            ? current.companies.map((company) =>
                company.id === payload.company.id ? payload.company : company
              )
            : [payload.company, ...current.companies],
        };
      });
      resetCompanyForm();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function patchCompany(company, patch) {
    setMessage('');

    try {
      const payload = await updateCompanyAdmin(company.id, { ...company, ...patch });
      setData((current) => ({
        ...current,
        companies: current.companies.map((item) =>
          item.id === company.id ? payload.company : item
        ),
      }));
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function removeCompany(id) {
    setMessage('');

    try {
      await deleteCompanyAdmin(id);
      setData((current) => ({
        ...current,
        companies: current.companies.filter((company) => company.id !== id),
      }));
    } catch (error) {
      setMessage(error.message);
    }
  }

  const seniors = data?.seniors || [];
  const managedCompanies = data?.companies || [];
  const adminCompanies = [...managedCompanies, ...companies];
  const getCompanyName = (id) => adminCompanies.find((company) => company.id === id)?.name || id;
  const pending = seniors.filter((senior) => !senior.approved);

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <div>
            <span className={styles.kicker}>Admin</span>
            <h1>System Management</h1>
            <p>Review mentor requests and keep InfoTern clean for UIT students.</p>
          </div>
          <Link className={styles.secondaryButton} href="/connect">
            View Senior Connect
          </Link>
        </header>

        {status === 'loading' && (
          <div className={styles.stateCard}>Loading admin dashboard...</div>
        )}

        {status === 'error' && (
          <div className={styles.stateCard}>
            <h2>Admin access required</h2>
            <p>{message}</p>
            <Link className={styles.primaryButton} href="/auth">
              Login with admin account
            </Link>
          </div>
        )}

        {status === 'ready' && data && (
          <>
            {message && <div className={styles.alert}>{message}</div>}

            <section className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span>Pending seniors</span>
                <strong>{pending.length}</strong>
              </div>
              <div className={styles.statCard}>
                <span>Approved seniors</span>
                <strong>{seniors.filter((senior) => senior.approved).length}</strong>
              </div>
              <div className={styles.statCard}>
                <span>Managed companies</span>
                <strong>{managedCompanies.length}</strong>
              </div>
              <div className={styles.statCard}>
                <span>Reviews</span>
                <strong>{data.stats.reviews}</strong>
              </div>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2>Senior Mentor Requests</h2>
                  <p>{pending.length} profile{pending.length !== 1 ? 's' : ''} waiting for approval.</p>
                </div>
                <button className={styles.secondaryButton} type="button" onClick={loadAdmin}>
                  Refresh
                </button>
              </div>

              {seniors.length === 0 ? (
                <div className={styles.empty}>No Supabase senior profiles yet.</div>
              ) : (
                <div className={styles.table}>
                  {seniors.map((senior) => (
                    <article key={senior.id} className={styles.row}>
                      <div className={styles.profile}>
                        <div className={styles.avatar}>{senior.major}</div>
                        <div>
                          <h3>{senior.name}</h3>
                          <p>{senior.role} at {getCompanyName(senior.companyId)}</p>
                          <span>{senior.email}</span>
                        </div>
                      </div>

                      <div className={styles.details}>
                        <span>Class of {senior.graduationYear}</span>
                        <span>{senior.available ? 'Available' : 'Unavailable'}</span>
                        <span className={senior.approved ? styles.approved : styles.pending}>
                          {senior.approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>

                      <p className={styles.bio}>{senior.bio}</p>

                      <div className={styles.actions}>
                        <button
                          type="button"
                          onClick={() => updateSenior(senior.id, { approved: !senior.approved })}
                          className={senior.approved ? styles.secondaryButton : styles.primaryButton}
                        >
                          {senior.approved ? 'Unapprove' : 'Approve'}
                        </button>
                        <button
                          type="button"
                          onClick={() => updateSenior(senior.id, { available: !senior.available })}
                          className={styles.secondaryButton}
                        >
                          {senior.available ? 'Hide' : 'Show'}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSenior(senior.id)}
                          className={styles.dangerButton}
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2>Company Listings</h2>
                  <p>{managedCompanies.length} database compan{managedCompanies.length === 1 ? 'y' : 'ies'} managed by admin.</p>
                </div>
                <Link className={styles.secondaryButton} href="/companies">
                  View Directory
                </Link>
              </div>

              <form className={styles.companyForm} onSubmit={submitCompany}>
                <label>
                  <span>Company name</span>
                  <input name="name" value={companyForm.name} onChange={updateCompanyField} placeholder="Company name" />
                </label>
                <label>
                  <span>Custom ID</span>
                  <input name="id" value={companyForm.id} onChange={updateCompanyField} placeholder="auto-from-name" disabled={Boolean(editingCompanyId)} />
                </label>
                <label>
                  <span>Industry</span>
                  <input name="industry" value={companyForm.industry} onChange={updateCompanyField} placeholder="Software Development" />
                </label>
                <label>
                  <span>Location</span>
                  <input name="location" value={companyForm.location} onChange={updateCompanyField} placeholder="Yangon" />
                </label>
                <label>
                  <span>Size</span>
                  <input name="size" value={companyForm.size} onChange={updateCompanyField} />
                </label>
                <label>
                  <span>Founded</span>
                  <input name="founded" type="number" value={companyForm.founded} onChange={updateCompanyField} />
                </label>
                <label>
                  <span>Website</span>
                  <input name="website" value={companyForm.website} onChange={updateCompanyField} placeholder="https://example.com" />
                </label>
                <label>
                  <span>Working hours</span>
                  <input name="workingHours" value={companyForm.workingHours} onChange={updateCompanyField} />
                </label>
                <label>
                  <span>Intern duration</span>
                  <input name="internDuration" value={companyForm.internDuration} onChange={updateCompanyField} />
                </label>
                <label>
                  <span>Stipend</span>
                  <input name="stipend" value={companyForm.stipend} onChange={updateCompanyField} placeholder="150,000 - 250,000 MMK/month" />
                </label>
                <label>
                  <span>Rating</span>
                  <input name="rating" type="number" step="0.1" min="0" max="5" value={companyForm.rating} onChange={updateCompanyField} />
                </label>
                <label>
                  <span>Total reviews</span>
                  <input name="totalReviews" type="number" min="0" value={companyForm.totalReviews} onChange={updateCompanyField} />
                </label>
                <label>
                  <span>Logo icon</span>
                  <input name="logo" value={companyForm.logo} onChange={updateCompanyField} placeholder="building" />
                </label>
                <label>
                  <span>Majors</span>
                  <input name="majorsText" value={companyForm.majorsText} onChange={updateCompanyField} placeholder="SE, KE, BIS" />
                </label>
                <label>
                  <span>Roles</span>
                  <input name="rolesText" value={companyForm.rolesText} onChange={updateCompanyField} placeholder="Frontend Developer, QA Engineer" />
                </label>
                <label>
                  <span>Facilities</span>
                  <input name="facilitiesText" value={companyForm.facilitiesText} onChange={updateCompanyField} placeholder="Training, Free Lunch" />
                </label>
                <label className={styles.fieldWide}>
                  <span>Description</span>
                  <textarea name="description" value={companyForm.description} onChange={updateCompanyField} placeholder="Short company description" />
                </label>
                <div className={styles.checks}>
                  <label>
                    <input name="featured" type="checkbox" checked={companyForm.featured} onChange={updateCompanyField} />
                    Featured
                  </label>
                  <label>
                    <input name="active" type="checkbox" checked={companyForm.active} onChange={updateCompanyField} />
                    Active
                  </label>
                </div>
                <div className={styles.formActions}>
                  <button className={styles.primaryButton} type="submit">
                    {editingCompanyId ? 'Update Company' : 'Add Company'}
                  </button>
                  {editingCompanyId && (
                    <button className={styles.secondaryButton} type="button" onClick={resetCompanyForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {managedCompanies.length === 0 ? (
                <div className={styles.empty}>No database companies yet. Add one above.</div>
              ) : (
                <div className={styles.companyList}>
                  {managedCompanies.map((company) => (
                    <article key={company.id} className={styles.companyRow}>
                      <div>
                        <h3>{company.name}</h3>
                        <p>{company.industry} - {company.location}</p>
                        <span>{company.majors.join(', ')}</span>
                      </div>
                      <div className={styles.details}>
                        <span className={company.active ? styles.approved : styles.pending}>
                          {company.active ? 'Active' : 'Hidden'}
                        </span>
                        {company.featured && <span>Featured</span>}
                      </div>
                      <div className={styles.actions}>
                        <button className={styles.secondaryButton} type="button" onClick={() => editCompany(company)}>
                          Edit
                        </button>
                        <button className={styles.secondaryButton} type="button" onClick={() => patchCompany(company, { active: !company.active })}>
                          {company.active ? 'Hide' : 'Show'}
                        </button>
                        <button className={styles.secondaryButton} type="button" onClick={() => patchCompany(company, { featured: !company.featured })}>
                          {company.featured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button className={styles.dangerButton} type="button" onClick={() => removeCompany(company.id)}>
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
