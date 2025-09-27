'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

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
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Google Calendar scheduling script
    const loadGoogleCalendarScript = () => {
      // Check if script is already loaded
      if (window.calendar?.schedulingButton) {
        initializeButton()
        return
      }

      // Load CSS
      const link = document.createElement('link')
      link.href = 'https://calendar.google.com/calendar/scheduling-button-script.css'
      link.rel = 'stylesheet'
      document.head.appendChild(link)

      // Load JS
      const script = document.createElement('script')
      script.src = 'https://calendar.google.com/calendar/scheduling-button-script.js'
      script.async = true
      script.onload = () => {
        initializeButton()
      }
      document.head.appendChild(script)
    }

    const initializeButton = () => {
      if (buttonRef.current && window.calendar?.schedulingButton) {
        // Clear any existing content
        buttonRef.current.innerHTML = ''
        
        // Initialize the Google Calendar button
        window.calendar.schedulingButton.load({
          url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ177Cvvmjwy7CFeRTF8UViTTql42t2sKPhS5DFPlXJv0w4yPGa9uLKRN_nwtR3AHAsv9SoFeOdR?gv=true',
          color: '#595F39', // Use Henly AI brand color
          label: 'Book a Call',
          target: buttonRef.current,
        })
      }
    }

    // Load the script when component mounts
    loadGoogleCalendarScript()

    // Cleanup function
    return () => {
      if (buttonRef.current) {
        buttonRef.current.innerHTML = ''
      }
    }
  }, [])

  // Custom styling based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'nav':
        return 'text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
      case 'secondary':
        return 'inline-flex items-center text-gray-800 hover:text-gray-900 px-12 py-4 rounded-2xl text-lg font-medium transition-all duration-500 ease-out border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50'
      case 'primary':
      default:
        return 'inline-flex items-center text-white px-12 py-4 rounded-2xl text-lg font-medium transition-all duration-500 ease-out shadow-xl hover:shadow-2xl'
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
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      <div
        ref={buttonRef}
        className={getVariantStyles()}
        style={{ backgroundColor: getBackgroundColor() }}
      />
    </motion.div>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    calendar?: {
      schedulingButton: {
        load: (config: {
          url: string
          color: string
          label: string
          target: HTMLElement
        }) => void
      }
    }
  }
}
