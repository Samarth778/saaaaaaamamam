import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  MapPin, 
  Cpu, 
  Smartphone, 
  GitCompare, 
  Sparkles, 
  ShieldCheck, 
  BookmarkCheck, 
  Menu, 
  X,
  ChevronDown,
  User,
  LogOut,
  LogIn
} from 'lucide-react';
import { AuthUser } from '../utils/auth';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  savedDevicesCount: number;
  currentUser: AuthUser | null;
  onSignOut: () => void;
}

export const CITIES = ['Indore', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad'];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCity,
  setSelectedCity,
  savedDevicesCount,
  currentUser,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Smartphone },
    { id: 'products', label: 'Explore Devices', icon: Search },
    { id: 'parts', label: 'Spare Parts', icon: Wrench },
    { id: 'nearby', label: 'Find Nearby', icon: MapPin },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'ai-agent', label: 'RevTech AI', icon: Sparkles, badge: 'Smart' },
    { id: 'assistant', label: 'Diagnostics', icon: Cpu },
    { id: 'garage', label: 'My Devices', icon: BookmarkCheck, count: savedDevicesCount },
    { id: 'methodology', label: 'Methodology', icon: ShieldCheck },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#DCE4DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#174C3C] to-[#10382D] flex items-center justify-center text-white shadow-md shadow-[#174C3C]/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5 text-[#DCE9DF]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#10382D] font-mono">RevTech</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#EEF5EF] text-[#174C3C] border border-[#DCE9DF] rounded">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-[#5D6B63] font-medium hidden sm:block">
                Repairability & Spare Parts Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#EEF5EF] text-[#174C3C] shadow-xs'
                      : 'text-[#5D6B63] hover:text-[#10382D] hover:bg-[#F8FAF7]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#174C3C]' : 'text-[#78857D]'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1 py-0.2 text-[9px] font-bold bg-[#174C3C] text-white rounded">
                      {item.badge}
                    </span>
                  )}
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="w-4 h-4 text-[10px] font-bold bg-[#174C3C] text-white rounded-full flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#174C3C] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: City Selector + Auth + Ask AI */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* City Selector */}
            <div className="relative">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium bg-[#F8FAF7] hover:bg-[#EEF5EF] border border-[#DCE4DC] rounded-lg text-[#1B2722] transition-colors"
                title="Select City for Local Spare Parts & Service Centers"
              >
                <MapPin className="w-3.5 h-3.5 text-[#174C3C]" />
                <span className="font-semibold">{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-[#78857D]" />
              </button>

              {cityDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-44 bg-white border border-[#DCE4DC] rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setCityDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-[#78857D] border-b border-[#EFF3EE]">
                    Local Tech Hub
                  </div>
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F8FAF7] transition-colors ${
                        selectedCity === city ? 'font-bold text-[#174C3C] bg-[#EEF5EF]' : 'text-[#1B2722]'
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && <span className="w-1.5 h-1.5 rounded-full bg-[#174C3C]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Button or User Profile Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-xs font-bold bg-[#EEF5EF] hover:bg-[#DCE9DF] border border-[#DCE9DF] rounded-xl text-[#10382D] transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-[#174C3C] text-white flex items-center justify-center text-[10px]">
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[90px] truncate">{currentUser.fullName.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-[#78857D]" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-52 bg-white border border-[#DCE4DC] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-[#EFF3EE]">
                      <p className="text-xs font-bold text-[#10382D] truncate">{currentUser.fullName}</p>
                      <p className="text-[10px] text-[#78857D] truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 bg-[#EEF5EF] text-[#174C3C] rounded">
                        {currentUser.role}
                      </span>
                    </div>

                    <button
                      onClick={() => handleNavClick('auth')}
                      className="w-full text-left px-3 py-2 text-xs text-[#1B2722] hover:bg-[#F8FAF7] flex items-center space-x-2"
                    >
                      <User className="w-3.5 h-3.5 text-[#78857D]" />
                      <span>Account Profile</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('garage')}
                      className="w-full text-left px-3 py-2 text-xs text-[#1B2722] hover:bg-[#F8FAF7] flex items-center space-x-2"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-[#78857D]" />
                      <span>My Devices Garage</span>
                    </button>

                    <div className="border-t border-[#EFF3EE] mt-1 pt-1">
                      <button
                        onClick={() => {
                          onSignOut();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-[#B42318] hover:bg-red-50 flex items-center space-x-2 font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('auth')}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold bg-[#F8FAF7] hover:bg-[#EEF5EF] border border-[#DCE4DC] text-[#174C3C] rounded-xl transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Ask AI CTA */}
            <button
              onClick={() => handleNavClick('ai-agent')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#174C3C] hover:bg-[#10382D] text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#DCE9DF]" />
              <span>Ask RevTech AI</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center space-x-2">
            {!currentUser && (
              <button
                onClick={() => handleNavClick('auth')}
                className="px-2.5 py-1.5 bg-[#EEF5EF] text-[#174C3C] text-xs font-bold rounded-lg border border-[#DCE9DF]"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => handleNavClick('ai-agent')}
              className="px-2.5 py-1.5 bg-[#174C3C] text-white text-xs font-semibold rounded-lg flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-[#DCE9DF]" />
              <span>AI</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#10382D] hover:bg-[#EEF5EF] rounded-lg transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#174C3C]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-[#DCE4DC] px-4 pt-2 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2">
          
          {/* User Status Bar in Mobile */}
          <div className="py-2 border-b border-[#EFF3EE] flex items-center justify-between">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-[#174C3C] text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#10382D]">{currentUser.fullName}</p>
                  <p className="text-[10px] text-[#5D6B63]">{currentUser.role}</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('auth')}
                className="text-xs font-bold text-[#174C3C] flex items-center space-x-1"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </button>
            )}

            <div className="flex items-center space-x-2">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="text-xs font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-md px-2 py-1 text-[#174C3C]"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#174C3C] text-white'
                      : 'text-[#1B2722] hover:bg-[#EEF5EF]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-white text-[#174C3C]' : 'bg-[#174C3C] text-white'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {currentUser && (
            <div className="pt-2 border-t border-[#EFF3EE]">
              <button
                onClick={() => {
                  onSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-xs font-bold text-[#B42318] bg-red-50 rounded-xl"
              >
                Sign Out ({currentUser.email})
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
