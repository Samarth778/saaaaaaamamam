import React, { useState } from 'react';
import { 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Wrench, 
  MapPin, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight,
  Flame,
  Activity
} from 'lucide-react';
import { PRODUCTS, SPARE_PARTS } from '../data/revtechData';

interface RepairAssistantPageProps {
  onFindParts: (category: string, productId: string) => void;
  onFindNearby: (component: string, productId: string) => void;
  selectedCity: string;
}

export const RepairAssistantPage: React.FC<RepairAssistantPageProps> = ({
  onFindParts,
  onFindNearby,
  selectedCity,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('samsung-galaxy-s23');
  const [symptom, setSymptom] = useState<string>('Battery draining fast & overheating');
  const [duration, setDuration] = useState<string>('Started 2-3 weeks ago');
  const [triggerEvent, setTriggerEvent] = useState<string>('Normal daily usage / gradual degradation');
  
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);

  const handleRunDiagnosis = async () => {
    setIsDiagnosing(true);
    const product = PRODUCTS.find((p) => p.id === selectedProductId);
    const deviceName = product ? `${product.brand} ${product.modelName}` : 'Smartphone';

    try {
      const res = await fetch('/api/gemini/troubleshoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device: deviceName,
          symptom,
          duration,
          trigger: triggerEvent,
        }),
      });
      const data = await res.json();
      setDiagnosisResult(data.diagnosis);
    } catch {
      // Deterministic fallback
      setDiagnosisResult({
        probableCauses: [
          'Lithium-ion cell internal resistance elevated beyond 500 charge cycles',
          'Background system process wake-lock or power leakage',
          'Sub-board power delivery regulator degradation'
        ],
        safeChecks: [
          'Inspect battery health percentage under device settings',
          'Boot in Safe Mode for 2 hours to confirm if issue is third-party app related',
          'Check device back panel for physical swelling or gap opening (if swollen, do not charge)'
        ],
        partsRecommended: ['Original OEM 3,900mAh Battery Module', 'Pre-cut battery adhesive gasket'],
        technicianQuestions: [
          'Can you confirm the replacement battery has a 0-cycle count?',
          'Will you test the charge current intake (amperage) with an inline USB meter?'
        ],
        urgency: 'Medium',
      });
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#DCE4DC] pb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider mb-1">
          <Cpu className="w-4 h-4" />
          <span>Hardware Triage & Safety Diagnostic</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#10382D]">
          RevTech Hardware Diagnostic Assistant
        </h1>
        <p className="text-sm text-[#5D6B63] mt-1">
          Safely troubleshoot smartphone symptoms, isolate hardware vs firmware faults, and avoid dangerous home repair hazards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Diagnostic Wizard Inputs (Left: 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DCE4DC] p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-[#10382D]">Symptom Intake Wizard</h3>
            <p className="text-xs text-[#5D6B63] mt-0.5">
              Select your smartphone model and current hardware anomalies.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* Device */}
            <div>
              <label className="font-bold text-[#78857D] uppercase tracking-wider block mb-1">
                Your Device
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D] focus:border-[#174C3C]"
              >
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.brand} {p.modelName} ({p.variant})
                  </option>
                ))}
              </select>
            </div>

            {/* Primary Symptom */}
            <div>
              <label className="font-bold text-[#78857D] uppercase tracking-wider block mb-1">
                Primary Hardware Symptom
              </label>
              <select
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D] focus:border-[#174C3C]"
              >
                <option value="Battery draining fast & overheating">Battery draining fast & device warming up</option>
                <option value="Display flickering, green lines, or black screen">Display flickering, vertical green line, or black screen</option>
                <option value="USB-C port loose, slow charging, or no connection">USB-C port loose, slow charging, or intermittent connect</option>
                <option value="Rear camera blurry, buzzing sound, or broken lens">Rear camera blurry, optical stabilizer buzzing, or lens crack</option>
                <option value="Device won't turn on (dead handset / bootloop)">Device won't turn on (dead handset / stuck on logo)</option>
                <option value="Speaker crackling or microphone not picking voice">Speaker crackling or microphone muffled</option>
              </select>
            </div>

            {/* When did it start */}
            <div>
              <label className="font-bold text-[#78857D] uppercase tracking-wider block mb-1">
                When Did This Issue Begin?
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D]"
              >
                <option value="Just today / sudden event">Just today / sudden failure</option>
                <option value="Started 2-3 weeks ago">Started 2-3 weeks ago and getting worse</option>
                <option value="Gradual degradation over 6+ months">Gradual degradation over 6+ months</option>
              </select>
            </div>

            {/* Trigger Event */}
            <div>
              <label className="font-bold text-[#78857D] uppercase tracking-wider block mb-1">
                Recent Incident / Potential Trigger
              </label>
              <select
                value={triggerEvent}
                onChange={(e) => setTriggerEvent(e.target.value)}
                className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D]"
              >
                <option value="Normal daily usage / gradual degradation">Normal daily usage (No physical shock)</option>
                <option value="Dropped on hard surface or screen impact">Dropped on concrete / corner impact</option>
                <option value="Moisture, rain, or water splash contact">Moisture, rain, or water splash contact</option>
                <option value="Immediately after an OS or security update">Immediately after an OS firmware update</option>
              </select>
            </div>

          </div>

          <button
            onClick={handleRunDiagnosis}
            disabled={isDiagnosing}
            className="w-full py-3 bg-[#174C3C] text-white text-xs font-bold rounded-xl hover:bg-[#10382D] transition-all flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
          >
            <Activity className="w-4 h-4 text-[#DCE9DF]" />
            <span>{isDiagnosing ? 'Analyzing Fault Vectors...' : 'Run Safety Diagnostics'}</span>
          </button>
        </div>

        {/* Diagnosis Results (Right: 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!diagnosisResult && !isDiagnosing && (
            <div className="bg-white rounded-2xl border-2 border-dashed border-[#DCE4DC] p-12 text-center space-y-4">
              <Cpu className="w-12 h-12 text-[#174C3C] mx-auto opacity-70" />
              <h3 className="text-base font-bold text-[#10382D]">Ready to run hardware triage</h3>
              <p className="text-xs text-[#5D6B63] max-w-md mx-auto">
                Select your phone's symptom and click "Run Safety Diagnostics" to get actionable test steps, recommended replacement parts, and critical safety precautions.
              </p>
            </div>
          )}

          {isDiagnosing && (
            <div className="bg-white rounded-2xl border border-[#DCE4DC] p-12 text-center space-y-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-[#174C3C] mx-auto animate-spin" />
              <h3 className="text-base font-bold text-[#10382D]">Isolating component failure modes...</h3>
            </div>
          )}

          {diagnosisResult && !isDiagnosing && (
            <div className="bg-white rounded-2xl border border-[#DCE4DC] p-6 shadow-sm space-y-6 animate-in fade-in">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#EFF3EE]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#78857D]">
                    Hardware Triage Assessment
                  </span>
                  <h3 className="text-xl font-extrabold text-[#10382D] mt-0.5">
                    {symptom}
                  </h3>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Urgency: {diagnosisResult.urgency || 'Medium'}</span>
                </div>
              </div>

              {/* Safety Precaution Alert */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold">
                  <Flame className="w-4 h-4 text-red-700" />
                  <span>Crucial Consumer Safety Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed text-red-800">
                  Never attempt to pry or puncture a lithium-ion battery with metal tools. Swollen batteries represent a thermal runaway hazard. For internal motherboard soldering, always consult a certified ESD-safe bench.
                </p>
              </div>

              {/* Probable Root Causes */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#78857D]">
                  Plausible Root Causes
                </h4>
                <ul className="space-y-2 text-xs text-[#1B2722]">
                  {(diagnosisResult.probableCauses || []).map((cause: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#174C3C] shrink-0 mt-0.5" />
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Safe User Checks */}
              <div className="space-y-2 pt-2 border-t border-[#EFF3EE]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#78857D]">
                  Safe Non-Invasive Checks to Perform
                </h4>
                <ul className="space-y-2 text-xs text-[#5D6B63]">
                  {(diagnosisResult.safeChecks || []).map((check: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2 bg-[#F8FAF7] p-2.5 rounded-lg border border-[#EFF3EE]">
                      <span className="font-bold text-[#10382D] shrink-0">{i + 1}.</span>
                      <span>{check}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Spare Parts */}
              <div className="p-4 rounded-xl bg-[#EEF5EF] border border-[#DCE9DF] space-y-2">
                <span className="text-xs font-bold text-[#174C3C] uppercase">
                  Target Replacement Component(s)
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(diagnosisResult.partsRecommended || []).map((partName: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 bg-white text-[#10382D] border border-[#DCE4DC] rounded-lg text-xs font-semibold">
                      {partName}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onFindParts('Battery', selectedProductId)}
                  className="flex-1 py-2.5 bg-[#174C3C] text-white text-xs font-bold rounded-xl hover:bg-[#10382D] transition-colors flex items-center justify-center space-x-1"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Search Compatible Parts</span>
                </button>
                <button
                  onClick={() => onFindNearby(symptom, selectedProductId)}
                  className="flex-1 py-2.5 bg-[#EEF5EF] text-[#174C3C] text-xs font-bold rounded-xl hover:bg-[#DCE9DF] transition-colors flex items-center justify-center space-x-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Find Diagnostic Centers in {selectedCity}</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
