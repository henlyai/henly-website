'use client'

import { Bot, Zap, Download, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import { marketplaceService, type MarketplaceStats } from '@/lib/marketplace'
import { useAuth } from '@/contexts/AuthContext'

export function MarketplaceStats() {
  const { organization } = useAuth()
  const [stats, setStats] = useState<MarketplaceStats>({
    totalAgents: 0,
    totalPrompts: 0,
    totalDownloads: 0,
    activeUsers: 1
  })

  useEffect(() => {
    const fetchStats = async () => {
      if (!organization) return
      
      try {
        const data = await marketplaceService.getStats(organization.id)
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch marketplace stats:', error)
      }
    }

    fetchStats()
  }, [organization])
  const statsDisplay = [
    {
      name: 'Available Agents',
      value: stats.totalAgents.toString(),
      icon: Bot,
      color: '#595F39'
    },
    {
      name: 'Prompt Templates',
      value: stats.totalPrompts.toString(), 
      icon: Zap,
      color: '#595F39'
    },
    {
      name: 'Total Downloads',
      value: stats.totalDownloads.toString(),
      icon: Download,
      color: '#595F39'
    },
    {
      name: 'Active Users',
      value: stats.activeUsers.toString(),
      icon: Users,
      color: '#595F39'
    }
  ]

  return (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsDisplay.map((stat) => (
          <div key={stat.name} className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
