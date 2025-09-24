'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Store, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Star, 
  Users, 
  Bot,
  Zap,
  Settings,
  Plus,
  Grid3x3,
  List
} from 'lucide-react'
import { MarketplaceCategories } from '@/components/marketplace/MarketplaceCategories'
import { AgentCard } from '@/components/marketplace/AgentCard'
import { PromptCard } from '@/components/marketplace/PromptCard'
import { MarketplaceStats } from '@/components/marketplace/MarketplaceStats'
import { marketplaceService, type MarketplaceAgent, type MarketplacePrompt } from '@/lib/marketplace'

export default function MarketplacePage() {
  const { user, organization } = useAuth()
  const [activeTab, setActiveTab] = useState<'agents' | 'prompts'>('agents')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [agents, setAgents] = useState<MarketplaceAgent[]>([])
  const [prompts, setPrompts] = useState<MarketplacePrompt[]>([])
  const [loading, setLoading] = useState(true)

  const tabs = [
    { id: 'agents', name: 'AI Agents', icon: Bot, count: agents.length },
    { id: 'prompts', name: 'Prompt Library', icon: Zap, count: prompts.length },
  ]

  useEffect(() => {
    fetchMarketplaceData()
  }, [organization, selectedCategory, searchQuery])

  const fetchMarketplaceData = async () => {
    if (!organization) return
    
    setLoading(true)
    try {
      const [agentsData, promptsData] = await Promise.all([
        marketplaceService.getAgents({
          category: selectedCategory,
          search: searchQuery,
          organization_id: organization.id
        }),
        marketplaceService.getPrompts({
          category: selectedCategory,
          search: searchQuery,
          organization_id: organization.id
        })
      ])
      
      setAgents(agentsData)
      setPrompts(promptsData)
    } catch (error) {
      console.error('Failed to fetch marketplace data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Store className="mr-3 h-8 w-8" style={{ color: '#595F39' }} />
                Agent Marketplace
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Discover, share, and install AI agents and prompts for your organization
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                style={{ focusRingColor: '#595F39' }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Publish Content
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                style={{ backgroundColor: '#595F39', focusRingColor: '#595F39' }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <MarketplaceStats />

        {/* Tabs */}
        <div className="px-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'agents' | 'prompts')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                      isActive
                        ? 'border-[#595F39] text-[#595F39]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="mr-2 h-4 w-4" />
                    {tab.name}
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      isActive 
                        ? 'bg-[#595F39] bg-opacity-10 text-[#595F39]' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'agents' ? 'agents' : 'prompts'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:border-[#595F39] transition-colors"
                  style={{ focusRingColor: '#595F39' }}
                />
              </div>
            </div>

            {/* Filters and View Mode */}
            <div className="flex items-center space-x-4">
              <MarketplaceCategories 
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#595F39' }}></div>
                <p className="mt-4 text-gray-600">Loading marketplace content...</p>
              </div>
            </div>
          ) : (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
            }`}>
              {activeTab === 'agents' ? (
                agents.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Bot className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No agents found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating your first AI agent or browse the public marketplace.
                    </p>
                    <div className="mt-6">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90"
                        style={{ backgroundColor: '#595F39' }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Agent
                      </button>
                    </div>
                  </div>
                ) : (
                  agents.map((agent: any) => (
                    <AgentCard 
                      key={agent.id} 
                      agent={agent} 
                      viewMode={viewMode}
                    />
                  ))
                )
              ) : (
                prompts.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Zap className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No prompts found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating your first prompt template or browse the public library.
                    </p>
                    <div className="mt-6">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90"
                        style={{ backgroundColor: '#595F39' }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Prompt
                      </button>
                    </div>
                  </div>
                ) : (
                  prompts.map((prompt: any) => (
                    <PromptCard 
                      key={prompt.id} 
                      prompt={prompt} 
                      viewMode={viewMode}
                    />
                  ))
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
