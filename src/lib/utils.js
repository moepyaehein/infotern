import { companies } from '@/data/companies';

/**
 * Filter companies based on search and filter criteria
 */
export function filterCompanies(allCompanies, { search = '', majors = [], minRating = 0 } = {}) {
  return allCompanies.filter(company => {
    // Search filter
    if (search) {
      const q = search.toLowerCase();
      const matchesSearch =
        company.name.toLowerCase().includes(q) ||
        company.description.toLowerCase().includes(q) ||
        company.industry.toLowerCase().includes(q) ||
        company.location.toLowerCase().includes(q) ||
        company.roles.some(r => r.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    // Major filter
    if (majors.length > 0) {
      const hasMajor = majors.some(m => company.majors.includes(m));
      if (!hasMajor) return false;
    }

    // Rating filter
    if (minRating > 0 && company.rating < minRating) {
      return false;
    }

    return true;
  });
}

/**
 * Filter reviews based on criteria
 */
export function filterReviews(allReviews, { companyId = '', major = '', sortBy = 'newest' } = {}) {
  let filtered = [...allReviews];

  if (companyId) {
    filtered = filtered.filter(r => r.companyId === companyId);
  }

  if (major) {
    filtered = filtered.filter(r => r.major === major);
  }

  // Sort
  switch (sortBy) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'oldest':
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case 'highest':
      filtered.sort((a, b) => b.overallRating - a.overallRating);
      break;
    case 'helpful':
      filtered.sort((a, b) => b.helpful - a.helpful);
      break;
    default:
      break;
  }

  return filtered;
}

/**
 * Smart matching algorithm
 * Returns companies sorted by match percentage based on user preferences
 */
export function getMatchedCompanies(preferences, allCompanies = companies) {
  const { major, priorities = [], preferredSize = '', minRating = 0 } = preferences;

  return allCompanies
    .map(company => {
      let score = 0;
      let maxScore = 0;

      // Major match (40% weight)
      maxScore += 40;
      if (company.majors.includes(major)) {
        score += 40;
      }

      // Rating match (20% weight)
      maxScore += 20;
      if (company.rating >= 4.5) score += 20;
      else if (company.rating >= 4.0) score += 15;
      else if (company.rating >= 3.5) score += 10;
      else score += 5;

      // Priorities matching (30% weight, divided among priorities)
      maxScore += 30;
      const priorityWeight = priorities.length > 0 ? 30 / priorities.length : 0;

      priorities.forEach(priority => {
        switch (priority) {
          case 'mentorship':
            if (company.rating >= 4.3) score += priorityWeight;
            break;
          case 'stipend':
            if (company.stipend && company.stipend.includes('300,000')) score += priorityWeight;
            else if (company.stipend && company.stipend.includes('250,000')) score += priorityWeight * 0.7;
            break;
          case 'flexibility':
            if (company.facilities.some(f =>
              f.toLowerCase().includes('flexible') ||
              f.toLowerCase().includes('remote') ||
              f.toLowerCase().includes('wfh')
            )) score += priorityWeight;
            break;
          case 'learning':
            if (company.facilities.some(f =>
              f.toLowerCase().includes('training') ||
              f.toLowerCase().includes('learning') ||
              f.toLowerCase().includes('certification')
            )) score += priorityWeight;
            break;
          case 'culture':
            if (company.facilities.some(f =>
              f.toLowerCase().includes('team') ||
              f.toLowerCase().includes('culture') ||
              f.toLowerCase().includes('gaming') ||
              f.toLowerCase().includes('outing')
            )) score += priorityWeight;
            break;
          default:
            break;
        }
      });

      // Size preference (10% weight)
      maxScore += 10;
      if (preferredSize) {
        const sizeMatch =
          (preferredSize === 'small' && company.size.includes('Small')) ||
          (preferredSize === 'medium' && company.size.includes('Medium')) ||
          (preferredSize === 'large' && company.size.includes('Large'));
        if (sizeMatch) score += 10;
        else score += 3;
      } else {
        score += 5;
      }

      const matchPercentage = Math.round((score / maxScore) * 100);

      return {
        ...company,
        matchPercentage,
      };
    })
    .filter(c => c.matchPercentage >= (minRating > 0 ? 30 : 0))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}

/**
 * Get company by ID
 */
export function getCompanyById(id) {
  return companies.find(c => c.id === id);
}

/**
 * Format date
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Generate unique ID
 */
export function generateId() {
  return 'r_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
