import type { ProductItem } from '../lib/tesco'
import TescoLogo from '../../assets/icons/Tesco Logos.svg'
import TescoProductCard from './TescoProductCard'

interface TescoContainerProps {
  products: ProductItem[]
  totalCount: number
  onAddToBasket: (product: ProductItem) => void
}

export default function TescoContainer({ products, totalCount, onAddToBasket }: TescoContainerProps) {
  // Show up to 16 products in a grid
  const displayProducts = products.slice(0, 16)

  return (
    <div className="bg-white border-2 border-[#00539f] flex flex-col gap-[8px] sm:gap-[12px] p-[8px] sm:p-[16px] col-span-4 my-[8px] sm:my-[16px]">
      {/* Header with Tesco logo and count */}
      <div className="flex gap-[8px] sm:gap-[12px] items-center">
        <img 
          src={TescoLogo} 
          alt="Tesco" 
          height="24" 
          width="80" 
          className="sm:h-[30px] sm:w-[100px]"
        />
        <p className="font-['Tesco_Modern'] font-bold text-[16px] sm:text-[20px] leading-[20px] sm:leading-[24px] text-[#00539f] text-nowrap">
          {totalCount} results from Tesco
        </p>
      </div>

      {/* Product grid - Responsive: 2 cols mobile, 4 cols tablet, 8 cols desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-[4px] sm:gap-[12px] items-start">
        {displayProducts.map((product) => (
          <TescoProductCard
            key={`tesco-${product.id}`}
            product={product}
            onAddToBasket={() => onAddToBasket(product)}
          />
        ))}
      </div>
    </div>
  )
}

