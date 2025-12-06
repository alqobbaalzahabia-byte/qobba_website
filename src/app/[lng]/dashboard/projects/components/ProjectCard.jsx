'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { HiDotsVertical } from 'react-icons/hi'
import { FiEdit, FiTrash2, FiImage } from 'react-icons/fi'

export default function ProjectCard({ project, lng, onEdit, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handleEdit = () => {
    setIsMenuOpen(false)
    if (onEdit) {
      onEdit(project)
    }
  }

  const handleDelete = () => {
    setIsMenuOpen(false)
    if (onDelete) {
      onDelete(project)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 relative group">
      <div className="absolute top-3 right-3 z-10" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-full bg-white/95 hover:bg-white shadow-md transition-all hover:scale-110"
          aria-label="Project options"
        >
          <HiDotsVertical className="text-gray-600 text-lg" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20 animate-fade-in">
            <button
              onClick={handleEdit}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <FiEdit className="text-gray-500 w-4 h-4" />
              <span>Edit Project</span>
            </button>
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
            >
              <FiTrash2 className="text-red-500 w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title?.[lng] || project.title || 'Project'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
            <FiImage className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-2 text-lg line-clamp-2 min-h-14">
          {project.title?.[lng] || project.title || 'Untitled Project'}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-3 min-h-16 mb-4">
          {project.description?.[lng] || project.description || 'No description available'}
        </p>

        <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">Created</span>
            <span className="text-xs text-gray-600 font-semibold">
              {new Date(project.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}