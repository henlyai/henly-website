'use client'

interface MarketplaceCategoriesProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function MarketplaceCategories({ selectedCategory, onCategoryChange }: MarketplaceCategoriesProps) {
  const categories = [
    { id: 'general', name: 'General' },
    { id: 'sales_marketing', name: 'Sales & Marketing' },
    { id: 'customer_support', name: 'Customer Support' },
    { id: 'data_analytics', name: 'Data & Analytics' },
    { id: 'content_creation', name: 'Content Creation' },
    { id: 'project_management', name: 'Project Management' },
    { id: 'finance_accounting', name: 'Finance & Accounting' },
    { id: 'hr_recruitment', name: 'HR & Recruitment' },
    { id: 'operations', name: 'Operations' },
    { id: 'other', name: 'Other' }
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
            selectedCategory === category.id
              ? 'text-white shadow-sm'
              : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
          }`}
          style={{
            backgroundColor: selectedCategory === category.id ? '#595F39' : undefined
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
