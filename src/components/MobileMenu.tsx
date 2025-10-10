import { useState } from 'react'
import TescoLogo from '../../assets/icons/Tesco Logos.svg'
import FnfLogo from '../../assets/icons/fnf.svg'
import type { TaxonomyItem } from '../lib/tesco'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  mode: 'tesco' | 'fnf'
  onSwitchMode: () => void
  tescoCategories?: TaxonomyItem[]
  fnfCategories?: TaxonomyItem[]
  onTescoCategoryClick?: (category: TaxonomyItem) => void
  onFnFCategoryClick?: (category: TaxonomyItem) => void
}

export default function MobileMenu({ 
  isOpen, 
  onClose, 
  mode, 
  onSwitchMode,
  tescoCategories = [],
  fnfCategories = [],
  onTescoCategoryClick,
  onFnFCategoryClick
}: MobileMenuProps) {
  const [showTescoDepartments, setShowTescoDepartments] = useState(false)
  
  if (!isOpen) return null

  const handleTescoCategoryClick = (category: TaxonomyItem) => {
    if (onTescoCategoryClick) {
      onTescoCategoryClick(category)
      onClose()
    }
  }

  const handleFnFCategoryClick = (category: TaxonomyItem) => {
    if (onFnFCategoryClick) {
      onFnFCategoryClick(category)
      onClose()
    }
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[300]"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed top-0 left-0 right-0 bottom-0 z-[301] overflow-hidden flex flex-col">
        <div className="bg-white w-full h-full overflow-y-auto">
        {mode === 'tesco' ? (
          <div className="flex flex-col w-full pb-safe">
            {/* Close Button */}
            <div className="bg-white border-b border-[#cccccc] flex items-center justify-end px-0 pr-[12px] py-[8px]">
              <button onClick={onClose} className="flex gap-[8px] items-center">
                <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-[#00539f]">Close</p>
                <div className="bg-white border-2 border-[#00539f] rounded-[18px] p-[4px] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4L12 12" stroke="#00539f" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </button>
            </div>

            {/* Local Navigation */}
            <div className="bg-white flex flex-col">
              {/* All Departments - Expandable */}
              <button 
                onClick={() => setShowTescoDepartments(!showTescoDepartments)}
                className="bg-white border-b border-[#e5e5e5] px-[12px] py-[8px] flex items-start justify-between"
              >
                <p className="font-['F&F_Sans'] text-[16px] leading-[20px] text-[#00539f] py-[2px]">All Departments</p>
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  className={`transition-transform ${showTescoDepartments ? 'rotate-90' : ''}`}
                >
                  <path d="M9 18l6-6-6-6" stroke="#00539f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {/* Category List - Second Level */}
              {showTescoDepartments && tescoCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleTescoCategoryClick(category)}
                  className="bg-[#f5f5f5] border-b border-[#e5e5e5] px-[24px] py-[8px] flex items-start justify-start hover:bg-[#e8e8e8] transition-colors"
                >
                  <p className="font-['F&F_Sans'] text-[14px] leading-[20px] text-[#00539f] py-[2px]">
                    {category.label || category.name}
                  </p>
                </button>
              ))}
              
              <div className="bg-white border-b border-[#e5e5e5] px-[12px] py-[8px] flex items-start justify-between">
                <p className="font-['F&F_Sans'] text-[16px] leading-[20px] text-[#00539f] py-[2px]">My Favourites</p>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="#00539f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="bg-white border-b border-[#e5e5e5] px-[12px] py-[8px] flex items-start justify-between">
                <p className="font-['F&F_Sans'] text-[16px] leading-[20px] text-[#00539f] py-[2px]">Special offers</p>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="#00539f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="bg-white border-b border-[#e5e5e5] px-[12px] py-[8px] flex items-start justify-between">
                <p className="font-['F&F_Sans'] text-[16px] leading-[20px] text-[#00539f] py-[2px]">Tesco Clubcard</p>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="#00539f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="bg-white border-b border-[#e5e5e5] px-[12px] py-[8px] flex items-start justify-between">
                <p className="font-['F&F_Sans'] text-[16px] leading-[20px] text-[#00539f] py-[2px]">Price Cuts</p>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="#00539f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="bg-white border-b border-[#e5e5e5] px-[12px] py-[8px] flex items-start justify-between">
                <p className="font-['F&F_Sans'] text-[16px] leading-[20px] text-[#00539f] py-[2px]">Recipes</p>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="#00539f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Global Navigation */}
            <div className="flex flex-col">
              <div className="bg-[#00539f] border-t border-[rgba(255,255,255,0.4)] px-[12px] py-[4px] h-[36px] flex items-center">
                <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-white">Tesco Bank</p>
              </div>
              <div className="bg-[#00539f] border-t border-[rgba(255,255,255,0.4)] px-[12px] py-[4px] h-[36px] flex items-center">
                <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-white">Tesco Mobile</p>
              </div>
              <div className="bg-[#00539f] border-t border-[rgba(255,255,255,0.4)] px-[12px] py-[4px] h-[36px] flex items-center">
                <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-white">Delivery Saver</p>
              </div>
              <div className="bg-[#00539f] border-t border-[rgba(255,255,255,0.4)] px-[12px] py-[4px] h-[36px] flex items-center">
                <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-white">Store Locator</p>
              </div>
              <div className="bg-[#00539f] border-t border-[rgba(255,255,255,0.4)] px-[12px] py-[4px] h-[36px] flex items-center">
                <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-white">Help</p>
              </div>
              {/* Mode Switch - F&F Clothing */}
              <button onClick={onSwitchMode} className="bg-black border-t border-[rgba(255,255,255,0.4)] border-b border-[#e5e5e5] px-[12px] py-[8px] flex items-center gap-[4px] hover:bg-gray-900 transition-colors">
                <img src={FnfLogo} alt="F&F" height="20" width="38" />
                <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-white">Clothing</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full pb-safe">
            {/* Close Button */}
            <div className="bg-white border-b border-[#cccccc] flex items-center justify-end px-0 pr-[12px] py-[8px]">
              <button onClick={onClose} className="flex gap-[8px] items-center">
                <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-black">Close</p>
                <div className="bg-white border-2 border-black rounded-[18px] p-[4px] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4L12 12" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </button>
            </div>

            {/* F&F Navigation */}
            <div className="bg-white flex flex-col">
              {fnfCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleFnFCategoryClick(category)}
                  className="bg-white border-b border-[#e5e5e5] px-[12px] py-[8px] flex items-start justify-between hover:bg-[#f5f5f5] transition-colors"
                >
                  <p className="font-['F&F_Sans'] text-[16px] leading-[20px] text-black py-[2px] uppercase">
                    {category.label || category.name}
                  </p>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ))}
              <div className="bg-white border-b border-[#e5e5e5] px-[12px] py-[8px]">
                <p className="font-['F&F_Sans'] text-[16px] leading-[20px] text-black py-[2px]">INSPIRE</p>
              </div>
              <div className="bg-white border-b border-[#e5e5e5] px-[12px] py-[8px]">
                <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-[#e81c2d] py-[2px]">SALE</p>
              </div>
            </div>

            {/* Global Navigation */}
            <div className="flex flex-col">
              <div className="bg-black border-t border-[rgba(255,255,255,0.4)] px-[12px] py-[4px] h-[36px] flex items-center">
                <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-white">WISHLIST</p>
              </div>
              <div className="bg-black border-t border-[rgba(255,255,255,0.4)] px-[12px] py-[4px] h-[36px] flex items-center">
                <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-white">MY ACCOUNT</p>
              </div>
              <div className="bg-black border-t border-[rgba(255,255,255,0.4)] px-[12px] py-[4px] h-[36px] flex items-center">
                <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-white">STORE LOCATOR</p>
              </div>
              <div className="bg-black border-t border-[rgba(255,255,255,0.4)] px-[12px] py-[4px] h-[36px] flex items-center">
                <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-white">HELP</p>
              </div>
              <div className="bg-black border-t border-[rgba(255,255,255,0.4)] px-[12px] py-[4px] h-[36px] flex items-center">
                <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-white">SIGN OUT</p>
              </div>
              {/* Mode Switch - Back to Tesco */}
              <button onClick={onSwitchMode} className="bg-[rgba(255,255,255,0.8)] border-t border-[rgba(255,255,255,0.4)] px-[12px] py-[4px] h-[36px] flex items-center gap-[10px] hover:bg-white transition-colors">
                <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-black">{"< Back to"}</p>
                <img src={TescoLogo} alt="Tesco" height="19" width="68" />
              </button>
              <div className="bg-black h-[4px] w-full" />
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  )
}

