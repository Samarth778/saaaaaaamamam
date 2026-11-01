import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './views/HomePage';
import { ExploreProductsPage } from './views/ExploreProductsPage';
import { SparePartsPage } from './views/SparePartsPage';
import { FindNearbyPage } from './views/FindNearbyPage';
import { CompareDevicesPage } from './views/CompareDevicesPage';
import { AIDecisionPage } from './views/AIDecisionPage';
import { RepairAssistantPage } from './views/RepairAssistantPage';
import { MyDevicesPage } from './views/MyDevicesPage';
import { MethodologyPage } from './views/MethodologyPage';
import { SignInPage } from './views/SignInPage';
import { RepairCalculatorModal } from './components/RepairCalculatorModal';
import { getSavedDevices } from './utils/calculations';
import { AuthUser, getCurrentUser, clearUserSession } from './utils/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCity, setSelectedCity] = useState<string>('Indore');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  
  // Cross-page Context
  const [selectedProductId, setSelectedProductId] = useState<string>('samsung-galaxy-s23');
  const [selectedComponentCategory, setSelectedComponentCategory] = useState<string>('Display');
  const [comparisonList, setComparisonList] = useState<string[]>(['samsung-galaxy-s23', 'apple-iphone-14']);
  const [savedCount, setSavedCount] = useState<number>(1);

  // Standalone Calculator Modal
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [calcPartName, setCalcPartName] = useState('Dynamic AMOLED Display Unit');
  const [calcMinCost, setCalcMinCost] = useState(8500);
  const [calcMaxCost, setCalcMaxCost] = useState(11500);
  const [calcLabour, setCalcLabour] = useState(850);

  // Load auth user and saved devices count on boot
  useEffect(() => {
    setCurrentUser(getCurrentUser());
    setSavedCount(getSavedDevices().length);
  }, [activeTab]);

  const handleSignOut = () => {
    clearUserSession();
    setCurrentUser(null);
  };

  // Handle Scenario Quick-Launches
  const handleStartScenario = (scenario: 's23-screen' | 'ip14-battery' | 'redmi-buy') => {
    if (scenario === 's23-screen') {
      setSelectedProductId('samsung-galaxy-s23');
      setSelectedComponentCategory('Display');
      setActiveTab('parts');
    } else if (scenario === 'ip14-battery') {
      setSelectedProductId('apple-iphone-14');
      setSelectedComponentCategory('Battery');
      setActiveTab('ai-agent');
    } else if (scenario === 'redmi-buy') {
      setSelectedProductId('xiaomi-redmi-note-13-pro-plus');
      setActiveTab('ai-agent');
    }
  };

  const handleOpenCalculator = (partName: string, minCost: number, maxCost: number, labour: number) => {
    setCalcPartName(partName);
    setCalcMinCost(minCost);
    setCalcMaxCost(maxCost);
    setCalcLabour(labour);
    setCalcModalOpen(true);
  };

  const handleJumpFromCalcToAI = (avgCost: number, partName: string) => {
    setSelectedComponentCategory(partName);
    setActiveTab('ai-agent');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF7] text-[#1B2722]">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        savedDevicesCount={savedCount}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main Content Pages */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={setActiveTab}
            onSelectProduct={(id) => {
              setSelectedProductId(id);
              setActiveTab('products');
            }}
            onSelectComponent={(category, productId) => {
              if (productId) setSelectedProductId(productId);
              setSelectedComponentCategory(category);
              setActiveTab('parts');
            }}
            onStartScenario={handleStartScenario}
            selectedCity={selectedCity}
          />
        )}

        {activeTab === 'products' && (
          <ExploreProductsPage
            onSelectProductForParts={(id) => {
              setSelectedProductId(id);
              setActiveTab('parts');
            }}
            onAskAIAboutProduct={(id) => {
              setSelectedProductId(id);
              setActiveTab('ai-agent');
            }}
            comparisonList={comparisonList}
            setComparisonList={setComparisonList}
            onGoToCompare={() => setActiveTab('compare')}
            initialProductId={selectedProductId}
          />
        )}

        {activeTab === 'parts' && (
          <SparePartsPage
            onFindNearby={(category, productId) => {
              setSelectedComponentCategory(category);
              setSelectedProductId(productId);
              setActiveTab('nearby');
            }}
            onOpenCalculator={handleOpenCalculator}
            initialProductId={selectedProductId}
            initialCategory={selectedComponentCategory}
            selectedCity={selectedCity}
          />
        )}

        {activeTab === 'nearby' && (
          <FindNearbyPage
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            initialComponent={selectedComponentCategory}
            initialProductId={selectedProductId}
            onAskAIAboutShop={() => setActiveTab('ai-agent')}
          />
        )}

        {activeTab === 'compare' && (
          <CompareDevicesPage
            comparisonList={comparisonList}
            setComparisonList={setComparisonList}
            onGoToExplore={() => setActiveTab('products')}
            onSelectForParts={(id) => {
              setSelectedProductId(id);
              setActiveTab('parts');
            }}
            onAskAI={(id) => {
              setSelectedProductId(id);
              setActiveTab('ai-agent');
            }}
          />
        )}

        {activeTab === 'ai-agent' && (
          <AIDecisionPage
            onFindParts={(productId) => {
              setSelectedProductId(productId);
              setActiveTab('parts');
            }}
            onFindNearby={(component, productId) => {
              setSelectedComponentCategory(component);
              setSelectedProductId(productId);
              setActiveTab('nearby');
            }}
            initialProductId={selectedProductId}
            initialComponent={selectedComponentCategory}
            initialRepairCost={calcMinCost}
            selectedCity={selectedCity}
          />
        )}

        {activeTab === 'assistant' && (
          <RepairAssistantPage
            onFindParts={(category, productId) => {
              setSelectedComponentCategory(category);
              setSelectedProductId(productId);
              setActiveTab('parts');
            }}
            onFindNearby={(component, productId) => {
              setSelectedComponentCategory(component);
              setSelectedProductId(productId);
              setActiveTab('nearby');
            }}
            selectedCity={selectedCity}
          />
        )}

        {activeTab === 'garage' && (
          <MyDevicesPage
            onSelectForParts={(productId) => {
              setSelectedProductId(productId);
              setActiveTab('parts');
            }}
            onOpenAIDecision={(productId) => {
              setSelectedProductId(productId);
              setActiveTab('ai-agent');
            }}
          />
        )}

        {activeTab === 'auth' && (
          <SignInPage
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            onNavigateAfterLogin={(tab) => setActiveTab(tab)}
            selectedCity={selectedCity}
          />
        )}

        {activeTab === 'methodology' && <MethodologyPage />}
      </main>

      {/* Global Interactive Repair Calculator Modal */}
      <RepairCalculatorModal
        isOpen={calcModalOpen}
        onClose={() => setCalcModalOpen(false)}
        partName={calcPartName}
        initialMinPartsCost={calcMinCost}
        initialMaxPartsCost={calcMaxCost}
        initialLabourCost={calcLabour}
        onJumpToAIDecision={handleJumpFromCalcToAI}
      />

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
