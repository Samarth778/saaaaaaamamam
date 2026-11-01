import React from 'react';
import { 
  GitCompare, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Wrench, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PRODUCTS, SPARE_PARTS, Product } from '../data/revtechData';

interface CompareDevicesPageProps {
  comparisonList: string[];
  setComparisonList: React.Dispatch<React.SetStateAction<string[]>>;
  onGoToExplore: () => void;
  onSelectForParts: (productId: string) => void;
  onAskAI: (productId: string) => void;
}

export const CompareDevicesPage: React.FC<CompareDevicesPageProps> = ({
  comparisonList,
  setComparisonList,
  onGoToExplore,
  onSelectForParts,
  onAskAI,
}) => {
  const comparedProducts = PRODUCTS.filter((p) => comparisonList.includes(p.id));

  const handleRemove = (id: string) => {
    setComparisonList(comparisonList.filter((item) => item !== id));
  };

  const handleAddSample = () => {
    // Pick the first product not in comparisonList
    const candidate = PRODUCTS.find((p) => !comparisonList.includes(p.id));
    if (candidate) {
      setComparisonList([...comparisonList, candidate.id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#DCE4DC] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider mb-1">
            <GitCompare className="w-4 h-4" />
            <span>Hardware Comparison Matrix</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#10382D]">
            Compare Repairability & Lifecycle Costs
          </h1>
          <p className="text-sm text-[#5D6B63] mt-1">
            Examine component replacement costs, repairability indices, and 3-year ownership projections side-by-side.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {comparisonList.length < 3 && (
            <button
              onClick={handleAddSample}
              className="py-2 px-3 bg-[#EEF5EF] text-[#174C3C] text-xs font-bold rounded-xl hover:bg-[#DCE9DF] flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Device</span>
            </button>
          )}
          <button
            onClick={onGoToExplore}
            className="py-2 px-3 bg-[#174C3C] text-white text-xs font-bold rounded-xl hover:bg-[#10382D] flex items-center space-x-1"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {comparedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-[#DCE4DC] p-12 text-center space-y-4">
          <GitCompare className="w-12 h-12 text-[#174C3C] mx-auto opacity-70" />
          <h3 className="text-base font-bold text-[#10382D]">No devices currently selected for comparison</h3>
          <p className="text-xs text-[#5D6B63] max-w-md mx-auto">
            Select up to 3 smartphones from our catalog to compare screen replacement pricing, battery pull-tab ergonomics, and long-term repairability scores.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setComparisonList(['samsung-galaxy-s23', 'apple-iphone-14', 'xiaomi-redmi-note-13-pro-plus'])}
              className="px-4 py-2 bg-[#174C3C] text-white text-xs font-bold rounded-xl"
            >
              Compare Flagship vs. Value Trio
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#DCE4DC] shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            
            {/* Table Header: Devices */}
            <thead>
              <tr className="border-b border-[#EFF3EE] bg-[#F8FAF7]">
                <th className="p-4 text-xs font-bold text-[#78857D] uppercase w-1/4">
                  Specification / Metric
                </th>
                {comparedProducts.map((product) => (
                  <th key={product.id} className="p-4 w-1/4 align-top">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#78857D] uppercase">
                          {product.brand}
                        </span>
                        <h3 className="text-sm font-bold text-[#10382D]">
                          {product.modelName}
                        </h3>
                        <p className="text-[11px] text-[#5D6B63]">{product.variant}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="text-[#78857D] hover:text-[#B42318] p-1"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#10382D] font-mono">
                        ₹{product.priceInr.toLocaleString('en-IN')}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#EEF5EF] text-[#174C3C] font-bold text-[11px]">
                        Score: {product.repairabilityScore}/10
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#EFF3EE] text-xs">
              
              {/* Repairability Index */}
              <tr className="hover:bg-[#F8FAF7]">
                <td className="p-4 font-bold text-[#10382D]">Repairability Index</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4">
                    <div className="font-extrabold text-[#174C3C] text-sm font-mono">
                      {p.repairabilityScore} / 10
                    </div>
                    <span className="text-[10px] text-[#5D6B63]">
                      {p.repairabilityScore >= 8 ? 'High Repairability' : p.repairabilityScore >= 6.5 ? 'Moderate' : 'Challenging'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Display Replacement Quote */}
              <tr className="hover:bg-[#F8FAF7]">
                <td className="p-4 font-bold text-[#10382D]">Display Replacement (Est.)</td>
                {comparedProducts.map((p) => {
                  const disp = SPARE_PARTS.find((sp) => sp.productId === p.id && sp.category === 'Display');
                  return (
                    <td key={p.id} className="p-4">
                      {disp ? (
                        <div>
                          <span className="font-bold text-[#10382D] font-mono">
                            ₹{disp.minPriceInr.toLocaleString('en-IN')} – ₹{disp.maxPriceInr.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-[#5D6B63] block">({disp.partType})</span>
                        </div>
                      ) : (
                        <span className="text-[#78857D]">Inquire</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Battery Replacement Quote */}
              <tr className="hover:bg-[#F8FAF7]">
                <td className="p-4 font-bold text-[#10382D]">Battery Replacement (Est.)</td>
                {comparedProducts.map((p) => {
                  const bat = SPARE_PARTS.find((sp) => sp.productId === p.id && sp.category === 'Battery');
                  return (
                    <td key={p.id} className="p-4">
                      {bat ? (
                        <div>
                          <span className="font-bold text-[#10382D] font-mono">
                            ₹{bat.minPriceInr.toLocaleString('en-IN')} – ₹{bat.maxPriceInr.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-[#23734D] block">Includes 6mo warranty</span>
                        </div>
                      ) : (
                        <span className="text-[#78857D]">Inquire</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Estimated 3-Year Ownership TCO */}
              <tr className="hover:bg-[#F8FAF7]">
                <td className="p-4 font-bold text-[#10382D]">Estimated 3-Yr TCO</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4">
                    <span className="font-extrabold text-[#10382D] font-mono text-sm">
                      ₹{p.estimatedOwnershipTco3Yr.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-[#5D6B63] block">
                      (~₹{Math.round(p.estimatedOwnershipTco3Yr / 36).toLocaleString('en-IN')}/mo)
                    </span>
                  </td>
                ))}
              </tr>

              {/* Battery Capacity & Adhesive */}
              <tr className="hover:bg-[#F8FAF7]">
                <td className="p-4 font-bold text-[#10382D]">Battery Architecture</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-[#5D6B63]">
                    {p.specifications.battery}
                  </td>
                ))}
              </tr>

              {/* Display & Glass Material */}
              <tr className="hover:bg-[#F8FAF7]">
                <td className="p-4 font-bold text-[#10382D]">Display Technology</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-[#5D6B63]">
                    {p.specifications.display}
                  </td>
                ))}
              </tr>

              {/* Software Support Lifespan */}
              <tr className="hover:bg-[#F8FAF7]">
                <td className="p-4 font-bold text-[#10382D]">Software Security Support</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-[#10382D] font-medium">
                    {p.specifications.osSupport}
                  </td>
                ))}
              </tr>

              {/* Action Buttons */}
              <tr>
                <td className="p-4 font-bold text-[#10382D]">Direct Actions</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 space-y-2">
                    <button
                      onClick={() => onSelectForParts(p.id)}
                      className="w-full py-1.5 px-2 bg-[#EEF5EF] text-[#174C3C] text-xs font-bold rounded-lg hover:bg-[#DCE9DF] flex items-center justify-center space-x-1"
                    >
                      <Wrench className="w-3 h-3" />
                      <span>Parts</span>
                    </button>
                    <button
                      onClick={() => onAskAI(p.id)}
                      className="w-full py-1.5 px-2 bg-[#174C3C] text-white text-xs font-bold rounded-lg hover:bg-[#10382D] flex items-center justify-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Ask AI</span>
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
