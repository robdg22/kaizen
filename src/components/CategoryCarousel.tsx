import { useRef } from 'react'
import type { TaxonomyItem } from '../lib/tesco'

interface CategoryCarouselProps {
  categories: TaxonomyItem[]
  onCategoryClick: (category: TaxonomyItem) => void
  roundedImages?: boolean
}

export default function CategoryCarousel({ categories, onCategoryClick, roundedImages = true }: CategoryCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      })
    }
  }

  // Get the image URL from the taxonomy item
  const getImageUrl = (category: TaxonomyItem): string | null => {
    if (!category.images || category.images.length === 0) return null
    // Try to find rounded style first, otherwise use the first available style
    const imageStyle = category.images.find(img => img.style === 'rounded') || category.images[0]
    if (!imageStyle || imageStyle.images.length === 0) return null
    return imageStyle.images[0].url
  }

  return (
    <div className="relative bg-white py-6 sm:py-8">
      <div className="relative px-4 sm:px-8">
        {/* Left scroll arrow - desktop only */}
        <button
          onClick={() => scroll('left')}
          className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          aria-label="Scroll left"
        >
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-12 sm:px-16"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => {
            const imageUrl = getImageUrl(category)
            if (!imageUrl) return null

            return (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category)}
                className="flex flex-col items-center gap-2 min-w-[120px] sm:min-w-[140px] group"
              >
                {/* Image container - circular for Tesco (1:1), portrait 5:4 ratio for F&F */}
                <div className={`
                  ${roundedImages 
                    ? 'w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-full' 
                    : 'w-[120px] h-[150px] sm:w-[140px] sm:h-[175px] rounded-none'
                  } 
                  overflow-hidden bg-gray-100 transition-transform group-hover:scale-105
                `}>
                  <img
                    src={imageUrl}
                    alt={category.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Category label */}
                <span className={`
                  ${roundedImages 
                    ? "font-['Tesco_Modern'] text-[#00539f]" 
                    : "font-['F&F_Sans'] text-black uppercase"
                  }
                  font-bold text-[14px] sm:text-[16px] leading-[18px] sm:leading-[20px] text-center
                `}>
                  {category.name}
                </span>
              </button>
            )
          })}
        </div>

        {/* Right scroll arrow - desktop only */}
        <button
          onClick={() => scroll('right')}
          className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          aria-label="Scroll right"
        >
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Hide scrollbar CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

