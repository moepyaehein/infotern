import { getCompanyById } from '@/lib/utils';
import { getMajorBadgeClass } from '@/data/majors';
import Icon from './Icon';
import styles from './SeniorCard.module.css';

const SENIOR_ICON_BY_MAJOR = {
  SE: 'mobile',
  CS: 'shield',
  KE: 'ai',
  CN: 'signal',
  ES: 'plug',
  BIS: 'briefcase',
  HPC: 'globe',
};

export default function SeniorCard({ senior, company: companyOverride = null }) {
  const company = companyOverride || getCompanyById(senior.companyId);

  return (
    <div className={`${styles.card} ${!senior.available ? styles.unavailable : ''}`} id={`senior-${senior.id}`}>
      <div className={styles.avatar}>
        <Icon name={senior.avatar || SENIOR_ICON_BY_MAJOR[senior.major] || 'person'} size={34} />
      </div>

      <h3 className={styles.name}>{senior.name}</h3>

      <span className={`badge ${getMajorBadgeClass(senior.major)}`}>{senior.major}</span>

      <div className={styles.meta}>
        <span className={styles.role}>{senior.role}</span>
        {company && <span className={styles.company}>at {company.name}</span>}
        <span className={styles.company}>Class of {senior.graduationYear}</span>
      </div>

      <p className={styles.bio}>{senior.bio}</p>

      <div className={styles.stats}>
        <span className={styles.helpBadge}>
          <Icon name="users" size={15} />
          Helped {senior.helpCount} students
        </span>
        {!senior.available && <span className={styles.unavailableBadge}>Currently Unavailable</span>}
      </div>

      {senior.available && (
        <div className={styles.contacts}>
          {senior.contact.telegram && (
            <a
              href={`https://t.me/${senior.contact.telegram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactBtn}
            >
              <Icon name="telegram" size={16} />
              Telegram
            </a>
          )}
          {senior.contact.facebook && (
            <a
              href={`https://${senior.contact.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactBtn}
            >
              <Icon name="facebook" size={16} />
              Facebook
            </a>
          )}
          {senior.contact.email && (
            <a
              href={`mailto:${senior.contact.email}`}
              className={styles.contactBtn}
            >
              <Icon name="email" size={16} />
              Email
            </a>
          )}
        </div>
      )}
    </div>
  );
}
