import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  Search, 
  Filter, 
  MapPin, 
  Calculator, 
  Info, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Layers, 
  ChevronRight,
  Shield,
  ArrowUpDown,
  X
} from 'lucide-react';
import { SPARE_PARTS, PRODUCTS, SparePart } from '../data/revtechData';
import { calculateRepairEstimate } from '../utils/calculations';

interface SparePartsPageProps {
  onFindNearby: (componentName: string, productId: string) => void;
  onOpenCalculator: (partName: string, minCost: number, maxCost: number, labour: number) => void;
  initialProductId?: string;
  initialCategory?: string;
  selectedCity: string;
}

export const SparePartsPage: React.FC<SparePartsPageProps> = ({
  onFindNearby,
  onOpenCalculator,
  initialProductId,
  initialCategory,
  selectedCity,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<string>(initialProductId || 'All');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedPartType, setSelectedPartType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'availability'>('price-asc');
  
  // Detail modal
  const [activeDetailPart, setActiveDetailPart] = useState<SparePart | null>(null);

  const brands = ['All', 'Samsung', 'Apple', 'Google', 'OnePlus', 'Xiaomi', 'Nothing'];
  const categories = ['All', 'Battery', 'Display', 'Charging Port', 'Camera', 'Back Panel'];
  const partTypes = ['All', 'Original OEM', 'High-Grade Compatible', 'Refurbished Genuine'];

  // Filtered parts logic
  const filteredParts = useMemo(() => {
    return SPARE_PARTS.filter((part) => {
      if (selectedBrand !== 'All' && part.brand !== selectedBrand) return false;
      if (selectedProduct !== 'All' && part.productId !== selectedProduct) return false;
      if (selectedCategory !== 'All' && part.category !== selectedCategory) return false;
      if (selectedPartType !== 'All') {
        if (selectedPartType === 'Original OEM' && !part.partType.includes('Original OEM')) return false;
        if (selectedPartType === 'High-Grade Compatible' && !part.partType.includes('Compatible')) return false;
        if (selectedPartType === 'Refurbished Genuine' && !part.partType.includes('Refurbished')) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = part.componentName.toLowerCase().includes(q);
        const matchesProduct = part.productName.toLowerCase().includes(q);
        const matchesCategory = part.category.toLowerCase().includes(q);
        if (!matchesName && !matchesProduct && !matchesCategory) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.minPriceInr - b.minPriceInr;
      if (sortBy === 'price-desc') return b.maxPriceInr - a.maxPriceInr;
      if (sortBy === 'availability') {
        const getScore = (s: string) => (s.includes('In Stock') ? 3 : s.includes('Limited') ? 2 : 1);
        return getScore(b.availabilityStatus) - getScore(a.availabilityStatus);
      }
      return 0;
    });
  }, [selectedBrand, selectedProduct, selectedCategory, selectedPartType, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedBrand('All');
    setSelectedProduct('All');
    setSelectedCategory('All');
    setSelectedPartType('All');
    setSearchQuery('');
    setSortBy('price-asc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#DCE4DC] pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider mb-1">
              <Wrench className="w-4 h-4" />
              <span>Direct Component Directory</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#10382D]">
              Smartphone Spare Parts Registry
            </h1>
            <p className="text-sm text-[#5D6B63] mt-1">
              Verified component pricing, OEM vs compatible specifications, and certified bench repair estimates across {selectedCity}.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-[#5D6B63] bg-[#EEF5EF] px-3 py-1.5 rounded-lg border border-[#DCE9DF] font-semibold">
              Showing {filteredParts.length} verified listings
            </span>
          </div>
        </div>
      </div>

      {/* Guided 3-Step Filter Panel */}
      <div className="bg-white rounded-2xl border border-[#DCE4DC] p-5 shadow-xs space-y-5">
        
        {/* Step 1: Brand Quick-Tabs */}
        <div>
          <label className="text-xs font-bold text-[#78857D] uppercase tracking-wider block mb-2">
            Step 1: Filter by Smartphone Manufacturer
          </label>
          <div className="flex flex-wrap gap-2">
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => {
                  setSelectedBrand(b);
                  if (b !== 'All') {
                    // Reset product if not matching
                    const match = PRODUCTS.find((p) => p.brand === b);
                    if (match) setSelectedProduct(match.id);
                  } else {
                    setSelectedProduct('All');
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedBrand === b
                    ? 'bg-[#174C3C] text-white shadow-xs'
                    : 'bg-[#F8FAF7] text-[#5D6B63] hover:bg-[#EEF5EF] border border-[#DCE4DC]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Model & Category Dropdowns + Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-[#EFF3EE]">
          
          {/* Model Selector */}
          <div>
            <label className="text-[11px] font-bold text-[#78857D] uppercase tracking-wider block mb-1">
              Device Model
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full text-xs font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D] focus:border-[#174C3C] focus:outline-hidden"
            >
              <option value="All">All Supported Models</option>
              {PRODUCTS.filter((p) => selectedBrand === 'All' || p.brand === selectedBrand).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand} {p.modelName}
                </option>
              ))}
            </select>
          </div>

          {/* Component Category */}
          <div>
            <label className="text-[11px] font-bold text-[#78857D] uppercase tracking-wider block mb-1">
              Component Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D] focus:border-[#174C3C] focus:outline-hidden"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Component Types' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Part Type / Tier */}
          <div>
            <label className="text-[11px] font-bold text-[#78857D] uppercase tracking-wider block mb-1">
              Quality Grade / Origin
            </label>
            <select
              value={selectedPartType}
              onChange={(e) => setSelectedPartType(e.target.value)}
              className="w-full text-xs font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D] focus:border-[#174C3C] focus:outline-hidden"
            >
              {partTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="text-[11px] font-bold text-[#78857D] uppercase tracking-wider block mb-1">
              Keyword Search
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#78857D] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search battery, OLED, flex..."
                className="w-full text-xs font-medium bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl pl-8 pr-3 py-2 text-[#1B2722] focus:border-[#174C3C] focus:outline-hidden"
              />
            </div>
          </div>

        </div>

        {/* Sort & Reset Bar */}
        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-[#EFF3EE] gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[#78857D] font-medium flex items-center space-x-1">
              <ArrowUpDown className="w-3 h-3" />
              <span>Sort by:</span>
            </span>
            <button
              onClick={() => setSortBy('price-asc')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${
                sortBy === 'price-asc' ? 'bg-[#EEF5EF] text-[#174C3C]' : 'text-[#5D6B63] hover:text-[#10382D]'
              }`}
            >
              Lowest Price
            </button>
            <button
              onClick={() => setSortBy('price-desc')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${
                sortBy === 'price-desc' ? 'bg-[#EEF5EF] text-[#174C3C]' : 'text-[#5D6B63] hover:text-[#10382D]'
              }`}
            >
              Highest Price
            </button>
            <button
              onClick={() => setSortBy('availability')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${
                sortBy === 'availability' ? 'bg-[#EEF5EF] text-[#174C3C]' : 'text-[#5D6B63] hover:text-[#10382D]'
              }`}
            >
              Availability
            </button>
          </div>

          {(selectedBrand !== 'All' || selectedProduct !== 'All' || selectedCategory !== 'All' || selectedPartType !== 'All' || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#B42318] hover:underline font-semibold flex items-center space-x-1"
            >
              <X className="w-3 h-3" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

      </div>

      {/* Spare Parts Grid */}
      {filteredParts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#DCE4DC] p-12 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-[#9A6700] mx-auto" />
          <h3 className="text-base font-bold text-[#10382D]">No matching spare parts in catalog</h3>
          <p className="text-xs text-[#5D6B63] max-w-md mx-auto">
            Try adjusting your model or category filters. Our catalog focuses on core functional modules (batteries, display panels, charging sub-boards, cameras).
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#174C3C] text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParts.map((part) => {
            const isStocked = part.availabilityStatus.includes('In Stock');
            const isLimited = part.availabilityStatus.includes('Limited');

            return (
              <div
                key={part.id}
                className="bg-white rounded-2xl border border-[#DCE4DC] hover:border-[#174C3C] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 space-y-4">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#EEF5EF] text-[#174C3C] rounded-md border border-[#DCE9DF]">
                      {part.category}
                    </span>
                    <div className="flex items-center space-x-1 text-[11px] font-semibold">
                      <span className={`w-2 h-2 rounded-full ${isStocked ? 'bg-[#23734D]' : isLimited ? 'bg-[#9A6700]' : 'bg-[#285F8F]'}`} />
                      <span className={isStocked ? 'text-[#23734D]' : isLimited ? 'text-[#9A6700]' : 'text-[#285F8F]'}>
                        {part.availabilityStatus}
                      </span>
                    </div>
                  </div>

                  {/* Component Title & Device */}
                  <div>
                    <h3 className="text-base font-bold text-[#10382D] leading-snug">
                      {part.componentName}
                    </h3>
                    <p className="text-xs text-[#5D6B63] mt-1 font-medium">
                      Compatible with <strong className="text-[#10382D]">{part.productName}</strong>
                    </p>
                  </div>

                  {/* Part Type & Quality Tier */}
                  <div className="p-2.5 rounded-xl bg-[#F8FAF7] border border-[#EFF3EE] text-xs space-y-1">
                    <div className="flex justify-between items-center text-[#5D6B63]">
                      <span>Tier:</span>
                      <span className="font-semibold text-[#10382D] text-right truncate max-w-[190px]">
                        {part.partType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[#5D6B63]">
                      <span>Match Status:</span>
                      <span className="font-semibold text-[#174C3C]">
                        {part.compatibilityStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[#5D6B63]">
                      <span>Warranty:</span>
                      <span className="font-semibold text-[#10382D]">
                        {part.warrantyMonths} Months Included
                      </span>
                    </div>
                  </div>

                  {/* Pricing Matrix */}
                  <div className="pt-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-[#5D6B63] font-medium">Component Price:</span>
                      <span className="text-lg font-extrabold text-[#10382D] font-mono">
                        ₹{part.minPriceInr.toLocaleString('en-IN')} – ₹{part.maxPriceInr.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-[11px] text-[#78857D] mt-0.5">
                      <span>Est. Bench Labour:</span>
                      <span className="font-semibold text-[#5D6B63]">
                        +₹{part.labourEstimateInr.toLocaleString('en-IN')} (Typical)
                      </span>
                    </div>
                  </div>

                </div>

                {/* Card Action Buttons */}
                <div className="px-5 pb-5 pt-3 border-t border-[#EFF3EE] space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onFindNearby(part.category, part.productId)}
                      className="py-2 px-2 text-xs font-bold bg-[#EEF5EF] text-[#174C3C] hover:bg-[#DCE9DF] rounded-xl transition-colors flex items-center justify-center space-x-1"
                      title="Locate service centers stocking this component"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Find Shops</span>
                    </button>
                    <button
                      onClick={() => onOpenCalculator(part.componentName, part.minPriceInr, part.maxPriceInr, part.labourEstimateInr)}
                      className="py-2 px-2 text-xs font-bold bg-[#174C3C] text-white hover:bg-[#10382D] rounded-xl transition-colors flex items-center justify-center space-x-1"
                      title="Calculate total repair vs replacement cost"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Estimate Cost</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveDetailPart(part)}
                    className="w-full py-1.5 text-center text-[11px] font-semibold text-[#5D6B63] hover:text-[#10382D] transition-colors"
                  >
                    View Technical Specifications & Compatibility →
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Part Technical Spec Modal */}
      {activeDetailPart && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DCE4DC] space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#EEF5EF] text-[#174C3C] rounded">
                  {activeDetailPart.category}
                </span>
                <h3 className="text-lg font-bold text-[#10382D] mt-1">
                  {activeDetailPart.componentName}
                </h3>
                <p className="text-xs text-[#5D6B63]">
                  Compatible with {activeDetailPart.productName}
                </p>
              </div>
              <button
                onClick={() => setActiveDetailPart(null)}
                className="p-1.5 text-[#78857D] hover:text-[#10382D] rounded-lg hover:bg-[#EFF3EE]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#F8FAF7] rounded-xl border border-[#EFF3EE]">
                <div>
                  <span className="text-[#78857D] block">Price Range (Part Only):</span>
                  <span className="font-extrabold text-[#10382D] text-sm font-mono">
                    ₹{activeDetailPart.minPriceInr.toLocaleString('en-IN')} – ₹{activeDetailPart.maxPriceInr.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[#78857D] block">Estimated Labour Charge:</span>
                  <span className="font-extrabold text-[#10382D] text-sm font-mono">
                    ₹{activeDetailPart.labourEstimateInr.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t border-[#EFF3EE] pt-3">
                <div className="flex justify-between py-1 border-b border-[#F8FAF7]">
                  <span className="text-[#78857D]">Part Origin / Grade:</span>
                  <span className="font-semibold text-[#10382D]">{activeDetailPart.partType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAF7]">
                  <span className="text-[#78857D]">Installation Complexity:</span>
                  <span className="font-semibold text-[#10382D]">{activeDetailPart.installationDifficulty}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F8FAF7]">
                  <span className="text-[#78857D]">Warranty Coverage:</span>
                  <span className="font-semibold text-[#23734D]">{activeDetailPart.warrantyMonths} Months Replacement</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#78857D]">Compatible Model Codes:</span>
                  <span className="font-mono text-[11px] text-[#10382D]">{activeDetailPart.compatibleModels.join(', ')}</span>
                </div>
              </div>

              <div className="p-3 bg-[#EEF5EF] rounded-xl text-[11px] text-[#174C3C] leading-relaxed">
                <Shield className="w-4 h-4 inline mr-1 text-[#174C3C]" />
                <strong>Technician Advisory:</strong> Always verify that display replacements retain biometric optical fingerprint sensitivity and TrueTone/ambient color calibration.
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  const part = activeDetailPart;
                  setActiveDetailPart(null);
                  onFindNearby(part.category, part.productId);
                }}
                className="flex-1 py-2.5 bg-[#174C3C] text-white text-xs font-bold rounded-xl hover:bg-[#10382D] transition-colors"
              >
                Find Nearby Repair Shops
              </button>
              <button
                onClick={() => setActiveDetailPart(null)}
                className="px-4 py-2.5 bg-[#EFF3EE] text-[#5D6B63] text-xs font-bold rounded-xl hover:bg-[#DCE4DC] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
