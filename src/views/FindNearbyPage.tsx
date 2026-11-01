import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Phone, 
  Clock, 
  Star, 
  ShieldCheck, 
  Navigation, 
  Filter, 
  Wrench, 
  ExternalLink, 
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';
import { PROVIDERS, Provider } from '../data/revtechData';
import { CITIES } from '../components/Navbar';

interface FindNearbyPageProps {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  initialComponent?: string;
  initialProductId?: string;
  onAskAIAboutShop?: (shopName: string) => void;
}

export const FindNearbyPage: React.FC<FindNearbyPageProps> = ({
  selectedCity,
  setSelectedCity,
  initialComponent,
  initialProductId,
  onAskAIAboutShop,
}) => {
  const [providerTypeFilter, setProviderTypeFilter] = useState<string>('All');
  const [componentFilter, setComponentFilter] = useState<string>(initialComponent || '');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = [
    { id: 'All', label: 'All Centers' },
    { id: 'Authorised Brand Service Center', label: 'Brand Authorized' },
    { id: 'Vetted Independent Specialist', label: 'Independent Labs' },
    { id: 'Direct Spare Parts Distributor', label: 'Parts Distributors' },
  ];

  const filteredProviders = PROVIDERS.filter((provider) => {
    // City filter
    if (provider.city.toLowerCase() !== selectedCity.toLowerCase()) {
      // If none match currently selected city, show Indore fallback seamlessly
      if (selectedCity !== 'Indore' && provider.city === 'Indore') return true;
    }
    // Type filter
    if (providerTypeFilter !== 'All' && provider.providerType !== providerTypeFilter) {
      return false;
    }
    // Search query or component filter
    const term = (searchQuery || componentFilter).toLowerCase().trim();
    if (term) {
      const matchName = provider.name.toLowerCase().includes(term);
      const matchLocality = provider.locality.toLowerCase().includes(term);
      const matchServices = provider.supportedServices.some((s) => s.toLowerCase().includes(term));
      const matchBrands = provider.brandsSpecialized.some((b) => b.toLowerCase().includes(term));
      if (!matchName && !matchLocality && !matchServices && !matchBrands) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#DCE4DC] pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" />
              <span>Verified Service Network</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#10382D]">
              Local Repair Centers & Parts Stockists
            </h1>
            <p className="text-sm text-[#5D6B63] mt-1">
              Verified repair centers, brand warranty hubs, and component distributors in <strong className="text-[#10382D]">{selectedCity}</strong>.
            </p>
          </div>

          {/* City Quick Switcher */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#78857D] font-medium">Switch City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs font-bold bg-white border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#174C3C] focus:border-[#174C3C] focus:outline-hidden shadow-xs"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Component Context Banner (if arrived from Spare Parts) */}
      {componentFilter && (
        <div className="bg-[#EEF5EF] border border-[#DCE9DF] rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wrench className="w-5 h-5 text-[#174C3C]" />
            <div>
              <p className="text-xs font-bold text-[#10382D]">
                Filtered for "{componentFilter}" Service & Stockists
              </p>
              <p className="text-[11px] text-[#5D6B63]">
                Highlighting certified centers equipped with precision tooling for this component.
              </p>
            </div>
          </div>
          <button
            onClick={() => setComponentFilter('')}
            className="text-xs text-[#174C3C] hover:underline font-bold flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Show All Services</span>
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-[#DCE4DC] p-4 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Segmented Control */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-[#F8FAF7] rounded-xl border border-[#DCE4DC]">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setProviderTypeFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  providerTypeFilter === tab.id
                    ? 'bg-[#174C3C] text-white shadow-xs'
                    : 'text-[#5D6B63] hover:text-[#10382D] hover:bg-[#EEF5EF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[#78857D] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search center name, locality, or brand..."
              className="w-full text-xs font-medium bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl pl-9 pr-3 py-2 text-[#1B2722] focus:border-[#174C3C] focus:outline-hidden"
            />
          </div>

        </div>

      </div>

      {/* Provider Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProviders.map((provider) => {
          const isBrandAuth = provider.providerType === 'Authorised Brand Service Center';
          const isDistributor = provider.providerType === 'Direct Spare Parts Distributor';
          const mapQuery = encodeURIComponent(`${provider.name}, ${provider.address}, ${provider.city}`);
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

          return (
            <div
              key={provider.id}
              className="bg-white rounded-2xl border border-[#DCE4DC] hover:border-[#174C3C] shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                
                {/* Header & Verification Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                      isBrandAuth
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : isDistributor
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-[#EEF5EF] text-[#174C3C] border-[#DCE9DF]'
                    }`}>
                      {provider.providerType}
                    </span>
                    <h3 className="text-base font-bold text-[#10382D] mt-1.5 flex items-center space-x-1.5">
                      <span>{provider.name}</span>
                      {provider.isVerified && (
                        <span title="RevTech Verified Location" className="inline-flex">
                          <ShieldCheck className="w-4 h-4 text-[#23734D] shrink-0" />
                        </span>
                      )}
                    </h3>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 bg-[#F8FAF7] border border-[#EFF3EE] px-2 py-1 rounded-lg shrink-0">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-[#10382D]">{provider.rating}</span>
                    <span className="text-[10px] text-[#78857D]">({provider.reviewCount})</span>
                  </div>
                </div>

                {/* Address & Timings */}
                <div className="space-y-1.5 text-xs text-[#5D6B63]">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-[#174C3C] shrink-0 mt-0.5" />
                    <span>{provider.address}, {provider.locality}, {provider.city} – {provider.postalCode}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-[#78857D] shrink-0" />
                    <span>{provider.hours}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-[#78857D] shrink-0" />
                    <span className="font-mono">{provider.phone}</span>
                  </div>
                </div>

                {/* Supported Services Badges */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#78857D] block mb-1.5">
                    Bench Capabilities & Stock:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {provider.supportedServices.map((service, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 bg-[#F8FAF7] text-[#1B2722] border border-[#EFF3EE] rounded-md"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#EFF3EE] flex items-center space-x-3">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 bg-[#174C3C] text-white text-xs font-bold rounded-xl hover:bg-[#10382D] transition-colors flex items-center justify-center space-x-1.5 text-center"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate (Google Maps)</span>
                </a>
                <a
                  href={`tel:${provider.phone.replace(/\s+/g, '')}`}
                  className="py-2 px-3 bg-[#EEF5EF] text-[#174C3C] text-xs font-bold rounded-xl hover:bg-[#DCE9DF] transition-colors flex items-center justify-center space-x-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Desk</span>
                </a>
              </div>

            </div>
          );
        })}
      </div>

      {/* Technician Pre-Service Advisory Checklist */}
      <div className="bg-[#EEF5EF] rounded-2xl p-6 border border-[#DCE4DC] space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4 text-[#23734D]" />
          <span>Consumer Protection Protocol</span>
        </div>
        <h3 className="text-base font-bold text-[#10382D]">
          What to Verify Before Handing Your Smartphone to Any Center
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#5D6B63]">
          <div className="bg-white p-4 rounded-xl border border-[#DCE4DC] space-y-1">
            <span className="font-bold text-[#10382D] block">1. Security & Backup</span>
            <p>Back up all data locally or to cloud. Remove SIM card and SD card. Never share screen lock PIN or passwords with technicians.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#DCE4DC] space-y-1">
            <span className="font-bold text-[#10382D] block">2. In-Store Hardware Test</span>
            <p>Before leaving the shop, dial *#0*# (Samsung) or test touch matrix, proximity sensor, earpiece, and charging speed in front of staff.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#DCE4DC] space-y-1">
            <span className="font-bold text-[#10382D] block">3. Written Warranty Bill</span>
            <p>Always demand an invoice specifying the part serial number and at least a 90-day physical/touch warranty policy.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
