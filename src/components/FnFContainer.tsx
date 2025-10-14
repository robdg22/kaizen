import type { ProductItem } from '../lib/tesco'
import FnfLogo from '../../assets/icons/fnf.svg'

interface FnFContainerProps {
  products: ProductItem[]
  totalCount: number
  onSwitchToFnF: () => void
  onAddToWishlist: (product: ProductItem) => void
}

export default function FnFContainer({ products, totalCount, onSwitchToFnF, onAddToWishlist }: FnFContainerProps) {
  // Show up to 16 products
  const displayProducts = products.slice(0, 16)

  return (
    <div className="bg-white border-2 border-black flex flex-col gap-[8px] sm:gap-[12px] p-[8px] sm:p-[16px] col-span-4 my-[8px] sm:my-[16px]">
      {/* Header with F&F logo and count */}
      <div className="flex gap-[8px] sm:gap-[12px] items-center">
      <img src={FnfLogo} 
            alt="F&F" 
            height="24" 
            width="46" 
            className="sm:h-[30px] sm:w-[58px]"
            />
        <p className="font-['F&F_Sans'] font-bold text-[16px] sm:text-[20px] leading-[20px] sm:leading-[24px] text-black text-nowrap">
          {totalCount} results from F&F clothing
        </p>
      </div>

      {/* Product grid - Responsive: 2 cols mobile, 4 cols tablet, 8 cols desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-[4px] sm:gap-0 items-start">
        {displayProducts.map((product) => {
          const imageUrl = product.media?.defaultImage?.url || product.defaultImageUrl || product.images?.display?.default?.url || ''
          const price = product.price?.actual || product.price?.price || 0

          return (
            <button 
              key={product.id} 
              onClick={() => {
                window.location.href = `/product/${product.tpnc}`
              }}
              className="bg-white relative cursor-pointer hover:shadow-lg transition-all group"
            >
              {/* Product Image with 4:5 aspect ratio */}
              <div className="w-full aspect-[4/5] relative overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                {/* Wishlist button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddToWishlist(product)
                  }}
                  className="absolute top-[8px] right-[8px] z-[2] p-1 bg-white rounded-full hover:scale-110 active:scale-95 transition-transform"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
              </div>

              {/* Product details */}
              <div className="flex flex-col gap-1 p-[4px] sm:p-2 w-full text-left">
                <p className="font-['F&F_Sans'] text-[12px] sm:text-[14px] leading-[16px] sm:leading-[18px] text-black line-clamp-2">
                  {product.title}
                </p>
                <p className="font-['F&F_Sans'] font-bold text-[14px] sm:text-[16px] leading-[18px] sm:leading-[20px] text-black">
                  £{price.toFixed(2)}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Shop F&F button */}
      <button
        onClick={onSwitchToFnF}
        className="bg-black px-[8px] sm:px-[12px] py-[4px] sm:py-[6px] flex gap-[4px] items-center justify-center hover:bg-gray-800 transition-colors w-auto self-start"
      >
        <p className="font-['Tesco_Modern'] font-bold text-[14px] sm:text-[16px] leading-[18px] sm:leading-[20px] text-white text-nowrap">
          SHOP F&F CLOTHING
        </p>
      </button>
    </div>
  )
}

