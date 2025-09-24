'use client'

import { Zap, Download, Star, Copy, Calendar, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

interface PromptCardProps {
  prompt: {
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
  }
  viewMode: 'grid' | 'list'
}

export function PromptCard({ prompt, viewMode }: PromptCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const handleInstall = () => {
    // TODO: Implement install functionality
    console.log('Installing prompt:', prompt.id)
  }

  const handleCopy = () => {
    // TODO: Implement copy functionality
    console.log('Copying prompt:', prompt.id)
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Sharing prompt:', prompt.id)
  }

  if (viewMode === 'list') {
    return (
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" 
              style={{ backgroundColor: '#595F3915' }}
            >
              <Zap className="h-6 w-6" style={{ color: '#595F39' }} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">{prompt.name}</h3>
            <p className="text-sm text-gray-500 truncate">{prompt.description}</p>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-xs text-gray-400">by {prompt.author}</span>
              <span className="text-xs text-gray-400">{prompt.category}</span>
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-400 ml-1">{prompt.rating}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">{prompt.downloads} downloads</span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </button>
          <button
            onClick={handleInstall}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#595F39' }}
          >
            <Download className="h-3 w-3 mr-1" />
            Install
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow relative">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <button
                  onClick={handleShare}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Share
                </button>
                <button
                  onClick={() => console.log('View details')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  View Details
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center" 
            style={{ backgroundColor: '#595F3915' }}
          >
            <Zap className="h-6 w-6" style={{ color: '#595F39' }} />
          </div>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium text-gray-900">{prompt.name}</h3>
          <p className="text-sm text-gray-500">by {prompt.author}</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{prompt.description}</p>

      {prompt.preview_text && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-500 mb-1">Preview:</p>
          <p className="text-sm text-gray-700 font-mono line-clamp-2">{prompt.preview_text}</p>
        </div>
      )}

      {prompt.tags && prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tag}
            </span>
          ))}
          {prompt.tags.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              +{prompt.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Download className="h-4 w-4 mr-1" />
            {prompt.downloads}
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
            {prompt.rating}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(prompt.created_at).toLocaleDateString()}
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          prompt.is_public 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {prompt.is_public ? 'Public' : 'Private'}
        </span>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleCopy}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
          style={{ focusRingColor: '#595F39' }}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </button>
        <button
          onClick={handleInstall}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
          style={{ backgroundColor: '#595F39', focusRingColor: '#595F39' }}
        >
          <Download className="h-4 w-4 mr-2" />
          Install
        </button>
      </div>
    </div>
  )
}
