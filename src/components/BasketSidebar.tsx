import { useEffect } from 'react'
import TescoLogo from '../../assets/icons/Tesco Logos.svg'
import FnfLogo from '../../assets/icons/fnf.svg'

interface BasketItem {
  id: string
  tpnc: string
  title: string
  color: string
  size: string
  price: number
  imageUrl: string
  isClothing: boolean
}

interface BasketSidebarProps {
  isOpen: boolean
  onClose: () => void
  items: BasketItem[]
  total: number
  onRemoveItem: (id: string) => void
  mode?: 'tesco' | 'fnf'
}

export default function BasketSidebar({ isOpen, onClose, items, total, onRemoveItem, mode = 'tesco' }: BasketSidebarProps) {
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

  // Separate items by type
  const clothingItems = items.filter(item => item.isClothing)
  const groceryItems = items.filter(item => !item.isClothing)
  
  const clothingTotal = clothingItems.reduce((sum, item) => sum + item.price, 0)
  const groceryTotal = groceryItems.reduce((sum, item) => sum + item.price, 0)

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
        className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl transition-transform duration-300 ease-out z-[301] flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-white border-b border-[#cccccc] p-4 flex items-center justify-between">
          <h2 className="font-['Tesco_Modern'] font-bold text-[20px] leading-[24px] text-[#333333]">
            Your Basket
          </h2>
          <button
            onClick={onClose}
            className="text-[#333333] hover:opacity-80 transition-opacity"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cccccc" strokeWidth="1">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <p className="font-['Tesco_Modern'] text-[16px] text-[#666666] mt-4">
                Your basket is empty
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Show F&F first in fnf mode, Tesco first in tesco mode */}
              {mode === 'fnf' ? (
                <>
                  {/* F&F Section */}
                  {clothingItems.length > 0 && (
                    <div className="border-2 border-black rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <img src={FnfLogo} alt="F&F" height="24" width="46" />
                        <span className="font-['F&F_Sans'] font-bold text-[16px]">
                          ({clothingItems.length})
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 mb-3">
                        {clothingItems.map((item) => (
                          <div key={item.id} className="flex gap-2 pb-2 border-b border-[#e0e0e0] last:border-0">
                            <div className="w-16 h-16 flex-shrink-0">
                              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col">
                              <p className="font-['F&F_Sans'] text-[12px] leading-[16px] text-[#333333] line-clamp-2">
                                {item.title}
                              </p>
                              {item.color && <span className="text-[10px] text-[#666666]">Color: {item.color}</span>}
                              {item.size && <span className="text-[10px] text-[#666666]">Size: {item.size}</span>}
                              <div className="flex items-center justify-between mt-auto">
                                <p className="font-['F&F_Sans'] font-bold text-[14px]">£{item.price.toFixed(2)}</p>
                                <button onClick={() => onRemoveItem(item.id)} className="text-[#E81C2D] text-[10px] font-bold">
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#333333]">
                        <p className="font-['F&F_Sans'] font-bold text-[14px]">Subtotal</p>
                        <p className="font-['F&F_Sans'] font-bold text-[16px]">£{clothingTotal.toFixed(2)}</p>
                      </div>
                      <button className="w-full bg-black mt-3 px-4 py-2 hover:bg-gray-800 transition-colors">
                        <p className="font-['F&F_Sans'] font-bold text-[14px] text-white">Checkout F&F</p>
                      </button>
                    </div>
                  )}

                  {/* Tesco Section */}
                  {groceryItems.length > 0 && (
                    <div className="border-2 border-[#00539f] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <img src={TescoLogo} alt="Tesco" height="24" width="80" />
                        <span className="font-['Tesco_Modern'] font-bold text-[16px] text-[#00539f]">
                          ({groceryItems.length})
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 mb-3">
                        {groceryItems.map((item) => (
                          <div key={item.id} className="flex gap-2 pb-2 border-b border-[#e0e0e0] last:border-0">
                            <div className="w-16 h-16 flex-shrink-0">
                              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col">
                              <p className="font-['Tesco_Modern'] text-[12px] leading-[16px] text-[#333333] line-clamp-2">
                                {item.title}
                              </p>
                              <div className="flex items-center justify-between mt-auto">
                                <p className="font-['Tesco_Modern'] font-bold text-[14px] text-[#00539f]">£{item.price.toFixed(2)}</p>
                                <button onClick={() => onRemoveItem(item.id)} className="text-[#E81C2D] text-[10px] font-bold">
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#00539f]">
                        <p className="font-['Tesco_Modern'] font-bold text-[14px] text-[#00539f]">Subtotal</p>
                        <p className="font-['Tesco_Modern'] font-bold text-[16px] text-[#00539f]">£{groceryTotal.toFixed(2)}</p>
                      </div>
                      <button className="w-full bg-[#00539f] rounded-[40px] mt-3 px-4 py-2 hover:bg-[#004080] transition-colors">
                        <p className="font-['Tesco_Modern'] font-bold text-[14px] text-white">Checkout Tesco</p>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Tesco Section First */}
                  {groceryItems.length > 0 && (
                    <div className="border-2 border-[#00539f] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <img src={TescoLogo} alt="Tesco" height="24" width="80" />
                        <span className="font-['Tesco_Modern'] font-bold text-[16px] text-[#00539f]">
                          ({groceryItems.length})
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 mb-3">
                        {groceryItems.map((item) => (
                          <div key={item.id} className="flex gap-2 pb-2 border-b border-[#e0e0e0] last:border-0">
                            <div className="w-16 h-16 flex-shrink-0">
                              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col">
                              <p className="font-['Tesco_Modern'] text-[12px] leading-[16px] text-[#333333] line-clamp-2">
                                {item.title}
                              </p>
                              <div className="flex items-center justify-between mt-auto">
                                <p className="font-['Tesco_Modern'] font-bold text-[14px] text-[#00539f]">£{item.price.toFixed(2)}</p>
                                <button onClick={() => onRemoveItem(item.id)} className="text-[#E81C2D] text-[10px] font-bold">
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#00539f]">
                        <p className="font-['Tesco_Modern'] font-bold text-[14px] text-[#00539f]">Subtotal</p>
                        <p className="font-['Tesco_Modern'] font-bold text-[16px] text-[#00539f]">£{groceryTotal.toFixed(2)}</p>
                      </div>
                      <button className="w-full bg-[#00539f] rounded-[40px] mt-3 px-4 py-2 hover:bg-[#004080] transition-colors">
                        <p className="font-['Tesco_Modern'] font-bold text-[14px] text-white">Checkout Tesco</p>
                      </button>
                    </div>
                  )}

                  {/* F&F Section */}
                  {clothingItems.length > 0 && (
                    <div className="border-2 border-black rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <img src={FnfLogo} alt="F&F" height="24" width="46" />
                        <span className="font-['F&F_Sans'] font-bold text-[16px]">
                          ({clothingItems.length})
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 mb-3">
                        {clothingItems.map((item) => (
                          <div key={item.id} className="flex gap-2 pb-2 border-b border-[#e0e0e0] last:border-0">
                            <div className="w-16 h-16 flex-shrink-0">
                              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col">
                              <p className="font-['F&F_Sans'] text-[12px] leading-[16px] text-[#333333] line-clamp-2">
                                {item.title}
                              </p>
                              {item.color && <span className="text-[10px] text-[#666666]">Color: {item.color}</span>}
                              {item.size && <span className="text-[10px] text-[#666666]">Size: {item.size}</span>}
                              <div className="flex items-center justify-between mt-auto">
                                <p className="font-['F&F_Sans'] font-bold text-[14px]">£{item.price.toFixed(2)}</p>
                                <button onClick={() => onRemoveItem(item.id)} className="text-[#E81C2D] text-[10px] font-bold">
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#333333]">
                        <p className="font-['F&F_Sans'] font-bold text-[14px]">Subtotal</p>
                        <p className="font-['F&F_Sans'] font-bold text-[16px]">£{clothingTotal.toFixed(2)}</p>
                      </div>
                      <button className="w-full bg-black mt-3 px-4 py-2 hover:bg-gray-800 transition-colors">
                        <p className="font-['F&F_Sans'] font-bold text-[14px] text-white">Checkout F&F</p>
                      </button>
                    </div>
                  )}
                </>
              )}
              
              {/* Grand Total */}
              {clothingItems.length > 0 && groceryItems.length > 0 && (
                <div className="border-t-2 border-[#333333] pt-3">
                  <div className="flex items-center justify-between">
                    <p className="font-['Tesco_Modern'] font-bold text-[18px] text-[#333333]">
                      Total
                    </p>
                    <p className="font-['Tesco_Modern'] font-bold text-[24px] text-[#333333]">
                      £{total.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

