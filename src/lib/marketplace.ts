// Marketplace API service for connecting to backend
import { supabase } from '@/lib/supabase-client'

const LIBRECHAT_BASE_URL = process.env.NEXT_PUBLIC_LIBRECHAT_URL || 'https://localhost:3080'

// Types for marketplace items
export interface MarketplaceAgent {
  id: string
  name: string
  description: string
  category: string
  avatar_url?: string
  author: string
  downloads: number
  rating: number
  is_public: boolean
  created_at: string
  tags?: string[]
  organization_id: string
  librechat_agent_id: string
}

export interface MarketplacePrompt {
  id: string
  name: string
  description: string
  category: string
  author: string
  downloads: number
  rating: number
  is_public: boolean
  created_at: string
  tags?: string[]
  preview_text?: string
  organization_id: string
  librechat_prompt_id: string
}

export interface MarketplaceStats {
  totalAgents: number
  totalPrompts: number
  totalDownloads: number
  activeUsers: number
}

class MarketplaceService {
  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession()
    const accessToken = session?.access_token
    
    return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}
  }

  // Categories
  async getCategories(): Promise<string[]> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${LIBRECHAT_BASE_URL}/api/marketplace/categories`, {
        headers,
        credentials: 'include'
      })
      
      if (!response.ok) throw new Error('Failed to fetch categories')
      
      const data = await response.json()
      return data.categories || []
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }

  // Agents
  async getAgents(filters: {
    category?: string
    search?: string
    organization_id?: string
  } = {}): Promise<MarketplaceAgent[]> {
    try {
      const headers = await this.getAuthHeaders()
      const params = new URLSearchParams()
      
      if (filters.category && filters.category !== 'general') {
        params.append('category', filters.category)
      }
      if (filters.search) {
        params.append('search', filters.search)
      }
      if (filters.organization_id) {
        params.append('organization_id', filters.organization_id)
      }

      const url = `${LIBRECHAT_BASE_URL}/api/marketplace/agents${params.toString() ? '?' + params.toString() : ''}`
      
      const response = await fetch(url, {
        headers,
        credentials: 'include'
      })
      
      if (!response.ok) throw new Error('Failed to fetch agents')
      
      const data = await response.json()
      return data.agents || []
    } catch (error) {
      console.error('Error fetching agents:', error)
      return []
    }
  }

  async installAgent(agentId: string): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${LIBRECHAT_BASE_URL}/api/marketplace/agents/${agentId}/install`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      
      if (!response.ok) throw new Error('Failed to install agent')
      
      return true
    } catch (error) {
      console.error('Error installing agent:', error)
      return false
    }
  }

  async publishAgent(agentId: string, options: {
    isPublic: boolean
    category?: string
    tags?: string[]
  }): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${LIBRECHAT_BASE_URL}/api/marketplace/agents/${agentId}/publish`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(options),
        credentials: 'include'
      })
      
      if (!response.ok) throw new Error('Failed to publish agent')
      
      return true
    } catch (error) {
      console.error('Error publishing agent:', error)
      return false
    }
  }

  // Prompts
  async getPrompts(filters: {
    category?: string
    search?: string
    organization_id?: string
  } = {}): Promise<MarketplacePrompt[]> {
    try {
      const headers = await this.getAuthHeaders()
      const params = new URLSearchParams()
      
      if (filters.category && filters.category !== 'general') {
        params.append('category', filters.category)
      }
      if (filters.search) {
        params.append('search', filters.search)
      }
      if (filters.organization_id) {
        params.append('organization_id', filters.organization_id)
      }

      const url = `${LIBRECHAT_BASE_URL}/api/marketplace/prompts${params.toString() ? '?' + params.toString() : ''}`
      
      const response = await fetch(url, {
        headers,
        credentials: 'include'
      })
      
      if (!response.ok) throw new Error('Failed to fetch prompts')
      
      const data = await response.json()
      return data.prompts || []
    } catch (error) {
      console.error('Error fetching prompts:', error)
      return []
    }
  }

  async installPrompt(promptId: string): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${LIBRECHAT_BASE_URL}/api/marketplace/prompts/${promptId}/install`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      
      if (!response.ok) throw new Error('Failed to install prompt')
      
      return true
    } catch (error) {
      console.error('Error installing prompt:', error)
      return false
    }
  }

  async publishPrompt(promptId: string, options: {
    isPublic: boolean
    category?: string
    tags?: string[]
  }): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${LIBRECHAT_BASE_URL}/api/marketplace/prompts/${promptId}/publish`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(options),
        credentials: 'include'
      })
      
      if (!response.ok) throw new Error('Failed to publish prompt')
      
      return true
    } catch (error) {
      console.error('Error publishing prompt:', error)
      return false
    }
  }

  // Stats
  async getStats(organizationId?: string): Promise<MarketplaceStats> {
    try {
      const headers = await this.getAuthHeaders()
      const params = organizationId ? `?organization_id=${organizationId}` : ''
      
      const response = await fetch(`${LIBRECHAT_BASE_URL}/api/marketplace/stats${params}`, {
        headers,
        credentials: 'include'
      })
      
      if (!response.ok) throw new Error('Failed to fetch stats')
      
      const data = await response.json()
      return {
        totalAgents: data.total_agents || 0,
        totalPrompts: data.total_prompts || 0,
        totalDownloads: data.total_downloads || 0,
        activeUsers: data.active_users || 1
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      return {
        totalAgents: 0,
        totalPrompts: 0,
        totalDownloads: 0,
        activeUsers: 1
      }
    }
  }
}

export const marketplaceService = new MarketplaceService()
