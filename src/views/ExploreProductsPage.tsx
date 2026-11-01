import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  BarChart3, 
  Wrench, 
  Sparkles, 
  GitCompare, 
  ShieldCheck, 
  ArrowRight, 
  X, 
  Check, 
  ExternalLink,
  Star
} from 'lucide-react';
import { PRODUCTS, SPARE_PARTS, PRODUCT_REVIEWS, Product } from '../data/revtechData';

interface ExploreProductsPageProps {
  onSelectProductForParts: (productId: string) => void;
  onAskAIAboutProduct: (productId: string) => void;
  comparisonList: string[];
  setComparisonList: React.Dispatch<React.SetStateAction<string[]>>;
  onGoToCompare: () => void;
  initialProductId?: string;
}

export const ExploreProductsPage: React.FC<ExploreProductsPageProps> = ({
  onSelectProductForParts,
  onAskAIAboutProduct,
  comparisonList,
  setComparisonList,
  onGoToCompare,
  initialProductId,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [minScore, setMinScore] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(
    initialProductId ? PRODUCTS.find((p) => p.id === initialProductId) || null : null
  );

  const brands = ['All', 'Samsung', 'Apple', 'Google', 'OnePlus', 'Xiaomi', 'Nothing'];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;
      if (p.repairabilityScore < minScore) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.modelName.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchCategory) return false;
      }
      return true;
    });
  }, [selectedBrand, minScore, searchQuery]);

  const toggleCompare = (productId: string) => {
    if (comparisonList.includes(productId)) {
      setComparisonList(comparisonList.filter((id) => id !== productId));
    } else {
      if (comparisonList.length >= 3) {
        alert('You can compare a maximum of 3 devices simultaneously.');
        return;
      }
      setComparisonList([...comparisonList, productId]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#DCE4DC] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider mb-1">
            <Search className="w-4 h-4" />
            <span>Hardware Registry</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#10382D]">
            Explore Smartphones & Repairability
          </h1>
          <p className="text-sm text-[#5D6B63] mt-1">
            Objective ratings based on spare-parts availability, repair affordability, and internal modularity.
          </p>
        </div>

        {/* Comparison Floating Badge */}
        {comparisonList.length > 0 && (
          <div className="flex items-center space-x-3 bg-[#EEF5EF] p-2.5 rounded-2xl border border-[#DCE9DF]">
            <span className="text-xs font-bold text-[#174C3C]">
              {comparisonList.length} / 3 Devices Selected
            </span>
            <button
              onClick={onGoToCompare}
              className="py-1.5 px-3 bg-[#174C3C] hover:bg-[#10382D] text-white text-xs font-bold rounded-xl flex items-center space-x-1"
            >
              <span>Compare Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#DCE4DC] p-5 shadow-xs space-y-4">
        
        {/* Brand Tabs */}
        <div>
          <label className="text-[11px] font-bold text-[#78857D] uppercase tracking-wider block mb-2">
            Manufacturer:
          </label>
          <div className="flex flex-wrap gap-2">
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
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

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#EFF3EE]">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#78857D] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search model name (e.g. Pixel 7a, iPhone 14)..."
              className="w-full text-xs font-medium bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl pl-9 pr-3 py-2 text-[#1B2722] focus:border-[#174C3C]"
            />
          </div>

          {/* Min Repairability Score */}
          <div className="flex items-center space-x-3 bg-[#F8FAF7] px-3 py-1.5 rounded-xl border border-[#DCE4DC]">
            <span className="text-xs text-[#5D6B63] font-semibold whitespace-nowrap">
              Min. Score: {minScore}/10
            </span>
            <input
              type="range"
              min="0"
              max="9"
              step="1"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full accent-[#174C3C]"
            />
          </div>
        </div>

      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const parts = SPARE_PARTS.filter((p) => p.productId === product.id);
          const batteryPart = parts.find((p) => p.category === 'Battery');
          const displayPart = parts.find((p) => p.category === 'Display');
          const isComparing = comparisonList.includes(product.id);

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-[#DCE4DC] hover:border-[#174C3C] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-4">
                
                {/* Top Row: Brand & Repairability Pill */}
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
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-[#EEF5EF] text-[#174C3C] border border-[#DCE9DF] font-bold text-xs">
                      Score {product.repairabilityScore}/10
                    </span>
                    <p className="text-xs font-bold text-[#10382D] font-mono mt-1">
                      ₹{product.priceInr.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Device Image */}
                <div 
                  onClick={() => setActiveDetailProduct(product)}
                  className="h-44 rounded-xl overflow-hidden bg-[#EFF3EE] relative cursor-pointer group"
                >
                  <img 
                    src={product.image} 
                    alt={product.modelName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                    Click for Hardware Profile & Breakdown
                  </div>
                </div>

                {/* Repairability Factor Radar Preview */}
                <div className="space-y-1.5 text-[11px] bg-[#F8FAF7] p-3 rounded-xl border border-[#EFF3EE]">
                  <div className="flex justify-between text-[#5D6B63]">
                    <span>Spare Parts Availability:</span>
                    <span className="font-bold text-[#10382D]">{product.scoreFactors.partsAvailability}/10</span>
                  </div>
                  <div className="flex justify-between text-[#5D6B63]">
                    <span>Repair Affordability:</span>
                    <span className="font-bold text-[#10382D]">{product.scoreFactors.affordability}/10</span>
                  </div>
                  <div className="flex justify-between text-[#5D6B63]">
                    <span>Battery Replacement Quote:</span>
                    <span className="font-bold text-[#174C3C]">
                      {batteryPart ? `₹${batteryPart.minPriceInr.toLocaleString('en-IN')}` : 'Inquire'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="px-5 pb-5 pt-3 border-t border-[#EFF3EE] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectProductForParts(product.id)}
                    className="py-2 px-2 text-xs font-bold bg-[#EEF5EF] text-[#174C3C] hover:bg-[#DCE9DF] rounded-xl transition-colors flex items-center justify-center space-x-1"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>View Parts</span>
                  </button>
                  <button
                    onClick={() => onAskAIAboutProduct(product.id)}
                    className="py-2 px-2 text-xs font-bold bg-[#174C3C] text-white hover:bg-[#10382D] rounded-xl transition-colors flex items-center justify-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#DCE9DF]" />
                    <span>Worth Buying?</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setActiveDetailProduct(product)}
                    className="text-[11px] font-semibold text-[#5D6B63] hover:text-[#10382D]"
                  >
                    View Technical Profile →
                  </button>

                  <button
                    onClick={() => toggleCompare(product.id)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors flex items-center space-x-1 ${
                      isComparing
                        ? 'bg-[#174C3C] text-white border-[#174C3C]'
                        : 'bg-[#F8FAF7] text-[#5D6B63] border-[#DCE4DC] hover:bg-[#EEF5EF]'
                    }`}
                  >
                    <GitCompare className="w-3 h-3" />
                    <span>{isComparing ? 'Comparing' : 'Compare'}</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Product Detail Profile Modal */}
      {activeDetailProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#DCE4DC] space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            
            <div className="flex items-start justify-between pb-4 border-b border-[#EFF3EE]">
              <div>
                <span className="text-[11px] font-bold text-[#78857D] uppercase tracking-wider">
                  {activeDetailProduct.brand}
                </span>
                <h2 className="text-2xl font-extrabold text-[#10382D]">
                  {activeDetailProduct.modelName}
                </h2>
                <p className="text-xs text-[#5D6B63]">{activeDetailProduct.variant} • Released {activeDetailProduct.releaseYear}</p>
              </div>
              <button
                onClick={() => setActiveDetailProduct(null)}
                className="p-1.5 text-[#78857D] hover:text-[#10382D] rounded-lg hover:bg-[#EFF3EE]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & 5-Factor Radar Breakdown */}
            <div className="p-4 rounded-xl bg-[#EEF5EF] border border-[#DCE9DF] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#174C3C] uppercase">
                    RevTech Repairability Index
                  </span>
                  <div className="text-2xl font-extrabold text-[#10382D] font-mono">
                    {activeDetailProduct.repairabilityScore} / 10
                  </div>
                </div>
                <div className="text-right text-xs text-[#5D6B63]">
                  <span>Est. 3-Year Ownership TCO:</span>
                  <p className="text-base font-extrabold text-[#10382D] font-mono">
                    ₹{activeDetailProduct.estimatedOwnershipTco3Yr.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* 5 Weighted Factor Bars */}
              <div className="space-y-1.5 pt-2 border-t border-[#DCE4DC] text-xs">
                <div>
                  <div className="flex justify-between text-[#5D6B63] mb-0.5">
                    <span>Spare-Parts Availability (30% weight)</span>
                    <span className="font-bold text-[#10382D]">{activeDetailProduct.scoreFactors.partsAvailability}/10</span>
                  </div>
                  <div className="w-full bg-white h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#174C3C] h-full" style={{ width: `${activeDetailProduct.scoreFactors.partsAvailability * 10}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[#5D6B63] mb-0.5">
                    <span>Repair Affordability (25% weight)</span>
                    <span className="font-bold text-[#10382D]">{activeDetailProduct.scoreFactors.affordability}/10</span>
                  </div>
                  <div className="w-full bg-white h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#174C3C] h-full" style={{ width: `${activeDetailProduct.scoreFactors.affordability * 10}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[#5D6B63] mb-0.5">
                    <span>Repair Documentation & Disassembly (20% weight)</span>
                    <span className="font-bold text-[#10382D]">{activeDetailProduct.scoreFactors.documentation}/10</span>
                  </div>
                  <div className="w-full bg-white h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#174C3C] h-full" style={{ width: `${activeDetailProduct.scoreFactors.documentation * 10}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Hardware Specifications */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#78857D]">
                Hardware & Disassembly Specs
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[#F8FAF7] rounded-lg border border-[#EFF3EE]">
                  <span className="text-[#78857D] block">Display & Glass:</span>
                  <span className="font-semibold text-[#10382D]">{activeDetailProduct.specifications.display}</span>
                </div>
                <div className="p-2.5 bg-[#F8FAF7] rounded-lg border border-[#EFF3EE]">
                  <span className="text-[#78857D] block">Battery & Adhesive:</span>
                  <span className="font-semibold text-[#10382D]">{activeDetailProduct.specifications.battery}</span>
                </div>
                <div className="p-2.5 bg-[#F8FAF7] rounded-lg border border-[#EFF3EE]">
                  <span className="text-[#78857D] block">Camera Modules:</span>
                  <span className="font-semibold text-[#10382D]">{activeDetailProduct.specifications.camera}</span>
                </div>
                <div className="p-2.5 bg-[#F8FAF7] rounded-lg border border-[#EFF3EE]">
                  <span className="text-[#78857D] block">OS & Security Patch Roadmap:</span>
                  <span className="font-semibold text-[#10382D]">{activeDetailProduct.specifications.osSupport}</span>
                </div>
              </div>
            </div>

            {/* Warranty & Official Support */}
            <div className="p-3 bg-[#F8FAF7] rounded-xl border border-[#EFF3EE] text-xs space-y-1">
              <div className="flex justify-between items-center font-bold text-[#10382D]">
                <span>Warranty Duration: {activeDetailProduct.warrantyMonths} Months</span>
                <a
                  href={activeDetailProduct.officialSupportUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#174C3C] hover:underline flex items-center space-x-1"
                >
                  <span>Official Support Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[#5D6B63] text-[11px]">{activeDetailProduct.warrantyCoverage}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  const id = activeDetailProduct.id;
                  setActiveDetailProduct(null);
                  onSelectProductForParts(id);
                }}
                className="flex-1 py-2.5 bg-[#174C3C] text-white text-xs font-bold rounded-xl hover:bg-[#10382D] transition-colors text-center"
              >
                Browse Compatible Spare Parts
              </button>
              <button
                onClick={() => {
                  const id = activeDetailProduct.id;
                  setActiveDetailProduct(null);
                  onAskAIAboutProduct(id);
                }}
                className="flex-1 py-2.5 bg-[#EEF5EF] text-[#174C3C] text-xs font-bold rounded-xl hover:bg-[#DCE9DF] transition-colors text-center"
              >
                Evaluate Pre-Purchase AI Verdict
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
