import type { TaxonomyItem } from '../lib/tesco'

interface CategoryCarouselProps {
  categories: TaxonomyItem[]
  onCategoryClick: (category: TaxonomyItem) => void
  roundedImages?: boolean
}

export default function CategoryCarousel({ categories, onCategoryClick, roundedImages = true }: CategoryCarouselProps) {
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
      <div className="px-4 sm:px-8">
        {/* Grid container with 2 rows */}
        <div className={`grid grid-rows-2 max-w-full overflow-hidden ${
          roundedImages 
            ? 'grid-cols-[repeat(auto-fit,minmax(70px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 sm:gap-6' 
            : 'grid-cols-[repeat(auto-fit,minmax(120px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-2'
        }`}>
          {categories.map((category) => {
            const imageUrl = getImageUrl(category)
            if (!imageUrl) return null

            return (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category)}
                className="flex flex-col items-center gap-1 sm:gap-2 group"
              >
                {/* Image container - circular for Tesco (1:1), portrait 5:4 ratio for F&F */}
                <div className={`
                  ${roundedImages 
                    ? 'w-[60px] h-[60px] sm:w-[140px] sm:h-[140px] rounded-full' 
                    : 'w-[120px] h-[150px] sm:w-[280px] sm:h-[350px] rounded-none'
                  } 
                  overflow-hidden bg-gray-100 transition-transform group-hover:scale-105
                `}>
                  <img
                    src={imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Category label */}
                <span className={`
                  ${roundedImages 
                    ? "font-['Tesco_Modern'] text-[#00539f]" 
                    : "font-['F&F_Sans'] text-black uppercase"
                  }
                  font-bold text-[12px] sm:text-[16px] leading-[14px] sm:leading-[20px] text-center
                `}>
                  {category.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

