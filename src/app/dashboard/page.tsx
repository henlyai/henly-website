'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { MessageSquare, Users, Zap, TrendingUp, Clock, CheckCircle, Calendar, BarChart3, BookOpen, Share2, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function DashboardPage() {
  const { profile, organization } = useAuth()
  const [loading, setLoading] = useState(false)
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

  // Mock data for chatbot metrics
  const chatbotMetrics = [
    { date: '2024-09-15', sessions: 45, messages: 234, tokens: 12340 },
    { date: '2024-09-16', sessions: 52, messages: 289, tokens: 15670 },
    { date: '2024-09-17', sessions: 48, messages: 267, tokens: 14230 },
    { date: '2024-09-18', sessions: 61, messages: 345, tokens: 18920 },
    { date: '2024-09-19', sessions: 55, messages: 298, tokens: 16240 },
    { date: '2024-09-20', sessions: 67, messages: 378, tokens: 20150 },
    { date: '2024-09-21', sessions: 73, messages: 412, tokens: 22480 },
  ]

  const topChatbotTopics = [
    { topic: 'Product Information', count: 234, percentage: 28 },
    { topic: 'Technical Support', count: 189, percentage: 23 },
    { topic: 'Pricing Questions', count: 156, percentage: 19 },
    { topic: 'Account Management', count: 123, percentage: 15 },
    { topic: 'General Inquiries', count: 98, percentage: 12 },
  ]

  // Calculate usage percentage based on your schema
  const usagePercentage = organization 
    ? Math.round((22480 / (organization.monthly_token_limit || 100000)) * 100)
    : 0

  // Calculate totals
  const totalSessions = chatbotMetrics.reduce((sum, day) => sum + day.sessions, 0)
  const totalMessages = chatbotMetrics.reduce((sum, day) => sum + day.messages, 0)
  const totalTokens = chatbotMetrics.reduce((sum, day) => sum + day.tokens, 0)

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
            {totalTokens.toLocaleString()} / {organization?.monthly_token_limit?.toLocaleString() || '100,000'} tokens
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights Preview */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">AI Insights & Trends</h3>
            <p className="text-sm text-gray-800">
              Stay updated with the latest AI trends, feature releases, and industry insights.
            </p>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="mx-auto mb-4 h-12 w-12" style={{ color: "#595F39" }} />
                <p className="text-gray-800 mb-4">Explore curated AI content and insights</p>
                <Link 
                  href="/dashboard/insights"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#595F39]" 
                  style={{ backgroundColor: "#595F39" }}
                >
                  View Insights
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Analytics</h2>
        
        {/* Daily Performance */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Chatbot Performance</h3>
          <div className="space-y-4">
            {chatbotMetrics.slice(-7).map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-800">
                    {new Date(metric.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{metric.sessions}</div>
                    <div className="text-xs text-gray-500">Sessions</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{metric.messages}</div>
                    <div className="text-xs text-gray-500">Messages</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{metric.tokens.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Tokens</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topics Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Chatbot Topics</h3>
            <div className="space-y-4">
              {topChatbotTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#595F39" }}></div>
                    <span className="text-sm font-medium text-gray-900">{topic.topic}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{topic.count}</div>
                      <div className="text-xs text-gray-500">queries</div>
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ backgroundColor: "#595F39", width: `${topic.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-8">{topic.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-800">Total Sessions</span>
                <span className="text-lg font-semibold" style={{ color: "#595F39" }}>{totalSessions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-800">Messages Processed</span>
                <span className="text-lg font-semibold" style={{ color: "#595F39" }}>{totalMessages}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-800">Tokens Used</span>
                <span className="text-lg font-semibold text-purple-600">{totalTokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-800">Avg Response Time</span>
                <span className="text-lg font-semibold text-gray-900">2.3s</span>
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
          
          <Link href="/dashboard/insights" className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <BookOpen className="h-5 w-5 text-purple-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">AI Insights</div>
              <div className="text-sm text-gray-500">Explore trends & content</div>
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
