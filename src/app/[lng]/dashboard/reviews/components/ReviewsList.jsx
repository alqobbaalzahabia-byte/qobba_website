'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ReviewCard from './ReviewCard'
import EditReviewModal from './EditReviewModal'
import AddReviewModal from './AddReviewModal'
import { FiPlus, FiX, FiAlertTriangle, FiFilter } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function ReviewsList({ reviews, error, lng }) {
  const router = useRouter()
  const [editingReview, setEditingReview] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all') // 'all', 'pending', 'approved'

  const handleEdit = (review) => {
    setEditingReview(review)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingReview(null)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }

  const handleAdd = async (formData) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([{
          name: formData.name,
          feedback: formData.feedback,
          image: formData.image,
          is_approved: true, // Admin-added reviews are auto-approved
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to add review')
      }

      router.refresh()
    } catch (error) {
      console.error('Error adding review:', error)
      throw error
    }
  }

  const handleSave = async (reviewId, formData) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .update({
          name: formData.name,
          feedback: formData.feedback,
          image: formData.image,
          is_approved: formData.is_approved
        })
        .eq('id', reviewId)
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to update review')
      }

      router.refresh()
    } catch (error) {
      console.error('Error updating review:', error)
      throw error
    }
  }

  const handleApprove = async (review) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_approved: true })
        .eq('id', review.id)

      if (error) throw error

      toast.success(
        lng === 'ar' 
          ? 'تمت الموافقة على المراجعة بنجاح!' 
          : 'Review approved successfully!'
      )
      router.refresh()
    } catch (error) {
      console.error('Error approving review:', error)
      toast.error(
        lng === 'ar' 
          ? 'فشل في الموافقة على المراجعة.' 
          : 'Failed to approve review.'
      )
    }
  }

  const handleReject = async (review) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_approved: false })
        .eq('id', review.id)

      if (error) throw error

      toast.success(
        lng === 'ar' 
          ? 'تم رفض المراجعة بنجاح!' 
          : 'Review rejected successfully!'
      )
      router.refresh()
    } catch (error) {
      console.error('Error rejecting review:', error)
      toast.error(
        lng === 'ar' 
          ? 'فشل في رفض المراجعة.' 
          : 'Failed to reject review.'
      )
    }
  }

  const handleDeleteClick = (review) => {
    setReviewToDelete(review)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', reviewToDelete.id)

      if (error) {
        throw new Error(error.message || 'Failed to delete review')
      }

      toast.success(
        lng === 'ar' 
          ? 'تم حذف المراجعة بنجاح!' 
          : 'Review deleted successfully!'
      )

      setIsDeleteModalOpen(false)
      setReviewToDelete(null)
      router.refresh()
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error(
        lng === 'ar' 
          ? 'فشل حذف المراجعة. يرجى المحاولة مرة أخرى.' 
          : 'Failed to delete review. Please try again.'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setReviewToDelete(null)
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading reviews</p>
      </div>
    )
  }

  // Filter reviews based on status
  const filteredReviews = reviews?.filter(review => {
    if (filterStatus === 'pending') return !review.is_approved
    if (filterStatus === 'approved') return review.is_approved
    return true
  }) || []

  const pendingCount = reviews?.filter(r => !r.is_approved).length || 0
  const approvedCount = reviews?.filter(r => r.is_approved).length || 0

  return (
    <>
      {/* Header with Add Button and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({reviews?.length || 0})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
              filterStatus === 'pending'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending ({pendingCount})
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterStatus === 'approved'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Approved ({approvedCount})
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#FAB000] text-white font-semibold rounded-lg hover:bg-[#E19F00] transition-colors shadow-md hover:shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          Add New Review
        </button>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <FiFilter className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {filterStatus === 'pending' 
                ? 'No pending reviews' 
                : filterStatus === 'approved' 
                ? 'No approved reviews' 
                : 'No reviews found'}
            </p>
            <p className="text-gray-400 text-sm">
              {filterStatus === 'all' && 'Get started by adding your first review'}
            </p>
            {filterStatus === 'all' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 flex items-center gap-2 px-6 py-2 bg-[#FAB000] text-white font-semibold rounded-lg hover:bg-[#E19F00] transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Add Review
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              lng={lng}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AddReviewModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAdd={handleAdd}
        lng={lng}
      />

      {/* Edit Modal */}
      {editingReview && (
        <EditReviewModal
          review={editingReview}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          lng={lng}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && reviewToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={handleDeleteCancel}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <FiAlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {lng === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
                </h2>
              </div>
              <button
                onClick={handleDeleteCancel}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
                disabled={isDeleting}
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6">
                {lng === 'ar' 
                  ? `هل أنت متأكد من حذف مراجعة "${reviewToDelete.name?.[lng] || reviewToDelete.name || 'هذا العميل'}"؟ لا يمكن التراجع عن هذا الإجراء.`
                  : `Are you sure you want to delete the review from "${reviewToDelete.name?.[lng] || reviewToDelete.name || 'this customer'}"? This action cannot be undone.`
                }
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={isDeleting}
                >
                  {lng === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-6 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDeleting}
                >
                  {isDeleting 
                    ? (lng === 'ar' ? 'جاري الحذف...' : 'Deleting...')
                    : (lng === 'ar' ? 'حذف' : 'Delete')
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}