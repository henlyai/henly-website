import { supabase } from './supabase-client'

const LIBRECHAT_BASE_URL = process.env.NEXT_PUBLIC_LIBRECHAT_URL || 'http://localhost:3080'

export interface SuperAdminAgent {
  id: string
  librechat_agent_id: string
  name: string
  description: string
  category: string
  organization_id: string
  organization_name: string
  creator_name: string
  is_default: boolean
  usage_count: number
  created_at: string
  librechat_data?: {
    model: string
    provider: string
    tools: string[]
    instructions: string
  }
}

export interface SuperAdminPrompt {
  id: string
  librechat_group_id: string
  name: string
  description: string
  category: string
  organization_id: string
  organization_name: string
  creator_name: string
  is_default: boolean
  usage_count: number
  created_at: string
  prompt_text: string
}

export interface SuperAdminOrganization {
  id: string
  name: string
  domain: string
  plan_type: string
  member_count: number
  agent_count: number
  prompt_count: number
  created_at: string
  last_activity_at: string
}

export interface SuperAdminStats {
  totalOrganizations: number
  totalAgents: number
  totalPrompts: number
  totalUsers: number
}

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession()
  const accessToken = session?.access_token
  return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}
}

export const superAdminService = {
  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<SuperAdminStats> {
    const headers = await getAuthHeaders()
    const res = await fetch(`${LIBRECHAT_BASE_URL}/api/super-admin/stats`, { headers })
    if (!res.ok) {
      throw new Error(`Failed to fetch stats: ${res.statusText}`)
    }
    const { data } = await res.json()
    return data
  },

  /**
   * Get all agents across all organizations
   */
  async getAllAgents(): Promise<SuperAdminAgent[]> {
    const headers = await getAuthHeaders()
    const res = await fetch(`${LIBRECHAT_BASE_URL}/api/super-admin/agents`, { headers })
    if (!res.ok) {
      throw new Error(`Failed to fetch agents: ${res.statusText}`)
    }
    const { data } = await res.json()
    return data
  },

  /**
   * Get all prompts across all organizations
   */
  async getAllPrompts(): Promise<SuperAdminPrompt[]> {
    const headers = await getAuthHeaders()
    const res = await fetch(`${LIBRECHAT_BASE_URL}/api/super-admin/prompts`, { headers })
    if (!res.ok) {
      throw new Error(`Failed to fetch prompts: ${res.statusText}`)
    }
    const { data } = await res.json()
    return data
  },

  /**
   * Get all organizations with stats
   */
  async getAllOrganizations(): Promise<SuperAdminOrganization[]> {
    const headers = await getAuthHeaders()
    const res = await fetch(`${LIBRECHAT_BASE_URL}/api/super-admin/organizations`, { headers })
    if (!res.ok) {
      throw new Error(`Failed to fetch organizations: ${res.statusText}`)
    }
    const { data } = await res.json()
    return data
  },

  /**
   * Share an agent to another organization
   */
  async shareAgent(agentId: string, sourceOrgId: string, targetOrgId: string): Promise<SuperAdminAgent> {
    const headers = await getAuthHeaders()
    const res = await fetch(`${LIBRECHAT_BASE_URL}/api/super-admin/agents/${agentId}/share`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceOrgId, targetOrgId }),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.details || `Failed to share agent: ${res.statusText}`)
    }
    const { data } = await res.json()
    return data
  },

  /**
   * Duplicate an agent to another organization
   */
  async duplicateAgent(agentId: string, sourceOrgId: string, targetOrgId: string): Promise<SuperAdminAgent> {
    const headers = await getAuthHeaders()
    const res = await fetch(`${LIBRECHAT_BASE_URL}/api/super-admin/agents/${agentId}/duplicate`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceOrgId, targetOrgId }),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.details || `Failed to duplicate agent: ${res.statusText}`)
    }
    const { data } = await res.json()
    return data
  },

  /**
   * Share a prompt to another organization
   */
  async sharePrompt(promptId: string, sourceOrgId: string, targetOrgId: string): Promise<SuperAdminPrompt> {
    const headers = await getAuthHeaders()
    const res = await fetch(`${LIBRECHAT_BASE_URL}/api/super-admin/prompts/${promptId}/share`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceOrgId, targetOrgId }),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.details || `Failed to share prompt: ${res.statusText}`)
    }
    const { data } = await res.json()
    return data
  },

  /**
   * Revoke access to a resource from an organization
   */
  async revokeAccess(resourceType: 'agents' | 'prompts', resourceId: string, organizationId: string): Promise<void> {
    const headers = await getAuthHeaders()
    const res = await fetch(`${LIBRECHAT_BASE_URL}/api/super-admin/${resourceType}/${resourceId}/revoke`, {
      method: 'DELETE',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationId }),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.details || `Failed to revoke access: ${res.statusText}`)
    }
  },

  /**
   * Bulk share resources to multiple organizations
   */
  async bulkShare(
    resourceType: 'agent' | 'prompt',
    resourceIds: string[],
    sourceOrgId: string,
    targetOrgIds: string[]
  ): Promise<{ successful: number; failed: number; errors: any[] }> {
    const headers = await getAuthHeaders()
    const res = await fetch(`${LIBRECHAT_BASE_URL}/api/super-admin/bulk-share`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceType, resourceIds, sourceOrgId, targetOrgIds }),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.details || `Failed to bulk share: ${res.statusText}`)
    }
    const { data } = await res.json()
    return data
  }
}
