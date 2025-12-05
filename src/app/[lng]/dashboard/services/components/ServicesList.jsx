'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ServiceCard from './ServiceCard'
import EditServiceModal from './EditServiceModal'

export default function ServicesList({ services, error, lng }) {
  const router = useRouter()
  const [editingService, setEditingService] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleEdit = (service) => {
    setEditingService(service)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingService(null)
  }

  const handleSave = async (serviceId, formData) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update({
          title: formData.title,
          description: formData.description,
          image: formData.image,
          // created_at: new Date().toISOString()
        })
        .eq('id', serviceId)
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to update service')
      }

      router.refresh()
    } catch (error) {
      console.error('Error updating service:', error)
      throw error
    }
  }

  const handleDelete = async (service) => {
    if (confirm(`Are you sure you want to delete "${service.title?.[lng] || service.title || 'this service'}"?`)) {
      try {
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', service.id)

        if (error) {
          throw new Error(error.message || 'Failed to delete service')
        }

        router.refresh()
      } catch (error) {
        console.error('Error deleting service:', error)
        alert(error.message || 'An error occurred while deleting the service')
      }
    }
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading services</p>
      </div>
    )
  }

  if (services?.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No services found</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            lng={lng}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Edit Modal */}
      {editingService && (
        <EditServiceModal
          service={editingService}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          lng={lng}
        />
      )}
    </>
  )
}

