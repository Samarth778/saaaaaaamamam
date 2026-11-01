import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  BarChart3, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Scale, 
  Cpu, 
  Wrench,
  Leaf
} from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="border-b border-[#DCE4DC] pb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Scientific Assessment Framework</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10382D]">
          RevTech Repairability Scoring & Lifecycle Methodology
        </h1>
        <p className="text-sm text-[#5D6B63] mt-2 leading-relaxed">
          How RevTech quantitatively evaluates consumer electronics repairability, spare-parts liquidity, and long-term ownership economics across India.
        </p>
      </div>

      {/* 5-Factor Weighted Model */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-[#174C3C] uppercase tracking-wider">
            Index Breakdown
          </span>
          <h2 className="text-2xl font-bold text-[#10382D] mt-1">
            The 5 Weighted Pillars of the RevTech Score
          </h2>
          <p className="text-xs sm:text-sm text-[#5D6B63] mt-1">
            Every smartphone is assessed on a 0 to 10 scale utilizing five mathematically weighted criteria.
          </p>
        </div>

        <div className="space-y-4">
          
          {/* Pillar 1 */}
          <div className="bg-white rounded-2xl border border-[#DCE4DC] p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-[#EEF5EF] text-[#174C3C] font-bold text-xs flex items-center justify-center font-mono">
                  30%
                </span>
                <h3 className="text-sm font-bold text-[#10382D]">
                  Spare-Parts Availability & Distribution Liquidity
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#174C3C] bg-[#EEF5EF] px-2 py-0.5 rounded">
                Weight: 30%
              </span>
            </div>
            <p className="text-xs text-[#5D6B63] leading-relaxed">
              Assesses whether replacement batteries, display panels, charging sub-boards, and camera modules can be obtained within 24 to 72 hours across Indian tier-1 and tier-2 markets. Evaluates supply resilience and multi-vendor distribution.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-2xl border border-[#DCE4DC] p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-[#EEF5EF] text-[#174C3C] font-bold text-xs flex items-center justify-center font-mono">
                  25%
                </span>
                <h3 className="text-sm font-bold text-[#10382D]">
                  Repair Affordability Ratio
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#174C3C] bg-[#EEF5EF] px-2 py-0.5 rounded">
                Weight: 25%
              </span>
            </div>
            <p className="text-xs text-[#5D6B63] leading-relaxed">
              Compares component pricing against the new retail value of the phone. When a screen replacement exceeds 40% of the phone's cost, the score penalizes the device, as high part costs economically force premature obsolescence.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-2xl border border-[#DCE4DC] p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-[#EEF5EF] text-[#174C3C] font-bold text-xs flex items-center justify-center font-mono">
                  20%
                </span>
                <h3 className="text-sm font-bold text-[#10382D]">
                  Repair Documentation & Software Pairing Transparency
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#174C3C] bg-[#EEF5EF] px-2 py-0.5 rounded">
                Weight: 20%
              </span>
            </div>
            <p className="text-xs text-[#5D6B63] leading-relaxed">
              Measures availability of official teardown schematics, calibration software, and penalizes artificial software serialization barriers (such as disabling TrueTone or FaceID when an authentic screen is swapped).
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white rounded-2xl border border-[#DCE4DC] p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-[#EEF5EF] text-[#174C3C] font-bold text-xs flex items-center justify-center font-mono">
                  15%
                </span>
                <h3 className="text-sm font-bold text-[#10382D]">
                  Service Accessibility & Technician Network
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#174C3C] bg-[#EEF5EF] px-2 py-0.5 rounded">
                Weight: 15%
              </span>
            </div>
            <p className="text-xs text-[#5D6B63] leading-relaxed">
              Evaluates the density of both authorized brand centers and vetted independent multi-brand chip-level labs, ensuring consumers aren't locked into single-vendor repair monopolies.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="bg-white rounded-2xl border border-[#DCE4DC] p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-[#EEF5EF] text-[#174C3C] font-bold text-xs flex items-center justify-center font-mono">
                  10%
                </span>
                <h3 className="text-sm font-bold text-[#10382D]">
                  Physical Disassembly Ergonomics & Modularity
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#174C3C] bg-[#EEF5EF] px-2 py-0.5 rounded">
                Weight: 10%
              </span>
            </div>
            <p className="text-xs text-[#5D6B63] leading-relaxed">
              Considers battery pull-tab design, standardized Phillips screws vs proprietary pentalobe fasteners, and whether screens or back glass can be removed without heating the frame over 85°C.
            </p>
          </div>

        </div>
      </section>

      {/* Sunk Cost Principle */}
      <section className="bg-[#EEF5EF] rounded-2xl p-6 sm:p-8 border border-[#DCE4DC] space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider">
          <Scale className="w-4 h-4 text-[#174C3C]" />
          <span>Economic Core Principle</span>
        </div>
        <h3 className="text-xl font-bold text-[#10382D]">
          The Sunk Cost Principle in RevTech AI Decisions
        </h3>
        <p className="text-xs sm:text-sm text-[#5D6B63] leading-relaxed">
          A common mistake consumers make is reasoning: <em>"I spent ₹60,000 on this phone two years ago, so spending ₹15,000 to repair it is definitely worth it."</em>
        </p>
        <p className="text-xs sm:text-sm text-[#5D6B63] leading-relaxed">
          In RevTech's decision mathematics, <strong>the initial purchase price is treated as a SUNK COST</strong>. It cannot be recovered. The only relevant comparison is:
        </p>
        <div className="p-4 bg-white rounded-xl border border-[#DCE4DC] text-xs font-mono text-[#10382D] space-y-1">
          <p>• Marginal Cost to Keep = Repair Price ÷ Expected Remaining Useful Life (Months)</p>
          <p>• Marginal Cost to Replace = Net New Purchase Price ÷ Expected Lifespan (Months)</p>
        </div>
        <p className="text-xs text-[#5D6B63] leading-relaxed">
          If your post-repair cost per month is lower than financing a new device and the security update roadmap is intact, repairing is unequivocally the rational choice.
        </p>
      </section>

      {/* Quality Tiers */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#10382D]">
          Component Quality Tiers Defined
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-[#DCE4DC] space-y-1.5">
            <span className="font-bold text-[#10382D] block">Original OEM</span>
            <p className="text-[#5D6B63]">Manufactured to exact brand specifications by original component tier-1 suppliers. Guaranteed refresh rate, color depth, and biometric tolerances.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#DCE4DC] space-y-1.5">
            <span className="font-bold text-[#10382D] block">High-Grade Compatible</span>
            <p className="text-[#5D6B63]">Precision aftermarket assemblies (GX OLED, OEM-Spec flexes) offering 90-95% of original performance at 40-50% lower cost.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#DCE4DC] space-y-1.5">
            <span className="font-bold text-[#10382D] block">Refurbished Genuine Grade-A</span>
            <p className="text-[#5D6B63]">Original OEM panels or cameras salvaged from intact donor boards with new outer polarizer/glass applied.</p>
          </div>
        </div>
      </section>

      {/* Right to repair portal */}
      <section className="p-6 bg-white rounded-2xl border border-[#DCE4DC] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#10382D]">
            Aligned with India’s Right to Repair Framework
          </h4>
          <p className="text-xs text-[#5D6B63] mt-1">
            RevTech supports consumer transparency and fair access to repair manuals and diagnostic software.
          </p>
        </div>
        <a
          href="https://consumeraffairs.nic.in/right-to-repair"
          target="_blank"
          rel="noreferrer"
          className="py-2 px-4 bg-[#174C3C] hover:bg-[#10382D] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shrink-0"
        >
          <span>Government Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </section>

    </div>
  );
};
