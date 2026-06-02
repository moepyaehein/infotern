'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, loginWithEmail, signupWithEmail } from '@/lib/authApi';
import styles from './page.module.css';

const UIT_DOMAIN = '@uit.edu.mm';

const emptyForm = {
  fullName: '',
  email: '',
  password: '',
};

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  const isSignup = mode === 'signup';

  const emailIsValid = useMemo(() => {
    return form.email.trim().toLowerCase().endsWith(UIT_DOMAIN);
  }, [form.email]);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then(({ user: currentUser }) => {
        if (isMounted) setUser(currentUser);
      })
      .catch(() => {
        if (isMounted) setUser(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setMessage('');
    setStatus('idle');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    const email = form.email.trim().toLowerCase();

    if (!email.endsWith(UIT_DOMAIN)) {
      setMessage(`Use your UIT email address, like moepyaehein${UIT_DOMAIN}.`);
      return;
    }

    if (form.password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }

    setStatus('loading');

    try {
      const payload = isSignup
        ? await signupWithEmail({
            email,
            password: form.password,
            fullName: form.fullName.trim(),
          })
        : await loginWithEmail({
            email,
            password: form.password,
          });

      setStatus('success');
      setMessage(payload.message);
      setUser(payload.user);

      if (!payload.needsEmailConfirmation) {
        router.push('/connect');
        router.refresh();
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  }

  return (
    <section className={styles.authShell}>
      <div className={styles.authPanel}>
        <div className={styles.visual}>
          <img className={styles.visualImage} src="/uit-campus.jpg" alt="UIT campus" />
          <div className={styles.visualOverlay} />
          <Link href="/" className={styles.brand}>
            <img src="/uit-logo.png" alt="UIT" />
            <span>
              <strong>InfoTern</strong>
              <small>UIT verified access</small>
            </span>
          </Link>
          <div className={styles.visualCopy}>
            <span className={styles.kicker}>University account only</span>
            <h1>Join with your UIT email.</h1>
            <p>
              Students and seniors use their official university account to share reviews,
              connect for guidance, and keep internship information trusted.
            </p>
          </div>
        </div>

        <div className={styles.formSide}>
          <div className={styles.formHeader}>
            <span className={styles.eyebrow}>Secure access</span>
            <h2>{isSignup ? 'Create your account' : 'Welcome back'}</h2>
            <p>
              {isSignup
                ? 'Use your UIT email to start your InfoTern profile.'
                : 'Sign in with the UIT email you used to register.'}
            </p>
          </div>

          <div className={styles.modeSwitch} role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              className={mode === 'login' ? styles.modeActive : ''}
              onClick={() => switchMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === 'signup' ? styles.modeActive : ''}
              onClick={() => switchMode('signup')}
            >
              Sign up
            </button>
          </div>

          {user && (
            <div className={styles.currentUser}>
              Signed in as <strong>{user.email}</strong>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            {isSignup && (
              <label className={styles.field}>
                <span>Full name</span>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={updateField}
                  placeholder="Moe Pyae Hein"
                  autoComplete="name"
                />
              </label>
            )}

            <label className={styles.field}>
              <span>UIT email</span>
              <input
                name="email"
                value={form.email}
                onChange={updateField}
                placeholder={`moepyaehein${UIT_DOMAIN}`}
                autoComplete="email"
                inputMode="email"
              />
              {form.email && !emailIsValid && (
                <small>Only {UIT_DOMAIN} accounts can join.</small>
              )}
            </label>

            <label className={styles.field}>
              <span>Password</span>
              <input
                name="password"
                value={form.password}
                onChange={updateField}
                placeholder="At least 6 characters"
                type="password"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
              />
            </label>

            {message && (
              <div className={`${styles.message} ${styles[status] || ''}`}>
                {message}
              </div>
            )}

            <button className={styles.submitButton} type="submit" disabled={status === 'loading'}>
              {status === 'loading'
                ? 'Working...'
                : isSignup
                  ? 'Create UIT account'
                  : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
