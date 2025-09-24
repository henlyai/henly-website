'use client'

import { useState } from 'react'
import { ChevronDown, Filter } from 'lucide-react'

interface MarketplaceCategoriesProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function MarketplaceCategories({ selectedCategory, onCategoryChange }: MarketplaceCategoriesProps) {
  const [isOpen, setIsOpen] = useState(false)

  const categories = [
    { id: 'all', name: 'All Categories', description: 'Browse everything' },
    { id: 'general', name: 'General', description: 'General purpose agents & prompts' },
    { id: 'sales_marketing', name: 'Sales & Marketing', description: 'Lead generation, campaigns, outreach' },
    { id: 'customer_support', name: 'Customer Support', description: 'Help desk, chatbots, FAQs' },
    { id: 'data_analytics', name: 'Data & Analytics', description: 'Reporting, insights, analysis' },
    { id: 'content_creation', name: 'Content Creation', description: 'Writing, blogs, social media' },
    { id: 'project_management', name: 'Project Management', description: 'Planning, tracking, coordination' },
    { id: 'finance_accounting', name: 'Finance & Accounting', description: 'Budgeting, invoicing, reports' },
    { id: 'hr_recruitment', name: 'HR & Recruitment', description: 'Hiring, onboarding, management' },
    { id: 'operations', name: 'Operations', description: 'Process automation, workflows' },
    { id: 'other', name: 'Other', description: 'Specialized and niche solutions' }
  ]

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory) || categories[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
        style={{ focusRingColor: '#595F39' }}
      >
        <Filter className="mr-2 h-4 w-4" />
        {selectedCategoryData.name}
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1 max-h-96 overflow-y-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategoryChange(category.id)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left block px-4 py-3 text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-[#595F39] bg-opacity-10 text-[#595F39]'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{category.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{category.description}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
