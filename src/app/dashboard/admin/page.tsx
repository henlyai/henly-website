'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import { 
  Users, 
  Building2, 
  Settings, 
  UserPlus, 
  Mail,
  Shield,
  Crown,
  CheckCircle,
  XCircle,
  Clock,
  Trash2
} from 'lucide-react'

interface OrganizationMember {
  id: string
  email: string
  full_name: string
  role: 'user' | 'admin' | 'super_admin'
  is_active: boolean
  created_at: string
  last_login: string | null
  is_verified: boolean
  email_verified_at: string | null
  status: string
}

interface Invitation {
  id: string
  email: string
  role: 'user' | 'admin'
  status: 'pending' | 'accepted' | 'expired' | 'cancelled'
  expires_at: string
  created_at: string
  inviter?: {
    id: string
    full_name: string
    email: string
  }
}

export default function AdminPage() {
  const { profile, organization, session } = useAuth()
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'user' | 'admin'>('user')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null)

  // Check if user has admin access
  if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-800">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  const isSuperAdmin = profile.role === 'super_admin'

  const loadMembers = async () => {
    try {
      const response = await fetch('/api/members')

      if (response.ok) {
        const result = await response.json()
        setMembers(result.data || [])
      } else {
        console.error('Failed to load members:', await response.text())
        setMembers([])
      }
    } catch (error) {
      console.error('Error loading members:', error)
      setMembers([])
    }
  }

  const loadInvitations = async () => {
    try {
      const response = await fetch('/api/invitations')

      if (response.ok) {
        const result = await response.json()
        setInvitations(result.data || [])
        
        // Also reload members when invitations are loaded
        // This ensures we get the latest member list if someone just accepted an invitation
        loadMembers()
      } else {
        console.error('Failed to load invitations:', await response.text())
        setInvitations([])
      }
    } catch (error) {
      console.error('Error loading invitations:', error)
      setInvitations([])
    }
  }

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    setInviteLoading(true)
    try {
      const response = await fetch('/api/invite-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          role: inviteRole,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setInviteEmail('')
        // Reload invitations
        loadInvitations()
        
        if (result.emailSuccess) {
          setInviteSuccess('Invitation sent successfully!')
          setInviteError(null)
        } else {
          setInviteError(`Invitation created but email failed: ${result.emailError || 'Unknown error'}`)
          setInviteSuccess(null)
        }
      } else {
        setInviteError(result.error || 'Failed to send invitation')
        setInviteSuccess(null)
      }
    } catch (error) {
      console.error('Error sending invitation:', error)
      setInviteError('Failed to send invitation')
      setInviteSuccess(null)
    } finally {
      setInviteLoading(false)
    }
  }

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/invitations?id=${invitationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Reload invitations
        loadInvitations()
        setInviteSuccess('Invitation cancelled successfully')
        setInviteError(null)
      } else {
        const result = await response.json()
        setInviteError(result.error || 'Failed to cancel invitation')
        setInviteSuccess(null)
      }
    } catch (error) {
      console.error('Error cancelling invitation:', error)
      setInviteError('Failed to cancel invitation')
      setInviteSuccess(null)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([loadMembers(), loadInvitations()])
      setLoading(false)
    }
    loadData()
  }, [])

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="h-4 w-4 text-purple-600" />
      case 'admin':
        return <Shield style={{ color: "#595F39" }} />
      default:
        return <Users className="h-4 w-4 text-gray-800" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle style={{ color: "#595F39" }} />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-800">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-3">
          {isSuperAdmin ? (
            <Crown className="h-8 w-8 text-purple-600" />
          ) : (
            <Shield style={{ color: "#595F39" }} />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isSuperAdmin ? 'Super Admin Panel' : 'Organization Admin'}
            </h1>
            <p className="text-gray-800">
              {isSuperAdmin 
                ? 'Manage all organizations and users' 
                : `Manage ${organization?.name || 'your organization'}`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Organization Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Building2 className="h-6 w-6 text-gray-800" />
          <h2 className="text-lg font-semibold text-gray-900">Organization Details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900">Organization Name</label>
            <p className="mt-1 text-sm text-gray-900">{organization?.name || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">Your Role</label>
            <div className="mt-1 flex items-center space-x-2">
              {getRoleIcon(profile.role)}
              <span className="text-sm text-gray-900 capitalize">{profile.role.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invite New User */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-4">
          <UserPlus className="h-6 w-6 text-gray-800" />
          <h2 className="text-lg font-semibold text-gray-900">Invite New Member</h2>
        </div>
        
        {/* Success/Error Messages */}
        {inviteSuccess && (
          <div className="rounded" style={{ backgroundColor: "rgba(89, 95, 57, 0.2)", borderColor: "rgba(89, 95, 57, 0.5)", color: "rgba(89, 95, 57, 0.8)" }}>
            {inviteSuccess}
          </div>
        )}
        {inviteError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {inviteError}
          </div>
        )}

        <form onSubmit={handleInviteUser} className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#595F39] focus:border-blue-500"
                required
              />
            </div>
            <div className="w-32">
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'user' | 'admin')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#595F39] focus:border-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={inviteLoading}
              className="text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#595F39] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: "#595F39" }}
            >
              {inviteLoading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-gray-800" />
            <h2 className="text-lg font-semibold text-gray-900">Organization Members</h2>
          </div>
        </div>
        <div className="p-6">
          {members.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-800">No members found. Invite users to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center" style={{ backgroundColor: "#595F39" }}>
                      <span className="text-sm font-medium text-white">
                        {member.full_name?.charAt(0) || member.email.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.full_name}</p>
                      <p className="text-sm text-gray-800">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(member.role)}
                      <span className="text-sm text-gray-800 capitalize">{member.role.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {member.is_verified ? (
                        <CheckCircle className="h-4 w-4 text-green-600" title="Email verified" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-600" title="Email not verified" />
                      )}
                      <span className="text-sm text-gray-500">
                        {member.is_verified ? 'Verified' : 'Pending verification'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {member.last_login ? `Last active: ${new Date(member.last_login).toLocaleDateString()}` : 'Never active'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pending Invitations */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Mail className="h-6 w-6 text-gray-800" />
            <h2 className="text-lg font-semibold text-gray-900">Pending Invitations</h2>
          </div>
        </div>
        <div className="p-6">
          {invitations.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-800">No pending invitations.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{invitation.email}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-800">
                        <span>Role: {invitation.role}</span>
                        <span>Invited: {new Date(invitation.created_at).toLocaleDateString()}</span>
                        {invitation.inviter && (
                          <span>by {invitation.inviter.full_name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(invitation.status)}
                      <span className="text-sm text-gray-800 capitalize">{invitation.status}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Expires: {new Date(invitation.expires_at).toLocaleDateString()}
                    </div>
                    {invitation.status === 'pending' && (
                      <button
                        onClick={() => handleCancelInvitation(invitation.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Cancel invitation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
