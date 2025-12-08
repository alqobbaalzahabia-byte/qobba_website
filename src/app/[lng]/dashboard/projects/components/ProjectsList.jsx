'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ProjectCard from './ProjectCard'
import EditProjectModal from './EditProjectModal'
import AddProjectModal from './AddProjectModal'
import { FiPlus } from 'react-icons/fi'

export default function ProjectsList({ projects, error, lng }) {
  const router = useRouter()
  const [editingProject, setEditingProject] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleEdit = (project) => {
    setEditingProject(project)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingProject(null)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
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

  const handleDelete = async (project) => {
    if (confirm(`Are you sure you want to delete "${project.title?.[lng] || project.title || 'this project'}"?`)) {
      try {
        if (project.image) {
          try {
            const imagePath = project.image.split('/').pop()
            await supabase.storage
              .from('projects')
              .remove([`projects/${imagePath}`])
          } catch (storageError) {
            console.log('Image deletion skipped:', storageError)
          }
        }

        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', project.id)

        if (error) {
          throw new Error(error.message || 'Failed to delete project')
        }

        router.refresh()
      } catch (error) {
        console.error('Error deleting project:', error)
        alert(error.message || 'An error occurred while deleting the project')
      }
    }
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
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSave}
          lng={lng}
        />
      )}

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAdd={handleAdd}
        lng={lng}
      />
    </>
  )
}