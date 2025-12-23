'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import MessageCard from './MessageCard'
import MessageDetailModal from './MessageDetailModal'
import { FiFilter, FiMail, FiInbox, FiX, FiAlertTriangle } from 'react-icons/fi'


import { toast } from 'react-toastify'

export default function MessagesList({ messages, error, lng }) {
  const router = useRouter()
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all') // 'all', 'unread', 'read'

  const handleViewMessage = async (message) => {
    setSelectedMessage(message)
    setIsDetailModalOpen(true)

    // Mark as read if unread
    if (!message.is_read) {
      try {
        await supabase
          .from('contact_messages')
          .update({ is_read: true })
          .eq('id', message.id)

        router.refresh()
      } catch (error) {
        console.error('Error marking message as read:', error)
      }
    }
  }

  const handleMarkAsRead = async (message) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', message.id)

      if (error) throw error

      toast.success(
        lng === 'ar' 
          ? 'تم وضع علامة مقروء على الرسالة!' 
          : 'Message marked as read!'
      )
      router.refresh()
    } catch (error) {
      console.error('Error marking message as read:', error)
      toast.error(
        lng === 'ar' 
          ? 'فشل في تحديث الرسالة.' 
          : 'Failed to update message.'
      )
    }
  }

  const handleMarkAsUnread = async (message) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: false })
        .eq('id', message.id)

      if (error) throw error

      toast.success(
        lng === 'ar' 
          ? 'تم وضع علامة غير مقروء على الرسالة!' 
          : 'Message marked as unread!'
      )
      router.refresh()
    } catch (error) {
      console.error('Error marking message as unread:', error)
      toast.error(
        lng === 'ar' 
          ? 'فشل في تحديث الرسالة.' 
          : 'Failed to update message.'
      )
    }
  }

  const handleDeleteClick = (message) => {
    setMessageToDelete(message)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!messageToDelete) return

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageToDelete.id)

      if (error) {
        throw new Error(error.message || 'Failed to delete message')
      }

      toast.success(
        lng === 'ar' 
          ? 'تم حذف الرسالة بنجاح!' 
          : 'Message deleted successfully!'
      )

      setIsDeleteModalOpen(false)
      setMessageToDelete(null)
      router.refresh()
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error(
        lng === 'ar' 
          ? 'فشل حذف الرسالة. يرجى المحاولة مرة أخرى.' 
          : 'Failed to delete message. Please try again.'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setMessageToDelete(null)
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading messages</p>
      </div>
    )
  }

  // Filter messages based on status
  const filteredMessages = messages?.filter(message => {
    if (filterStatus === 'unread') return !message.is_read
    if (filterStatus === 'read') return message.is_read
    return true
  }) || []

  const unreadCount = messages?.filter(m => !m.is_read).length || 0
  const readCount = messages?.filter(m => m.is_read).length || 0

  return (
    <>
      {/* Header with Filters */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Messages</h2>
        
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
            All ({messages?.length || 0})
          </button>
          <button
            onClick={() => setFilterStatus('unread')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
              filterStatus === 'unread'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiMail className="inline w-4 h-4 mr-1" />
            Unread ({unreadCount})
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setFilterStatus('read')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterStatus === 'read'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiInbox className="inline w-4 h-4 mr-1" />
            Read ({readCount})
          </button>
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <FiFilter className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {filterStatus === 'unread' 
                ? 'No unread messages' 
                : filterStatus === 'read' 
                ? 'No read messages' 
                : 'No messages found'}
            </p>
            <p className="text-gray-400 text-sm">
              Messages from customers will appear here
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              lng={lng}
              onView={handleViewMessage}
              onMarkAsRead={handleMarkAsRead}
              onMarkAsUnread={handleMarkAsUnread}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <MessageDetailModal
          message={selectedMessage}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedMessage(null)
          }}
          lng={lng}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && messageToDelete && (
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
                  ? `هل أنت متأكد من حذف رسالة "${messageToDelete.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                  : `Are you sure you want to delete the message from "${messageToDelete.name}"? This action cannot be undone.`
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