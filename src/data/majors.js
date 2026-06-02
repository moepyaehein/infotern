export const MAJORS = [
  { code: 'SE', name: 'Software Engineering', color: 'var(--major-se)', badgeClass: 'badge-se' },
  { code: 'KE', name: 'Knowledge Engineering', color: 'var(--major-ke)', badgeClass: 'badge-ke' },
  { code: 'BIS', name: 'Business Information Systems', color: 'var(--major-bis)', badgeClass: 'badge-bis' },
  { code: 'CS', name: 'Cybersecurity', color: 'var(--major-cs)', badgeClass: 'badge-cs' },
  { code: 'CN', name: 'Computer Networking', color: 'var(--major-cn)', badgeClass: 'badge-cn' },
  { code: 'ES', name: 'Embedded Systems', color: 'var(--major-es)', badgeClass: 'badge-es' },
  { code: 'HPC', name: 'High Performance Computing', color: 'var(--major-hpc)', badgeClass: 'badge-hpc' },
];

export function getMajorByCode(code) {
  return MAJORS.find(m => m.code === code);
}

export function getMajorColor(code) {
  const major = getMajorByCode(code);
  return major ? major.color : 'var(--text-muted)';
}

export function getMajorBadgeClass(code) {
  const major = getMajorByCode(code);
  return major ? major.badgeClass : '';
}
