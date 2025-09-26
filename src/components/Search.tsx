import { useMemo, useState } from 'react'
import type { ProductItem } from '../lib/tesco'
import { TescoAPI } from '../lib/tesco'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Search() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<ProductItem[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const canSearch = useMemo(() => query.trim().length > 1, [query])

  async function performSearch() {
    if (!canSearch) return
    setIsLoading(true)
    setError(null)
    setHasSearched(true)
    setProducts([]) // Clear previous results to show skeleton immediately
    
    const result = await TescoAPI.searchProducts({ query, count: 12, page: 0, filters: [] })
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
    <div className="bg-white relative">
      {/* Wishlist Button Skeleton */}
      <div className="absolute top-3 right-3 z-10">
        <Skeleton width={36} height={36} circle />
      </div>
      
      <div className="pt-4 px-4 pb-12">
        {/* Top Container */}
        <div className="flex flex-col gap-3 mb-3">
          {/* Tag skeleton */}
          <div className="flex gap-1 items-start">
            <Skeleton width={40} height={24} />
          </div>

          {/* Image skeleton */}
          <div className="flex items-center justify-center w-full">
            <Skeleton width={135} height={135} />
          </div>

          {/* Title skeleton */}
          <div className="flex flex-col gap-1">
            <Skeleton width={60} height={16} />
            <Skeleton width="80%" height={20} />
          </div>

          {/* Rating skeleton */}
          <div className="flex gap-2 items-center">
            <div className="flex gap-1">
              {[1,2,3,4,5].map((star) => (
                <Skeleton key={star} width={12} height={12} />
              ))}
            </div>
            <Skeleton width={80} height={18} />
          </div>

          {/* Links skeleton */}
          <div className="flex flex-col gap-1">
            <Skeleton width={100} height={18} />
            <Skeleton width={90} height={18} />
          </div>
        </div>

        {/* Bottom Container */}
        <div className="pt-3 flex flex-col gap-3">
          {/* Value bar skeleton */}
          <div className="flex flex-col gap-2">
            <Skeleton height={56} />
            <Skeleton width="60%" height={16} />
          </div>

          {/* Price and add button skeleton */}
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-2">
              <Skeleton width={80} height={28} />
              <Skeleton width={60} height={18} />
            </div>
            <div className="flex gap-3 items-start">
              <Skeleton width={68} height={40} />
              <Skeleton width={92} height={40} />
            </div>
          </div>
        </div>
      </div>
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

  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Header */}
      <div className="w-full max-w-sm mx-auto">
        <div className={`bg-white border-t-4 ${
          hasSearched && products.some(p => 
            p.brandName?.toLowerCase().includes('f&f') || 
            p.brandName?.toLowerCase().includes('florence') ||
            p.title?.toLowerCase().includes('f&f') ||
            p.title?.toLowerCase().includes('florence')
          ) ? 'border-black' : 'border-[#003adc]'
        }`}>
          {/* Logo & Basket Row */}
          <div className="flex items-center justify-between px-3 py-0 h-[60px]">
            <div className="flex items-center gap-2 h-[54px] pt-1">
              {/* Menu Button */}
              <button className="p-1.5 rounded-[18px] flex items-center justify-center relative focus:outline-none focus-visible:outline-none group hover:scale-105 active:scale-90 transition-transform duration-150 ease-out">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 4.25H2V2.75H18V4.25Z" fill="#00539F"/>
                  <path d="M18 10.75H2V9.25H18V10.75Z" fill="#00539F"/>
                  <path d="M18 17.25H2V15.75H18V17.25Z" fill="#00539F"/>
                </svg>
                {/* Focus ring - only visible for keyboard focus */}
                <div className="absolute inset-[-4px] rounded-[22px] border-[3px] border-[#003adc] border-solid pointer-events-none opacity-0 group-focus-visible:opacity-100 transition-opacity"></div>
              </button>
              {/* Tesco Logo */}
              <div className="h-[19px] w-[68px] flex items-center">
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
            </div>
            
            {/* Basket */}
            <div className="flex items-center gap-2 pb-2 pt-3">
              <div className="bg-[#003adc] p-2 rounded-[20px] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.25001 18.9999V12.9999H8.75001V18.9999H7.25001Z" fill="white"/>
                  <path d="M11.25 18.9999V12.9999H12.75V18.9999H11.25Z" fill="white"/>
                  <path d="M15.25 12.9999V18.9999H16.75V12.9999H15.25Z" fill="white"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M18.6127 2.43241L13.4474 9.7499H23.4396L20.5987 22.2499H3.40133L0.560425 9.7499H11.6114L17.3873 1.56738L18.6127 2.43241ZM4.59868 20.7499L2.43959 11.2499H21.5604L19.4013 20.7499H4.59868Z" fill="white"/>
                </svg>
              </div>
              <div>
                <p className="text-[#003adc] font-bold text-[16px] leading-[20px]">£0.00</p>
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
                className="bg-[#003adc] p-2 rounded-[20px] flex items-center justify-center disabled:opacity-50 relative focus:outline-none focus-visible:outline-none group hover:scale-105 active:scale-90 transition-transform duration-150 ease-out disabled:hover:scale-100 disabled:active:scale-100"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M1.75 9.00003C1.75 4.99582 4.99579 1.75003 9 1.75003C13.0042 1.75003 16.25 4.99582 16.25 9.00003C16.25 10.732 15.6428 12.322 14.6296 13.5689L22.0301 20.9694L20.9694 22.0301L13.5689 14.6296C12.322 15.6428 10.732 16.25 9 16.25C4.99579 16.25 1.75 13.0042 1.75 9.00003ZM9 3.25003C5.82421 3.25003 3.25 5.82424 3.25 9.00003C3.25 12.1758 5.82421 14.75 9 14.75C12.1758 14.75 14.75 12.1758 14.75 9.00003C14.75 5.82424 12.1758 3.25003 9 3.25003Z" fill="white"/>
                </svg>
                {/* Focus ring - only visible for keyboard focus */}
                <div className="absolute inset-[-4px] rounded-[24px] border-[3px] border-[#003adc] border-solid pointer-events-none opacity-0 group-focus-visible:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>
      </div>

        {/* Results Section - Only show after search */}
        {hasSearched && (() => {
          
          return (
            <div className="p-4">
      {error && (
                <p className="text-red-600 mb-4">{error}</p>
              )}

              {isLoading && (
                <div className="grid grid-cols-2 gap-0">
                  {[1,2,3,4,5,6].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {!isLoading && products.length === 0 && query.trim() && (
                <p className="text-gray-600 text-center py-8">No products found for "{query}"</p>
              )}

              {!isLoading && products.length > 0 && (
              <div className="grid grid-cols-2 gap-0">
                {products.map((p) => {
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
                    <div key={p.id} className="bg-white relative">
                      {/* Wishlist Button - positioned in top-right corner */}
                      <div className="absolute top-3 right-3 z-10">
                      </div>
                      
                      <div className="pt-4 px-4 pb-12">
                        {/* Top Container */}
                        <div className="flex flex-col gap-3 mb-3">
                          {/* Tags - Only show if promotions exist */}
                          {p.promotions && p.promotions.length > 0 && (
                            <div className="flex gap-1 items-start">
                              <div className={`${isFFProduct ? 'bg-black' : 'bg-[#003adc]'} px-2 py-1 rounded-sm inline-flex items-center justify-center`}>
                                <span className="text-white text-xs font-bold leading-none">
                                  {p.promotions[0].promotionType === 'NEW' ? 'New' : 'Offer'}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Image Container */}
                          <div className="flex items-center justify-center w-full">
            {(() => {
              const { url, ratio } = getImageUrl(p)
              const useFourByFive = Math.abs((ratio ?? 1) - 0.8) <= 0.06
                              
                              if (useFourByFive) {
                                // Portrait image (4:5 ratio)
              return (
                                  <div className="w-[108px] h-[135px]">
                                    <img 
                                      src={url} 
                                      className="w-full h-full object-cover" 
                                      alt={p.title} 
                                    />
                </div>
              )
                              } else {
                                // Square image
                return (
                                  <div className="w-[135px] h-[135px]">
                                    <img 
                                      src={url} 
                                      className="w-full h-full object-cover" 
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
                            <p className={`text-base font-bold ${isFFProduct ? 'text-black' : 'text-[#003adc]'} leading-5`}>
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
                              {rating} (<span className={`${isFFProduct ? 'text-black' : 'text-[#003adc]'} underline`}>{reviewCount}</span>)
                            </p>
                          </div>

                          {/* Links */}
                          <div className="flex flex-col gap-1">
                            <div className="flex gap-1 items-center h-[18px]">
                              <span className={`text-sm font-bold ${isFFProduct ? 'text-black' : 'text-[#003adc]'} leading-[18px]`}>Write a review</span>
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.35352 2.77147L9.77073 7.99956L4.35377 13.2226L5.39492 14.3024L11.9313 8.00006L5.39517 1.69214L4.35352 2.77147Z" fill={isFFProduct ? "#000000" : "#003adc"}/>
                              </svg>
                            </div>
                            <div className="flex gap-1 items-center h-[18px]">
                              <span className={`text-sm font-bold ${isFFProduct ? 'text-black' : 'text-[#003adc]'} leading-[18px]`}>Rest of shelf</span>
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.35352 2.77147L9.77073 7.99956L4.35377 13.2226L5.39492 14.3024L11.9313 8.00006L5.39517 1.69214L4.35352 2.77147Z" fill={isFFProduct ? "#000000" : "#003adc"}/>
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
                            <button className={`${isFFProduct ? 'bg-black' : 'bg-[#003adc]'} px-5 py-2 rounded-full w-[92px] h-10 flex items-center justify-center relative focus:outline-none focus-visible:outline-none group hover:scale-105 active:scale-90 transition-transform duration-150 ease-out`}>
                              <span className="text-base font-bold text-white leading-5">Add</span>
                              {/* Focus ring - only visible for keyboard focus */}
                              <div className={`absolute inset-[-4px] rounded-full border-[3px] ${isFFProduct ? 'border-black' : 'border-[#003adc]'} border-solid pointer-events-none opacity-0 group-focus-visible:opacity-100 transition-opacity`}></div>
                            </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            </div>
          )
        })()}
      </div>
    </div>
  )
}


