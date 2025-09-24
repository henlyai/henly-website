'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Users, 
  Bot, 
  Zap, 
  Building2, 
  Share2, 
  Copy, 
  Trash2,
  Plus,
  Search,
  Filter,
  Settings,
  AlertCircle,
  CheckCircle,
  Loader2,
  ChevronDown
} from 'lucide-react'
import { 
  superAdminService, 
  type SuperAdminAgent, 
  type SuperAdminPrompt, 
  type SuperAdminOrganization,
  type SuperAdminStats 
} from '@/lib/super-admin'

export default function SuperAdminPage() {
  const { user, profile } = useAuth()
  const [activeTab, setActiveTab] = useState<'agents' | 'prompts' | 'organizations'>('agents')
  const [agents, setAgents] = useState<SuperAdminAgent[]>([])
  const [prompts, setPrompts] = useState<SuperAdminPrompt[]>([])
  const [organizations, setOrganizations] = useState<SuperAdminOrganization[]>([])
  const [stats, setStats] = useState<SuperAdminStats>({
    totalOrganizations: 0,
    totalAgents: 0,
    totalPrompts: 0,
    totalUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedOrg, setSelectedOrg] = useState('all')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Check if user is super admin
  if (profile?.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">Super admin access required.</p>
        </div>
      </div>
    )
  }

  const categories = [
    'all', 'general', 'sales_marketing', 'customer_support', 
    'data_analytics', 'content_creation', 'project_management',
    'finance_accounting', 'hr_recruitment', 'operations', 'other'
  ]

  useEffect(() => {
    fetchSuperAdminData()
  }, [])

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const fetchSuperAdminData = async () => {
    setLoading(true)
    try {
      const [statsData, agentsData, promptsData, orgsData] = await Promise.all([
        superAdminService.getStats(),
        superAdminService.getAllAgents(),
        superAdminService.getAllPrompts(),
        superAdminService.getAllOrganizations()
      ])
      
      setStats(statsData)
      setAgents(agentsData)
      setPrompts(promptsData)
      setOrganizations(orgsData)
    } catch (error) {
      console.error('Failed to fetch super admin data:', error)
      showNotification('error', 'Failed to load super admin data')
    } finally {
      setLoading(false)
    }
  }

  const shareAgentToOrganization = async (agentId: string, sourceOrgId: string, targetOrgId: string) => {
    try {
      await superAdminService.shareAgent(agentId, sourceOrgId, targetOrgId)
      showNotification('success', 'Agent shared successfully')
      fetchSuperAdminData()
    } catch (error: any) {
      console.error('Failed to share agent:', error)
      showNotification('error', error.message || 'Failed to share agent')
    }
  }

  const sharePromptToOrganization = async (promptId: string, sourceOrgId: string, targetOrgId: string) => {
    try {
      await superAdminService.sharePrompt(promptId, sourceOrgId, targetOrgId)
      showNotification('success', 'Prompt shared successfully')
      fetchSuperAdminData()
    } catch (error: any) {
      console.error('Failed to share prompt:', error)
      showNotification('error', error.message || 'Failed to share prompt')
    }
  }

  const duplicateAgentToOrganization = async (agentId: string, sourceOrgId: string, targetOrgId: string) => {
    try {
      await superAdminService.duplicateAgent(agentId, sourceOrgId, targetOrgId)
      showNotification('success', 'Agent duplicated successfully')
      fetchSuperAdminData()
    } catch (error: any) {
      console.error('Failed to duplicate agent:', error)
      showNotification('error', error.message || 'Failed to duplicate agent')
    }
  }

  const revokeAccess = async (resourceType: 'agents' | 'prompts', resourceId: string, organizationId: string) => {
    try {
      await superAdminService.revokeAccess(resourceType, resourceId, organizationId)
      showNotification('success', 'Access revoked successfully')
      fetchSuperAdminData()
    } catch (error: any) {
      console.error('Failed to revoke access:', error)
      showNotification('error', error.message || 'Failed to revoke access')
    }
  }

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory
    const matchesOrg = selectedOrg === 'all' || agent.organization_id === selectedOrg
    return matchesSearch && matchesCategory && matchesOrg
  })

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory
    const matchesOrg = selectedOrg === 'all' || prompt.organization_id === selectedOrg
    return matchesSearch && matchesCategory && matchesOrg
  })

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            )}
            <p className={`text-sm ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {notification.message}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">
            Super Admin - Cross-Organization Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and share agents, prompts, and resources across all organizations
          </p>
        </div>

        {/* Stats Overview */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Organizations</p>
                <p className="text-lg font-semibold text-gray-900">{stats.totalOrganizations}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Agents</p>
                <p className="text-lg font-semibold text-gray-900">{stats.totalAgents}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Prompts</p>
                <p className="text-lg font-semibold text-gray-900">{stats.totalPrompts}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Share2 className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-lg font-semibold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-4">
            {[
              { id: 'agents', name: 'Agents', icon: Bot, count: stats.totalAgents },
              { id: 'prompts', name: 'Prompts', icon: Zap, count: stats.totalPrompts },
              { id: 'organizations', name: 'Organizations', icon: Building2, count: stats.totalOrganizations }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-3 py-2 font-medium text-sm rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.name} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search agents, prompts, or organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.replace('_', ' ')}
                </option>
              ))}
            </select>

            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Organizations</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading super admin data...</p>
              </div>
            </div>
          ) : activeTab === 'agents' ? (
            <AgentsManagement 
              agents={filteredAgents}
              organizations={organizations}
              onShare={shareAgentToOrganization}
              onDuplicate={duplicateAgentToOrganization}
              onRevoke={revokeAccess}
            />
          ) : activeTab === 'prompts' ? (
            <PromptsManagement 
              prompts={filteredPrompts}
              organizations={organizations}
              onShare={sharePromptToOrganization}
              onRevoke={revokeAccess}
            />
          ) : (
            <OrganizationsManagement organizations={organizations} />
          )}
        </div>
      </div>
    </div>
  )
}

// Sub-components for each tab
function AgentsManagement({ agents, organizations, onShare, onDuplicate, onRevoke }: any) {
  if (agents.length === 0) {
    return (
      <div className="text-center py-10">
        <Bot className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No agents found</h3>
        <p className="mt-1 text-sm text-gray-500">
          No agents match your current filters.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {agents.map((agent: SuperAdminAgent) => (
        <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                {agent.is_default && (
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Default
                  </span>
                )}
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  {agent.category.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{agent.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>Organization: {agent.organization_name}</span>
                <span>Usage: {agent.usage_count}</span>
                <span>Created: {new Date(agent.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <ShareDropdown
                resourceId={agent.id}
                resourceType="agent"
                organizations={organizations}
                currentOrgId={agent.organization_id}
                onShare={onShare}
                onDuplicate={onDuplicate}
                onRevoke={onRevoke}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function PromptsManagement({ prompts, organizations, onShare, onRevoke }: any) {
  if (prompts.length === 0) {
    return (
      <div className="text-center py-10">
        <Zap className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No prompts found</h3>
        <p className="mt-1 text-sm text-gray-500">
          No prompts match your current filters.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {prompts.map((prompt: SuperAdminPrompt) => (
        <div key={prompt.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-gray-900">{prompt.name}</h3>
                {prompt.is_default && (
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Default
                  </span>
                )}
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  {prompt.category.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{prompt.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>Organization: {prompt.organization_name}</span>
                <span>Usage: {prompt.usage_count}</span>
                <span>Created: {new Date(prompt.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <ShareDropdown
                resourceId={prompt.id}
                resourceType="prompt"
                organizations={organizations}
                currentOrgId={prompt.organization_id}
                onShare={onShare}
                onRevoke={onRevoke}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function OrganizationsManagement({ organizations }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {organizations.map((org: SuperAdminOrganization) => (
        <div key={org.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{org.name}</h3>
              <p className="text-sm text-gray-600">{org.domain}</p>
              <div className="mt-2 text-xs text-gray-500">
                <p>Members: {org.member_count}</p>
                <p>Plan: {org.plan_type}</p>
                <p>Agents: {org.agent_count}</p>
                <p>Prompts: {org.prompt_count}</p>
              </div>
            </div>
            <Settings className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ShareDropdown({ resourceId, resourceType, organizations, currentOrgId, onShare, onDuplicate, onRevoke }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = async (action: 'share' | 'duplicate' | 'revoke', targetOrgId: string) => {
    setLoading(`${action}-${targetOrgId}`)
    try {
      if (action === 'share') {
        await onShare(resourceId, currentOrgId, targetOrgId)
      } else if (action === 'duplicate') {
        await onDuplicate(resourceId, currentOrgId, targetOrgId)
      } else if (action === 'revoke') {
        await onRevoke(resourceType === 'agent' ? 'agents' : 'prompts', resourceId, targetOrgId)
      }
      setIsOpen(false)
    } catch (error) {
      console.error(`Failed to ${action}:`, error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-1"
      >
        <Share2 className="h-4 w-4" />
        <span>Manage</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-20">
          <div className="p-3">
            <p className="text-xs text-gray-500 mb-3">Manage access to organizations:</p>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {organizations.filter((org: SuperAdminOrganization) => org.id !== currentOrgId).map((org: SuperAdminOrganization) => (
                <div key={org.id} className="flex items-center justify-between py-2 px-2 bg-gray-50 rounded">
                  <div>
                    <span className="text-sm font-medium">{org.name}</span>
                    <p className="text-xs text-gray-500">{org.domain}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleAction('share', org.id)}
                      disabled={loading === `share-${org.id}`}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 flex items-center space-x-1"
                    >
                      {loading === `share-${org.id}` ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Share2 className="h-3 w-3" />
                      )}
                      <span>Share</span>
                    </button>
                    {onDuplicate && (
                      <button
                        onClick={() => handleAction('duplicate', org.id)}
                        disabled={loading === `duplicate-${org.id}`}
                        className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 flex items-center space-x-1"
                      >
                        {loading === `duplicate-${org.id}` ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span>Copy</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleAction('revoke', org.id)}
                      disabled={loading === `revoke-${org.id}`}
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 flex items-center space-x-1"
                    >
                      {loading === `revoke-${org.id}` ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                      <span>Revoke</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {organizations.filter((org: SuperAdminOrganization) => org.id !== currentOrgId).length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No other organizations available</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
