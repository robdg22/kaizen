import TescoLogo from '../../assets/icons/Tesco Logos.svg'
import BasketIcon from '../../assets/icons/Icon buttons/24px Icons/Basket.svg'
import SearchIcon from '../../assets/icons/Property header/Icon buttons/24px Icons/Search.svg'
import MenuIcon from '../../assets/icons/Property header/Icon buttons/20px Icons/Menu.svg'
import FnfLogo from '../../assets/icons/fnf.svg'

interface TescoHeaderProps {
  basketTotal: number
  basketCount: number
  wishlistCount: number
  onSearch: (query: string) => void
  onModeSwitch: () => void
  searchQuery: string
  onQueryChange: (query: string) => void
  isVisible?: boolean
  onBasketClick: () => void
  onWishlistClick: () => void
}

export default function TescoHeader({ 
  basketTotal,
  basketCount,
  wishlistCount,
  onSearch, 
  onModeSwitch, 
  searchQuery, 
  onQueryChange,
  isVisible = true,
  onBasketClick,
  onWishlistClick
}: TescoHeaderProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <div className={`flex flex-col items-start w-full bg-white sticky top-0 z-[200] transition-transform duration-300 ease-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      {/* Mobile Header (below sm breakpoint) */}
      <div className="sm:hidden w-full bg-white border-t-[4px] border-[#00539f] border-solid">
        {/* Logo & Basket Row */}
        <div className="flex items-start justify-between px-[12px] py-0 h-[60px] w-full">
          {/* Logo */}
          <div className="flex gap-[8px] h-[54px] items-center pt-[4px]">
            <div className="flex flex-col items-center justify-center p-[6px] rounded-[18px]">
              <img src={MenuIcon} alt="Menu" width="20" height="20" />
            </div>
            <img src={TescoLogo} alt="Tesco" height="19" width="68" />
          </div>
          {/* Basket */}
          <div className="flex gap-[16px] items-center pt-[12px] pb-[8px]">
            <button onClick={onWishlistClick} className="bg-white border-2 border-[#00539f] rounded-[20px] p-[8px] relative hover:opacity-80 transition-opacity">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00539f" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {wishlistCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-white text-[#00539f] text-[11px] leading-[11px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center border-2 border-[#00539f]">
                  {wishlistCount}
                </div>
              )}
            </button>
            <button onClick={onBasketClick} className="flex items-center gap-[8px] hover:opacity-80 transition-opacity">
              <div className="bg-[#00539f] rounded-[20px] p-[8px] relative">
                <img src={BasketIcon} alt="Basket" width="24" height="24" />
                {basketCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-[#E81C2D] text-white text-[11px] leading-[11px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                    {basketCount}
                  </div>
                )}
              </div>
              <p className="font-['Tesco_Modern'] font-bold text-[16px] leading-[20px] text-[#00539f]">£{basketTotal.toFixed(2)}</p>
            </button>
          </div>
        </div>
        
        {/* Search Row */}
        <div className="border-b border-[#cccccc] flex flex-col gap-[10px] pb-[12px] pt-[4px] px-[12px] w-full">
          <form onSubmit={handleSubmit} className="flex gap-[12px] items-start w-full">
            <div className="flex-1 flex items-center px-[12px] py-[8px] border border-[#666666] bg-white h-[40px] relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search"
                className="flex-1 outline-none font-['Tesco_Modern'] text-[16px] leading-[20px] text-[#666666]"
              />
            </div>
            <button 
              type="submit"
              className="bg-[#00539f] rounded-[20px] p-[8px] flex items-center justify-center flex-shrink-0"
            >
              <img src={SearchIcon} alt="Search" width="24" height="24" />
            </button>
          </form>
        </div>
      </div>

      {/* Desktop Header (sm breakpoint and above) */}
      {/* Utility Bar - Hidden on mobile, scrollable on tablet */}
      <div className="bg-[#00539f] w-full h-[32px] hidden sm:flex items-center justify-end overflow-x-auto">
        <div className="bg-[#00539f] border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[12px] sm:px-[20px] py-[4px] flex-shrink-0">
          <p className="font-['Tesco_Modern'] font-bold text-[12px] sm:text-[14px] leading-[18px] text-white text-nowrap">Tesco Bank</p>
        </div>
        <div className="bg-[#00539f] border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[12px] sm:px-[20px] py-[4px] flex-shrink-0">
          <p className="font-['Tesco_Modern'] font-bold text-[12px] sm:text-[14px] leading-[18px] text-white text-nowrap">Tesco Mobile</p>
        </div>
        <div className="bg-[#00539f] border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[12px] sm:px-[20px] py-[4px] flex-shrink-0">
          <p className="font-['Tesco_Modern'] font-bold text-[12px] sm:text-[14px] leading-[18px] text-white text-nowrap">Delivery saver</p>
        </div>
        <div className="bg-[#00539f] border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[12px] sm:px-[20px] py-[4px] flex-shrink-0">
          <p className="font-['Tesco_Modern'] font-bold text-[12px] sm:text-[14px] leading-[18px] text-white text-nowrap">Store locator</p>
        </div>
        <div className="bg-[#00539f] border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[12px] sm:px-[20px] py-[4px] flex-shrink-0">
          <p className="font-['Tesco_Modern'] font-bold text-[12px] sm:text-[14px] leading-[18px] text-white text-nowrap">My orders</p>
        </div>
        <div className="bg-[#00539f] border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[12px] sm:px-[20px] py-[4px] flex-shrink-0">
          <p className="font-['Tesco_Modern'] font-bold text-[12px] sm:text-[14px] leading-[18px] text-white text-nowrap">Help</p>
        </div>
        <div className="bg-[#00539f] border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[12px] sm:px-[20px] py-[4px] flex-shrink-0">
          <p className="font-['Tesco_Modern'] font-bold text-[12px] sm:text-[14px] leading-[18px] text-white text-nowrap">Feedback</p>
        </div>
        <div className="bg-[#00539f] border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[12px] sm:px-[20px] py-[4px] flex-shrink-0">
          <p className="font-['Tesco_Modern'] font-bold text-[12px] sm:text-[14px] leading-[18px] text-white text-nowrap">My account</p>
        </div>
        <div className="bg-[#00539f] border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[12px] sm:px-[20px] py-[4px] flex-shrink-0">
          <p className="font-['Tesco_Modern'] font-bold text-[12px] sm:text-[14px] leading-[18px] text-white text-nowrap">Sign out</p>
        </div>
        {/* Clickable F&F Logo - Switch to F&F Mode */}
        <button 
          onClick={onModeSwitch}
          className="bg-black border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center gap-[8px] px-[12px] sm:px-[20px] py-[4px] hover:bg-gray-800 transition-colors flex-shrink-0"
          title="Go to F&F"
        >
          <img src={FnfLogo} alt="F&F" width="53" height="16" />
          <p className="font-['F&F_Sans'] text-[12px] sm:text-[14px] leading-[18px] text-white text-nowrap">Clothing</p>
        </button>
      </div>

      {/* Desktop Main Header */}
      <div className="hidden sm:flex flex-row gap-[24px] items-center px-[12px] py-0 w-full">
        {/* Logo and Search */}
        <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[24px] items-stretch sm:items-center flex-1">
          {/* Tesco Logo */}
          <div className="flex items-center justify-center sm:justify-start h-[40px] sm:h-auto sm:py-2 flex-shrink-0">
            <img src={TescoLogo} 
            alt="Tesco" 
            width="120" 
            height="36" 
            className="h-[28px] sm:h-[36px] w-auto"
            />
          </div>

          {/* Search Container */}
          <form onSubmit={handleSubmit} className="flex-1 py-[8px] sm:py-[16px]">
            <div className="flex gap-[8px] sm:gap-[12px] items-center w-full">
              <div className="flex-1 flex items-center px-[8px] sm:px-[12px] py-[6px] sm:py-[8px] border border-[#666666] bg-white h-[36px] sm:h-[40px] relative">
                <div className="flex gap-[4px] items-center flex-1">
                  <img src={SearchIcon} alt="Search" width="20" height="20" className="sm:w-6 sm:h-6" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder="Search"
                    className="flex-1 outline-none font-['Tesco_Modern'] text-[14px] sm:text-[16px] leading-[20px] text-[#666666]"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="bg-[#00539f] rounded-[18px] sm:rounded-[20px] p-[6px] sm:p-[8px] flex items-center justify-center flex-shrink-0"
              >
                <img src={SearchIcon} alt="Search" width="20" height="20" className="sm:w-6 sm:h-6" />
              </button>
            </div>
          </form>
        </div>

        {/* Wishlist and Basket */}
        <div className="flex gap-[8px] sm:gap-[12px] items-center justify-end">
          {/* Wishlist */}
          <button onClick={onWishlistClick} className="hover:opacity-80 transition-opacity">
            <div className="bg-[#E81C2D] rounded-[18px] sm:rounded-[20px] p-[6px] sm:p-[8px] relative">
              <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {wishlistCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-white text-[#E81C2D] text-[10px] sm:text-[11px] leading-[10px] sm:leading-[11px] font-bold rounded-full min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] px-1 flex items-center justify-center">
                  {wishlistCount}
                </div>
              )}
            </div>
          </button>

          {/* Basket */}
          <button onClick={onBasketClick} className="flex items-center gap-[6px] sm:gap-[8px] hover:opacity-80 transition-opacity">
            <div className="bg-[#00539f] rounded-[18px] sm:rounded-[20px] p-[6px] sm:p-[8px] relative">
              <img src={BasketIcon} alt="Basket" width="20" height="20" className="sm:w-6 sm:h-6" />
              {basketCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-[#E81C2D] text-white text-[10px] sm:text-[11px] leading-[10px] sm:leading-[11px] font-bold rounded-full min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] px-1 flex items-center justify-center">
                  {basketCount}
                </div>
              )}
            </div>
            <div className="flex flex-col items-start justify-center hidden sm:flex">
              <p className="font-['Tesco_Modern'] font-bold text-[14px] sm:text-[16px] leading-[20px] text-[#00539f] text-nowrap">£{basketTotal.toFixed(2)}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Desktop Local Navigation */}
      <div className="bg-white hidden sm:flex gap-[16px] h-[44px] items-center w-full overflow-x-auto">
        <div className="flex gap-[4px] sm:gap-[8px] items-center px-[6px] sm:px-[8px] py-[10px] flex-shrink-0">
          <p className="font-['Tesco_Modern'] font-bold text-[14px] sm:text-[16px] leading-[20px] text-[#00539f] text-nowrap">All Departments</p>
          <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
            <path d="M6 9L12 15L18 9" stroke="#00539f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="px-[6px] sm:px-[8px] py-[12px] flex-shrink-0">
          <p className="font-['Tesco_Modern'] font-bold text-[14px] sm:text-[16px] leading-[20px] text-[#00539f] text-nowrap">Groceries & Essentials</p>
        </div>
        <div className="px-[6px] sm:px-[8px] py-[12px] flex-shrink-0">
          <p className="font-['Tesco_Modern'] font-bold text-[14px] sm:text-[16px] leading-[20px] text-[#00539f] text-nowrap">My Favourites</p>
        </div>
        <div className="px-[6px] sm:px-[8px] py-[12px] flex-shrink-0">
          <p className="font-['Tesco_Modern'] font-bold text-[14px] sm:text-[16px] leading-[20px] text-[#00539f] text-nowrap">Summer</p>
        </div>
        <div className="px-[6px] sm:px-[8px] py-[12px] flex-shrink-0">
          <p className="font-['Tesco_Modern'] font-bold text-[14px] sm:text-[16px] leading-[20px] text-[#00539f] text-nowrap">Tesco Clubcard</p>
        </div>
        <div className="px-[6px] sm:px-[8px] py-[12px] flex-shrink-0">
          <p className="font-['Tesco_Modern'] font-bold text-[14px] sm:text-[16px] leading-[20px] text-[#00539f] text-nowrap">Recipes</p>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#cccccc] h-px w-full" />
    </div>
  )
}

