'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Loader2, Building2, Mail, Calendar, Shield, CheckCircle, XCircle } from 'lucide-react'

interface InvitationData {
  id: string
  email: string
  organizationName: string
  inviterName: string
  expiresAt: string
  status: 'pending' | 'accepted' | 'expired'
  role: 'user' | 'admin'
}

export default function InvitationSignupPage() {
  const params = useParams()
  const router = useRouter()
  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    username: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const token = params.token as string

  useEffect(() => {
    if (token) {
      validateInvitation()
    }
  }, [token])

  const validateInvitation = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/validate-invitation?token=${token}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Invalid or expired invitation link.')
        return
      }

      const invitationData = await response.json()
      
      // Check if invitation is expired
      if (new Date(invitationData.expires_at) < new Date()) {
        setError('This invitation has expired. Please request a new invitation.')
        setInvitation({ ...invitationData, status: 'expired' })
        return
      }

      setInvitation({
        id: invitationData.id,
        email: invitationData.email,
        organizationName: invitationData.organization_name,
        inviterName: invitationData.inviter_name || 'Team Admin',
        expiresAt: invitationData.expires_at,
        status: invitationData.status,
        role: invitationData.role || 'user'
      })

      // Pre-fill the email from the invitation
      setFormData(prev => ({
        ...prev,
        email: invitationData.email
      }))
    } catch (err) {
      console.error('Error validating invitation:', err)
      setError('Invalid or expired invitation link.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setSubmitError('Passwords do not match')
      setSubmitting(false)
      return
    }

    if (formData.password.length < 6) {
      setSubmitError('Password must be at least 6 characters long')
      setSubmitting(false)
      return
    }

    if (!formData.username.trim()) {
      setSubmitError('Username is required')
      setSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/signup-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          username: formData.username,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setSubmitError(result.error || 'Failed to create account')
        setSubmitting(false)
        return
      }

      // Success! Redirect to verification pending page
      if (result.emailSent) {
        router.push(`/verify-email-pending?email=${encodeURIComponent(formData.email)}&org=${encodeURIComponent(invitation?.organizationName || '')}&invitation=true`)
      } else {
        // If no email was sent (development mode), go directly to dashboard
        router.push('/dashboard')
      }
      
    } catch (error) {
      console.error('Signup error:', error)
      setSubmitError('An unexpected error occurred')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: "#595F39" }} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Validating Invitation</h2>
          <p className="text-gray-600">Please wait while we verify your invitation...</p>
        </div>
      </div>
    )
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Invitation</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="text-white py-2 px-4 rounded-md hover:opacity-90 transition-colors" style={{ backgroundColor: "#595F39" }}
          >
            Go to Homepage
          </button>
        </div>
      </div>
    )
  }

  if (!invitation) {
    return null
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Image src="/henly_ai_logo.png" alt="Henly AI Logo" width={120} height={30} className="h-12 w-auto mx-auto" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Complete Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-800">
            You've been invited to join <strong>{invitation.organizationName}</strong>
          </p>
        </div>

        {/* Invitation Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-3">
            <Building2 className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Organization</p>
              <p className="text-sm text-gray-600">{invitation.organizationName}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Invited by</p>
              <p className="text-sm text-gray-600">{invitation.inviterName}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Expires</p>
              <p className="text-sm text-gray-600">
                {new Date(invitation.expiresAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Role</p>
              <p className="text-sm text-gray-600 capitalize">{invitation.role}</p>
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-900">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#595F39] focus:border-[#595F39]"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#595F39] focus:border-[#595F39]"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#595F39] focus:border-[#595F39] bg-gray-50"
                placeholder="Enter your email"
                disabled
              />
              <p className="mt-1 text-xs text-gray-500">This email was provided in your invitation</p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#595F39] focus:border-[#595F39] pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#595F39] focus:border-[#595F39] pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {submitError}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#595F39] disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: "#595F39" }}
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Complete Account Setup'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-800">
              Already have an account?{' '}
              <Link href="/login" className="font-medium hover:opacity-80" style={{ color: "#595F39" }}>
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
