'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { MessageSquare, Users, Zap, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function DashboardPage() {
  const { profile, organization } = useAuth()
  const [loading, setLoading] = useState(false) // Set to false since we're using mock data
  const [showWelcome, setShowWelcome] = useState(false)
  const searchParams = useSearchParams()
  const orgSlug = searchParams.get('org')

  useEffect(() => {
    // Show welcome message if coming from verification
    if (orgSlug) {
      setShowWelcome(true)
      // Hide welcome message after 10 seconds
      const timer = setTimeout(() => setShowWelcome(false), 10000)
      return () => clearTimeout(timer)
    }
  }, [orgSlug])

  // Mock chatbot stats
  const stats = [
    {
      name: 'Chat Sessions',
      value: '387',
      change: '+12%',
      changeType: 'positive',
      icon: MessageSquare,
    },
    {
      name: 'Satisfaction Rate',
      value: '94%',
      change: '+3%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Avg Response Time',
      value: '2.3s',
      change: '-0.5s',
      changeType: 'positive',
      icon: Clock,
    },
    {
      name: 'Active Today',
      value: '73',
      change: '+8',
      changeType: 'positive',
      icon: TrendingUp,
    },
  ]

  // Calculate usage percentage based on your schema
  const usagePercentage = organization 
    ? Math.round((22480 / (organization.monthly_token_limit || 100000)) * 100) // Mock current usage
    : 0

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message for New Users */}
      {showWelcome && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800">
                Welcome to {organization?.name}!
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Your email has been verified and your organization is ready to go. Start exploring your AI chatbot below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile?.full_name || 'User'}!
        </h1>
        <p className="text-gray-800 mt-1">
          Your AI chatbot is ready to help with {organization?.name}'s customer support needs.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Monthly Usage</h3>
          <span className="text-sm text-gray-500">
            22,480 / {organization?.monthly_token_limit?.toLocaleString() || '100,000'} tokens
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              usagePercentage > 80 ? 'bg-red-500' : usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-600'
            }`}
            style={{ 
              width: `${Math.min(usagePercentage, 100)}%`,
              backgroundColor: usagePercentage <= 60 ? "#595F39" : undefined
            }}
          />
        </div>
        <p className="text-sm text-gray-800 mt-2">
          {usagePercentage}% of your monthly limit used
        </p>
      </div>

      {/* Services Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* AI Chatbot Service */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">AI Chatbot</h3>
            <p className="text-sm text-gray-800">
              Your custom AI assistant connected to your business systems and databases.
            </p>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="mx-auto mb-4 h-12 w-12" style={{ color: "#595F39" }} />
                <p className="text-gray-800 mb-4">Your AI Chatbot is ready to assist customers</p>
                <div className="space-x-4">
                  <Link 
                    href="/dashboard/chatbot"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#595F39]" 
                    style={{ backgroundColor: "#595F39" }}
                  >
                    Open Chatbot
                  </Link>
                  <Link 
                    href="/dashboard/analytics"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#595F39]"
                  >
                    View Analytics
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard/chatbot" className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageSquare className="mr-3 h-6 w-6" style={{ color: "#595F39" }} />
            <div className="text-left">
              <div className="font-medium text-gray-900">Start Chat</div>
              <div className="text-sm text-gray-500">Open AI chatbot</div>
            </div>
          </Link>
          
          <Link href="/dashboard/analytics" className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Zap className="h-5 w-5 text-purple-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Analytics</div>
              <div className="text-sm text-gray-500">View performance metrics</div>
            </div>
          </Link>

          <div className="flex items-center p-4 border border-gray-300 rounded-lg bg-gray-50 opacity-60">
            <Users className="mr-3 h-6 w-6 text-gray-400" />
            <div className="text-left">
              <div className="font-medium text-gray-500">Team Settings</div>
              <div className="text-sm text-gray-400">Coming Soon</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
