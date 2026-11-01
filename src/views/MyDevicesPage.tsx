import React, { useState, useEffect } from 'react';
import { 
  BookmarkCheck, 
  Plus, 
  Trash2, 
  Wrench, 
  Calendar, 
  Tag, 
  DollarSign, 
  Smartphone, 
  TrendingUp, 
  CheckCircle2, 
  X,
  History
} from 'lucide-react';
import { 
  getSavedDevices, 
  saveDeviceToGarage, 
  deleteDeviceFromGarage, 
  UserSavedDevice 
} from '../utils/calculations';
import { PRODUCTS } from '../data/revtechData';

interface MyDevicesPageProps {
  onSelectForParts: (productId: string) => void;
  onOpenAIDecision: (productId: string) => void;
}

export const MyDevicesPage: React.FC<MyDevicesPageProps> = ({
  onSelectForParts,
  onOpenAIDecision,
}) => {
  const [devices, setDevices] = useState<UserSavedDevice[]>([]);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [activeLogRepairDeviceId, setActiveLogRepairDeviceId] = useState<string | null>(null);

  // New device form state
  const [newDeviceName, setNewDeviceName] = useState('Samsung Galaxy S23');
  const [newDeviceBrand, setNewDeviceBrand] = useState('Samsung');
  const [newPurchaseDate, setNewPurchaseDate] = useState('2023-05-10');
  const [newPurchasePrice, setNewPurchasePrice] = useState(54999);
  const [newCondition, setNewCondition] = useState<UserSavedDevice['condition']>('Good');

  // Repair log form state
  const [repairComponent, setRepairComponent] = useState('Display Replacement');
  const [repairCost, setRepairCost] = useState(3500);
  const [repairShop, setRepairShop] = useState('TechFix Pro Express, Indore');

  useEffect(() => {
    setDevices(getSavedDevices());
  }, []);

  const handleCreateDevice = (e: React.FormEvent) => {
    e.preventDefault();
    const created: UserSavedDevice = {
      id: `dev-${Date.now()}`,
      name: newDeviceName,
      brand: newDeviceBrand,
      purchaseDate: newPurchaseDate,
      purchasePriceInr: Number(newPurchasePrice) || 30000,
      condition: newCondition,
      repairsLogged: [],
    };
    saveDeviceToGarage(created);
    setDevices(getSavedDevices());
    setIsAddDeviceOpen(false);
  };

  const handleAddRepairLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLogRepairDeviceId) return;
    const current = getSavedDevices();
    const target = current.find((d) => d.id === activeLogRepairDeviceId);
    if (target) {
      target.repairsLogged.push({
        id: `rep-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        component: repairComponent,
        costInr: Number(repairCost) || 0,
        shopName: repairShop,
      });
      saveDeviceToGarage(target);
      setDevices(getSavedDevices());
      setActiveLogRepairDeviceId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this device from your garage?')) {
      deleteDeviceFromGarage(id);
      setDevices(getSavedDevices());
    }
  };

  // Fleet stats
  const totalHardwareInvested = devices.reduce((sum, d) => sum + d.purchasePriceInr, 0);
  const totalRepairsSpent = devices.reduce((sum, d) => sum + d.repairsLogged.reduce((rSum, r) => rSum + r.costInr, 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#DCE4DC] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider mb-1">
            <BookmarkCheck className="w-4 h-4" />
            <span>Personal Hardware Garage</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#10382D]">
            My Devices & Ownership Cost Tracker
          </h1>
          <p className="text-sm text-[#5D6B63] mt-1">
            Track real maintenance expenditures, amortized cost-per-day, and lifecycle longevity for your smartphones.
          </p>
        </div>

        <button
          onClick={() => setIsAddDeviceOpen(true)}
          className="py-2.5 px-4 bg-[#174C3C] hover:bg-[#10382D] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Device to Garage</span>
        </button>
      </div>

      {/* Fleet Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white rounded-2xl border border-[#DCE4DC] p-6 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#78857D] uppercase">Total Active Devices</span>
          <p className="text-2xl font-extrabold text-[#10382D] font-mono mt-1">{devices.length} Handsets</p>
          <span className="text-[11px] text-[#5D6B63]">Tracked in browser local storage</span>
        </div>
        <div>
          <span className="text-xs font-bold text-[#78857D] uppercase">Total Acquisition Cost</span>
          <p className="text-2xl font-extrabold text-[#10382D] font-mono mt-1">
            ₹{totalHardwareInvested.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-[#5D6B63]">Combined original purchase prices</span>
        </div>
        <div>
          <span className="text-xs font-bold text-[#78857D] uppercase">Logged Repairs Spent</span>
          <p className="text-2xl font-extrabold text-[#174C3C] font-mono mt-1">
            ₹{totalRepairsSpent.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-[#23734D] font-semibold">
            {totalHardwareInvested > 0 ? `${((totalRepairsSpent / totalHardwareInvested) * 100).toFixed(1)}% of initial cost` : 'No repairs yet'}
          </span>
        </div>
      </div>

      {/* Devices List */}
      {devices.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-[#DCE4DC] p-12 text-center space-y-4">
          <Smartphone className="w-12 h-12 text-[#174C3C] mx-auto opacity-70" />
          <h3 className="text-base font-bold text-[#10382D]">Your device garage is empty</h3>
          <p className="text-xs text-[#5D6B63] max-w-md mx-auto">
            Add your current phone to monitor maintenance costs, battery degradation cycles, and calculate when future repairs break even.
          </p>
          <button
            onClick={() => setIsAddDeviceOpen(true)}
            className="px-4 py-2 bg-[#174C3C] text-white text-xs font-bold rounded-xl"
          >
            Add Your First Device
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {devices.map((device) => {
            const purchase = new Date(device.purchaseDate);
            const now = new Date();
            const diffMonths = Math.max(1, Math.round((now.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24 * 30.4)));
            const daysOwned = Math.max(1, Math.round((now.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24)));
            const repairsSum = device.repairsLogged.reduce((sum, r) => sum + r.costInr, 0);
            const totalCost = device.purchasePriceInr + repairsSum;
            const costPerDay = Math.round(totalCost / daysOwned);

            return (
              <div
                key={device.id}
                className="bg-white rounded-2xl border border-[#DCE4DC] hover:border-[#174C3C] shadow-xs hover:shadow-md transition-all p-6 space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  
                  {/* Top Bar */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#EEF5EF] text-[#174C3C] rounded">
                        {device.brand}
                      </span>
                      <h3 className="text-lg font-bold text-[#10382D] mt-1">
                        {device.name}
                      </h3>
                      <p className="text-xs text-[#5D6B63]">
                        Acquired {device.purchaseDate} ({diffMonths} months ago)
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(device.id)}
                      className="text-[#78857D] hover:text-[#B42318] p-1.5 rounded-lg hover:bg-[#F8FAF7]"
                      title="Remove device"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Ownership Stats */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-[#F8FAF7] rounded-xl border border-[#EFF3EE] text-center text-xs">
                    <div>
                      <span className="text-[#78857D] text-[10px] block">Purchase Price</span>
                      <span className="font-extrabold text-[#10382D] font-mono">
                        ₹{device.purchasePriceInr.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#78857D] text-[10px] block">Total Repairs</span>
                      <span className="font-extrabold text-[#174C3C] font-mono">
                        ₹{repairsSum.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#78857D] text-[10px] block">Cost / Day</span>
                      <span className="font-extrabold text-[#23734D] font-mono">
                        ₹{costPerDay}/day
                      </span>
                    </div>
                  </div>

                  {/* Maintenance Log */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#78857D] uppercase">
                        Service & Repair History ({device.repairsLogged.length})
                      </span>
                      <button
                        onClick={() => setActiveLogRepairDeviceId(device.id)}
                        className="text-[11px] font-bold text-[#174C3C] hover:underline flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Log Expense</span>
                      </button>
                    </div>

                    {device.repairsLogged.length === 0 ? (
                      <p className="text-[11px] text-[#78857D] italic p-2 bg-[#F8FAF7] rounded-lg">
                        No maintenance events logged yet.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {device.repairsLogged.map((rep) => (
                          <div
                            key={rep.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAF7] border border-[#EFF3EE] text-xs"
                          >
                            <div>
                              <span className="font-semibold text-[#10382D]">{rep.component}</span>
                              <span className="text-[10px] text-[#78857D] block">{rep.date} • {rep.shopName}</span>
                            </div>
                            <span className="font-bold text-[#10382D] font-mono">
                              ₹{rep.costInr.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-[#EFF3EE] flex gap-2">
                  <button
                    onClick={() => onSelectForParts('samsung-galaxy-s23')}
                    className="flex-1 py-2 bg-[#EEF5EF] text-[#174C3C] text-xs font-bold rounded-xl hover:bg-[#DCE9DF] transition-colors flex items-center justify-center space-x-1"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Find Parts</span>
                  </button>
                  <button
                    onClick={() => onOpenAIDecision('samsung-galaxy-s23')}
                    className="flex-1 py-2 bg-[#174C3C] text-white text-xs font-bold rounded-xl hover:bg-[#10382D] transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>Repair vs Replace</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add Device Modal */}
      {isAddDeviceOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#DCE4DC] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFF3EE]">
              <h3 className="text-base font-bold text-[#10382D]">Add Smartphone to Garage</h3>
              <button onClick={() => setIsAddDeviceOpen(false)} className="text-[#78857D] hover:text-[#10382D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDevice} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#78857D] block mb-1">Select from Catalog or Custom</label>
                <select
                  value={newDeviceName}
                  onChange={(e) => {
                    setNewDeviceName(e.target.value);
                    const match = PRODUCTS.find((p) => `${p.brand} ${p.modelName}` === e.target.value);
                    if (match) {
                      setNewDeviceBrand(match.brand);
                      setNewPurchasePrice(match.priceInr);
                    }
                  }}
                  className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D]"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={`${p.brand} ${p.modelName}`}>
                      {p.brand} {p.modelName} ({p.variant})
                    </option>
                  ))}
                  <option value="Custom Handset">Other Custom Smartphone</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#78857D] block mb-1">Purchase Date</label>
                <input
                  type="date"
                  value={newPurchaseDate}
                  onChange={(e) => setNewPurchaseDate(e.target.value)}
                  className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D]"
                />
              </div>

              <div>
                <label className="font-bold text-[#78857D] block mb-1">Original Purchase Price (₹)</label>
                <input
                  type="number"
                  value={newPurchasePrice}
                  onChange={(e) => setNewPurchasePrice(Number(e.target.value))}
                  className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#174C3C] text-white font-bold rounded-xl hover:bg-[#10382D]"
                >
                  Save Device
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddDeviceOpen(false)}
                  className="px-4 py-2.5 bg-[#EFF3EE] text-[#5D6B63] font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Repair Modal */}
      {activeLogRepairDeviceId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#DCE4DC] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFF3EE]">
              <h3 className="text-base font-bold text-[#10382D]">Log Repair Expense</h3>
              <button onClick={() => setActiveLogRepairDeviceId(null)} className="text-[#78857D] hover:text-[#10382D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRepairLog} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#78857D] block mb-1">Repaired Component</label>
                <input
                  type="text"
                  value={repairComponent}
                  onChange={(e) => setRepairComponent(e.target.value)}
                  placeholder="e.g. Battery Replacement, Display Swap"
                  className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#78857D] block mb-1">Total Cost Paid (₹)</label>
                <input
                  type="number"
                  value={repairCost}
                  onChange={(e) => setRepairCost(Number(e.target.value))}
                  className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#78857D] block mb-1">Service Center / Shop Name</label>
                <input
                  type="text"
                  value={repairShop}
                  onChange={(e) => setRepairShop(e.target.value)}
                  placeholder="e.g. Samsung SmartCare, Orbit Mall"
                  className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D]"
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#174C3C] text-white font-bold rounded-xl hover:bg-[#10382D]"
                >
                  Save Log Entry
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLogRepairDeviceId(null)}
                  className="px-4 py-2.5 bg-[#EFF3EE] text-[#5D6B63] font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
