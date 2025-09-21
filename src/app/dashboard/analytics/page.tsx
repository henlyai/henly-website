'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { TrendingUp, Users, MessageSquare, Calendar, BarChart3 } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'

export default function AnalyticsPage() {
  const { organization, user, profile } = useAuth()
  const [loading, setLoading] = useState(false) // Set to false since we're using mock data

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Dashboard Supabase session:', session);
    });
    console.log('Dashboard AuthContext user:', user);
    console.log('Dashboard AuthContext profile:', profile);
    console.log('Dashboard AuthContext organization:', organization);
  }, [organization?.id])

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

  // Chatbot performance metrics
  const totalSessions = chatbotMetrics.reduce((sum, day) => sum + day.sessions, 0)
  const totalMessages = chatbotMetrics.reduce((sum, day) => sum + day.messages, 0)
  const totalTokens = chatbotMetrics.reduce((sum, day) => sum + day.tokens, 0)
  const avgResponseTime = '2.3'
  const satisfactionRate = '94'

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
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-800 mt-1">
          Track your AI chatbot performance and usage metrics
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageSquare className="h-6 w-6" style={{ color: "#595F39" }} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Sessions
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {totalSessions}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6" style={{ color: "#595F39" }} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Satisfaction Rate
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {satisfactionRate}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg Response Time
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {avgResponseTime}s
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Messages
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {totalMessages}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chatbot Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Chatbot Performance</h3>
          <div className="space-y-4">
            {chatbotMetrics.map((metric, index) => (
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

        {/* Chatbot Topics */}
        <div className="bg-white rounded-lg shadow p-6">
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
      </div>

      {/* Usage Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Usage Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2" style={{ color: "#595F39" }}>
              {totalSessions}
            </div>
            <div className="text-sm text-gray-800">Chat Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2" style={{ color: "#595F39" }}>
              {totalMessages}
            </div>
            <div className="text-sm text-gray-800">Messages Processed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {totalTokens.toLocaleString()}
            </div>
            <div className="text-sm text-gray-800">Tokens Used</div>
          </div>
        </div>
      </div>
    </div>
  )
}
