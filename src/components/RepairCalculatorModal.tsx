import React, { useState } from 'react';
import { 
  Calculator, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Wrench, 
  Info 
} from 'lucide-react';
import { calculateRepairEstimate, RepairCalculationResult } from '../utils/calculations';

interface RepairCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  partName: string;
  initialMinPartsCost: number;
  initialMaxPartsCost: number;
  initialLabourCost: number;
  onJumpToAIDecision: (cost: number, component: string) => void;
}

export const RepairCalculatorModal: React.FC<RepairCalculatorModalProps> = ({
  isOpen,
  onClose,
  partName,
  initialMinPartsCost,
  initialMaxPartsCost,
  initialLabourCost,
  onJumpToAIDecision,
}) => {
  const [minParts, setMinParts] = useState(initialMinPartsCost || 3000);
  const [maxParts, setMaxParts] = useState(initialMaxPartsCost || 4500);
  const [labour, setLabour] = useState(initialLabourCost || 600);
  const [extraFee, setExtraFee] = useState(150); // e.g. IP68 waterproof adhesive seal & anti-static kit

  if (!isOpen) return null;

  const estimate: RepairCalculationResult = calculateRepairEstimate(minParts, maxParts, labour, extraFee);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DCE4DC] space-y-6 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EFF3EE]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#EEF5EF] text-[#174C3C] flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#10382D]">Bench Repair Cost Estimator</h3>
              <p className="text-[11px] text-[#5D6B63]">{partName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#78857D] hover:text-[#10382D] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#78857D] uppercase block mb-1">Part Min Cost (₹)</label>
              <input
                type="number"
                value={minParts}
                onChange={(e) => setMinParts(Number(e.target.value))}
                className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D]"
              />
            </div>
            <div>
              <label className="font-bold text-[#78857D] uppercase block mb-1">Part Max Cost (₹)</label>
              <input
                type="number"
                value={maxParts}
                onChange={(e) => setMaxParts(Number(e.target.value))}
                className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#78857D] uppercase block mb-1">Bench Labour (₹)</label>
              <input
                type="number"
                value={labour}
                onChange={(e) => setLabour(Number(e.target.value))}
                className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D]"
              />
            </div>
            <div>
              <label className="font-bold text-[#78857D] uppercase block mb-1">Seal & Consumables (₹)</label>
              <input
                type="number"
                value={extraFee}
                onChange={(e) => setExtraFee(Number(e.target.value))}
                className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D]"
              />
            </div>
          </div>
        </div>

        {/* Calculated Result Breakdown */}
        <div className="p-4 rounded-xl bg-[#EEF5EF] border border-[#DCE9DF] space-y-2">
          <span className="text-[10px] font-bold text-[#174C3C] uppercase tracking-wider block">
            Estimated Complete Out-of-Pocket Cost
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#10382D] font-mono">
              ₹{estimate.minTotalInr.toLocaleString('en-IN')} – ₹{estimate.maxTotalInr.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-semibold text-[#5D6B63]">
              Avg: ₹{estimate.averageInr.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-[#5D6B63] leading-relaxed pt-1 border-t border-[#DCE9DF]/60">
            {estimate.notes}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={() => {
              onClose();
              onJumpToAIDecision(estimate.averageInr, partName);
            }}
            className="flex-1 py-2.5 px-3 bg-[#174C3C] hover:bg-[#10382D] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#DCE9DF]" />
            <span>Check Repair vs. Replace with AI</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-[#EFF3EE] text-[#5D6B63] text-xs font-bold rounded-xl hover:bg-[#DCE4DC] transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
