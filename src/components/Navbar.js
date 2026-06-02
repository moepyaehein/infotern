'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCurrentUser, logoutUser } from '@/lib/authApi';
import styles from './Navbar.module.css';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/companies', label: 'Companies' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/match', label: 'Smart Match' },
  { href: '/connect', label: 'Senior Connect' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then(({ user: currentUser }) => {
        if (isMounted) setUser(currentUser);
      })
      .catch(() => {
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setAuthReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  async function handleLogout() {
    await logoutUser();
    setUser(null);
    setMobileOpen(false);
  }

  function renderAuthControls() {
    return user ? (
      <div className={styles.authArea}>
        <button className={styles.accountButton} type="button" aria-label="Account menu">
          <span className={styles.accountAvatar}>U</span>
          <span className={styles.accountText}>
            <strong>UIT Account</strong>
            <small>{user.isAdmin ? 'Admin' : 'Signed in'}</small>
          </span>
        </button>
        <div className={styles.accountMenu}>
          <span>{user.isAdmin ? 'Admin access' : 'UIT email verified'}</span>
          <button className={styles.logoutBtn} type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    ) : (
      <Link
        href="/auth"
        className={`${styles.authLink} ${pathname === '/auth' ? styles.authLinkActive : ''}`}
        onClick={() => setMobileOpen(false)}
      >
        Sign in
      </Link>
    );
  }

  return (
    <nav className={styles.navbar} id="main-navbar">
      <div className={styles.navInner}>
        <Link href="/" className={styles.logo}>
          <img className={styles.logoMark} src="/uit-logo.png" alt="UIT" />
          <span className={styles.logoText}>
            <span>InfoTern</span>
            <small>University of Information Technology</small>
          </span>
        </Link>

        <div className={styles.navLinks}>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}
            >
              {item.label}
            </Link>
          ))}
          {user?.isAdmin && (
            <Link
              href="/admin"
              className={`${styles.navLink} ${pathname === '/admin' ? styles.navLinkActive : ''}`}
            >
              Admin
            </Link>
          )}
        </div>

        <div className={styles.desktopAuth}>
          {authReady ? renderAuthControls() : <span className={styles.authSkeleton} />}
        </div>

        <button
          className={styles.menuToggle}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          id="mobile-menu-toggle"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {user?.isAdmin && (
            <Link
              href="/admin"
              className={`${styles.navLink} ${pathname === '/admin' ? styles.navLinkActive : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              Admin
            </Link>
          )}
          <div className={styles.mobileAuth}>
            {authReady ? renderAuthControls() : <span className={styles.authSkeleton} />}
          </div>
        </div>
      )}
    </nav>
  );
}
