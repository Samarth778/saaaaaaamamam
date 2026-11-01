import React, { useState } from 'react';
import { 
  Sparkles, 
  Wrench, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  HelpCircle, 
  TrendingDown, 
  Calculator, 
  ShieldAlert, 
  FileText, 
  Smartphone,
  RotateCcw,
  Bot
} from 'lucide-react';
import { PRODUCTS, SPARE_PARTS, Product } from '../data/revtechData';
import { evaluateRepairVsReplace, RepairVsReplaceResult } from '../utils/calculations';

interface AIDecisionPageProps {
  onFindParts: (productId: string) => void;
  onFindNearby: (component: string, productId: string) => void;
  initialProductId?: string;
  initialComponent?: string;
  initialRepairCost?: number;
  initialMode?: 'repair-vs-replace' | 'worth-buying' | 'chat';
  selectedCity: string;
}

export const AIDecisionPage: React.FC<AIDecisionPageProps> = ({
  onFindParts,
  onFindNearby,
  initialProductId,
  initialComponent,
  initialRepairCost,
  initialMode = 'repair-vs-replace',
  selectedCity,
}) => {
  const [activeTab, setActiveTab] = useState<'repair-vs-replace' | 'worth-buying' | 'chat'>(initialMode);

  // --- TAB 1: REPAIR VS REPLACE FORM ---
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProductId || 'samsung-galaxy-s23');
  const [customDeviceName, setCustomDeviceName] = useState<string>('');
  const [componentFault, setComponentFault] = useState<string>(initialComponent || 'Display Assembly (Cracked)');
  const [deviceAgeMonths, setDeviceAgeMonths] = useState<number>(22);
  const [repairCostInr, setRepairCostInr] = useState<number>(initialRepairCost || 8500);
  const [estimatedResaleValueInr, setEstimatedResaleValueInr] = useState<number>(14000);
  const [replacementBudgetInr, setReplacementBudgetInr] = useState<number>(38000);
  const [userPriority, setUserPriority] = useState<'Save Upfront Cash' | 'Lowest Monthly Cost' | 'Latest Tech & Warranty' | 'Environmental Longevity'>('Lowest Monthly Cost');

  // Decision State
  const [isLoadingDecision, setIsLoadingDecision] = useState(false);
  const [decisionResult, setDecisionResult] = useState<any>(null);
  const [engineSource, setEngineSource] = useState<string>('');

  // --- TAB 2: WORTH BUYING FORM ---
  const [buyTargetProductId, setBuyTargetProductId] = useState<string>('xiaomi-redmi-note-13-pro-plus');
  const [userBudgetInr, setUserBudgetInr] = useState<number>(32000);
  const [plannedHoldingPeriodYears, setPlannedHoldingPeriodYears] = useState<number>(3);
  const [buyDecisionResult, setBuyDecisionResult] = useState<any>(null);
  const [isLoadingBuyDecision, setIsLoadingBuyDecision] = useState(false);

  // --- TAB 3: CHAT FORM ---
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; source?: string }>>([
    {
      sender: 'ai',
      text: `Hello! I'm RevTech AI, your electronics repairability and smartphone lifecycle advisor. Ask me anything about spare parts pricing, whether fixing a cracked screen makes financial sense, or component quality tiers.`,
      source: 'RevTech AI Agent',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Execute Repair vs Replace Decision
  const handleRunRepairDecision = async () => {
    setIsLoadingDecision(true);
    const selectedProd = PRODUCTS.find((p) => p.id === selectedProductId);
    const deviceName = selectedProd ? `${selectedProd.brand} ${selectedProd.modelName}` : customDeviceName || 'Smartphone';

    // 1. First run deterministic financial math
    const mathResult: RepairVsReplaceResult = evaluateRepairVsReplace({
      currentDeviceName: deviceName,
      currentDeviceAgeMonths: deviceAgeMonths,
      estimatedResaleValueInr,
      repairCostInr,
      expectedLifeAfterRepairMonths: 18,
      replacementDeviceName: `New Target Device (~₹${replacementBudgetInr})`,
      replacementPriceInr: replacementBudgetInr,
      replacementLifespanMonths: 36,
      userPriority,
    });

    try {
      const res = await fetch('/api/gemini/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'repair-vs-replace',
          product: deviceName,
          component: componentFault,
          repairCost: repairCostInr,
          replacementCost: replacementBudgetInr,
          deviceAge: deviceAgeMonths,
          deviceValue: estimatedResaleValueInr,
          priorities: userPriority,
        }),
      });
      const data = await res.json();
      setDecisionResult({
        ...mathResult,
        ...data,
        // Preserve mathematical values
        repairMonthlyCostInr: mathResult.repairMonthlyCostInr,
        replacementMonthlyCostInr: mathResult.replacementMonthlyCostInr,
        breakEvenMonths: mathResult.breakEvenMonths,
        twoYearSavingsInr: mathResult.twoYearSavingsInr,
      });
      setEngineSource(data.source || 'RevTech AI');
    } catch {
      // Deterministic fallback
      setDecisionResult(mathResult);
      setEngineSource('RevTech Algorithmic Intelligence (Deterministic Engine)');
    } finally {
      setIsLoadingDecision(false);
    }
  };

  // Execute Worth Buying Evaluation
  const handleRunBuyDecision = async () => {
    setIsLoadingBuyDecision(true);
    const targetProduct = PRODUCTS.find((p) => p.id === buyTargetProductId) || PRODUCTS[0];
    const parts = SPARE_PARTS.filter((p) => p.productId === targetProduct.id);
    const batteryPart = parts.find((p) => p.category === 'Battery');
    const displayPart = parts.find((p) => p.category === 'Display');

    try {
      const res = await fetch('/api/gemini/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'worth-buying',
          product: `${targetProduct.brand} ${targetProduct.modelName} (₹${targetProduct.priceInr})`,
          component: 'Full Device Purchase Evaluation',
          repairCost: displayPart?.maxPriceInr || 6000,
          replacementCost: targetProduct.priceInr,
          deviceAge: 0,
          deviceValue: targetProduct.priceInr,
          priorities: `User budget ₹${userBudgetInr}, planning ${plannedHoldingPeriodYears} years usage`,
          prompt: `Repairability score is ${targetProduct.repairabilityScore}/10. Battery part price ₹${batteryPart?.minPriceInr}-₹${batteryPart?.maxPriceInr}. Display part price ₹${displayPart?.minPriceInr}-₹${displayPart?.maxPriceInr}.`,
        }),
      });
      const data = await res.json();
      setBuyDecisionResult({
        product: targetProduct,
        ...data,
      });
    } catch {
      setBuyDecisionResult({
        product: targetProduct,
        recommendation: targetProduct.repairabilityScore >= 7.5 ? 'Buying appears reasonable' : 'Consider an alternative product',
        headline: `${targetProduct.brand} ${targetProduct.modelName} offers an above-average ${targetProduct.repairabilityScore}/10 repairability index with strong spare parts liquidity.`,
        whyFactors: [
          `Purchase price of ₹${targetProduct.priceInr.toLocaleString('en-IN')} fits comfortably within your ₹${userBudgetInr.toLocaleString('en-IN')} budget envelope.`,
          `High parts accessibility: Battery swap is estimated at only ₹${batteryPart?.minPriceInr || 2000} - ₹${batteryPart?.maxPriceInr || 2600}.`,
          `Estimated 3-Year Total Cost of Ownership (TCO) is approximately ₹${targetProduct.estimatedOwnershipTco3Yr.toLocaleString('en-IN')}.`
        ],
        economicAnalysis: `Amortized over ${plannedHoldingPeriodYears} years (${plannedHoldingPeriodYears * 12} months), device ownership equals roughly ₹${Math.round(targetProduct.estimatedOwnershipTco3Yr / (plannedHoldingPeriodYears * 12)).toLocaleString('en-IN')}/month, representing exceptional value in this segment.`,
        confidence: 'High',
        nextSteps: [
          'Check local service centers in Find Nearby tab before final purchase',
          'Ensure purchasing from authorized channels with valid 1-year warranty bill'
        ],
        source: 'RevTech Algorithmic Intelligence (Offline Engine)',
      });
    } finally {
      setIsLoadingBuyDecision(false);
    }
  };

  // Send Chat Message
  const handleSendChat = async (messageText?: string) => {
    const textToSend = messageText || chatInput;
    if (!textToSend.trim()) return;

    const newMsgs = [...chatMessages, { sender: 'user' as const, text: textToSend }];
    setChatMessages(newMsgs);
    setChatInput('');
    setIsSendingChat(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: {
            selectedCity,
            selectedProduct: selectedProductId,
          },
        }),
      });
      const data = await res.json();
      setChatMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: data.reply || 'No response returned.',
          source: data.source || 'RevTech AI',
        },
      ]);
    } catch {
      setChatMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: `[RevTech AI Local Response] For electronics repairs: Make sure to check whether your repair quote is under 35% of a new phone's cost. For screens, OEM panels guarantee full 120Hz refresh rate and biometric support, whereas compatible screens save 40-50% cost.`,
          source: 'RevTech Rule Engine',
        },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#DCE4DC] pb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-[#174C3C]" />
          <span>Decision Support Intelligence</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#10382D]">
          RevTech AI Decision Suite
        </h1>
        <p className="text-sm text-[#5D6B63] mt-1">
          Make data-driven decisions on whether to repair your smartphone or replace it, and evaluate if a new phone is worth buying based on lifecycle costs.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex border-b border-[#DCE4DC] gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('repair-vs-replace')}
          className={`pb-3 flex items-center space-x-2 transition-all ${
            activeTab === 'repair-vs-replace'
              ? 'text-[#174C3C] border-b-2 border-[#174C3C]'
              : 'text-[#78857D] hover:text-[#10382D]'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Repair vs. Replace Advisor</span>
        </button>
        <button
          onClick={() => setActiveTab('worth-buying')}
          className={`pb-3 flex items-center space-x-2 transition-all ${
            activeTab === 'worth-buying'
              ? 'text-[#174C3C] border-b-2 border-[#174C3C]'
              : 'text-[#78857D] hover:text-[#10382D]'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Is It Worth Buying?</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`pb-3 flex items-center space-x-2 transition-all ${
            activeTab === 'chat'
              ? 'text-[#174C3C] border-b-2 border-[#174C3C]'
              : 'text-[#78857D] hover:text-[#10382D]'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>RevTech AI Live Chat</span>
        </button>
      </div>

      {/* TAB 1: REPAIR VS REPLACE ADVISOR */}
      {activeTab === 'repair-vs-replace' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Inputs (Left: 5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DCE4DC] p-6 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-[#10382D]">Configure Your Repair Scenario</h3>
              <p className="text-xs text-[#5D6B63] mt-0.5">
                Input your device details and quotes to calculate the exact amortized cost difference.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Product */}
              <div>
                <label className="font-bold text-[#78857D] uppercase tracking-wider block mb-1">
                  Your Current Smartphone
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const match = PRODUCTS.find((p) => p.id === e.target.value);
                    if (match) {
                      setEstimatedResaleValueInr(Math.round(match.priceInr * 0.35));
                    }
                  }}
                  className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D] focus:border-[#174C3C]"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brand} {p.modelName} ({p.variant})
                    </option>
                  ))}
                  <option value="custom">Other / Custom Model...</option>
                </select>
                {selectedProductId === 'custom' && (
                  <input
                    type="text"
                    value={customDeviceName}
                    onChange={(e) => setCustomDeviceName(e.target.value)}
                    placeholder="Enter brand & model..."
                    className="w-full mt-2 font-medium bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#1B2722]"
                  />
                )}
              </div>

              {/* Damaged Component */}
              <div>
                <label className="font-bold text-[#78857D] uppercase tracking-wider block mb-1">
                  Damaged Component / Problem
                </label>
                <select
                  value={componentFault}
                  onChange={(e) => setComponentFault(e.target.value)}
                  className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D] focus:border-[#174C3C]"
                >
                  <option value="Display Assembly (Cracked)">Display Assembly (Cracked Glass / Black screen)</option>
                  <option value="Battery Degradation (<80% Health)">Battery Degradation (&lt;80% Health / Fast drain)</option>
                  <option value="Charging Sub-board (Loose port)">Charging Sub-board (Loose port / No charge)</option>
                  <option value="Rear Camera Module (Blurry / Broken)">Rear Camera Module (Blurry / Broken lens)</option>
                  <option value="Back Glass Cover Shattered">Back Glass Cover Shattered</option>
                  <option value="Motherboard Power IC Fault">Motherboard Power IC / Micro-soldering</option>
                </select>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[#78857D] uppercase">Device Age:</span>
                    <span className="font-extrabold text-[#10382D]">{deviceAgeMonths} Months</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="60"
                    step="2"
                    value={deviceAgeMonths}
                    onChange={(e) => setDeviceAgeMonths(Number(e.target.value))}
                    className="w-full accent-[#174C3C]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[#78857D] uppercase">Repair Quote:</span>
                    <span className="font-extrabold text-[#10382D]">₹{repairCostInr.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="25000"
                    step="500"
                    value={repairCostInr}
                    onChange={(e) => setRepairCostInr(Number(e.target.value))}
                    className="w-full accent-[#174C3C]"
                  />
                </div>
              </div>

              {/* Resale Value & Replacement Budget */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#78857D] uppercase tracking-wider block mb-1">
                    Current Resale (Working)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-[#78857D]">₹</span>
                    <input
                      type="number"
                      value={estimatedResaleValueInr}
                      onChange={(e) => setEstimatedResaleValueInr(Number(e.target.value))}
                      className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl pl-7 pr-3 py-2 text-[#10382D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#78857D] uppercase tracking-wider block mb-1">
                    Replacement Target Budget
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-[#78857D]">₹</span>
                    <input
                      type="number"
                      value={replacementBudgetInr}
                      onChange={(e) => setReplacementBudgetInr(Number(e.target.value))}
                      className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl pl-7 pr-3 py-2 text-[#10382D]"
                    />
                  </div>
                </div>
              </div>

              {/* User Priority */}
              <div>
                <label className="font-bold text-[#78857D] uppercase tracking-wider block mb-1">
                  Your Primary Priority
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Lowest Monthly Cost', 'Save Upfront Cash', 'Latest Tech & Warranty', 'Environmental Longevity'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setUserPriority(p)}
                      className={`py-2 px-2 rounded-xl text-left font-semibold text-[11px] transition-all border ${
                        userPriority === p
                          ? 'bg-[#EEF5EF] border-[#174C3C] text-[#174C3C]'
                          : 'bg-[#F8FAF7] border-[#DCE4DC] text-[#5D6B63] hover:bg-[#EEF5EF]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Run Button */}
            <button
              onClick={handleRunRepairDecision}
              disabled={isLoadingDecision}
              className="w-full py-3 bg-[#174C3C] text-white text-xs font-bold rounded-xl hover:bg-[#10382D] transition-all flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#DCE9DF]" />
              <span>{isLoadingDecision ? 'Analyzing Decision via Gemini 3.8...' : 'Calculate Decision Recommendation'}</span>
            </button>
          </div>

          {/* Decision Results (Right: 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {!decisionResult && !isLoadingDecision && (
              <div className="bg-white rounded-2xl border-2 border-dashed border-[#DCE4DC] p-12 text-center space-y-4">
                <Calculator className="w-12 h-12 text-[#174C3C] mx-auto opacity-70" />
                <h3 className="text-base font-bold text-[#10382D]">Ready to Analyze Your Scenario</h3>
                <p className="text-xs text-[#5D6B63] max-w-md mx-auto">
                  Adjust the inputs on the left and click "Calculate Decision Recommendation". RevTech AI will model your marginal costs, break-even period, and parts supply risk.
                </p>
                <button
                  onClick={handleRunRepairDecision}
                  className="px-4 py-2 bg-[#EEF5EF] text-[#174C3C] text-xs font-bold rounded-xl hover:bg-[#DCE9DF]"
                >
                  Run S23 Display Case Study
                </button>
              </div>
            )}

            {isLoadingDecision && (
              <div className="bg-white rounded-2xl border border-[#DCE4DC] p-12 text-center space-y-4 animate-pulse">
                <Sparkles className="w-8 h-8 text-[#174C3C] mx-auto animate-spin" />
                <h3 className="text-base font-bold text-[#10382D]">RevTech AI is evaluating lifecycle economics...</h3>
                <p className="text-xs text-[#5D6B63]">
                  Comparing upfront expenditure, amortized monthly cost, and component availability.
                </p>
              </div>
            )}

            {decisionResult && !isLoadingDecision && (
              <div className="bg-white rounded-2xl border border-[#DCE4DC] p-6 shadow-sm space-y-6 animate-in fade-in">
                
                {/* Header & Verdict */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EFF3EE]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#78857D]">
                      Recommendation Verdict
                    </span>
                    <h3 className="text-xl font-extrabold text-[#10382D] mt-0.5">
                      {decisionResult.recommendation}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EEF5EF] text-[#174C3C] border border-[#DCE9DF]">
                      Confidence: {decisionResult.confidence || 'High'}
                    </span>
                  </div>
                </div>

                {/* Headline Banner */}
                <div className="p-4 rounded-xl bg-[#EEF5EF] border border-[#DCE9DF] text-xs text-[#174C3C] font-semibold leading-relaxed">
                  {decisionResult.headline}
                </div>

                {/* Cost Comparison Visual Ticker */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#F8FAF7] rounded-xl border border-[#EFF3EE] text-center">
                  <div>
                    <span className="text-[10px] text-[#78857D] uppercase font-bold block">Keep & Repair / Mo</span>
                    <span className="text-base font-extrabold text-[#174C3C] font-mono">
                      ₹{decisionResult.repairMonthlyCostInr?.toLocaleString('en-IN') || '472'}/mo
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#78857D] uppercase font-bold block">Replace / Mo</span>
                    <span className="text-base font-extrabold text-[#10382D] font-mono">
                      ₹{decisionResult.replacementMonthlyCostInr?.toLocaleString('en-IN') || '1,055'}/mo
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#78857D] uppercase font-bold block">Break-even Period</span>
                    <span className="text-base font-extrabold text-[#23734D] font-mono">
                      {decisionResult.breakEvenMonths || 8} Months
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#78857D] uppercase font-bold block">2-Year Net Savings</span>
                    <span className="text-base font-extrabold text-[#23734D] font-mono">
                      ₹{decisionResult.twoYearSavingsInr?.toLocaleString('en-IN') || '14,000'}
                    </span>
                  </div>
                </div>

                {/* Key Factors */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#78857D]">
                    Key Decision Drivers
                  </h4>
                  <ul className="space-y-2 text-xs text-[#1B2722]">
                    {(decisionResult.whyFactors || decisionResult.reasons || []).map((factor: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-[#23734D] shrink-0 mt-0.5" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Economic Analysis */}
                {decisionResult.economicAnalysis && (
                  <div className="space-y-1.5 pt-2 border-t border-[#EFF3EE]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#78857D]">
                      Economic Lifecycle Analysis
                    </h4>
                    <p className="text-xs text-[#5D6B63] leading-relaxed">
                      {decisionResult.economicAnalysis}
                    </p>
                  </div>
                )}

                {/* Spare Parts Guidance */}
                {decisionResult.sparePartsAdvice && (
                  <div className="p-3.5 bg-[#F8FAF7] rounded-xl border border-[#EFF3EE] space-y-1 text-xs">
                    <span className="font-bold text-[#10382D] block">Component Sourcing Strategy:</span>
                    <p className="text-[#5D6B63] leading-relaxed">{decisionResult.sparePartsAdvice}</p>
                  </div>
                )}

                {/* Next Steps Buttons */}
                <div className="pt-4 border-t border-[#EFF3EE] flex flex-wrap gap-3">
                  <button
                    onClick={() => onFindParts(selectedProductId)}
                    className="flex-1 py-2.5 px-3 bg-[#174C3C] text-white text-xs font-bold rounded-xl hover:bg-[#10382D] transition-colors flex items-center justify-center space-x-1"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Check Spare Parts Stock</span>
                  </button>
                  <button
                    onClick={() => onFindNearby(componentFault, selectedProductId)}
                    className="flex-1 py-2.5 px-3 bg-[#EEF5EF] text-[#174C3C] text-xs font-bold rounded-xl hover:bg-[#DCE9DF] transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>Locate Repair Center in {selectedCity}</span>
                  </button>
                </div>

                <div className="text-[10px] text-[#78857D] text-right">
                  Analysis Engine: {engineSource}
                </div>

              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: IS THIS PHONE WORTH BUYING? */}
      {activeTab === 'worth-buying' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Target Phone Selection */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DCE4DC] p-6 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-[#10382D]">Pre-Purchase Evaluation</h3>
              <p className="text-xs text-[#5D6B63] mt-0.5">
                Analyze long-term ownership cost, spare parts accessibility, and screen vulnerability before buying.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#78857D] uppercase tracking-wider block mb-1">
                  Select Smartphone to Evaluate
                </label>
                <select
                  value={buyTargetProductId}
                  onChange={(e) => setBuyTargetProductId(e.target.value)}
                  className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D] focus:border-[#174C3C]"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brand} {p.modelName} — ₹{p.priceInr.toLocaleString('en-IN')} (Score: {p.repairabilityScore}/10)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#78857D] uppercase tracking-wider block mb-1">
                  Your Target Budget (₹)
                </label>
                <input
                  type="number"
                  value={userBudgetInr}
                  onChange={(e) => setUserBudgetInr(Number(e.target.value))}
                  className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D]"
                />
              </div>

              <div>
                <label className="font-bold text-[#78857D] uppercase tracking-wider block mb-1">
                  Expected Holding Period
                </label>
                <div className="flex gap-2">
                  {[2, 3, 4, 5].map((yrs) => (
                    <button
                      key={yrs}
                      type="button"
                      onClick={() => setPlannedHoldingPeriodYears(yrs)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                        plannedHoldingPeriodYears === yrs
                          ? 'bg-[#174C3C] text-white border-[#174C3C]'
                          : 'bg-[#F8FAF7] text-[#5D6B63] border-[#DCE4DC]'
                      }`}
                    >
                      {yrs} Years
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleRunBuyDecision}
              disabled={isLoadingBuyDecision}
              className="w-full py-3 bg-[#174C3C] text-white text-xs font-bold rounded-xl hover:bg-[#10382D] transition-all flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#DCE9DF]" />
              <span>{isLoadingBuyDecision ? 'Evaluating Hardware Longevity...' : 'Evaluate Worth Buying'}</span>
            </button>
          </div>

          {/* Buying Results */}
          <div className="lg:col-span-7">
            {!buyDecisionResult && !isLoadingBuyDecision && (
              <div className="bg-white rounded-2xl border-2 border-dashed border-[#DCE4DC] p-12 text-center space-y-4">
                <Smartphone className="w-12 h-12 text-[#174C3C] mx-auto opacity-70" />
                <h3 className="text-base font-bold text-[#10382D]">Select a phone to evaluate pre-purchase longevity</h3>
                <p className="text-xs text-[#5D6B63] max-w-md mx-auto">
                  Find out if the phone has affordable display replacements, easy battery swapping, and genuine market liquidity before spending your hard-earned money.
                </p>
                <button
                  onClick={handleRunBuyDecision}
                  className="px-4 py-2 bg-[#EEF5EF] text-[#174C3C] text-xs font-bold rounded-xl hover:bg-[#DCE9DF]"
                >
                  Analyze Redmi Note 13 Pro+
                </button>
              </div>
            )}

            {isLoadingBuyDecision && (
              <div className="bg-white rounded-2xl border border-[#DCE4DC] p-12 text-center space-y-4 animate-pulse">
                <Sparkles className="w-8 h-8 text-[#174C3C] mx-auto animate-spin" />
                <h3 className="text-base font-bold text-[#10382D]">Auditing parts availability and review sentiment...</h3>
              </div>
            )}

            {buyDecisionResult && !isLoadingBuyDecision && (
              <div className="bg-white rounded-2xl border border-[#DCE4DC] p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#EFF3EE]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#78857D]">
                      Pre-Purchase Recommendation
                    </span>
                    <h3 className="text-xl font-extrabold text-[#10382D]">
                      {buyDecisionResult.recommendation}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-[#EEF5EF] text-[#174C3C] border border-[#DCE9DF] rounded-full">
                    Index: {buyDecisionResult.product?.repairabilityScore}/10
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#EEF5EF] border border-[#DCE9DF] text-xs text-[#174C3C] font-semibold leading-relaxed">
                  {buyDecisionResult.headline}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#78857D]">
                    Key Purchase Drivers
                  </h4>
                  <ul className="space-y-2 text-xs text-[#1B2722]">
                    {(buyDecisionResult.whyFactors || []).map((f: string, i: number) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-[#23734D] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#EFF3EE]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#78857D]">
                    {plannedHoldingPeriodYears}-Year Ownership Cost Forecast
                  </h4>
                  <p className="text-xs text-[#5D6B63] leading-relaxed">
                    {buyDecisionResult.economicAnalysis}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EFF3EE] flex gap-3">
                  <button
                    onClick={() => onFindParts(buyDecisionResult.product.id)}
                    className="flex-1 py-2.5 bg-[#174C3C] text-white text-xs font-bold rounded-xl hover:bg-[#10382D] transition-colors"
                  >
                    View Compatible Spare Parts
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: REVTECH AI LIVE CHAT */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-2xl border border-[#DCE4DC] shadow-xs overflow-hidden flex flex-col h-[580px]">
          
          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chatMessages.map((msg, index) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={index}
                  className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-1.5 ${
                      isAi
                        ? 'bg-[#F8FAF7] text-[#1B2722] border border-[#EFF3EE]'
                        : 'bg-[#174C3C] text-white shadow-xs'
                    }`}
                  >
                    {isAi && (
                      <div className="flex items-center space-x-1.5 text-[10px] font-bold text-[#174C3C]">
                        <Sparkles className="w-3 h-3" />
                        <span>{msg.source || 'RevTech AI Agent'}</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              );
            })}
            {isSendingChat && (
              <div className="flex justify-start">
                <div className="bg-[#F8FAF7] rounded-2xl p-3 text-xs text-[#5D6B63] border border-[#EFF3EE] flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#174C3C] animate-spin" />
                  <span>RevTech AI is formulating advice...</span>
                </div>
              </div>
            )}
          </div>

          {/* Prompt Chips */}
          <div className="px-6 py-2 bg-[#F8FAF7] border-t border-[#EFF3EE] flex flex-wrap gap-2 text-[11px]">
            <span className="text-[#78857D] py-1 font-medium">Quick prompts:</span>
            <button
              onClick={() => handleSendChat("Is a compatible third-party screen safe for iPhone 14?")}
              className="px-2.5 py-1 bg-white hover:bg-[#EEF5EF] text-[#174C3C] border border-[#DCE4DC] rounded-lg transition-colors"
            >
              Third-party screen on iPhone 14?
            </button>
            <button
              onClick={() => handleSendChat("How much does a Galaxy S23 battery swap cost in Indore?")}
              className="px-2.5 py-1 bg-white hover:bg-[#EEF5EF] text-[#174C3C] border border-[#DCE4DC] rounded-lg transition-colors"
            >
              Galaxy S23 battery swap in Indore?
            </button>
            <button
              onClick={() => handleSendChat("What questions should I ask a technician before display repair?")}
              className="px-2.5 py-1 bg-white hover:bg-[#EEF5EF] text-[#174C3C] border border-[#DCE4DC] rounded-lg transition-colors"
            >
              Questions to ask repair shop?
            </button>
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-[#DCE4DC]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask RevTech AI about repairability, prices, or hardware triage..."
                className="flex-1 text-xs sm:text-sm font-medium bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-4 py-2.5 text-[#1B2722] focus:border-[#174C3C] focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={isSendingChat || !chatInput.trim()}
                className="p-2.5 bg-[#174C3C] hover:bg-[#10382D] text-white rounded-xl transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};
