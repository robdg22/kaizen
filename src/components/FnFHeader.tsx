import SearchIcon from '../../assets/icons/Property header/Icon buttons/24px Icons/Search.svg'
import TescoLogo from '../../assets/icons/Tesco Logos.svg'
import BasketIcon from '../../assets/icons/Icon buttons/24px Icons/Basket.svg'
import FnfLogo from '../../assets/icons/fnf.svg'

type ViewMode = 'zoomIn' | 'default' | 'zoomOut'

interface FnFHeaderProps {
  basketTotal: number
  basketCount: number
  wishlistCount: number
  onSearch: (query: string) => void
  onModeSwitch: () => void
  onWishlistClick: () => void
  searchQuery: string
  onQueryChange: (query: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  hasSearched: boolean
  isVisible?: boolean
  onBasketClick: () => void
}

export default function FnFHeader({ 
  basketTotal,
  basketCount,
  wishlistCount,
  onSearch, 
  onModeSwitch, 
  onWishlistClick,
  searchQuery, 
  onQueryChange,
  viewMode,
  onViewModeChange,
  hasSearched,
  isVisible = true,
  onBasketClick
}: FnFHeaderProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <div className={`flex flex-col items-start w-full bg-white sticky top-0 z-[200] transition-transform duration-300 ease-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      {/* Utility Bar - Black */}
      <div className="bg-black w-full h-[33px] border-b border-black flex items-center justify-end">
        <div className="bg-black border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[20px] py-[4px]">
          <p className="font-['F&F_Sans'] font-bold text-[14px] leading-[18px] text-white text-nowrap">Store locator</p>
        </div>
        <div className="bg-black border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[20px] py-[4px]">
          <p className="font-['F&F_Sans'] font-bold text-[14px] leading-[18px] text-white text-nowrap">My orders</p>
        </div>
        <div className="bg-black border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[20px] py-[4px]">
          <p className="font-['F&F_Sans'] font-bold text-[14px] leading-[18px] text-white text-nowrap">Help</p>
        </div>
        <div className="bg-black border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[20px] py-[4px]">
          <p className="font-['F&F_Sans'] font-bold text-[14px] leading-[18px] text-white text-nowrap">Feedback</p>
        </div>
        <div className="bg-black border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[20px] py-[4px]">
          <p className="font-['F&F_Sans'] font-bold text-[14px] leading-[18px] text-white text-nowrap">My account</p>
        </div>
        {/* Clickable Tesco Logo - Returns to Tesco Mode */}
        <button 
          onClick={onModeSwitch}
          className="bg-white border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[20px] py-[4px] hover:bg-gray-100 transition-colors"
          title="Return to Tesco"
        >
          <img src={TescoLogo} alt="Tesco" width="53" height="16" />
        </button>
      </div>

      {/* Main Header */}
      <div className="flex gap-[24px] items-center px-[12px] py-0 w-full">
        {/* Logo and Search */}
        <div className="flex flex-row items-center flex-1">
          <div className="flex gap-[24px] items-center flex-1">
            {/* F&F Logo */}
            <img src={FnfLogo} 
            alt="Tesco" 
            width="120" 
            height="36" 
            />

            {/* Search Container */}
            <form onSubmit={handleSubmit} className="flex-1 max-w-[749px] py-[16px]">
              <div className="flex gap-[12px] items-start w-full">
                <div className="flex-1 flex items-center px-[12px] py-[8px] border border-[#666666] bg-white h-[40px] relative">
                  <div className="flex gap-[4px] items-center flex-1">
                    <img src={SearchIcon} alt="Search" width="24" height="24" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => onQueryChange(e.target.value)}
                      placeholder="Search"
                      className="flex-1 outline-none font-['F&F_Sans'] text-[16px] leading-[20px] text-[#666666]"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="bg-black rounded-[20px] p-[8px] flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  <img src={SearchIcon} alt="Search" width="24" height="24" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={onWishlistClick}
          className="bg-black rounded-[20px] p-[8px] relative hover:bg-gray-800 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {wishlistCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {wishlistCount}
            </div>
          )}
        </button>

        {/* Basket */}
        <button onClick={onBasketClick} className="flex gap-[24px] items-start justify-end hover:opacity-80 transition-opacity">
          <div className="flex items-center gap-[8px]">
            <div className="bg-black rounded-[20px] p-[8px] relative">
              <img src={BasketIcon} alt="Basket" width="24" height="24" />
              {basketCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-[#E81C2D] text-white text-[11px] leading-[11px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {basketCount}
                </div>
              )}
            </div>
            <div className="flex flex-col items-start justify-center">
              <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-black text-nowrap">£{basketTotal.toFixed(2)}</p>
            </div>
          </div>
        </button>
      </div>

      {/* Local Navigation */}
      <div className="bg-white flex gap-[16px] h-[44px] items-center w-full">
        <div className="px-[8px] py-[12px]">
          <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-black text-nowrap">WOMEN</p>
        </div>
        <div className="px-[8px] py-[12px]">
          <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-black text-nowrap">MEN</p>
        </div>
        <div className="px-[8px] py-[12px]">
          <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-black text-nowrap">KIDS</p>
        </div>
        <div className="px-[8px] py-[12px]">
          <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-black text-nowrap">BABY</p>
        </div>
        <div className="px-[8px] py-[12px]">
          <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-black text-nowrap">SCHOOL</p>
        </div>
        <div className="px-[8px] py-[12px]">
          <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-black text-nowrap">SPORTS</p>
        </div>
        <div className="px-[8px] py-[12px]">
          <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-black text-nowrap">HOLIDAY SHOP</p>
        </div>
        <div className="px-[8px] py-[12px]">
          <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-black text-nowrap">BRANDS</p>
        </div>
        <div className="px-[8px] py-[12px]">
          <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-black text-nowrap">HOME</p>
        </div>
        <div className="px-[8px] py-[12px]">
          <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-black text-nowrap">INSPIRE</p>
        </div>
        <div className="px-[8px] py-[12px]">
          <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-black text-nowrap">GIFTS</p>
        </div>
        <div className="px-[8px] py-[12px]">
          <p className="font-['F&F_Sans'] font-bold text-[16px] leading-[20px] text-[#e81c2d] text-nowrap">SALE</p>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#cccccc] h-px w-full" />

      {/* View Mode Toggle - shown after search */}
      {hasSearched && (
        <div className="bg-white w-full px-[12px] py-[12px] border-b border-[#cccccc]">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-['F&F_Sans'] font-bold text-black">View:</span>
            <div className="relative bg-gray-100 w-[85px] h-[28px] border border-gray-400 rounded">
              {/* Black background indicator */}
              <div 
                className="absolute bg-black h-[24px] top-[2px] w-[27px] transition-all duration-200 rounded"
                style={{
                  left: viewMode === 'zoomIn' ? '2px' : viewMode === 'default' ? '29px' : '56px',
                  transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.18, 1)'
                }}
              />
              
              {/* Button container */}
              <div className="absolute h-[24px] left-[2px] top-[2px] w-[81px] flex">
                {/* Zoom In view button */}
                <button
                  onClick={() => onViewModeChange('zoomIn')}
                  className="flex items-center justify-center w-[27px] h-[24px] p-[6px] cursor-pointer relative z-10"
                  aria-label="Zoom in view"
                >
                  <div className={`border-[1.5px] border-solid w-[16px] h-[16px] transition-colors ${
                    viewMode === 'zoomIn' ? 'border-white' : 'border-black'
                  }`} />
                </button>
                
                {/* Default view button */}
                <button
                  onClick={() => onViewModeChange('default')}
                  className="flex items-center justify-center w-[27px] h-[24px] p-[6px] cursor-pointer relative z-10"
                  aria-label="Default view"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={viewMode === 'default' ? 'text-white' : 'text-black'}>
                    <rect x="4" y="2" width="3" height="12" fill="currentColor"/>
                    <rect x="9" y="2" width="3" height="12" fill="currentColor"/>
                  </svg>
                </button>
                
                {/* Zoom Out view button */}
                <button
                  onClick={() => onViewModeChange('zoomOut')}
                  className="flex items-center justify-center w-[27px] h-[24px] p-[6px] cursor-pointer relative z-10"
                  aria-label="Zoom out view"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={viewMode === 'zoomOut' ? 'text-white' : 'text-black'}>
                    <rect x="1" y="1" width="4" height="4" fill="currentColor"/>
                    <rect x="6" y="1" width="4" height="4" fill="currentColor"/>
                    <rect x="11" y="1" width="4" height="4" fill="currentColor"/>
                    <rect x="1" y="6" width="4" height="4" fill="currentColor"/>
                    <rect x="6" y="6" width="4" height="4" fill="currentColor"/>
                    <rect x="11" y="6" width="4" height="4" fill="currentColor"/>
                    <rect x="1" y="11" width="4" height="4" fill="currentColor"/>
                    <rect x="6" y="11" width="4" height="4" fill="currentColor"/>
                    <rect x="11" y="11" width="4" height="4" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

