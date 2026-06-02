import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} id="site-footer">
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <div className={styles.brandLogo}>
              <img className={styles.brandIcon} src="/uit-logo.png" alt="UIT" />
              <span className={styles.brandName}>InfoTern</span>
            </div>
            <p className={styles.brandDesc}>
              Helping UIT students make informed internship decisions through real reviews,
              company insights, and senior connections.
            </p>
          </div>

          <div className={styles.footerColumn}>
            <h4>Explore</h4>
            <Link href="/companies">Companies</Link>
            <Link href="/reviews">Reviews</Link>
            <Link href="/match">Smart Match</Link>
            <Link href="/connect">Senior Connect</Link>
          </div>

          <div className={styles.footerColumn}>
            <h4>Contribute</h4>
            <Link href="/reviews/new">Write a Review</Link>
            <Link href="/connect">Become a Mentor</Link>
            <Link href="/about">About Us</Link>
          </div>

          <div className={styles.footerColumn}>
            <h4>UIT Majors</h4>
            <Link href="/companies?major=SE">Software Engineering</Link>
            <Link href="/companies?major=KE">Knowledge Engineering</Link>
            <Link href="/companies?major=CS">Cybersecurity</Link>
            <Link href="/companies?major=CN">Computer Networking</Link>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>Copyright {new Date().getFullYear()} InfoTern - UIT Internship Platform</span>
          <span>Built for UIT Students</span>
        </div>
      </div>
    </footer>
  );
}
