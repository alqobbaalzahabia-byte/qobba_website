import { createClient } from '@/lib/supabase-server'
import ReviewsList from '@/app/[lng]/dashboard/reviews/components/ReviewsList'

export default async function ReviewsPage({ params }) {
  const { lng } = await params
  const supabase = await createClient()

  // Fetch all reviews (pending and approved)
  const { data: reviews, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  // Count pending reviews
  const pendingCount = reviews?.filter(review => !review.is_approved).length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews Management</h1>
        <p className="text-gray-600">Manage customer reviews and testimonials</p>
        {pendingCount > 0 && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-yellow-800">
              {pendingCount} review{pendingCount > 1 ? 's' : ''} pending approval
            </span>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <ReviewsList reviews={reviews} error={error} lng={lng} />
      </div>
    </div>
  )
}