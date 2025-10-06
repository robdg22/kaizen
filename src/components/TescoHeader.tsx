import TescoLogo from '../../assets/icons/Tesco Logos.svg'
import BasketIcon from '../../assets/icons/Icon buttons/24px Icons/Basket.svg'
import SearchIcon from '../../assets/icons/Property header/Icon buttons/24px Icons/Search.svg'

interface TescoHeaderProps {
  basketTotal: number
  basketCount: number
  onSearch: (query: string) => void
  onModeSwitch: () => void
  searchQuery: string
  onQueryChange: (query: string) => void
  isVisible?: boolean
  onBasketClick: () => void
}

export default function TescoHeader({ 
  basketTotal,
  basketCount,
  onSearch, 
  onModeSwitch, 
  searchQuery, 
  onQueryChange,
  isVisible = true,
  onBasketClick
}: TescoHeaderProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <div className={`flex flex-col items-start w-full bg-white sticky top-0 z-[200] transition-transform duration-300 ease-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      {/* Utility Bar */}
      <div className="bg-[#00539f] w-full h-[32px] flex items-center justify-end">
        <div className="bg-[#00539f] border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[20px] py-[4px]">
          <p className="font-['Tesco_Modern'] font-bold text-[14px] leading-[18px] text-white text-nowrap">Tesco Bank</p>
        </div>
        <div className="bg-[#00539f] border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[20px] py-[4px]">
          <p className="font-['Tesco_Modern'] font-bold text-[14px] leading-[18px] text-white text-nowrap">Tesco Mobile</p>
        </div>
        <div className="bg-[#00539f] border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[20px] py-[4px]">
          <p className="font-['Tesco_Modern'] font-bold text-[14px] leading-[18px] text-white text-nowrap">Delivery saver</p>
        </div>
        <div className="bg-[#00539f] border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[20px] py-[4px]">
          <p className="font-['Tesco_Modern'] font-bold text-[14px] leading-[18px] text-white text-nowrap">Store locator</p>
        </div>
        <div className="bg-[#00539f] border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[20px] py-[4px]">
          <p className="font-['Tesco_Modern'] font-bold text-[14px] leading-[18px] text-white text-nowrap">My orders</p>
        </div>
        <div className="bg-[#00539f] border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[20px] py-[4px]">
          <p className="font-['Tesco_Modern'] font-bold text-[14px] leading-[18px] text-white text-nowrap">Help</p>
        </div>
        <div className="bg-[#00539f] border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[20px] py-[4px]">
          <p className="font-['Tesco_Modern'] font-bold text-[14px] leading-[18px] text-white text-nowrap">Feedback</p>
        </div>
        <div className="bg-[#00539f] border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[20px] py-[4px]">
          <p className="font-['Tesco_Modern'] font-bold text-[14px] leading-[18px] text-white text-nowrap">My account</p>
        </div>
        <div className="bg-[#00539f] border-l border-[rgba(255,255,255,0.4)] h-[32px] flex items-center justify-center px-[20px] py-[4px]">
          <p className="font-['Tesco_Modern'] font-bold text-[14px] leading-[18px] text-white text-nowrap">Sign out</p>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex gap-[24px] items-center px-[12px] py-0 w-full">
        {/* Logo and Search */}
        <div className="flex gap-[24px] items-center flex-1">
          {/* Tesco Logo */}
          <div className="flex flex-col items-start justify-center h-full py-2">
            <img src={TescoLogo} 
            alt="Tesco" 
            width="120" 
            height="36" 
            />
          </div>

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
                    className="flex-1 outline-none font-['Tesco_Modern'] text-[16px] leading-[20px] text-[#666666]"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="bg-[#00539f] rounded-[20px] p-[8px] flex items-center justify-center"
              >
                <img src={SearchIcon} alt="Search" width="24" height="24" />
              </button>
            </div>
          </form>
        </div>

        {/* Basket */}
        <button onClick={onBasketClick} className="flex gap-[24px] items-start justify-end hover:opacity-80 transition-opacity">
          <div className="flex items-center gap-[8px]">
            <div className="bg-[#00539f] rounded-[20px] p-[8px] relative">
              <img src={BasketIcon} alt="Basket" width="24" height="24" />
              {basketCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-[#E81C2D] text-white text-[11px] leading-[11px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {basketCount}
                </div>
              )}
            </div>
            <div className="flex flex-col items-start justify-center">
              <p className="font-['Tesco_Modern'] font-bold text-[16px] leading-[20px] text-[#00539f] text-nowrap">£{basketTotal.toFixed(2)}</p>
            </div>
          </div>
        </button>
      </div>

      {/* Local Navigation */}
      <div className="bg-white flex gap-[16px] h-[44px] items-center w-full">
        <div className="flex gap-[8px] items-center px-[8px] py-[10px]">
          <p className="font-['Tesco_Modern'] font-bold text-[16px] leading-[20px] text-[#00539f] text-nowrap">All Departments</p>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 9L12 15L18 9" stroke="#00539f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="px-[8px] py-[12px]">
          <p className="font-['Tesco_Modern'] font-bold text-[16px] leading-[20px] text-[#00539f] text-nowrap">Groceries & Essentials</p>
        </div>
        <button 
          onClick={onModeSwitch}
          className="bg-black px-[8px] py-[8px] hover:bg-gray-800 transition-colors"
        >
          <p className="font-['Tesco_Modern'] font-bold text-[16px] leading-[20px] text-white text-nowrap">F&F Clothing</p>
        </button>
        <div className="px-[8px] py-[12px]">
          <p className="font-['Tesco_Modern'] font-bold text-[16px] leading-[20px] text-[#00539f] text-nowrap">My Favourites</p>
        </div>
        <div className="px-[8px] py-[12px]">
          <p className="font-['Tesco_Modern'] font-bold text-[16px] leading-[20px] text-[#00539f] text-nowrap">Summer</p>
        </div>
        <div className="px-[8px] py-[12px]">
          <p className="font-['Tesco_Modern'] font-bold text-[16px] leading-[20px] text-[#00539f] text-nowrap">Tesco Clubcard</p>
        </div>
        <div className="px-[8px] py-[12px]">
          <p className="font-['Tesco_Modern'] font-bold text-[16px] leading-[20px] text-[#00539f] text-nowrap">Recipes</p>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#cccccc] h-px w-full" />
    </div>
  )
}

