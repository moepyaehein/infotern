export function reviewFromSupabase(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    reviewerName: row.reviewer_name,
    major: row.major,
    graduationYear: row.graduation_year,
    role: row.role,
    overallRating: row.overall_rating,
    workLifeBalance: row.work_life_balance,
    learningOpportunity: row.learning_opportunity,
    mentorship: row.mentorship,
    pros: row.pros,
    cons: row.cons,
    interviewTips: row.interview_tips || '',
    helpful: row.helpful || 0,
    createdAt: row.created_at,
  };
}

export function reviewToSupabase(review) {
  return {
    company_id: review.companyId,
    reviewer_name: review.reviewerName,
    major: review.major,
    graduation_year: review.graduationYear,
    role: review.role,
    overall_rating: review.overallRating,
    work_life_balance: review.workLifeBalance,
    learning_opportunity: review.learningOpportunity,
    mentorship: review.mentorship,
    pros: review.pros,
    cons: review.cons,
    interview_tips: review.interviewTips || '',
  };
}
