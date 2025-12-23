'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import SectionCard from './SectionCard'
import EditSectionModal from './EditSectionModal'
import AddSectionModal from './AddSectionModal'
import { FiPlus, FiX, FiAlertTriangle } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function SectionsList({ sections, error, lng, type }) {
  const router = useRouter()
  const [editingSection, setEditingSection] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [sectionToDelete, setSectionToDelete] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const tableName = type === 'terms' ? 'terms' : 'privacy'
  const displayName = type === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'

  const handleEdit = (section) => {
    setEditingSection(section)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingSection(null)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }

  const handleAdd = async (formData) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert([{
          title: formData.title,
          content: formData.content,
        }])
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to add section')
      }

      router.refresh()
    } catch (error) {
      console.error('Error adding section:', error)
      throw error
    }
  }

  const handleSave = async (sectionId, formData) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update({
          title: formData.title,
          content: formData.content,
        })
        .eq('id', sectionId)
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to update section')
      }

      router.refresh()
    } catch (error) {
      console.error('Error updating section:', error)
      throw error
    }
  }

  const handleDeleteClick = (section) => {
    setSectionToDelete(section)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!sectionToDelete) return

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', sectionToDelete.id)

      if (error) {
        throw new Error(error.message || 'Failed to delete section')
      }

      toast.success(
        lng === 'ar' 
          ? 'تم حذف القسم بنجاح!' 
          : 'Section deleted successfully!'
      )

      setIsDeleteModalOpen(false)
      setSectionToDelete(null)
      router.refresh()
    } catch (error) {
      console.error('Error deleting section:', error)
      toast.error(
        lng === 'ar' 
          ? 'فشل حذف القسم. يرجى المحاولة مرة أخرى.' 
          : 'Failed to delete section. Please try again.'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setSectionToDelete(null)
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading sections</p>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage sections and content for {displayName.toLowerCase()}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#FAB000] text-white font-semibold rounded-lg hover:bg-[#E19F00] transition-colors shadow-md hover:shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          Add New Section
        </button>
      </div>

      {sections?.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <FiPlus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No sections found</p>
            <p className="text-gray-400 text-sm">Get started by adding your first section</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 flex items-center gap-2 px-6 py-2 bg-[#FAB000] text-white font-semibold rounded-lg hover:bg-[#E19F00] transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Section
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              lng={lng}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <AddSectionModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAdd={handleAdd}
        lng={lng}
        type={type}
      />

      {editingSection && (
        <EditSectionModal
          section={editingSection}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          lng={lng}
          type={type}
        />
      )}

      {isDeleteModalOpen && sectionToDelete && (
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
                  ? `هل أنت متأكد من حذف "${sectionToDelete.title?.[lng] || sectionToDelete.title?.en || 'هذا القسم'}"؟ لا يمكن التراجع عن هذا الإجراء.`
                  : `Are you sure you want to delete "${sectionToDelete.title?.[lng] || sectionToDelete.title?.en || 'this section'}"? This action cannot be undone.`
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