'use client';

import { useState } from 'react';
import styles from './StarRating.module.css';

export default function StarRating({ value = 0, onChange, readOnly = false, size = 'md', label = '' }) {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (star) => {
    if (!readOnly && onChange) {
      onChange(star);
    }
  };

  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={`${styles.stars} ${styles[`size_${size}`]} ${readOnly ? '' : styles.interactive}`}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`${styles.star} ${star <= (hoverValue || value) ? styles.filled : styles.empty}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
}
