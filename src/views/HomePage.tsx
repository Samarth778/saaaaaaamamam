import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  TrendingDown, 
  Zap, 
  Cpu, 
  BarChart3, 
  ChevronRight,
  Clock,
  Star
} from 'lucide-react';
import { PRODUCTS, SPARE_PARTS, PRODUCT_REVIEWS } from '../data/revtechData';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  onSelectProduct: (productId: string) => void;
  onSelectComponent: (componentCategory: string, productId?: string) => void;
  onStartScenario: (scenario: 's23-screen' | 'ip14-battery' | 'redmi-buy') => void;
  selectedCity: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  setActiveTab,
  onSelectProduct,
  onSelectComponent,
  onStartScenario,
  selectedCity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Search suggestions: filter products & parts
  const filteredProducts = PRODUCTS.filter(
    (p) =>
      p.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredParts = SPARE_PARTS.filter(
    (p) =>
      p.componentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (filteredProducts.length > 0) {
      onSelectProduct(filteredProducts[0].id);
      setActiveTab('products');
    } else {
      setActiveTab('parts');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 bg-gradient-to-b from-[#EEF5EF] via-[#F8FAF7] to-[#F8FAF7] border-b border-[#DCE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border border-[#DCE4DC] rounded-full shadow-xs text-xs font-semibold text-[#174C3C]">
              <span className="w-2 h-2 rounded-full bg-[#23734D] animate-pulse" />
              <span>India's Consumer Electronics Repair & Parts Registry</span>
              <span className="text-[#78857D]">•</span>
              <span className="text-[#5D6B63]">{selectedCity} Hub Active</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#10382D] leading-[1.15]">
              Don’t replace it <br className="hidden sm:inline" />
              <span className="text-[#174C3C] bg-gradient-to-r from-[#174C3C] to-[#23734D] bg-clip-text text-transparent">
                before you check.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-[#5D6B63] max-w-2xl mx-auto leading-relaxed">
              Find authentic spare parts, discover verified local repair specialists, and let <strong className="text-[#10382D] font-semibold">RevTech AI</strong> calculate whether to repair, replace, or buy smarter.
            </p>

            {/* Main Interactive Search Input */}
            <div className="relative max-w-2xl mx-auto mt-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex items-center bg-white rounded-2xl shadow-lg shadow-[#174C3C]/5 border-2 border-[#DCE4DC] focus-within:border-[#174C3C] transition-all p-1.5 sm:p-2">
                  <div className="pl-3 sm:pl-4 pr-2 text-[#78857D]">
                    <Search className="w-5 h-5 text-[#174C3C]" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search phone model (e.g. Galaxy S23, iPhone 14) or part..."
                    className="w-full text-sm sm:text-base font-medium text-[#1B2722] placeholder-[#78857D] focus:outline-hidden py-2"
                  />
                  <button
                    type="submit"
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#174C3C] hover:bg-[#10382D] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all shrink-0 flex items-center space-x-1.5"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Instant Dropdown Suggestions */}
              {showSuggestions && searchQuery.trim().length > 0 && (
                <div 
                  className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#DCE4DC] p-3 z-50 text-left space-y-3"
                  onMouseLeave={() => setShowSuggestions(false)}
                >
                  {filteredProducts.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#78857D] px-2 py-1">
                        Matching Devices
                      </p>
                      <div className="space-y-1">
                        {filteredProducts.slice(0, 3).map((p) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              onSelectProduct(p.id);
                              setActiveTab('products');
                              setShowSuggestions(false);
                            }}
                            className="flex items-center justify-between p-2 hover:bg-[#EEF5EF] rounded-xl cursor-pointer transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <img src={p.image} alt={p.modelName} className="w-8 h-8 rounded-lg object-cover" />
                              <div>
                                <p className="text-xs font-bold text-[#10382D]">{p.brand} {p.modelName}</p>
                                <p className="text-[10px] text-[#5D6B63]">₹{p.priceInr.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold text-[#174C3C] bg-[#EEF5EF] px-2 py-0.5 rounded">
                              Score {p.repairabilityScore}/10
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredParts.length > 0 && (
                    <div className="pt-2 border-t border-[#EFF3EE]">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#78857D] px-2 py-1">
                        Matching Spare Parts
                      </p>
                      <div className="space-y-1">
                        {filteredParts.slice(0, 3).map((sp) => (
                          <div
                            key={sp.id}
                            onClick={() => {
                              onSelectComponent(sp.category, sp.productId);
                              setActiveTab('parts');
                              setShowSuggestions(false);
                            }}
                            className="flex items-center justify-between p-2 hover:bg-[#EEF5EF] rounded-xl cursor-pointer transition-colors"
                          >
                            <div>
                              <p className="text-xs font-bold text-[#10382D]">{sp.componentName}</p>
                              <p className="text-[10px] text-[#5D6B63]">Compatible with {sp.productName}</p>
                            </div>
                            <span className="text-xs font-bold text-[#10382D]">
                              ₹{sp.minPriceInr.toLocaleString('en-IN')} - ₹{sp.maxPriceInr.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredProducts.length === 0 && filteredParts.length === 0 && (
                    <div className="p-4 text-center text-xs text-[#78857D]">
                      No exact match found in catalog. Try "Galaxy S23", "iPhone 14 Display", or "Battery".
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Action Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-xs text-[#78857D] font-medium">Quick explore:</span>
              <button
                onClick={() => onStartScenario('s23-screen')}
                className="px-3 py-1 bg-white hover:bg-[#EEF5EF] border border-[#DCE4DC] text-[#174C3C] text-xs font-medium rounded-full transition-colors"
              >
                Galaxy S23 Display
              </button>
              <button
                onClick={() => onStartScenario('ip14-battery')}
                className="px-3 py-1 bg-white hover:bg-[#EEF5EF] border border-[#DCE4DC] text-[#174C3C] text-xs font-medium rounded-full transition-colors"
              >
                iPhone 14 Battery
              </button>
              <button
                onClick={() => onStartScenario('redmi-buy')}
                className="px-3 py-1 bg-white hover:bg-[#EEF5EF] border border-[#DCE4DC] text-[#174C3C] text-xs font-medium rounded-full transition-colors"
              >
                Redmi Note 13 Pro+ Worth Buying?
              </button>
            </div>

          </div>

          {/* 3 Core Quick-Action Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12 sm:mt-16">
            
            {/* Card 1: Spare Parts Finder */}
            <div 
              onClick={() => setActiveTab('parts')}
              className="bg-white rounded-2xl p-6 border border-[#DCE4DC] hover:border-[#174C3C] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EEF5EF] group-hover:bg-[#174C3C] flex items-center justify-center text-[#174C3C] group-hover:text-white transition-colors mb-4">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#10382D] group-hover:text-[#174C3C] transition-colors">
                  Spare Parts Registry
                </h3>
                <p className="text-xs text-[#5D6B63] mt-2 leading-relaxed">
                  Look up OEM batteries, AMOLED screens, and charging boards with transparent Indian market pricing and verified compatibility tags.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-[#174C3C] space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Explore Spare Parts</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Card 2: Nearby Repair Finder */}
            <div 
              onClick={() => setActiveTab('nearby')}
              className="bg-white rounded-2xl p-6 border border-[#DCE4DC] hover:border-[#174C3C] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EEF5EF] group-hover:bg-[#174C3C] flex items-center justify-center text-[#174C3C] group-hover:text-white transition-colors mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#10382D] group-hover:text-[#174C3C] transition-colors">
                  Verified Local Repair
                </h3>
                <p className="text-xs text-[#5D6B63] mt-2 leading-relaxed">
                  Find manufacturer-authorized centers and vetted chip-level repair labs across {selectedCity} with verified turnaround times.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-[#174C3C] space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Locate Centers in {selectedCity}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Card 3: RevTech AI Agent */}
            <div 
              onClick={() => setActiveTab('ai-agent')}
              className="bg-gradient-to-br from-[#10382D] to-[#174C3C] text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24" />
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#DCE9DF] mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>RevTech AI Advisor</span>
                  <span className="text-[10px] font-bold bg-[#23734D] text-white px-2 py-0.5 rounded-full uppercase">
                    3.8 Flash
                  </span>
                </h3>
                <p className="text-xs text-[#DCE9DF]/90 mt-2 leading-relaxed">
                  Evaluate whether fixing your phone makes financial sense over a 24-month horizon, or analyze if a new device is truly worth buying.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-[#DCE9DF] space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Start AI Analysis</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

          </div>

          {/* Live Data Ticker Stats */}
          <div className="max-w-5xl mx-auto mt-12 bg-white rounded-2xl border border-[#DCE4DC] p-4 sm:p-6 shadow-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#EFF3EE]">
              <div className="px-2 pt-2 md:pt-0">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#10382D] font-mono">₹22,400</p>
                <p className="text-[11px] font-semibold text-[#5D6B63] mt-1">Average Repair Savings</p>
              </div>
              <div className="px-2 pt-2 md:pt-0">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#174C3C] font-mono">94%</p>
                <p className="text-[11px] font-semibold text-[#5D6B63] mt-1">Parts Verified Availability</p>
              </div>
              <div className="px-2 pt-2 md:pt-0">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#10382D] font-mono">8.6/10</p>
                <p className="text-[11px] font-semibold text-[#5D6B63] mt-1">Highest Repair Index</p>
              </div>
              <div className="px-2 pt-2 md:pt-0">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#23734D] font-mono">4.8 ★</p>
                <p className="text-[11px] font-semibold text-[#5D6B63] mt-1">Verified Care Satisfaction</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED SMARTPHONES & REPAIRABILITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 space-y-2 sm:space-y-0">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider">
              <BarChart3 className="w-4 h-4" />
              <span>Consumer Hardware Index</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10382D] mt-1">
              Featured Devices & Repair Scores
            </h2>
            <p className="text-xs sm:text-sm text-[#5D6B63] mt-1">
              Evaluated on spare parts liquidity, screen replacement affordability, and disassembly ergonomics.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('products')}
            className="flex items-center space-x-1.5 text-xs font-bold text-[#174C3C] hover:text-[#10382D] bg-[#EEF5EF] px-3.5 py-2 rounded-xl transition-colors"
          >
            <span>View All Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.slice(0, 3).map((product) => {
            const partsForProduct = SPARE_PARTS.filter((p) => p.productId === product.id);
            const batteryPart = partsForProduct.find((p) => p.category === 'Battery');
            const displayPart = partsForProduct.find((p) => p.category === 'Display');

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-[#DCE4DC] hover:border-[#174C3C] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#78857D] uppercase tracking-wider">
                        {product.brand}
                      </span>
                      <h3 className="text-lg font-bold text-[#10382D] mt-0.5">
                        {product.modelName}
                      </h3>
                      <p className="text-xs text-[#5D6B63]">{product.variant}</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#EEF5EF] text-[#174C3C] border border-[#DCE9DF] font-bold text-xs">
                        Score {product.repairabilityScore}/10
                      </div>
                      <p className="text-[11px] text-[#78857D] mt-1 font-mono">
                        ₹{product.priceInr.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Device Image */}
                  <div className="my-4 h-44 rounded-xl overflow-hidden bg-[#EFF3EE] relative">
                    <img 
                      src={product.image} 
                      alt={product.modelName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold rounded-md">
                      {partsForProduct.length} Verified Components Listed
                    </div>
                  </div>

                  {/* Key Spare Parts Summary */}
                  <div className="space-y-2 bg-[#F8FAF7] p-3 rounded-xl border border-[#EFF3EE] text-xs">
                    <div className="flex justify-between items-center text-[#5D6B63]">
                      <span>Battery Replacement:</span>
                      <span className="font-bold text-[#10382D]">
                        {batteryPart ? `₹${batteryPart.minPriceInr.toLocaleString('en-IN')} - ₹${batteryPart.maxPriceInr.toLocaleString('en-IN')}` : 'Inquire'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[#5D6B63]">
                      <span>Display Replacement:</span>
                      <span className="font-bold text-[#10382D]">
                        {displayPart ? `₹${displayPart.minPriceInr.toLocaleString('en-IN')} - ₹${displayPart.maxPriceInr.toLocaleString('en-IN')}` : 'Inquire'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-5 pb-5 pt-2 border-t border-[#EFF3EE] flex items-center space-x-2">
                  <button
                    onClick={() => {
                      onSelectProduct(product.id);
                      setActiveTab('parts');
                    }}
                    className="flex-1 py-2 px-3 text-xs font-bold bg-[#EEF5EF] text-[#174C3C] hover:bg-[#DCE9DF] rounded-xl transition-colors text-center"
                  >
                    View Parts
                  </button>
                  <button
                    onClick={() => {
                      onSelectProduct(product.id);
                      setActiveTab('ai-agent');
                    }}
                    className="flex-1 py-2 px-3 text-xs font-bold bg-[#174C3C] text-white hover:bg-[#10382D] rounded-xl transition-colors text-center flex items-center justify-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#DCE9DF]" />
                    <span>Ask AI</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3 PRE-CONFIGURED SCENARIO TEST DRIVES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#EEF5EF] rounded-3xl p-6 sm:p-10 border border-[#DCE4DC]">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-[#174C3C] uppercase tracking-wider">
              Interactive Decision Scenarios
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10382D] mt-1">
              Test Real-World Smartphone Dilemmas
            </h2>
            <p className="text-xs sm:text-sm text-[#5D6B63] mt-1">
              Select a pre-configured case study to see how RevTech solves genuine consumer hardware problems with transparent calculations and AI reasoning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Scenario 1 */}
            <div className="bg-white rounded-2xl p-6 border border-[#DCE4DC] shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
                  Scenario 1 • Spare Parts Discovery
                </span>
                <h3 className="text-base font-bold text-[#10382D] mt-3">
                  Samsung S23 Cracked Display
                </h3>
                <p className="text-xs text-[#5D6B63] mt-2 leading-relaxed">
                  User cracked their front glass. Compare OEM display modules with high-grade compatible options, check bench labour charges, and discover nearby service centers in {selectedCity}.
                </p>
              </div>
              <button
                onClick={() => onStartScenario('s23-screen')}
                className="w-full py-2.5 px-3 bg-[#174C3C] text-white text-xs font-bold rounded-xl hover:bg-[#10382D] transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>Run Scenario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scenario 2 */}
            <div className="bg-white rounded-2xl p-6 border border-[#DCE4DC] shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md">
                  Scenario 2 • Repair vs. Replace
                </span>
                <h3 className="text-base font-bold text-[#10382D] mt-3">
                  iPhone 14 Battery at 78% SOH
                </h3>
                <p className="text-xs text-[#5D6B63] mt-2 leading-relaxed">
                  Device is 22 months old with battery throttling. Calculate whether a ₹5,500 battery swap or buying an iPhone 15/16 yields lower monthly amortized cost over 24 months.
                </p>
              </div>
              <button
                onClick={() => onStartScenario('ip14-battery')}
                className="w-full py-2.5 px-3 bg-[#174C3C] text-white text-xs font-bold rounded-xl hover:bg-[#10382D] transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>Run Scenario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scenario 3 */}
            <div className="bg-white rounded-2xl p-6 border border-[#DCE4DC] shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-md">
                  Scenario 3 • Pre-Purchase Analysis
                </span>
                <h3 className="text-base font-bold text-[#10382D] mt-3">
                  Is Redmi Note 13 Pro+ Worth Buying?
                </h3>
                <p className="text-xs text-[#5D6B63] mt-2 leading-relaxed">
                  Evaluate whether its 8.6/10 repairability index, affordable curved display replacement (₹4,800), and 4-year security patch support justify purchase over rival flagships.
                </p>
              </div>
              <button
                onClick={() => onStartScenario('redmi-buy')}
                className="w-full py-2.5 px-3 bg-[#174C3C] text-white text-xs font-bold rounded-xl hover:bg-[#10382D] transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>Run Scenario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* HOW REVTECH WORKS: 3-STEP DISCOVERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#174C3C] uppercase tracking-wider">
            Clear, Transparent Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10382D] mt-1">
            How RevTech Puts You in Control
          </h2>
          <p className="text-xs sm:text-sm text-[#5D6B63] mt-1">
            Stop relying on vague repair quotes or aggressive retail sales pitches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          <div className="bg-white p-6 rounded-2xl border border-[#DCE4DC] text-center space-y-3 relative">
            <div className="w-10 h-10 rounded-full bg-[#174C3C] text-white font-mono font-bold flex items-center justify-center mx-auto text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-[#10382D]">Select Device or Fault</h3>
            <p className="text-xs text-[#5D6B63] leading-relaxed">
              Identify your exact model variant and problem component (battery degradation, broken glass, charging flex failure).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DCE4DC] text-center space-y-3 relative">
            <div className="w-10 h-10 rounded-full bg-[#174C3C] text-white font-mono font-bold flex items-center justify-center mx-auto text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-[#10382D]">Compare Parts & Local Quotes</h3>
            <p className="text-xs text-[#5D6B63] leading-relaxed">
              Review verified part price ranges in ₹, understand OEM vs aftermarket tolerances, and see certified service hubs nearby.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DCE4DC] text-center space-y-3 relative">
            <div className="w-10 h-10 rounded-full bg-[#174C3C] text-white font-mono font-bold flex items-center justify-center mx-auto text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-[#10382D]">RevTech AI Economic Verdict</h3>
            <p className="text-xs text-[#5D6B63] leading-relaxed">
              Receive a math-backed recommendation on whether repairing saves money or if replacement is the smarter long-term move.
            </p>
          </div>

        </div>
      </section>

      {/* VERIFIED COMMUNITY & TECHNICIAN REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#174C3C] uppercase tracking-wider">
              Field Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10382D] mt-1">
              Technician Notes & Long-Term Reviews
            </h2>
            <p className="text-xs sm:text-sm text-[#5D6B63]">
              Real teardown experiences and long-term ownership feedback on display durability and battery longevity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRODUCT_REVIEWS.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-[#DCE4DC] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#78857D] mb-2">
                  <span className="font-semibold text-[#10382D]">{rev.author}</span>
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold text-[#10382D] ml-1">{rev.rating}</span>
                  </div>
                </div>
                <div className="inline-block px-2 py-0.5 bg-[#EEF5EF] text-[#174C3C] text-[10px] font-bold rounded mb-2">
                  {rev.role}
                </div>
                <h4 className="text-sm font-bold text-[#10382D]">{rev.title}</h4>
                <p className="text-xs text-[#5D6B63] mt-2 leading-relaxed">
                  "{rev.content.slice(0, 160)}..."
                </p>
              </div>

              <div className="pt-3 border-t border-[#EFF3EE] text-[11px] text-[#174C3C] font-medium bg-[#F8FAF7] p-2.5 rounded-xl">
                <span className="font-bold">Hardware Insight:</span> {rev.repairabilityInsight}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
