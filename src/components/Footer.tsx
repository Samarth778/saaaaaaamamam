import React from 'react';
import { Wrench, Shield, Leaf, HeartHandshake, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#10382D] text-[#EEF5EF] border-t border-[#174C3C] pt-14 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#174C3C]/60">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#174C3C] flex items-center justify-center text-white border border-[#DCE9DF]/20">
                <Wrench className="w-4 h-4 text-[#DCE9DF]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-mono">RevTech</span>
            </div>
            <p className="text-sm text-[#DCE9DF]/80 leading-relaxed max-w-sm">
              RevTech is India's premier consumer electronics repairability directory and spare parts intelligence platform.
              We empower consumers and technicians with verified component availability, cost indices, and AI-assisted lifecycle economics.
            </p>
            <div className="flex items-center space-x-4 pt-2 text-xs text-[#DCE9DF]/70">
              <div className="flex items-center space-x-1.5">
                <Leaf className="w-4 h-4 text-[#23734D]" />
                <span>E-Waste Reduction</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Shield className="w-4 h-4 text-[#285F8F]" />
                <span>Right to Repair</span>
              </div>
            </div>
          </div>

          {/* Quick Links: Parts & Care */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#DCE9DF] mb-4">
              Spare Parts & Care
            </h4>
            <ul className="space-y-2.5 text-xs text-[#DCE9DF]/80">
              <li>
                <button onClick={() => setActiveTab('parts')} className="hover:text-white transition-colors text-left">
                  Find OEM Batteries
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('parts')} className="hover:text-white transition-colors text-left">
                  AMOLED & Display Units
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('parts')} className="hover:text-white transition-colors text-left">
                  USB-C Sub-Boards & Ports
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('nearby')} className="hover:text-white transition-colors text-left">
                  Authorized Service Centers
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('nearby')} className="hover:text-white transition-colors text-left">
                  Independent BGA Labs
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links: Decision Intelligence */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#DCE9DF] mb-4">
              Decision Suite
            </h4>
            <ul className="space-y-2.5 text-xs text-[#DCE9DF]/80">
              <li>
                <button onClick={() => setActiveTab('ai-agent')} className="hover:text-white transition-colors text-left">
                  Repair vs Replace Advisor
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ai-agent')} className="hover:text-white transition-colors text-left">
                  Pre-Purchase Worthiness Test
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('compare')} className="hover:text-white transition-colors text-left">
                  Device Comparison Matrix
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('assistant')} className="hover:text-white transition-colors text-left">
                  Safe Hardware Triage
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('garage')} className="hover:text-white transition-colors text-left">
                  My Devices Garage & TCO
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('auth')} className="hover:text-white transition-colors text-left font-semibold text-[#EEF5EF]">
                  Member Portal & Sign In →
                </button>
              </li>
            </ul>
          </div>

          {/* Standards & Transparency */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#DCE9DF] mb-4">
              Standards & Data
            </h4>
            <ul className="space-y-2.5 text-xs text-[#DCE9DF]/80">
              <li>
                <button onClick={() => setActiveTab('methodology')} className="hover:text-white transition-colors text-left">
                  Repairability Scoring Weights
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('methodology')} className="hover:text-white transition-colors text-left">
                  Parts Verification Protocols
                </button>
              </li>
              <li>
                <a 
                  href="https://consumeraffairs.nic.in/right-to-repair" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <span>India Right to Repair Portal</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li className="pt-2">
                <div className="p-2.5 rounded-lg bg-[#174C3C]/80 border border-[#DCE9DF]/15 text-[11px] text-[#DCE9DF]">
                  <div className="flex items-center space-x-1.5 font-bold text-white mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Real-Time Index</span>
                  </div>
                  Daily verified component pricing across major Indian tech clusters.
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#DCE9DF]/60 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} RevTech Technologies. All rights reserved.</p>
          <p className="text-[11px] max-w-xl text-center md:text-right text-[#DCE9DF]/50">
            RevTech is an independent decision platform. Product names, logos, and brands are property of their respective owners. Quotations reflect market survey medians and certified distributor lists.
          </p>
        </div>

      </div>
    </footer>
  );
};
