'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, User, MapPin } from 'lucide-react'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#595F39] to-[#7A8B5A]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Book Your Consultation</h2>
                  <p className="text-white/80 text-sm">Schedule your free AI adoption strategy call</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Info Cards */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#595F39]/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[#595F39]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">30-45 minutes</p>
                    <p className="text-xs text-gray-600">Duration</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#595F39]/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-[#595F39]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">1-on-1 Call</p>
                    <p className="text-xs text-gray-600">Format</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#595F39]/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#595F39]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Video Call</p>
                    <p className="text-xs text-gray-600">Location</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Calendar Embed */}
            <div className="relative h-[600px]">
              <iframe
                ref={iframeRef}
                src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ177Cvvmjwy7CFeRTF8UViTTql42t2sKPhS5DFPlXJv0w4yPGa9uLKRN_nwtR3AHAsv9SoFeOdR?gv=true&embed=true"
                className="w-full h-full border-0"
                title="Book a consultation"
                loading="lazy"
              />
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>Need help? Contact us at <span className="font-medium text-[#595F39]">hello@henly.ai</span></p>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
