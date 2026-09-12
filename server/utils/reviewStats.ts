import prisma from '@/lib/prisma.ts'

export interface ReviewStats {
  averageRating: number | null
  reviewCount: number
}

// No average is stored on a Course, it is derived here every time it is asked
// for. See docs/adr/0001 for why. One groupBy covers a whole page of courses,
// so the catalogue pays for one extra query, not one per card.
export async function courseReviewStats(
  courseIds: string[],
): Promise<Map<string, ReviewStats>> {
  const stats = new Map<string, ReviewStats>()
  if (courseIds.length === 0) return stats

  const grouped = await prisma.review.groupBy({
    by: ['courseId'],
    where: { courseId: { in: courseIds } },
    _avg: { rating: true },
    _count: { rating: true },
  })

  for (const row of grouped) {
    const average = row._avg.rating
    stats.set(row.courseId, {
      // one decimal is all the stars can show anyway
      averageRating: average === null ? null : Math.round(average * 10) / 10,
      reviewCount: row._count.rating,
    })
  }

  return stats
}

// a course nobody has reviewed has no average, which is not the same as zero
export const noReviews: ReviewStats = { averageRating: null, reviewCount: 0 }
