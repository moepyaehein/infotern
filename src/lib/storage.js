const STORAGE_KEYS = {
  REVIEWS: 'infotern_reviews',
  SENIORS: 'infotern_seniors',
  USER_PREFS: 'infotern_user_prefs',
  HELPFUL_VOTES: 'infotern_helpful_votes',
  INITIALIZED: 'infotern_initialized',
};

export function isInitialized() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.INITIALIZED) === 'true';
}

export function markInitialized() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
}

// --- Reviews ---
export function getStoredReviews() {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  return data ? JSON.parse(data) : [];
}

export function saveReviews(reviews) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
}

export function addReview(review) {
  const reviews = getStoredReviews();
  reviews.unshift(review);
  saveReviews(reviews);
  return reviews;
}

// --- Helpful Votes ---
export function getHelpfulVotes() {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(STORAGE_KEYS.HELPFUL_VOTES);
  return data ? JSON.parse(data) : {};
}

export function toggleHelpfulVote(reviewId) {
  const votes = getHelpfulVotes();
  if (votes[reviewId]) {
    delete votes[reviewId];
  } else {
    votes[reviewId] = true;
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.HELPFUL_VOTES, JSON.stringify(votes));
  }
  return votes;
}

// --- User Preferences ---
export function getUserPrefs() {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.USER_PREFS);
  return data ? JSON.parse(data) : null;
}

export function saveUserPrefs(prefs) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER_PREFS, JSON.stringify(prefs));
}

// --- Initialize Seed Data ---
export function initializeData(seedReviews) {
  if (typeof window === 'undefined') return;
  if (!isInitialized()) {
    saveReviews(seedReviews);
    markInitialized();
  }
}
