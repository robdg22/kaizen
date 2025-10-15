import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TescoAPI, type GetProductResponse } from '../lib/tesco'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import TescoHeader from './TescoHeader'
import FnFHeader from './FnFHeader'

export default function ProductPage() {
  const { tpnc } = useParams<{ tpnc: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<GetProductResponse['product'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  
  // Header state (simplified for product page)
  const [basketTotal] = useState(0)
  const [basketCount] = useState(0)
  const [wishlistCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'zoomIn' | 'default' | 'zoomOut'>('default')
  const [hasSearched] = useState(false)

  useEffect(() => {
    if (!tpnc) {
      setError('Product ID is required')
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await TescoAPI.getProduct({ tpnc: tpnc })
        
        if (response.errors) {
          setError(response.errors[0].message)
        } else if (response.data?.product) {
          setProduct(response.data.product)
          
          // Set default color and size for clothing products
          const productData = response.data.product
          const isClothing = productData.brandName?.toLowerCase().includes('f&f') || 
                           productData.brandName?.toLowerCase().includes('florence') ||
                           productData.title?.toLowerCase().includes('f&f') ||
                           productData.title?.toLowerCase().includes('florence') ||
                           productData.details?.clothingInfo !== undefined
          
          if (isClothing && productData.variations?.products) {
            const variations = productData.variations.products
            
            // Extract unique colors
            const colorSet = new Set<string>()
            variations.forEach(variant => {
              const color = variant.variationAttributes?.find(attr => attr.attributeGroup === 'colour')?.attributeGroupData?.value
              if (color) colorSet.add(color)
            })
            const colors = Array.from(colorSet)
            
            // Extract unique sizes
            const sizeSet = new Set<string>()
            variations.forEach(variant => {
              const size = variant.variationAttributes?.find(attr => attr.attributeGroup === 'size')?.attributeGroupData?.value
              if (size) sizeSet.add(size)
            })
            const sizes = Array.from(sizeSet)
            
            // Set defaults
            if (colors.length > 0) setSelectedColor(colors[0])
            if (sizes.length > 0) setSelectedSize(sizes[0])
          }
        } else {
          setError('Product not found')
        }
      } catch (err) {
        console.error('Error fetching product:', err) // Debug log
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [tpnc])

  const handleAddToBasket = () => {
    if (!product) return
    
    if (isClothingProduct && product.variations?.products) {
      // For clothing products, find the specific variant
      const selectedVariant = product.variations.products.find(variant => {
        const variantColor = variant.variationAttributes?.find(attr => attr.attributeGroup === 'colour')?.attributeGroupData?.value
        const variantSize = variant.variationAttributes?.find(attr => attr.attributeGroup === 'size')?.attributeGroupData?.value
        return variantColor === selectedColor && variantSize === selectedSize
      })
      
      if (selectedVariant) {
        // TODO: Implement add to basket functionality for clothing
      }
    } else {
      // For regular products
      console.log('Add to basket (regular):', product.id, 'Quantity:', quantity)
      // TODO: Implement add to basket functionality for regular products
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image skeleton */}
            <div className="space-y-4">
              <Skeleton height={400} />
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} height={80} width={80} />
                ))}
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="space-y-6">
              <Skeleton height={32} />
              <Skeleton height={24} width="60%" />
              <Skeleton height={48} />
              <Skeleton height={100} />
              <Skeleton height={48} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The product you are looking for could not be found.'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#00539f] text-white px-6 py-3 rounded-lg hover:bg-[#004080] transition-colors"
          >
            Back to Search
          </button>
        </div>
      </div>
    )
  }

  // Get product images
  const productImages = [
    product.media?.defaultImage?.url || product.defaultImageUrl,
    ...(product.media?.images?.map(img => img.url) || []),
    ...(product.images?.display?.default?.url ? [product.images.display.default.url] : [])
  ].filter(Boolean) as string[]

  // Get product price
  const price = product.price?.actual || 0
  const unitPrice = product.price?.unitPrice || ''
  const unitOfMeasure = product.price?.unitOfMeasure || ''
  
  // Get review data
  const reviewCount = product.reviews?.stats?.noOfReviews || 0
  const rating = product.reviews?.stats?.overallRating || 0
  const starCount = Math.floor(rating)

  // Determine if unit price should be shown
  const showUnitPrice = unitPrice && 
                        unitOfMeasure.toLowerCase() !== 'each' && 
                        unitPrice !== `£${price.toFixed(2)}`

  // Detect if this is a clothing product (F&F) based on superDepartment
  const isClothingProduct = product.superDepartmentName === 'Clothing & Accessories'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {isClothingProduct ? (
        <FnFHeader
          basketTotal={basketTotal}
          basketCount={basketCount}
          wishlistCount={wishlistCount}
          onSearch={() => navigate('/')}
          onModeSwitch={() => navigate('/')}
          onWishlistClick={() => {}}
          searchQuery={searchQuery}
          onQueryChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          hasSearched={hasSearched}
          onBasketClick={() => {}}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
          onMobileMenuClose={() => setIsMobileMenuOpen(false)}
          onLogoClick={() => navigate('/')}
          categories={[]}
          onCategoryClick={() => {}}
        />
      ) : (
        <TescoHeader
          basketTotal={basketTotal}
          basketCount={basketCount}
          wishlistCount={wishlistCount}
          onSearch={() => navigate('/')}
          onModeSwitch={() => navigate('/')}
          searchQuery={searchQuery}
          onQueryChange={setSearchQuery}
          onBasketClick={() => {}}
          onWishlistClick={() => {}}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
          onMobileMenuClose={() => setIsMobileMenuOpen(false)}
          onLogoClick={() => navigate('/')}
          categories={[]}
          onCategoryClick={() => {}}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className={`${isClothingProduct ? 'aspect-[4/5]' : 'aspect-square'} bg-white ${isClothingProduct ? 'border-2 border-black' : 'rounded-lg border border-gray-200'} overflow-hidden`}>
              {productImages.length > 0 ? (
                <img
                  src={productImages[selectedImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 ${isClothingProduct ? 'w-8 h-10' : 'w-20 h-20'} ${isClothingProduct ? '' : 'rounded-lg'} overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? (isClothingProduct ? 'border-black' : 'border-[#00539f]') 
                        : (isClothingProduct ? 'border-black' : 'border-gray-200')
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Brand and Title */}
            <div>
              {product.brandName && (
                <p className={`text-sm ${isClothingProduct ? 'text-black' : 'text-gray-600'} mb-2`} style={isClothingProduct ? { fontFamily: 'FandF Sans, sans-serif' } : {}}>
                  {product.brandName}
                </p>
              )}
              <h1 className={`text-2xl lg:text-3xl font-bold ${isClothingProduct ? 'text-black' : 'text-gray-900'} mb-4`} style={isClothingProduct ? { fontFamily: 'FandF Sans, sans-serif' } : {}}>
                {product.title}
              </h1>
            </div>

            {/* Rating */}
            {reviewCount > 0 && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${star <= starCount ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {rating.toFixed(1)} ({reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className={`text-3xl font-bold ${isClothingProduct ? 'text-black' : 'text-gray-900'}`} style={isClothingProduct ? { fontFamily: 'FandF Sans, sans-serif' } : {}}>
                  £{price.toFixed(2)}
                </span>
                {showUnitPrice && (
                  <span className={`text-lg ${isClothingProduct ? 'text-black' : 'text-gray-600'}`} style={isClothingProduct ? { fontFamily: 'FandF Sans, sans-serif' } : {}}>
                    {unitPrice}/{unitOfMeasure}
                  </span>
                )}
              </div>
              
              {/* Promotions */}
              {product.promotions && product.promotions.length > 0 && (
                <div className="space-y-2">
                  {product.promotions.map((promotion) => (
                    <div key={promotion.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-800">{promotion.description}</p>
                      {promotion.price && (
                        <p className="text-sm text-red-600">
                          Was £{promotion.price.beforeDiscount?.toFixed(2)} - Now £{promotion.price.afterDiscount?.toFixed(2)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity and Add to Basket */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color and Size Selection for Clothing Products */}
              {isClothingProduct && product.variations?.products && (() => {
                const variations = product.variations.products
                
                // Extract unique colors
                const colorSet = new Set<string>()
                variations.forEach(variant => {
                  const color = variant.variationAttributes?.find(attr => attr.attributeGroup === 'colour')?.attributeGroupData?.value
                  if (color) colorSet.add(color)
                })
                const colors = Array.from(colorSet)
                
                // Extract unique sizes for selected color
                const sizeMap = new Map<string, { isAvailable: boolean; tpnc: string }>()
                variations.forEach(variant => {
                  const size = variant.variationAttributes?.find(attr => attr.attributeGroup === 'size')?.attributeGroupData?.value
                  const variantColor = variant.variationAttributes?.find(attr => attr.attributeGroup === 'colour')?.attributeGroupData?.value
                  if (size && variantColor === selectedColor) {
                    const isAvailable = variant.sellers?.results?.some(s => s.isForSale && s.status === 'AvailableForSale') ?? false
                    sizeMap.set(size, { isAvailable, tpnc: variant.tpnc })
                  }
                })
                
                const sizes = Array.from(sizeMap.entries())
                  .map(([size, data]) => ({ size, ...data }))
                  .sort((a, b) => {
                    const numA = parseInt(a.size || '0')
                    const numB = parseInt(b.size || '0')
                    return numA - numB
                  })
                
                return (
                  <div className="space-y-4">
                    {/* Color Selection */}
                    {colors.length > 1 && (
                      <div>
                        <label htmlFor="color" className="block text-sm font-bold text-black mb-2" style={{ fontFamily: 'FandF Sans, sans-serif' }}>
                          Colour
                        </label>
                        <select
                          id="color"
                          value={selectedColor}
                          onChange={(e) => {
                            setSelectedColor(e.target.value)
                            // Reset size when color changes
                            setSelectedSize('')
                          }}
                          className="w-full h-[36px] px-[12px] py-[6px] border border-black bg-white text-[16px] leading-[20px] text-black appearance-none"
                          style={{ fontFamily: 'FandF Sans, sans-serif' }}
                        >
                          {colors.map((color) => (
                            <option key={color} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    {/* Size Selection */}
                    {sizes.length > 0 && (
                      <div>
                        <label htmlFor="size" className="block text-sm font-bold text-black mb-2" style={{ fontFamily: 'FandF Sans, sans-serif' }}>
                          Size
                        </label>
                        <select
                          id="size"
                          value={selectedSize}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          className="w-full h-[36px] px-[12px] py-[6px] border border-black bg-white text-[16px] leading-[20px] text-black appearance-none"
                          style={{ fontFamily: 'FandF Sans, sans-serif' }}
                        >
                          <option value="">Select Size</option>
                          {sizes.map(({ size, isAvailable }) => (
                            <option key={size} value={size} disabled={!isAvailable}>
                              {size} {!isAvailable ? '(Out of stock)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )
              })()}

              <button
                onClick={handleAddToBasket}
                disabled={isClothingProduct && (!selectedColor || !selectedSize)}
                className={`w-full ${isClothingProduct ? 'bg-black hover:bg-gray-800' : 'bg-[#00539f] hover:bg-[#004080]'} text-white py-3 px-6 ${isClothingProduct ? '' : 'rounded-lg'} font-medium transition-colors ${
                  isClothingProduct && (!selectedColor || !selectedSize) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                style={isClothingProduct ? { fontFamily: 'FandF Sans, sans-serif' } : {}}
              >
                {isClothingProduct && (!selectedColor || !selectedSize) 
                  ? 'Select Colour and Size' 
                  : (isClothingProduct ? 'ADD' : 'Add to Basket')
                }
              </button>
            </div>

            {/* Product Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Product Details */}
            {product.details && (
              <div className="space-y-4">
                {product.details.ingredients && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ingredients</h3>
                    <p className="text-gray-600">{product.details.ingredients}</p>
                  </div>
                )}

                {product.details.storage && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Storage</h3>
                    <p className="text-gray-600">{product.details.storage}</p>
                  </div>
                )}

                {product.details.allergenInfo && product.details.allergenInfo.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Allergens</h3>
                    <div className="space-y-1">
                      {product.details.allergenInfo.map((allergen, index) => (
                        <p key={index} className="text-gray-600">
                          <span className="font-medium">{allergen.name}:</span> {allergen.values.join(', ')}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {product.details.nutritionInfo && product.details.nutritionInfo.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nutrition Information</h3>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Per 100g</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Per Serving</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">% RI</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {product.details.nutritionInfo.map((nutrition, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-sm text-gray-900">{nutrition.name}</td>
                              <td className="px-4 py-2 text-sm text-gray-600">{nutrition.perComp}</td>
                              <td className="px-4 py-2 text-sm text-gray-600">{nutrition.perServing}</td>
                              <td className="px-4 py-2 text-sm text-gray-600">{nutrition.referencePercentage}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Clothing-specific information */}
                {isClothingProduct && product.details.clothingInfo && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-black mb-2" style={{ fontFamily: 'FandF Sans, sans-serif' }}>Clothing Information</h3>
                    
                    {product.details.clothingInfo.fibreComposition && product.details.clothingInfo.fibreComposition.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-black mb-2" style={{ fontFamily: 'FandF Sans, sans-serif' }}>Fibre Composition</h4>
                        <div className="space-y-1">
                          {product.details.clothingInfo.fibreComposition.map((fibre, index) => (
                            <p key={index} className="text-black" style={{ fontFamily: 'FandF Sans, sans-serif' }}>{fibre}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.details.clothingInfo.careInstructions && product.details.clothingInfo.careInstructions.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-black mb-2" style={{ fontFamily: 'FandF Sans, sans-serif' }}>Care Instructions</h4>
                        <div className="space-y-1">
                          {product.details.clothingInfo.careInstructions.map((instruction, index) => (
                            <p key={index} className="text-black" style={{ fontFamily: 'FandF Sans, sans-serif' }}>{instruction}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.details.clothingInfo.specialFeature && product.details.clothingInfo.specialFeature.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-black mb-2" style={{ fontFamily: 'FandF Sans, sans-serif' }}>Special Features</h4>
                        <div className="space-y-2">
                          {product.details.clothingInfo.specialFeature
                            .filter(feature => feature.trim() !== '') // Filter out empty strings
                            .map((feature, index) => (
                            <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-black text-sm" style={{ fontFamily: 'FandF Sans, sans-serif' }}>{feature}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.details.clothingInfo.sizeChart && product.details.clothingInfo.sizeChart.url && (
                      <div>
                        <h4 className="text-md font-medium text-black mb-2" style={{ fontFamily: 'FandF Sans, sans-serif' }}>Size Guide</h4>
                        <a 
                          href={product.details.clothingInfo.sizeChart.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                          style={{ fontFamily: 'FandF Sans, sans-serif' }}
                        >
                          <span>View Size Guide</span>
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Reviews */}
            {product.reviews?.entries && product.reviews.entries.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Reviews</h3>
                <div className="space-y-4">
                  {product.reviews.entries.slice(0, 3).map((review, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{review.author.nickname}</span>
                          {review.verifiedBuyer && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating.value ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      {review.summary && (
                        <h4 className="font-medium text-gray-900 mb-2">{review.summary}</h4>
                      )}
                      <p className="text-gray-600 text-sm">{review.text}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(review.submissionDateTime).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
