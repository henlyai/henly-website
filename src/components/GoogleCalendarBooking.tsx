'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import BookingModal from './BookingModal'

interface GoogleCalendarBookingProps {
  variant?: 'primary' | 'secondary' | 'nav'
  className?: string
  children?: React.ReactNode
}

export default function GoogleCalendarBooking({ 
  variant = 'primary', 
  className = '',
  children 
}: GoogleCalendarBookingProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleBookingClick = () => {
    setIsModalOpen(true)
  }

  // Custom styling based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'nav':
        return 'text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer'
      case 'secondary':
        return 'inline-flex items-center text-gray-800 hover:text-gray-900 px-12 py-4 rounded-2xl text-lg font-medium transition-all duration-500 ease-out border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 cursor-pointer'
      case 'primary':
      default:
        return 'inline-flex items-center text-white px-12 py-4 rounded-2xl text-lg font-medium transition-all duration-500 ease-out shadow-xl hover:shadow-2xl cursor-pointer'
    }
  }

  const getBackgroundColor = () => {
    switch (variant) {
      case 'nav':
        return '#595F39'
      case 'secondary':
        return 'transparent'
      case 'primary':
      default:
        return '#595F39'
    }
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={className}
      >
        <button
          onClick={handleBookingClick}
          className={getVariantStyles()}
          style={{ backgroundColor: getBackgroundColor() }}
        >
          {children || 'Book a Call'}
          {variant === 'primary' && !children && <ArrowRight className="ml-3 h-5 w-5" />}
        </button>
      </motion.div>
      
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
