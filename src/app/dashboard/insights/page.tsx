'use client'

import { useState } from 'react'
import { 
  BookOpen, 
  Play, 
  ExternalLink, 
  Share2, 
  Clock, 
  TrendingUp, 
  Star,
  Calendar,
  Tag,
  ArrowRight,
  Youtube,
  Headphones,
  FileText,
  Zap
} from 'lucide-react'

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState('all')

  const tabs = [
    { id: 'all', name: 'All Content', icon: BookOpen },
    { id: 'trends', name: 'AI Trends', icon: TrendingUp },
    { id: 'features', name: 'Feature Releases', icon: Zap },
    { id: 'courses', name: 'Courses', icon: Play },
    { id: 'podcasts', name: 'Podcasts', icon: Headphones },
  ]

  const content = [
    {
      id: 1,
      type: 'article',
      category: 'trends',
      title: 'The Future of AI in Customer Service: 2024 Trends',
      description: 'Explore how AI is revolutionizing customer service with new automation capabilities, sentiment analysis, and predictive support.',
      author: 'Henly AI Team',
      date: '2024-09-20',
      readTime: '8 min read',
      tags: ['AI Trends', 'Customer Service', 'Automation'],
      image: '/api/placeholder/400/200',
      featured: true,
      url: '#'
    },
    {
      id: 2,
      type: 'feature',
      category: 'features',
      title: 'New: Advanced Context Understanding in Henly AI',
      description: 'Our latest update brings enhanced context awareness, allowing your chatbot to maintain better conversation flow and provide more accurate responses.',
      author: 'Product Team',
      date: '2024-09-19',
      readTime: '5 min read',
      tags: ['Feature Release', 'Context AI', 'Improvements'],
      image: '/api/placeholder/400/200',
      featured: true,
      url: '#'
    },
    {
      id: 3,
      type: 'course',
      category: 'courses',
      title: 'AI Implementation Best Practices',
      description: 'Learn how to effectively implement AI solutions in your business with this comprehensive course covering strategy, deployment, and optimization.',
      author: 'AI Academy',
      date: '2024-09-18',
      readTime: '45 min course',
      tags: ['Course', 'Implementation', 'Best Practices'],
      image: '/api/placeholder/400/200',
      featured: false,
      url: '#',
      videoUrl: 'https://youtube.com/watch?v=example'
    },
    {
      id: 4,
      type: 'podcast',
      category: 'podcasts',
      title: 'The AI Revolution in Business',
      description: 'Join industry experts as they discuss how AI is transforming business operations and what companies need to know to stay competitive.',
      author: 'Tech Talk Podcast',
      date: '2024-09-17',
      readTime: '32 min listen',
      tags: ['Podcast', 'Business AI', 'Industry Insights'],
      image: '/api/placeholder/400/200',
      featured: false,
      url: '#',
      audioUrl: '#'
    },
    {
      id: 5,
      type: 'article',
      category: 'trends',
      title: 'Building Trust in AI: Transparency and Ethics',
      description: 'Understanding the importance of transparent AI systems and ethical considerations in business applications.',
      author: 'AI Ethics Institute',
      date: '2024-09-16',
      readTime: '12 min read',
      tags: ['AI Ethics', 'Transparency', 'Trust'],
      image: '/api/placeholder/400/200',
      featured: false,
      url: '#'
    },
    {
      id: 6,
      type: 'feature',
      category: 'features',
      title: 'Enhanced Analytics Dashboard Now Available',
      description: 'Get deeper insights into your AI chatbot performance with our new analytics features including conversation flow analysis and user satisfaction metrics.',
      author: 'Product Team',
      date: '2024-09-15',
      readTime: '6 min read',
      tags: ['Analytics', 'Dashboard', 'Insights'],
      image: '/api/placeholder/400/200',
      featured: false,
      url: '#'
    }
  ]

  const filteredContent = activeTab === 'all' 
    ? content 
    : content.filter(item => item.category === activeTab)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="h-4 w-4" />
      case 'feature': return <Zap className="h-4 w-4" />
      case 'course': return <Play className="h-4 w-4" />
      case 'podcast': return <Headphones className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-100 text-blue-800'
      case 'feature': return 'bg-green-100 text-green-800'
      case 'course': return 'bg-purple-100 text-purple-800'
      case 'podcast': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Insights & Trends</h1>
        <p className="text-gray-800 mt-1">
          Stay ahead with curated AI content, feature releases, and industry insights tailored for your business needs.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-[#595F39] text-[#595F39]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Featured Content */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            Featured Content
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {content.filter(item => item.featured).map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📊</div>
                    <div className="text-sm">Content Image</div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                      <span className="ml-1 capitalize">{item.type}</span>
                    </span>
                    {item.featured && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{item.author}</span>
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {item.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.readTime}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <a href={item.url} className="inline-flex items-center text-[#595F39] hover:text-[#4a4f2f] text-sm font-medium">
                        Read More
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {activeTab === 'all' ? 'All Content' : tabs.find(t => t.id === activeTab)?.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-3xl mb-2">
                    {item.type === 'course' ? '🎓' : item.type === 'podcast' ? '🎧' : item.type === 'feature' ? '⚡' : '📄'}
                  </div>
                  <div className="text-xs">Content Image</div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                    <span className="ml-1 capitalize">{item.type}</span>
                  </span>
                  {item.featured && (
                    <Star className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{item.author}</span>
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {item.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {item.readTime}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 1).map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Share2 className="h-4 w-4" />
                    </button>
                    {item.videoUrl && (
                      <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="p-1 text-red-500 hover:text-red-600">
                        <Youtube className="h-4 w-4" />
                      </a>
                    )}
                    <a href={item.url} className="inline-flex items-center text-[#595F39] hover:text-[#4a4f2f] text-sm font-medium">
                      {item.type === 'course' ? 'Start Course' : item.type === 'podcast' ? 'Listen' : 'Read'}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-[#595F39] to-[#4a4f2f] rounded-lg shadow p-6 text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Stay Updated with AI Insights</h2>
          <p className="text-[#e8f0e8] mb-4">
            Get weekly curated AI content, feature updates, and industry insights delivered to your inbox.
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-l-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-2 bg-white text-[#595F39] rounded-r-md font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
