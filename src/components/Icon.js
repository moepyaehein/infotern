import styles from './Icon.module.css';

const ICONS = {
  building: (
    <>
      <path d="M7 20V5.8C7 4.8 7.8 4 8.8 4h6.4c1 0 1.8.8 1.8 1.8V20" />
      <path d="M4 20h16" />
      <path d="M10 8h1M14 8h1M10 12h1M14 12h1M10 16h1M14 16h1" />
    </>
  ),
  mobile: (
    <>
      <rect x="8" y="3" width="8" height="18" rx="2" />
      <path d="M11 6h2M12 18h.01" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 7.5h14a2 2 0 0 1 2 2v7A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
      <path d="M16 12h4v3h-4a1.5 1.5 0 0 1 0-3Z" />
      <path d="M6 7.5 15 4l1.2 3.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.2 2.3 3.2 5.2 3.2 8.5s-1 6.2-3.2 8.5M12 3.5C9.8 5.8 8.8 8.7 8.8 12s1 6.2 3.2 8.5" />
    </>
  ),
  ai: (
    <>
      <rect x="6" y="7" width="12" height="10" rx="2" />
      <path d="M9 7V4M15 7V4M9 17v3M15 17v3M4 10h2M18 10h2M4 14h2M18 14h2" />
      <path d="M10 11h.01M14 11h.01M10 14h4" />
    </>
  ),
  signal: (
    <>
      <path d="M6 18h12" />
      <path d="M12 18V8" />
      <path d="M8 10a5.7 5.7 0 0 1 8 0M5.5 7.5a9.2 9.2 0 0 1 13 0" />
      <path d="M10.2 12.4a2.5 2.5 0 0 1 3.6 0" />
    </>
  ),
  briefcase: (
    <>
      <rect x="4" y="7" width="16" height="12" rx="2" />
      <path d="M9 7V5.5C9 4.7 9.7 4 10.5 4h3c.8 0 1.5.7 1.5 1.5V7M4 12h16M12 12v2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 19 6v5.2c0 4.2-2.8 7.8-7 9.3-4.2-1.5-7-5.1-7-9.3V6l7-2.5Z" />
      <path d="m9.5 12 1.7 1.7 3.6-4" />
    </>
  ),
  plug: (
    <>
      <path d="M9 7V3M15 7V3M8 7h8v5a4 4 0 0 1-8 0V7ZM12 16v5" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 14 8 18l-2-2 4-4" />
      <path d="M12 14c4.5-1.2 7-4.4 7.5-9.5C14.4 5 11.2 7.5 10 12l2 2Z" />
      <path d="M14.5 7.5h.01M7 17l-2 2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6-5.1 6-11a6 6 0 0 0-12 0c0 5.9 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.2 2" />
    </>
  ),
  star: (
    <path d="m12 3.8 2.3 4.7 5.2.8-3.8 3.7.9 5.2-4.6-2.4-4.6 2.4.9-5.2-3.8-3.7 5.2-.8L12 3.8Z" />
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  graduate: (
    <>
      <path d="m3 8.5 9-4 9 4-9 4-9-4Z" />
      <path d="M7 10.5v4.2c2.7 2 7.3 2 10 0v-4.2M19 9.5v5" />
    </>
  ),
  users: (
    <>
      <path d="M9.5 11.5a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM3.8 19c.7-3 2.6-4.6 5.7-4.6s5 1.6 5.7 4.6" />
      <path d="M15.5 11.2a2.7 2.7 0 1 0 0-5.4M16.5 14.5c2.2.3 3.5 1.8 3.9 4.5" />
    </>
  ),
  mentorship: (
    <>
      <path d="M8 18v-1.5c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5V18" />
      <circle cx="12" cy="8" r="3" />
      <path d="M5 6h3M16 6h3M5 10h2M17 10h2" />
    </>
  ),
  learning: (
    <>
      <path d="M5 5.5h6.2c1 0 1.8.8 1.8 1.8V20c0-1.1-.9-2-2-2H5V5.5Z" />
      <path d="M19 5.5h-6.2c-1 0-1.8.8-1.8 1.8V20c0-1.1.9-2 2-2h6V5.5Z" />
    </>
  ),
  culture: (
    <>
      <path d="M7 15c-1.5 0-2.5-1-2.5-2.5S5.5 10 7 10h10c1.5 0 2.5 1 2.5 2.5S18.5 15 17 15" />
      <path d="M8 10V8M16 10V8M9 14l-2 4M15 14l2 4M9 12h.01M15 12h.01M11 14h2" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-4 3.1-6 7-6s6.2 2 7 6" />
    </>
  ),
  telegram: (
    <path d="m20 5-3.2 14-5-4-3.2 3 .8-4.7L4 10.8 20 5Z" />
  ),
  facebook: (
    <path d="M14 8h2V4h-2.5A4.5 4.5 0 0 0 9 8.5V11H6v4h3v6h4v-6h3l.7-4H13V8.7c0-.4.4-.7 1-.7Z" />
  ),
  email: (
    <>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="m5 8 7 5 7-5" />
    </>
  ),
  check: <path d="m5 12 4 4 10-10" />,
  edit: (
    <>
      <path d="M5 19h4l10-10-4-4L5 15v4Z" />
      <path d="m14 6 4 4" />
    </>
  ),
  website: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 12h8M12 3.5c2 2.3 3 5.2 3 8.5s-1 6.2-3 8.5M12 3.5c-2 2.3-3 5.2-3 8.5s1 6.2 3 8.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="5" y="5" width="14" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M5 9h14" />
    </>
  ),
};

export default function Icon({ name, className = '', size = 22, decorative = true }) {
  const icon = ICONS[name] || ICONS.briefcase;

  return (
    <svg
      className={`${styles.icon} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden={decorative}
      focusable="false"
      role={decorative ? undefined : 'img'}
    >
      {icon}
    </svg>
  );
}
