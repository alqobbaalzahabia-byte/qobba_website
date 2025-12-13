'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ProjectCard from './ProjectCard'
import EditProjectModal from './EditProjectModal'
import AddProjectModal from './AddProjectModal'
import { FiPlus, FiX, FiAlertTriangle } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function ProjectsList({ projects, error, lng }) {
  const router = useRouter()
  const [editingProject, setEditingProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }

  const handleAdd = async (formData) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: formData.title,
          description: formData.description,
          image: formData.image,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to add project')
      }

      router.refresh()
    } catch (error) {
      console.error('Error adding project:', error)
      throw error
    }
  }

  const handleSave = async (projectId, formData) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          title: formData.title,
          description: formData.description,
          image: formData.image,
        })
        .eq('id', projectId)
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to update project')
      }

      router.refresh()
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  const handleDeleteClick = (project) => {
    setProjectToDelete(project)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete.id)

      if (error) {
        throw new Error(error.message || 'Failed to delete project')
      }

      toast.success(
        lng === 'ar' 
          ? 'تم حذف المشروع بنجاح!' 
          : 'Project deleted successfully!'
      )

      setIsDeleteModalOpen(false)
      setProjectToDelete(null)
      router.refresh()
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error(
        lng === 'ar' 
          ? 'فشل حذف المشروع. يرجى المحاولة مرة أخرى.' 
          : 'Failed to delete project. Please try again.'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setProjectToDelete(null)
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading projects</p>
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
          Add New Project
        </button>
      </div>

      {projects?.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <FiPlus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No projects found</p>
            <p className="text-gray-400 text-sm">Get started by adding your first project</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 flex items-center gap-2 px-6 py-2 bg-[#FAB000] text-white font-semibold rounded-lg hover:bg-[#E19F00] transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Project
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              lng={lng}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAdd={handleAdd}
        lng={lng}
      />

      {/* Edit Modal */}
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          lng={lng}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && projectToDelete && (
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
                  ? `هل أنت متأكد من حذف "${projectToDelete.title?.[lng] || projectToDelete.title || 'هذا المشروع'}"؟ لا يمكن التراجع عن هذا الإجراء.`
                  : `Are you sure you want to delete "${projectToDelete.title?.[lng] || projectToDelete.title || 'this project'}"? This action cannot be undone.`
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