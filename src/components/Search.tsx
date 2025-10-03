import { useMemo, useState, useEffect } from 'react'
import type { ProductItem } from '../lib/tesco'
import { TescoAPI } from '../lib/tesco'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// Rolling currency display for basket total (train timetable effect)
function RollingCurrency({ value }: { value: number }) {
  const formatted = value.toFixed(2)
  const chars = (`£${formatted}`).split('')

  return (
    <div className="flex items-center gap-0.5">
      {chars.map((ch, idx) => {
        const isDigit = /\d/.test(ch)
        if (!isDigit) {
          return (
            <span key={idx} className="h-[20px] leading-[20px]">
              {ch}
            </span>
          )
        }
        const d = Number(ch)
        return (
          <div key={idx} className="h-[20px] overflow-hidden">
            <div
              className="transition-transform duration-300 ease-out"
              style={{ transform: `translateY(-${d * 20}px)` }}
            >
              {[0,1,2,3,4,5,6,7,8,9].map(n => (
                <div key={n} className="h-[20px] leading-[20px]">{n}</div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Search() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<ProductItem[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [basketCount, setBasketCount] = useState(0)
  const [basketTotal, setBasketTotal] = useState(0)
  const [lastScrollY, setLastScrollY] = useState(0)
  
  // State for product modal
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Touch handling for swipe navigation
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  
  // Thumbnail view mode for clothing products
  type ViewMode = 'default' | 'image-only' | 'large'
  const [viewMode, setViewMode] = useState<ViewMode>('default')

  const canSearch = useMemo(() => query.trim().length > 1, [query])

  // Modal functions
  const openProductModal = (index: number) => {
    setSelectedProductIndex(index)
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden' // Prevent background scroll
  }

  const closeProductModal = () => {
    setIsModalOpen(false)
    setSelectedProductIndex(null)
    document.body.style.overflow = 'unset'
  }

  const navigateProduct = (direction: 'prev' | 'next') => {
    if (selectedProductIndex === null) return
    
    if (direction === 'prev' && selectedProductIndex > 0) {
      setSelectedProductIndex(selectedProductIndex - 1)
    } else if (direction === 'next' && selectedProductIndex < products.length - 1) {
      setSelectedProductIndex(selectedProductIndex + 1)
    }
  }

  // Touch event handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null) // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50 // Minimum distance for swipe
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      navigateProduct('next') // Swipe left to go to next product
    } else if (isRightSwipe) {
      navigateProduct('prev') // Swipe right to go to previous product
    }
  }

  // Handle scroll for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Only handle scroll when we have scrolled more than 10px to avoid jitter
      if (Math.abs(currentScrollY - lastScrollY) < 10) return
      
      // Show header when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsHeaderVisible(true)
      }
      // Hide header when scrolling down and past 100px
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return
      
      if (e.key === 'Escape') {
        closeProductModal()
      } else if (e.key === 'ArrowLeft') {
        navigateProduct('prev')
      } else if (e.key === 'ArrowRight') {
        navigateProduct('next')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, selectedProductIndex])

  async function performSearch() {
    if (!canSearch) return
    setIsLoading(true)
    setError(null)
    setHasSearched(true)
    setProducts([]) // Clear previous results to show skeleton immediately
    
    // Always load 40 products regardless of viewport
    const productCount = 40
    
    // Filter to clothing products only
    const result = await TescoAPI.searchProducts({ 
      query, 
      count: productCount, 
      page: 0, 
      filters: [{
        name: "superDepartment",
        values: ["Clothing & Accessories"]
      }]
    })
    if (result.errors) {
      setError(result.errors[0]?.message ?? 'Unknown error')
      setProducts([])
    } else if (result.data) {
      // API field names mapped by client types
      // The proxy returns keys as in the original schema: search.products
      // Types ensure access below is correct
      // @ts-expect-error narrow by known shape
      const items = result.data.search?.productItems || result.data.search?.products || []
      setProducts(items as ProductItem[])
    }
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
    performSearch()
    }
  }

  // Skeleton card component
  const SkeletonCard = () => (
    <div className="bg-white relative transition-all duration-500 ease-in-out">
      {/* Image skeleton - 4:5 aspect ratio for clothing */}
      <div className="w-full aspect-[4/5] relative overflow-hidden">
        <Skeleton height="100%" />
      </div>

      {/* Content - Hidden in image-only mode */}
      {viewMode !== 'image-only' && (
        <div className={`px-4 pb-4 pt-3 space-y-3 transition-all duration-500 ease-in-out ${
          viewMode === 'large' ? 'px-6 pb-6 pt-4 space-y-4' : ''
        }`}>
          {/* Title skeleton */}
          <div className="flex flex-col gap-1">
            <Skeleton width="80%" height={18} />
          </div>

          {/* Price and add button skeleton */}
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <Skeleton width={80} height={20} />
              <Skeleton width={60} height={16} />
            </div>
            <Skeleton height={40} />
          </div>
        </div>
      )}
    </div>
  )

  function toNumber(value: number | string | undefined): number | undefined {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed.includes(':')) {
        const [w, h] = trimmed.split(':')
        const wn = Number(w)
        const hn = Number(h)
        if (Number.isFinite(wn) && Number.isFinite(hn) && hn !== 0) {
          return wn / hn
        }
      }
      const n = Number(trimmed)
      return Number.isFinite(n) ? n : undefined
    }
    return undefined
  }

  function getImageUrl(p: ProductItem): { url: string | undefined; ratio: number | undefined } {
    const d = p.media?.defaultImage
    const dRatio = toNumber(d?.aspectRatio)
    const mediaList = p.media?.images ?? []

    const candidates = [d, ...mediaList].filter(Boolean) as Array<{ url?: string; aspectRatio?: number | string }>
    let best = undefined as { url?: string; aspectRatio?: number | string } | undefined
    let bestDist = Infinity
    for (const img of candidates) {
      if (!img?.url) continue
      const r = toNumber(img.aspectRatio)
      if (r == null) continue
      const dist = Math.abs(r - 0.8)
      if (dist < bestDist) {
        best = img
        bestDist = dist
      }
    }

    // Use closest-to-0.8 portrait if it's within tolerance
    if (best && best.url && bestDist <= 0.06) {
      return { url: best.url, ratio: 0.8 }
    }

    // Otherwise prefer defaultImage, then first available image
    if (d?.url) return { url: d.url, ratio: dRatio }
    const first = mediaList.find(img => img?.url)
    if (first?.url) return { url: first.url, ratio: toNumber(first.aspectRatio) }

    return { url: p.images?.display?.default?.url || p.defaultImageUrl, ratio: undefined }
  }

  // Product Modal Component
  const ProductModal = () => {
    if (!isModalOpen || selectedProductIndex === null) return null
    
    const currentProduct = products[selectedProductIndex]
    const prevProduct = selectedProductIndex > 0 ? products[selectedProductIndex - 1] : null
    const nextProduct = selectedProductIndex < products.length - 1 ? products[selectedProductIndex + 1] : null
    
    // Generate mock data for current product
    const productHash = currentProduct.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const rating = (3.0 + (productHash % 20) / 10).toFixed(1)
    const reviewCount = Math.max(1, (productHash % 50) + 5)
    const starCount = Math.floor(parseFloat(rating))
    
    const isFFProduct = currentProduct.brandName?.toLowerCase().includes('f&f') || 
                       currentProduct.brandName?.toLowerCase().includes('florence') ||
                       currentProduct.title?.toLowerCase().includes('f&f') ||
                       currentProduct.title?.toLowerCase().includes('florence')
    
    const { url: currentImageUrl } = getImageUrl(currentProduct)
    
    // Mock color variations
    const colors = ['Black', 'White', 'Navy', 'Grey']
    const sizes = isFFProduct ? ['XS', 'S', 'M', 'L', 'XL', 'XXL'] : ['Small', 'Medium', 'Large']
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={closeProductModal}
        />
        
        {/* Modal Content */}
        <div 
          className="relative w-full max-w-6xl mx-4 bg-white rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Previous Product Preview (Desktop Left) */}
          {prevProduct && (
            <div 
              className="hidden md:block w-20 flex-shrink-0 opacity-30 hover:opacity-50 transition-opacity cursor-pointer bg-gray-100 flex items-center justify-center"
              onClick={() => navigateProduct('prev')}
            >
              <img 
                src={getImageUrl(prevProduct).url}
                alt={prevProduct.title}
                className="w-full h-32 object-cover"
              />
            </div>
          )}
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col md:flex-row">
            {/* Large Image */}
            <div className="w-full md:w-1/2 p-4 md:p-6 bg-gray-50 flex items-center justify-center">
              <div className="relative w-full max-w-sm md:max-w-md aspect-square">
                <img 
                  src={currentImageUrl}
                  alt={currentProduct.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
            
            {/* Product Details */}
            <div className="w-full md:w-1/2 p-4 md:p-6 overflow-y-auto">
              {/* Close Button */}
              <button 
                onClick={closeProductModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              
              {/* Brand */}
              <p className="text-sm text-gray-600 mb-2">
                {currentProduct.brandName || 'Sponsored'}
              </p>
              
              {/* Title */}
              <h1 className={`text-2xl font-bold mb-4 ${isFFProduct ? 'text-black' : 'text-gray-900'}`}>
                {currentProduct.title}
              </h1>
              
              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  £{(currentProduct.price?.actual ?? currentProduct.price?.price ?? 0).toFixed(2)}
                </span>
                {currentProduct.price?.price && currentProduct.price?.price !== currentProduct.price?.actual && (
                  <span className="ml-3 text-lg text-gray-500 line-through">
                    £{currentProduct.price?.price.toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <svg key={star} className={`w-5 h-5 ${star <= starCount ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600">
                  {rating} ({reviewCount} reviews)
                </span>
              </div>
              
              {/* Color Variations */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Color</h3>
                <div className="flex gap-2">
                  {colors.map((color, index) => (
                    <button 
                      key={color}
                      className={`px-4 py-2 border rounded-md text-sm ${
                        index === 0 
                          ? `${isFFProduct ? 'border-black bg-black text-white' : 'border-blue-600 bg-blue-600 text-white'}` 
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((size, index) => (
                    <button 
                      key={size}
                      className={`py-2 border rounded-md text-sm ${
                        index === 2 
                          ? `${isFFProduct ? 'border-black bg-black text-white' : 'border-blue-600 bg-blue-600 text-white'}` 
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Size Guide Link */}
              <button className={`text-sm ${isFFProduct ? 'text-black' : 'text-blue-600'} hover:underline mb-6 flex items-center gap-1`}>
                Size guide
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {/* Add to Basket */}
              <button 
                onClick={() => {
                  const unit = (currentProduct.price?.actual ?? currentProduct.price?.price ?? 1.00)
                  setBasketCount(prev => prev + 1)
                  setBasketTotal(prev => Number((prev + unit).toFixed(2)))
                  setIsHeaderVisible(true)
                  closeProductModal()
                }}
                className={`w-full ${isFFProduct ? 'bg-black hover:bg-gray-800' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 px-6 rounded-md font-medium transition-colors`}
              >
                Add to basket
              </button>
            </div>
          </div>
          
          {/* Next Product Preview (Desktop Right) */}
          {nextProduct && (
            <div 
              className="hidden md:block w-20 flex-shrink-0 opacity-30 hover:opacity-50 transition-opacity cursor-pointer bg-gray-100 flex items-center justify-center"
              onClick={() => navigateProduct('next')}
            >
              <img 
                src={getImageUrl(nextProduct).url}
                alt={nextProduct.title}
                className="w-full h-32 object-cover"
              />
            </div>
          )}
          
          {/* Mobile Navigation - Bottom */}
          <div className="md:hidden flex flex-col items-center gap-2 p-4 bg-gray-50 border-t">
            {/* Swipe Indicator */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span>←</span>
              <span>Swipe to navigate</span>
              <span>→</span>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4">
              {prevProduct && (
                <button 
                  onClick={() => navigateProduct('prev')}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:bg-gray-50 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm">Previous</span>
                </button>
              )}
              
              {nextProduct && (
                <button 
                  onClick={() => navigateProduct('next')}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm">Next</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Desktop Navigation Arrows */}
          {prevProduct && (
            <button 
              onClick={() => navigateProduct('prev')}
              className="hidden md:flex absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          
          {nextProduct && (
            <button 
              onClick={() => navigateProduct('next')}
              className="hidden md:flex absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header - Responsive design */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-white transition-transform duration-300 ease-out ${
        isHeaderVisible ? 'transform translate-y-0' : 'transform -translate-y-full'
      }`}>
        {/* Mobile Header */}
        <div className="xs:hidden">
          {(() => {
            // Always use F&F theme for clothing-only branch
            const isFFTheme = true
            return (
          <div className={`bg-white border-t-4 ${isFFTheme ? 'border-black' : 'border-[#003adc]'}`}>
            {/* Logo & Basket Row */}
            <div className="flex items-center justify-between px-3 py-0 h-[60px]">
              <div className="flex items-center gap-2 h-[54px] pt-1">
                {/* Menu Button */}
                <button className="p-1.5 rounded-[18px] flex items-center justify-center relative focus:outline-none focus-visible:outline-none group hover:scale-105 active:scale-90 transition-transform duration-150 ease-out">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 4.25H2V2.75H18V4.25Z" fill={isFFTheme ? "#000000" : "#00539F"}/>
                    <path d="M18 10.75H2V9.25H18V10.75Z" fill={isFFTheme ? "#000000" : "#00539F"}/>
                    <path d="M18 17.25H2V15.75H18V17.25Z" fill={isFFTheme ? "#000000" : "#00539F"}/>
                  </svg>
                  {/* Focus ring - only visible for keyboard focus */}
                  <div className={`absolute inset-[-4px] rounded-[22px] border-[3px] ${isFFTheme ? 'border-black' : 'border-[#003adc]'} border-solid pointer-events-none opacity-0 group-focus-visible:opacity-100 transition-opacity`}></div>
                </button>
                {/* Logo - Conditional: F&F or Tesco */}
                <div className="h-[19px] flex items-center">
                  {isFFTheme ? (
                    // F&F Logo
                    <div className="w-[37px]">
                      <svg width="37" height="19" viewBox="0 0 142 73" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="141.599" height="73" fill="black"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M130.649 10.95H92.0897V61.3822H97.4171V37.6384H129.009V32.8598H97.4171V15.7487H130.649V10.95ZM89.4875 55.2181L81.0843 47.5035C83.2207 44.4508 84.2236 40.686 84.2236 38.6599H80.4852C80.309 40.257 79.6055 43.5275 78.3965 45.0806L66.3686 34.0013C70.4309 32.3295 74.5459 29.6344 74.5459 24.7104C74.5459 21.1722 72.1394 16.9374 64.9837 16.9374C59.2224 16.9374 55.4427 20.1606 55.4427 24.8724C55.4427 28.4601 57.525 30.6753 60.3767 33.2867C52.741 36.3456 49.5091 39.3452 49.5091 44.6562C49.5091 51.2053 54.3921 56.0857 64.3413 56.0857C70.6068 56.0857 76.0292 53.8832 78.8436 50.4578L83.9457 55.2181H89.4875ZM49.5091 10.95H10.95V61.3822H16.2623V37.6384H47.8605V32.8598H32.0614H16.2623V15.7487H32.8857H49.5091V10.95ZM70.7994 24.8727C70.7994 22.3947 69.0671 20.1614 64.6808 20.1614C61.892 20.1614 59.208 21.8958 59.208 24.6591C59.208 26.2362 59.5931 27.6366 63.9626 31.9058C68.665 29.9107 70.7994 27.6366 70.7994 24.8727ZM62.6499 35.5904L76.2403 48.2045C72.6707 51.8407 69.1421 52.8617 64.5299 52.8617C56.8774 52.8617 53.5306 48.969 53.5306 44.9086C53.5306 40.6642 56.4516 37.8611 62.6499 35.5904Z" fill="white"/>
                      </svg>
                    </div>
                  ) : (
                    // Tesco Logo
                    <div className="w-[68px]">
                      <svg width="68" height="21" viewBox="0 0 68 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M47.8529 0.5C49.2877 0.5 50.5301 0.678955 51.5275 0.947143V4.05827C50.5476 3.0392 49.3928 2.39545 47.8704 2.39545C45.0882 2.39545 43.2336 4.38014 43.2336 7.02672C43.2336 9.67305 45.0882 11.6577 47.8704 11.6577C49.3928 11.6577 50.5476 11.0142 51.5275 9.99492V13.1063C50.5301 13.3745 49.2877 13.5711 47.8529 13.5711C43.0412 13.5711 39.559 11.1214 39.559 7.02672C39.559 2.93183 43.0412 0.5 47.8529 0.5V0.5ZM34.1872 5.5784C36.5844 5.91793 38.5791 6.77642 38.5791 9.44065C38.5791 12.5699 35.6745 13.5711 32.5423 13.5534C30.3552 13.5353 28.5004 13.3208 27.1355 12.7665V9.95913C29.0778 11.2466 31.0725 11.6577 32.5423 11.6577C34.0646 11.6577 35.4646 11.2824 35.4646 10.1023C35.4646 8.92217 34.1697 8.63584 31.5101 8.22473C29.2177 7.86707 27.1355 6.86566 27.1179 4.5591C27.1004 1.44773 29.9877 0.5 32.7522 0.5C34.5372 0.5 36.2695 0.714501 37.8616 1.25112V4.27301C36.5319 3.07499 34.5547 2.39545 32.6124 2.39545C31.2999 2.39545 30.0575 2.8247 30.0575 3.82587C30.0575 5.07758 31.8948 5.25653 34.1872 5.5784V5.5784ZM20.994 11.3902C22.4112 11.3902 24.7734 11.0504 25.7008 10.2098V13.2854H15.6396C16.1295 12.6953 16.2171 12.3018 16.2171 11.1038V2.95009C16.2171 1.75207 16.1295 1.35862 15.6396 0.768555H25.1759V3.84413C24.2485 3.00378 21.8863 2.66401 20.4691 2.66401H19.349V5.98988H20.1716C20.9765 5.98988 22.2188 5.95409 23.0412 5.65011V8.11773C22.2188 7.81375 20.9765 7.77796 20.1716 7.77796H19.349V11.3902H20.994ZM0.556152 0.768555H14.362V3.84413C13.382 3.00378 11.2998 2.66401 9.07772 2.66401V11.0504C9.07772 12.3018 9.18255 12.6416 9.65513 13.2854H5.26301C5.73559 12.6416 5.84042 12.3018 5.84042 11.0504V2.66401C3.61833 2.66401 1.5361 3.00378 0.556152 3.84413V0.768555Z" fill="#E81C2D"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M60.1956 11.6582C57.6933 11.6582 56.0662 9.54826 56.0662 7.02695C56.0662 4.488 57.6933 2.39569 60.1956 2.39569C62.6976 2.39569 64.325 4.488 64.325 7.02695C64.325 9.54826 62.6976 11.6582 60.1956 11.6582M60.1959 0.500183C55.2264 0.500183 52.3918 3.45049 52.3918 7.02665C52.3918 10.5852 55.2264 13.5534 60.1959 13.5534C65.1652 13.5534 68 10.5852 68 7.02665C68 3.45049 65.1652 0.500183 60.1959 0.500183" fill="#E81C2D"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M59.5118 16.6854H67.8487C67.858 16.6854 67.8657 16.6874 67.8715 16.6908L67.8734 16.6918C67.8753 16.693 67.8772 16.6945 67.8789 16.6962C67.8952 16.7124 67.8966 16.7452 67.8717 16.769C67.8647 16.7754 67.8585 16.7793 67.8513 16.783L67.8364 16.7901C66.8678 17.2412 65.5707 18.6167 65.5707 18.6167C64.6008 19.5583 63.8737 20.152 62.3231 20.152H54.3744C54.3513 20.152 54.3393 20.1297 54.3381 20.1064C54.3381 20.1059 54.3381 20.1071 54.3381 20.1064C54.3381 20.0919 54.3446 20.0763 54.3549 20.0677C54.3614 20.062 54.371 20.0554 54.3801 20.0495C55.2524 19.5516 56.5552 18.1712 56.5552 18.1712C57.0887 17.5272 58.1545 16.6854 59.5118 16.6854" fill="#00539F"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M45.9275 16.6854H54.2643C54.2737 16.6854 54.2813 16.6874 54.2871 16.6908L54.289 16.6918C54.2909 16.693 54.2929 16.6945 54.2945 16.6962C54.3109 16.7124 54.3123 16.7452 54.2873 16.769C54.2804 16.7754 54.2741 16.7793 54.267 16.783L54.2521 16.7901C53.2834 17.2412 51.9863 18.6167 51.9863 18.6167C51.0165 19.5583 50.2896 20.152 48.7387 20.152H40.79C40.767 20.152 40.755 20.1297 40.7538 20.1064C40.7538 20.1059 40.7538 20.1071 40.7538 20.1064C40.7538 20.0919 40.7603 20.0763 40.7706 20.0677C40.7771 20.062 40.7866 20.0554 40.7958 20.0495C41.668 19.5516 42.9708 18.1712 42.9708 18.1712C43.5043 17.5272 44.5702 16.6854 45.9275 16.6854" fill="#00539F"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M32.3427 16.6854H40.6796C40.689 16.6854 40.6966 16.6874 40.7024 16.6908L40.7043 16.6918C40.7062 16.693 40.7081 16.6945 40.7098 16.6962C40.7261 16.7124 40.7276 16.7452 40.7026 16.769C40.6957 16.7754 40.6894 16.7793 40.6822 16.783L40.6674 16.7901C39.6987 17.2412 38.4016 18.6167 38.4016 18.6167C37.4317 19.5583 36.7049 20.152 35.154 20.152H27.2053C27.1823 20.152 27.1703 20.1297 27.1691 20.1064C27.1691 20.1059 27.1691 20.1071 27.1691 20.1064C27.1691 20.0919 27.1755 20.0763 27.1859 20.0677C27.1923 20.062 27.2022 20.0554 27.211 20.0495C28.0833 19.5516 29.3864 18.1712 29.3864 18.1712C29.9196 17.5272 30.9855 16.6854 32.3427 16.6854" fill="#00539F"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M18.7584 16.6854H27.0952C27.1046 16.6854 27.1123 16.6874 27.118 16.6908L27.12 16.6918C27.1219 16.693 27.1238 16.6945 27.1255 16.6962C27.1418 16.7124 27.1432 16.7452 27.1183 16.769C27.1113 16.7754 27.1051 16.7793 27.0979 16.783L27.083 16.7901C26.1143 17.2412 24.8173 18.6167 24.8173 18.6167C23.8474 19.5583 23.1203 20.152 21.5697 20.152H13.6209C13.5979 20.152 13.5859 20.1297 13.5847 20.1064C13.5847 20.1059 13.5847 20.1071 13.5847 20.1064C13.5847 20.0919 13.5912 20.0763 13.6015 20.0677C13.608 20.062 13.6176 20.0554 13.6267 20.0495C14.4989 19.5516 15.8018 18.1712 15.8018 18.1712C16.3353 17.5272 17.4011 16.6854 18.7584 16.6854" fill="#00539F"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.17368 16.6854H13.5105C13.5199 16.6854 13.5276 16.6874 13.5333 16.6908L13.5352 16.6918C13.5372 16.693 13.5391 16.6945 13.5408 16.6962C13.5571 16.7124 13.5585 16.7452 13.5336 16.769C13.5266 16.7754 13.5204 16.7793 13.5132 16.783L13.4983 16.7901C12.5296 17.2412 11.2325 18.6167 11.2325 18.6167C10.2627 19.5583 9.53557 20.152 7.98493 20.152H0.0362232C0.0131939 20.152 0.00119944 20.1297 0 20.1064C0 20.1059 0 20.1071 0 20.1064C0 20.0919 0.00647699 20.0763 0.0167922 20.0677C0.0232692 20.062 0.0328647 20.0554 0.0419805 20.0495C0.914216 19.5516 2.21705 18.1712 2.21705 18.1712C2.75056 17.5272 3.81639 16.6854 5.17368 16.6854" fill="#00539F"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Basket */}
              <div className="flex items-center gap-2 pb-2 pt-3">
                <div className={`relative ${isFFTheme ? 'bg-black' : 'bg-[#003adc]'} p-2 rounded-[20px] flex items-center justify-center`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.25001 18.9999V12.9999H8.75001V18.9999H7.25001Z" fill="white"/>
                    <path d="M11.25 18.9999V12.9999H12.75V18.9999H11.25Z" fill="white"/>
                    <path d="M15.25 12.9999V18.9999H16.75V12.9999H15.25Z" fill="white"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.6127 2.43241L13.4474 9.7499H23.4396L20.5987 22.2499H3.40133L0.560425 9.7499H11.6114L17.3873 1.56738L18.6127 2.43241ZM4.59868 20.7499L2.43959 11.2499H21.5604L19.4013 20.7499H4.59868Z" fill="white"/>
                  </svg>
                  {basketCount > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E81C2D] flex items-center justify-center">
                      <span className="text-white text-[11px] leading-[11px] font-bold">{basketCount}</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className={`${isFFTheme ? 'text-black' : 'text-[#003adc]'} font-bold text-[16px] leading-[20px] flex items-center`} aria-live="polite" aria-atomic="true">
                    <RollingCurrency value={basketTotal} />
                  </div>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className="px-3 pb-3 pt-1 border-b border-[#cccccc]">
              <div className="flex gap-3 items-center">
                <div className="flex-1 relative">
                  <div className="relative">
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Search"
                      className="w-full h-[40px] px-3 py-2 border border-[#666666] bg-white text-[16px] leading-[20px] font-normal placeholder-[#666666] focus:outline-none focus:border-[#007eb3] peer"
                    />
                    {/* Focus ring overlay - matches Figma design */}
                    <div className="absolute inset-[-4px] border-[3px] border-[#007eb3] border-solid pointer-events-none opacity-0 peer-focus:opacity-100 transition-opacity"></div>
                  </div>
                </div>
                <button 
                  onClick={performSearch} 
                  disabled={!canSearch || isLoading}
                  className={`${isFFTheme ? 'bg-black' : 'bg-[#003adc]'} p-2 rounded-[20px] flex items-center justify-center disabled:opacity-50 relative focus:outline-none focus-visible:outline-none group hover:scale-105 active:scale-90 transition-transform duration-150 ease-out disabled:hover:scale-100 disabled:active:scale-100`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M1.75 9.00003C1.75 4.99582 4.99579 1.75003 9 1.75003C13.0042 1.75003 16.25 4.99582 16.25 9.00003C16.25 10.732 15.6428 12.322 14.6296 13.5689L22.0301 20.9694L20.9694 22.0301L13.5689 14.6296C12.322 15.6428 10.732 16.25 9 16.25C4.99579 16.25 1.75 13.0042 1.75 9.00003ZM9 3.25003C5.82421 3.25003 3.25 5.82424 3.25 9.00003C3.25 12.1758 5.82421 14.75 9 14.75C12.1758 14.75 14.75 12.1758 14.75 9.00003C14.75 5.82424 12.1758 3.25003 9 3.25003Z" fill="white"/>
                  </svg>
                  {/* Focus ring - only visible for keyboard focus */}
                  <div className={`absolute inset-[-4px] rounded-[24px] border-[3px] ${isFFTheme ? 'border-black' : 'border-[#003adc]'} border-solid pointer-events-none opacity-0 group-focus-visible:opacity-100 transition-opacity`}></div>
                </button>
              </div>
            </div>
          </div>
            )
          })()}
        </div>

        {/* Wide Header (450px+) */}
        <div className="hidden xs:block">
          {(() => {
            // Always use F&F theme for clothing-only branch
            const isFFTheme = true
            return (
          <div className="bg-white">
            {/* Blue utility bar */}
            <div className={`${isFFTheme ? 'bg-black' : 'bg-[#00539f]'} h-8 w-full`}></div>
            
            {/* Main header content - responsive container with extra padding for xl breakpoints */}
            <div className="w-full">
              <div className="mx-auto px-3 xl:px-[256px] max-w-screen-2xl">
                <div className="flex items-center gap-6 py-4">
                  {/* Logo - Conditional: F&F or Tesco */}
                  <div className="flex items-center justify-center h-12 flex-shrink-0">
                    {isFFTheme ? (
                      // F&F Logo
                      <div className="w-[70px]">
                        <svg width="70" height="36" viewBox="0 0 142 73" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="141.599" height="73" fill="black"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M130.649 10.95H92.0897V61.3822H97.4171V37.6384H129.009V32.8598H97.4171V15.7487H130.649V10.95ZM89.4875 55.2181L81.0843 47.5035C83.2207 44.4508 84.2236 40.686 84.2236 38.6599H80.4852C80.309 40.257 79.6055 43.5275 78.3965 45.0806L66.3686 34.0013C70.4309 32.3295 74.5459 29.6344 74.5459 24.7104C74.5459 21.1722 72.1394 16.9374 64.9837 16.9374C59.2224 16.9374 55.4427 20.1606 55.4427 24.8724C55.4427 28.4601 57.525 30.6753 60.3767 33.2867C52.741 36.3456 49.5091 39.3452 49.5091 44.6562C49.5091 51.2053 54.3921 56.0857 64.3413 56.0857C70.6068 56.0857 76.0292 53.8832 78.8436 50.4578L83.9457 55.2181H89.4875ZM49.5091 10.95H10.95V61.3822H16.2623V37.6384H47.8605V32.8598H32.0614H16.2623V15.7487H32.8857H49.5091V10.95ZM70.7994 24.8727C70.7994 22.3947 69.0671 20.1614 64.6808 20.1614C61.892 20.1614 59.208 21.8958 59.208 24.6591C59.208 26.2362 59.5931 27.6366 63.9626 31.9058C68.665 29.9107 70.7994 27.6366 70.7994 24.8727ZM62.6499 35.5904L76.2403 48.2045C72.6707 51.8407 69.1421 52.8617 64.5299 52.8617C56.8774 52.8617 53.5306 48.969 53.5306 44.9086C53.5306 40.6642 56.4516 37.8611 62.6499 35.5904Z" fill="white"/>
                        </svg>
                      </div>
                    ) : (
                      // Tesco Logo
                      <div className="w-[121px]">
                        <svg width="120" height="36" viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M84.5012 0.857149C87.3874 0.857149 89.6712 1.15724 91.2483 1.62771V6.95554C89.6881 5.495 87.6745 4.53635 84.5297 4.53635C79.8668 4.53635 76.6373 7.53167 76.6373 12.0457C76.6373 16.5598 79.8668 19.5549 84.5297 19.5549C87.6745 19.5549 89.6881 18.5964 91.2483 17.1359V22.4637C89.6712 22.9342 87.3874 23.2857 84.5012 23.2857C76.2728 23.2857 70.0439 19.1365 70.0439 12.0457C70.0439 4.95493 76.2728 0.857149 84.5012 0.857149V0.857149ZM60.5321 9.55548C64.8345 10.075 68.3407 11.6101 68.3407 16.1757C68.3407 21.5549 63.7521 23.2857 57.6404 23.2343C54.2886 23.1829 51.1428 22.8314 48.8761 21.7686V17.0256C51.5054 19.2166 54.9944 19.9743 57.6404 19.9743C60.4924 19.9743 62.8104 19.3394 62.8104 17.3178C62.8104 15.2962 60.5492 14.7915 56.1639 14.1223C52.7607 13.5662 48.8761 11.7668 48.8419 8.21262C48.8078 3.19031 53.1102 0.857149 58.1161 0.857149C61.1515 0.857149 64.1016 1.22435 67.0174 2.14157V7.32654C64.8516 5.27786 61.2454 4.26926 57.7049 4.26926C55.5734 4.26926 53.5428 4.95493 53.5428 6.5414C53.5428 8.69578 56.6544 9.01722 60.5321 9.55548V9.55548ZM37.2429 19.5549C39.6294 19.5549 43.8689 18.975 45.2129 17.5316V22.7166H27.7399C28.5315 21.6537 28.6857 20.9423 28.6857 19.0258V5.05291C28.6857 3.00423 28.5315 2.29286 27.7399 1.23003H44.6477V6.41501C43.3036 5.04936 39.9007 4.45878 37.4799 4.45878H34.2333V10.2437H35.6287C36.9728 10.2437 39.3765 10.1837 40.8405 9.67118V13.9317C39.3765 13.4192 36.9728 13.3592 35.6287 13.3592H34.2333V19.5549H37.2429ZM0.986177 1.23003H25.4646V6.41501C23.7191 5.04936 20.0273 4.45878 16.1325 4.45878V18.975C16.1325 20.9423 16.3039 21.6023 17.1125 22.7166H9.33393C10.1426 21.6023 10.314 20.9423 10.314 18.975V4.45878C6.41914 4.45878 2.71436 5.04936 0.986177 6.41501V1.23003Z" fill="#E81C2D"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M106.746 19.9746C102.1 19.9746 99.3362 16.3975 99.3362 12.045C99.3362 7.6926 102.1 4.12972 106.746 4.12972C111.393 4.12972 114.158 7.6926 114.158 12.045C114.158 16.3975 111.393 19.9746 106.746 19.9746M106.749 0.857422C97.9304 0.857422 92.7421 5.91548 92.7421 12.0448C92.7421 18.1456 97.9304 23.2 106.749 23.2C115.568 23.2 120.757 18.1456 120.757 12.0448C120.757 5.91548 115.568 0.857422 106.749 0.857422" fill="#E81C2D"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M105.542 28.6058H120.246C120.263 28.6058 120.277 28.6091 120.287 28.6148L120.291 28.6173C120.295 28.6198 120.299 28.6232 120.302 28.6266C120.332 28.6555 120.335 28.7133 120.294 28.7548C120.282 28.7677 120.271 28.7742 120.258 28.7806L120.233 28.7936C118.787 29.5549 116.719 31.6055 116.719 31.6055C115.335 33.636 114.204 34.5714 111.77 34.5714H96.4447C96.404 34.5714 96.3831 34.5368 96.3809 34.4978C96.3809 34.4956 96.3809 34.4978 96.3809 34.4978C96.3809 34.4697 96.3918 34.4395 96.4082 34.4222C96.4201 34.4092 96.4363 34.3939 96.4525 34.3807C97.9477 33.4561 100.019 31.4034 100.019 31.4034C100.833 30.2368 102.578 28.6058 105.542 28.6058" fill="#00539F"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M81.4631 28.6058H96.1673C96.1844 28.6058 96.1993 28.6091 96.2098 28.6148L96.2141 28.6173C96.2184 28.6198 96.2227 28.6232 96.2262 28.6266C96.2565 28.6555 96.2591 28.7133 96.2184 28.7548C96.2067 28.7677 96.1949 28.7742 96.1823 28.7806L96.1567 28.7936C94.7118 29.5549 92.6438 31.6055 92.6438 31.6055C91.2588 33.636 90.1276 34.5714 87.6938 34.5714H72.3686C72.3279 34.5714 72.307 34.5368 72.3049 34.4978C72.3049 34.4956 72.3049 34.4978 72.3049 34.4978C72.3049 34.4697 72.3157 34.4395 72.3322 34.4222C72.3441 34.4092 72.3602 34.3939 72.3765 34.3807C73.8716 33.4561 75.9428 31.4034 75.9428 31.4034C76.757 30.2368 78.502 28.6058 81.4631 28.6058" fill="#00539F"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M57.3838 28.6058H72.088C72.1051 28.6058 72.12 28.6091 72.1305 28.6148L72.1348 28.6173C72.1391 28.6198 72.1434 28.6232 72.1469 28.6266C72.1772 28.6555 72.1798 28.7133 72.1391 28.7548C72.1274 28.7677 72.1156 28.7742 72.103 28.7806L72.0775 28.7936C70.6326 29.5549 68.5645 31.6055 68.5645 31.6055C67.1796 33.636 66.0483 34.5714 63.6146 34.5714H48.2893C48.2486 34.5714 48.2277 34.5368 48.2256 34.4978C48.2256 34.4956 48.2256 34.4978 48.2256 34.4978C48.2256 34.4697 48.2364 34.4395 48.2529 34.4222C48.2648 34.4092 48.281 34.3939 48.2972 34.3807C49.7924 33.4561 51.8635 31.4034 51.8635 31.4034C52.6777 30.2368 54.4227 28.6058 57.3838 28.6058" fill="#00539F"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M33.3048 28.6058H48.009C48.0261 28.6058 48.041 28.6091 48.0515 28.6148L48.0558 28.6173C48.0601 28.6198 48.0644 28.6232 48.0679 28.6266C48.0982 28.6555 48.1008 28.7133 48.0601 28.7548C48.0484 28.7677 48.0366 28.7742 48.024 28.7806L47.9985 28.7936C46.5536 29.5549 44.4855 31.6055 44.4855 31.6055C43.1006 33.636 41.9693 34.5714 39.5356 34.5714H24.2103C24.1696 34.5714 24.1487 34.5368 24.1466 34.4978C24.1466 24.4956 24.1466 24.4978 24.1466 24.4978C24.1466 24.4697 24.1574 24.4395 24.1739 24.4222C24.1858 24.4092 24.202 24.3939 24.2182 24.3807C25.7134 23.4561 27.7845 21.4034 27.7845 21.4034C28.5987 20.2368 30.3437 18.6058 33.3048 18.6058" fill="#00539F"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M9.17316 28.6058H23.8773C23.8944 28.6058 23.9093 28.6091 23.9198 28.6148L23.9241 28.6173C23.9284 28.6198 23.9327 28.6232 23.9362 28.6266C23.9665 28.6555 23.9691 28.7133 23.9284 28.7548C23.9167 28.7677 23.9049 28.7742 23.8923 28.7806L23.8668 28.7936C22.4219 29.5549 20.3538 31.6055 20.3538 31.6055C18.9689 33.636 17.8376 34.5714 15.4039 34.5714H0.0786295C0.0379276 34.5714 0.0170088 34.5368 0.0148755 34.4978C0.0148755 34.4956 0.0148755 34.4978 0.0148755 34.4978C0.0148755 34.4697 0.0257277 34.4395 0.0422298 34.4222C0.0541152 34.4092 0.0703006 34.3939 0.0864527 34.3807C1.58168 33.4561 3.65281 31.4034 3.65281 31.4034C4.46698 30.2368 6.21199 28.6058 9.17316 28.6058" fill="#00539F"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Search container - takes up remaining space, on same line as logo */}
                  <div className="flex-1 max-w-[749px]">
                    <div className="flex gap-3 items-center">
                      <div className="flex-1 relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Search"
                          className="w-full h-[40px] px-3 py-2 border border-[#666666] bg-white text-[16px] leading-[20px] font-normal placeholder-[#666666] focus:outline-none focus:border-[#007eb3] peer"
                        />
                        <div className="absolute inset-[-4px] border-[3px] border-[#007eb3] border-solid pointer-events-none opacity-0 peer-focus:opacity-100 transition-opacity"></div>
                      </div>
                      <button 
                        onClick={performSearch} 
                        disabled={!canSearch || isLoading}
                        className={`${isFFTheme ? 'bg-black' : 'bg-[#00539f]'} p-2 rounded-[20px] flex items-center justify-center disabled:opacity-50 relative focus:outline-none focus-visible:outline-none group hover:scale-105 active:scale-90 transition-transform duration-150 ease-out disabled:hover:scale-100 disabled:active:scale-100`}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M1.75 9.00003C1.75 4.99582 4.99579 1.75003 9 1.75003C13.0042 1.75003 16.25 4.99582 16.25 9.00003C16.25 10.732 15.6428 12.322 14.6296 13.5689L22.0301 20.9694L20.9694 22.0301L13.5689 14.6296C12.322 15.6428 10.732 16.25 9 16.25C4.99579 16.25 1.75 13.0042 1.75 9.00003ZM9 3.25003C5.82421 3.25003 3.25 5.82424 3.25 9.00003C3.25 12.1758 5.82421 14.75 9 14.75C12.1758 14.75 14.75 12.1758 14.75 9.00003C14.75 5.82424 12.1758 3.25003 9 3.25003Z" fill="white"/>
                        </svg>
                        <div className={`absolute inset-[-4px] rounded-[24px] border-[3px] ${isFFTheme ? 'border-black' : 'border-[#00539f]'} border-solid pointer-events-none opacity-0 group-focus-visible:opacity-100 transition-opacity`}></div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Basket */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={`relative ${isFFTheme ? 'bg-black' : 'bg-[#00539f]'} p-2 rounded-[20px] flex items-center justify-center`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.25001 18.9999V12.9999H8.75001V18.9999H7.25001Z" fill="white"/>
                        <path d="M11.25 18.9999V12.9999H12.75V18.9999H11.25Z" fill="white"/>
                        <path d="M15.25 12.9999V18.9999H16.75V12.9999H15.25Z" fill="white"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M18.6127 2.43241L13.4474 9.7499H23.4396L20.5987 22.2499H3.40133L0.560425 9.7499H11.6114L17.3873 1.56738L18.6127 2.43241ZM4.59868 20.7499L2.43959 11.2499H21.5604L19.4013 20.7499H4.59868Z" fill="white"/>
                      </svg>
                      {basketCount > 0 && (
                        <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E81C2D] flex items-center justify-center">
                          <span className="text-white text-[11px] leading-[11px] font-bold">{basketCount}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className={`${isFFTheme ? 'text-black' : 'text-[#00539f]'} font-bold text-[16px] leading-[20px] flex items-center`} aria-live="polite" aria-atomic="true">
                        <RollingCurrency value={basketTotal} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom divider */}
            <div className="bg-[#cccccc] h-px w-full"></div>
          </div>
            )
          })()}
        </div>
      </div>

      {/* Content Container with padding for fixed header */}
      <div className="pt-[124px]">
        {/* Results Section - Only show after search */}
        {hasSearched && (() => {
          
          return (
            <div>
      {error && (
                <p className="text-red-600 mb-4">{error}</p>
              )}

              {isLoading && (
                <div className={`flex flex-wrap px-2 transition-all duration-500 ease-in-out ${
                  viewMode === 'large' ? 'gap-6' : 'gap-2'
                }`}>
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className={`transition-all duration-500 ease-in-out ${
                      viewMode === 'large' 
                        ? 'w-[calc(50%-12px)] sm:w-[376px] max-w-[376px]' 
                        : viewMode === 'image-only'
                        ? 'w-[calc(33.333%-5.33px)] sm:w-[125px] max-w-[125px]'
                        : 'w-[calc(50%-4px)] sm:w-[188px] max-w-[188px]'
                    }`}>
                      <SkeletonCard />
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && products.length === 0 && query.trim() && (
                <p className="text-gray-600 text-center py-8">No products found for "{query}"</p>
              )}

              {!isLoading && products.length > 0 && (
              <>
                {/* View Mode Toggle for Clothing Products */}
                {(() => {
                  // Always show toggle for clothing-only branch
                  return (
                    <div className="mb-6 px-2">
                      <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border w-fit">
                        <button
                          onClick={() => setViewMode('default')}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                            viewMode === 'default' 
                              ? 'bg-black text-white shadow-sm' 
                              : 'text-gray-600 hover:text-black hover:bg-gray-100'
                          }`}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline mr-1">
                            <rect x="2" y="2" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                            <rect x="2" y="11" width="12" height="1" rx="0.5" fill="currentColor"/>
                            <rect x="2" y="13" width="8" height="1" rx="0.5" fill="currentColor"/>
                          </svg>
                          Default
                        </button>
                        <button
                          onClick={() => setViewMode('image-only')}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                            viewMode === 'image-only' 
                              ? 'bg-black text-white shadow-sm' 
                              : 'text-gray-600 hover:text-black hover:bg-gray-100'
                          }`}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline mr-1">
                            <rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                            <circle cx="6" cy="6" r="1.5" fill="currentColor"/>
                            <path d="M14 10l-3-3-2 2-3-3-4 4v3h12v-3z" fill="currentColor"/>
                          </svg>
                          Image
                        </button>
                        <button
                          onClick={() => setViewMode('large')}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                            viewMode === 'large' 
                              ? 'bg-black text-white shadow-sm' 
                              : 'text-gray-600 hover:text-black hover:bg-gray-100'
                          }`}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline mr-1">
                            <rect x="1" y="1" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                            <rect x="1" y="12" width="14" height="1" rx="0.5" fill="currentColor"/>
                            <rect x="1" y="14" width="10" height="1" rx="0.5" fill="currentColor"/>
                          </svg>
                          Large
                        </button>
                      </div>
                    </div>
                  )
                })()}
                
                <div className={`flex flex-wrap px-2 transition-all duration-500 ease-in-out ${
                  viewMode === 'large' ? 'gap-6' : 'gap-2'
                }`}>
                {products.map((p, index) => {
                  // Generate realistic rating data based on product ID
                  const productHash = p.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
                  const rating = (3.0 + (productHash % 20) / 10).toFixed(1) // 3.0 - 5.0
                  const reviewCount = Math.max(1, (productHash % 50) + 5) // 5-55 reviews
                  const starCount = Math.floor(parseFloat(rating))
                  
                  // Detect F&F (Florence & Fred) products for black theme
                  const isFFProduct = p.brandName?.toLowerCase().includes('f&f') || 
                                    p.brandName?.toLowerCase().includes('florence') ||
                                    p.title?.toLowerCase().includes('f&f') ||
                                    p.title?.toLowerCase().includes('florence')
                  
                  return (
                    <div 
                      key={p.id} 
                      className={`bg-white relative cursor-pointer hover:shadow-lg transition-all duration-500 ease-in-out ${
                        viewMode === 'large' 
                          ? 'w-[calc(50%-12px)] sm:w-[376px] max-w-[376px]' 
                          : viewMode === 'image-only'
                          ? 'w-[calc(33.333%-5.33px)] sm:w-[125px] max-w-[125px]'
                          : 'w-[calc(50%-4px)] sm:w-[188px] max-w-[188px]'
                      }`}
                      onClick={() => openProductModal(index)}
                    >
                      {isFFProduct ? (
                        // F&F (Clothing) Card Design
                        <>
                          {/* Image Container - 4:5 aspect ratio */}
                          <div className={`w-full aspect-[4/5] relative overflow-hidden group transition-all duration-500 ease-in-out ${
                            viewMode === 'large' ? 'aspect-[4/5]' : 'aspect-[4/5]'
                          }`}>
                            {(() => {
                              const { url } = getImageUrl(p)
                              return (
                                <img
                                  src={url}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-110"
                                  alt={p.title}
                                />
                              )
                            })()}
                          </div>

                          {/* Content - Hidden in image-only mode */}
                          {viewMode !== 'image-only' && (
                            <div className={`px-4 pb-4 pt-3 space-y-3 transition-all duration-500 ease-in-out ${
                              viewMode === 'large' ? 'px-6 pb-6 pt-4 space-y-4' : ''
                            }`}>
                            {/* Title */}
                            <h3 className="text-sm font-bold text-black leading-[18px] w-full">
                              {p.title}
                            </h3>

                            {/* Price and Add to Basket */}
                            <div className="space-y-3">
                              <div className="flex items-baseline gap-2">
                                <span className="text-base font-bold text-black leading-5">
                                  £{(p.price?.actual ?? p.price?.price ?? 0).toFixed(2)}
                                </span>
                                {p.price?.price && p.price?.price !== p.price?.actual && (
                                  <span className="text-sm text-gray-500 line-through">
                                    £{p.price?.price.toFixed(2)}
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation() // Prevent modal from opening
                                  const unit = (p.price?.actual ?? p.price?.price ?? 1.00)
                                  setBasketCount(prev => prev + 1)
                                  setBasketTotal(prev => Number((prev + unit).toFixed(2)))
                                  setIsHeaderVisible(true)
                                }}
                                className="bg-black px-5 py-2 rounded-full w-full h-10 flex items-center justify-center relative focus:outline-none focus-visible:outline-none group hover:scale-105 active:scale-90 transition-transform duration-150 ease-out"
                              >
                                <span className="text-base font-bold text-white leading-5">Add</span>
                                {/* Focus ring - only visible for keyboard focus */}
                                <div className="absolute inset-[-4px] rounded-full border-[3px] border-black border-solid pointer-events-none opacity-0 group-focus-visible:opacity-100 transition-opacity"></div>
                              </button>
                            </div>
                            </div>
                          )}
                        </>
                      ) : (
                        // Regular Product Card Design
                        <>
                          {/* Wishlist Button - positioned in top-right corner */}
                          <div className="absolute top-3 right-3 z-10">
                          </div>
                          
                          <div className="pt-4 px-4 pb-12">
                            {/* Top Container */}
                            <div className="flex flex-col gap-3 mb-3">
                              {/* Tags - Only show if promotions exist */}
                              {p.promotions && p.promotions.length > 0 && (
                                <div className="flex gap-1 items-start">
                                  <div className="bg-[#003adc] px-2 py-1 rounded-sm inline-flex items-center justify-center">
                                    <span className="text-white text-xs font-bold leading-none">
                                      {p.promotions[0].promotionType === 'NEW' ? 'New' : 'Offer'}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Image Container */}
                              <div className="flex items-center justify-center w-full group">
            {(() => {
              const { url, ratio } = getImageUrl(p)
              const useFourByFive = Math.abs((ratio ?? 1) - 0.8) <= 0.06
                                  
                                  if (useFourByFive) {
                                    // Portrait image (4:5 ratio)
                  return (
                                      <div className="w-[108px] h-[135px] overflow-hidden">
                                        <img 
                                          src={url}
                                          className="w-full h-full object-cover transition-transform duration-150 ease-out group-hover:scale-110" 
                                          alt={p.title} 
                                        />
                    </div>
                  )
                                  } else {
                                    // Square image
              return (
                                      <div className="w-[135px] h-[135px] overflow-hidden">
                                        <img 
                                          src={url}
                                          className="w-full h-full object-cover transition-transform duration-150 ease-out group-hover:scale-110" 
                                          alt={p.title} 
                                        />
                      </div>
                    )
                                  }
                  })()}
                </div>
                              {/* Product Title & Brand */}
                              <div className="flex flex-col gap-1">
                                <p className="text-xs text-[#666666] leading-4">
                                  {p.brandName || 'Sponsored'}
                                </p>
                                <p className="text-base font-bold text-[#003adc] leading-5">
                                  {p.title}
                                </p>
              </div>

                              {/* Rating - Now using product-based data */}
                              <div className="flex gap-2 items-center">
                                <div className="flex gap-1">
                                  {[1,2,3,4,5].map((star) => (
                                    <svg key={star} width="12" height="12" viewBox="0 0 12 12" fill="none">
                                      <path 
                                        d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.5L6 8.885L2.91 10.5L3.5 7.07L1 4.635L4.455 4.13L6 1Z" 
                                        fill={star <= starCount ? "#FFD700" : "#E5E5E5"}
                                      />
                                    </svg>
                                  ))}
                                </div>
                                <p className="text-sm text-[#666666] leading-[18px]">
                                  {rating} (<span className="text-[#003adc] underline">{reviewCount}</span>)
                                </p>
                              </div>

                              {/* Links */}
                              <div className="flex flex-col gap-1">
                                <div className="flex gap-1 items-center h-[18px]">
                                  <span className="text-sm font-bold text-[#003adc] leading-[18px]">Write a review</span>
                                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.35352 2.77147L9.77073 7.99956L4.35377 13.2226L5.39492 14.3024L11.9313 8.00006L5.39517 1.69214L4.35352 2.77147Z" fill="#003adc"/>
                                  </svg>
                                </div>
                                <div className="flex gap-1 items-center h-[18px]">
                                  <span className="text-sm font-bold text-[#003adc] leading-[18px]">Rest of shelf</span>
                                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.35352 2.77147L9.77073 7.99956L4.35377 13.2226L5.39492 14.3024L11.9313 8.00006L5.39517 1.69214L4.35352 2.77147Z" fill="#003adc"/>
                                  </svg>
                                </div>
                              </div>
                            </div>

                            {/* Bottom Container */}
                            <div className="pt-3 flex flex-col gap-3">
                              {/* Value Bar - Only show if promotions exist */}
                              {p.promotions && p.promotions.length > 0 && (
                                <div className="flex flex-col gap-2">
                                  <div className="flex rounded-xl overflow-hidden h-14">
                                    {/* Clubcard Price Logo */}
                                    <div className="bg-[#003adc] flex items-center justify-center px-1 min-w-[48px]">
                                      <div className="text-white text-[10px] font-bold leading-[10px] text-center">
                                        Clubcard<br/>Price
                                      </div>
                                    </div>
                                    {/* White Divider */}
                                    <div className="bg-white w-1"></div>
                                    {/* Yellow Price Section */}
                                    <div className="bg-[#fcd700] flex-1 px-2 py-0.5 flex items-center">
                                      <div className="flex flex-col">
                                        <p className="text-base font-bold text-black leading-5 truncate">
                                          {p.promotions[0].offerText || `£${((p.price?.actual ?? p.price?.price ?? 0) * 0.8).toFixed(2)} offer`}
                                        </p>
                                        <p className="text-xs text-black leading-4">
                                          £{(((p.price?.actual ?? p.price?.price ?? 0) * 0.8) * 3.67).toFixed(2)}/kg
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-xs text-[#666666] leading-4 text-right">
                                    Valid for delivery from {p.promotions[0].startDate ? new Date(p.promotions[0].startDate).toLocaleDateString() : 'XX/XX'} until {p.promotions[0].endDate ? new Date(p.promotions[0].endDate).toLocaleDateString() : 'XX/XX/XX'}
                                  </p>
                                </div>
                              )}

                              {/* Add to Basket */}
                              <div className="flex flex-col gap-3">
                                {/* Price */}
                                <div className="flex items-baseline gap-2">
                                  <span className="text-2xl font-bold text-[#333333] leading-7">
                                    £{(p.price?.actual ?? p.price?.price ?? 1.00).toFixed(2)}
                                  </span>
                                  <span className="text-sm text-[#666666] leading-[18px]">
                                    £3.67/kg
                                  </span>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex gap-3 items-start">
                                  <div className="w-[68px]">
                                    <div className="relative">
                                      <input
                                        type="number"
                                        defaultValue="1"
                                        min="1"
                                        className="w-full h-10 px-3 py-2 border border-[#666666] bg-white text-base text-center focus:outline-none focus:border-[#003adc]"
                                      />
                                    </div>
                                  </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation() // Prevent modal from opening
                                    const unit = (p.price?.actual ?? p.price?.price ?? 1.00)
                                    setBasketCount(prev => prev + 1)
                                    setBasketTotal(prev => Number((prev + unit).toFixed(2)))
                                    setIsHeaderVisible(true)
                                  }}
                                  className="bg-[#003adc] px-5 py-2 rounded-full w-[92px] h-10 flex items-center justify-center relative focus:outline-none focus-visible:outline-none group hover:scale-105 active:scale-90 transition-transform duration-150 ease-out"
                                >
                                  <span className="text-base font-bold text-white leading-5">Add</span>
                                  {/* Focus ring - only visible for keyboard focus */}
                                  <div className="absolute inset-[-4px] rounded-full border-[3px] border-[#003adc] border-solid pointer-events-none opacity-0 group-focus-visible:opacity-100 transition-opacity"></div>
                                </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                </div>
              )
                })}
              </div>
              </>
            )}
                  </div>
                )
              })()}
            </div>
      
      {/* Product Modal */}
      {isModalOpen && <ProductModal />}
      </div>
  )
}


