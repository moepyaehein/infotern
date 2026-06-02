import Link from 'next/link';
import { getMajorBadgeClass } from '@/data/majors';
import Icon from './Icon';
import styles from './CompanyCard.module.css';

export default function CompanyCard({ company }) {
  return (
    <Link href={`/companies/${company.id}`} className={styles.card} id={`company-card-${company.id}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardLogo}>
          <Icon name={company.logo} size={28} />
        </div>
        <div className={styles.cardInfo}>
          <h3 className={styles.cardName}>{company.name}</h3>
          <span className={styles.cardIndustry}>{company.industry}</span>
        </div>
        <div className={styles.cardActions}>
          {company.featured && (
            <span className={styles.featured}>
              <Icon name="star" size={14} />
              Featured
            </span>
          )}
          <span className={styles.cardRating}>
            <span className={styles.ratingValue}>
              <Icon name="star" size={16} />
              {company.rating}
            </span>
            <span className={styles.ratingCount}>({company.totalReviews})</span>
          </span>
        </div>
      </div>

      <p className={styles.cardDescription}>{company.description}</p>

      <div className={styles.cardMeta}>
        <span className={styles.metaItem}>
          <Icon name="pin" size={15} />
          {company.location}
        </span>
        <span className={styles.metaItem}>
          <Icon name="clock" size={15} />
          {company.workingHours}
        </span>
      </div>

      <div className={styles.cardMajors}>
        {company.majors.map(major => (
          <span key={major} className={`badge ${getMajorBadgeClass(major)}`}>
            {major}
          </span>
        ))}
      </div>
    </Link>
  );
}
