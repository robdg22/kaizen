import { useEffect } from 'react'

interface WishlistItem {
  id: string
  tpnc: string
  title: string
  color?: string
  size?: string
  price: number
  imageUrl: string
  isClothing: boolean
}

interface WishlistSidebarProps {
  isOpen: boolean
  onClose: () => void
  items: WishlistItem[]
  onRemoveItem: (id: string) => void
  onMoveToBasket: (item: WishlistItem) => void
}

export default function WishlistSidebar({ isOpen, onClose, items, onRemoveItem, onMoveToBasket }: WishlistSidebarProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-[300] ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl transition-transform duration-300 ease-out z-[301] flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-[#E81C2D] p-[12px] sm:p-4 flex items-center justify-between">
          <h2 className="font-['Tesco_Modern'] font-bold text-[18px] sm:text-[20px] leading-[22px] sm:leading-[24px] text-white">
            Your Wishlist
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:opacity-80 transition-opacity p-1"
          >
            <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-[12px] sm:p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="#cccccc" strokeWidth="2">
                <path d="M32 54l-3.5-3.18C15.4 38.72 8 31.76 8 23c0-6.16 4.84-11 11-11 3.48 0 6.82 1.62 9 4.18C30.18 13.62 33.52 12 37 12c6.16 0 11 4.84 11 11 0 8.76-7.4 15.72-20.5 27.82L32 54z"/>
              </svg>
              <p className="font-['Tesco_Modern'] text-[16px] text-[#666666] mt-4">
                Your wishlist is empty
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.id} className="border border-[#cccccc] p-3 flex gap-3">
                  {/* Image */}
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col gap-1">
                    <p className="font-['Tesco_Modern'] text-[14px] leading-[18px] text-[#333333] line-clamp-2">
                      {item.title}
                    </p>
                    {item.isClothing && (
                      <div className="flex gap-2 text-[12px] text-[#666666]">
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </div>
                    )}
                    <p className="font-['Tesco_Modern'] font-bold text-[16px] text-[#00539f] mt-1">
                      £{item.price.toFixed(2)}
                    </p>
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => onMoveToBasket(item)}
                        className="flex-1 bg-[#00539f] text-white rounded-[20px] px-3 py-1 text-[12px] font-bold hover:bg-[#004080] transition-colors"
                      >
                        Add to Basket
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#E81C2D] hover:opacity-80 text-[12px] font-bold px-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

