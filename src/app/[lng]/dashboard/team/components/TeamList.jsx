'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import TeamCard from './TeamCard'
import EditTeamModal from './EditTeamModal'
import AddTeamModal from './AddTeamModal'
import { FiPlus, FiX, FiAlertTriangle } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function TeamList({ team, error, lng }) {
  const router = useRouter()
  const [editingMember, setEditingMember] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (member) => {
    setEditingMember(member)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingMember(null)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }

  const handleAdd = async (formData) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{
          name: formData.name,
          position: formData.position,
          image: formData.image,
        }])
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to add team member')
      }

      router.refresh()
    } catch (error) {
      console.error('Error adding team member:', error)
      throw error
    }
  }

  const handleSave = async (memberId, formData) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .update({
          name: formData.name,
          position: formData.position,
          image: formData.image,
        })
        .eq('id', memberId)
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to update team member')
      }

      router.refresh()
    } catch (error) {
      console.error('Error updating team member:', error)
      throw error
    }
  }

  const handleDeleteClick = (member) => {
    setMemberToDelete(member)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', memberToDelete.id)

      if (error) {
        throw new Error(error.message || 'Failed to delete team member')
      }

      toast.success(
        lng === 'ar' 
          ? 'تم حذف عضو الفريق بنجاح!' 
          : 'Team member deleted successfully!'
      )

      setIsDeleteModalOpen(false)
      setMemberToDelete(null)
      router.refresh()
    } catch (error) {
      console.error('Error deleting team member:', error)
      toast.error(
        lng === 'ar' 
          ? 'فشل حذف عضو الفريق. يرجى المحاولة مرة أخرى.' 
          : 'Failed to delete team member. Please try again.'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setMemberToDelete(null)
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading team members</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#FAB000] text-white font-semibold rounded-lg hover:bg-[#E19F00] transition-colors shadow-md hover:shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          Add New Team Member
        </button>
      </div>

      {team?.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <FiPlus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No team members found</p>
            <p className="text-gray-400 text-sm">Get started by adding your first team member</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 flex items-center gap-2 px-6 py-2 bg-[#FAB000] text-white font-semibold rounded-lg hover:bg-[#E19F00] transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Team Member
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {team.map((member) => (
            <TeamCard
              key={member.id}
              member={member}
              lng={lng}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AddTeamModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAdd={handleAdd}
        lng={lng}
      />

      {/* Edit Modal */}
      {editingMember && (
        <EditTeamModal
          member={editingMember}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          lng={lng}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && memberToDelete && (
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
                  ? `هل أنت متأكد من حذف "${memberToDelete.name?.[lng] || memberToDelete.name || 'هذا العضو'}"؟ لا يمكن التراجع عن هذا الإجراء.`
                  : `Are you sure you want to delete "${memberToDelete.name?.[lng] || memberToDelete.name || 'this team member'}"? This action cannot be undone.`
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