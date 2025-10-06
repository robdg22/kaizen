import type { ProductItem } from '../lib/tesco'

interface TescoProductCardProps {
  product: ProductItem
  onAddToBasket: () => void
}

export default function TescoProductCard({ product, onAddToBasket }: TescoProductCardProps) {
  // Get product image
  const imageUrl = product.media?.defaultImage?.url || product.defaultImageUrl || product.images?.display?.default?.url || ''

  // Get product price
  const price = product.price?.actual || product.price?.price || 0
  const unitPrice = product.price?.unitPrice || ''
  const unitOfMeasure = product.price?.unitOfMeasure || ''
  
  // Get review data
  const reviewCount = product.reviews?.stats?.noOfReviews || 0
  const rating = product.reviews?.stats?.overallRating || 0
  const starCount = Math.floor(rating)
  
  // Determine if unit price should be shown
  // Don't show if: no unit price, unit is "each", or unit price is same as actual price
  const showUnitPrice = unitPrice && 
                        unitOfMeasure.toLowerCase() !== 'each' && 
                        unitPrice !== `£${price.toFixed(2)}`

  return (
    <div className="bg-white border border-[#cccccc] flex flex-col gap-[12px] p-[16px] w-full h-full">
      {/* Top container */}
      <div className="flex flex-col gap-[12px] w-full flex-1">
        {/* Image container - Square aspect ratio */}
        <div className="flex items-center justify-center w-full">
          <div className="flex flex-col items-start w-full aspect-square">
            <img 
              src={imageUrl} 
              alt={product.title}
              className="w-full h-full object-cover object-center pointer-events-none"
            />
          </div>
        </div>

        {/* Product title */}
        <div className="flex flex-col gap-[4px] w-full">
          <p className="font-['Tesco_Modern'] text-[16px] leading-[20px] text-[#00539f] w-full">
            {product.title}
          </p>
        </div>

        {/* Rating */}
        {reviewCount > 0 && (
          <div className="flex gap-[8px] items-center w-full">
            <div className="flex gap-[4px] items-start">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="w-[12px] h-[12px]">
                  <svg viewBox="0 0 12 12" fill={star <= starCount ? "#FCD700" : "#E0E0E0"}>
                    <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.5L6 8.885L2.91 10.5L3.5 7.07L1 4.635L4.455 4.13L6 1Z"/>
                  </svg>
                </div>
              ))}
            </div>
            <p className="font-['Tesco_Modern'] text-[14px] leading-[18px] text-[#666666]">
              {rating.toFixed(1)} ({reviewCount})
            </p>
          </div>
        )}

        {/* Rest of shelf link */}
        <div className="flex gap-[4px] h-[18px] items-end w-full">
          <p className="font-['Tesco_Modern'] text-[14px] leading-[18px] text-[#00539f] text-nowrap">
            Rest of shelf
          </p>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="#00539f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Bottom container */}
      <div className="flex flex-col gap-[12px] pt-[12px] w-full">
        {/* Add to basket section */}
        <div className="flex gap-[12px] items-end w-full">
          {/* Price */}
          <div className="flex-1 flex flex-col items-start justify-center text-nowrap">
            <p className="font-['Tesco_Modern'] font-bold text-[14px] leading-[18px] text-[#333333]">
              £{price.toFixed(2)}
            </p>
            {showUnitPrice && (
              <p className="font-['Tesco_Modern'] text-[12px] leading-[16px] text-[#666666]">
                {unitPrice}/{unitOfMeasure}
              </p>
            )}
          </div>

          {/* Add button */}
          <div className="flex-1 flex flex-wrap gap-[12px] items-start">
            <button
              onClick={onAddToBasket}
              className="bg-[#00539f] rounded-[40px] px-[20px] py-[8px] flex items-center justify-center hover:bg-[#004080] transition-colors"
            >
              <p className="font-['Tesco_Modern'] font-bold text-[16px] leading-[20px] text-white text-nowrap">
                Add
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

