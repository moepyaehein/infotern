export async function fetchReviews() {
  const response = await fetch('/api/reviews', {
    cache: 'no-store',
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || 'Could not load reviews');
  }

  return payload;
}

export async function submitReview(review) {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(review),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || 'Could not submit review');
  }

  return payload.review;
}
