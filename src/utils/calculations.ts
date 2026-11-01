export interface RepairCalculationResult {
  minTotalInr: number;
  maxTotalInr: number;
  averageInr: number;
  partsMin: number;
  partsMax: number;
  labour: number;
  extraCharges: number;
  isPartsOnly: boolean;
  notes: string;
}

export interface RepairVsReplaceInput {
  currentDeviceName: string;
  currentDeviceAgeMonths: number;
  estimatedResaleValueInr: number;
  repairCostInr: number;
  expectedLifeAfterRepairMonths: number;
  replacementDeviceName: string;
  replacementPriceInr: number;
  replacementLifespanMonths: number;
  userPriority: 'Save Upfront Cash' | 'Lowest Monthly Cost' | 'Latest Tech & Warranty' | 'Environmental Longevity';
}

export interface RepairVsReplaceResult {
  verdict: 'Repair appears more economical' | 'Replacement appears more economical' | 'Marginal / Situational decision';
  confidence: 'High' | 'Moderate' | 'Low';
  repairMonthlyCostInr: number;
  replacementMonthlyCostInr: number;
  monthlySavingsInr: number;
  breakEvenMonths: number;
  upfrontDifferenceInr: number;
  projectedCost2YearKeep: number;
  projectedCost2YearReplace: number;
  twoYearSavingsInr: number;
  headline: string;
  reasons: string[];
  recommendationDetails: string;
  actionAdvice: string[];
}

/**
 * Deterministic repair cost calculator
 */
export function calculateRepairEstimate(
  partsMin: number,
  partsMax: number,
  labour: number = 0,
  extraCharges: number = 0
): RepairCalculationResult {
  const pMin = Math.max(0, partsMin || 0);
  const pMax = Math.max(pMin, partsMax || pMin);
  const lab = Math.max(0, labour || 0);
  const extra = Math.max(0, extraCharges || 0);

  const minTotal = pMin + lab + extra;
  const maxTotal = pMax + lab + extra;
  const average = Math.round((minTotal + maxTotal) / 2);

  return {
    minTotalInr: minTotal,
    maxTotalInr: maxTotal,
    averageInr: average,
    partsMin: pMin,
    partsMax: pMax,
    labour: lab,
    extraCharges: extra,
    isPartsOnly: lab === 0,
    notes: lab === 0
      ? 'This estimate reflects component-only pricing. Professional bench installation typically ranges from ₹400 to ₹1,000.'
      : 'Estimate includes OEM-grade component, certified technician labour, and anti-static bench handling.',
  };
}

/**
 * Deterministic Repair vs. Replace Financial Engine
 * Treats initial device purchase as a SUNK COST, focusing on forward-looking marginal utility.
 */
export function evaluateRepairVsReplace(input: RepairVsReplaceInput): RepairVsReplaceResult {
  const repairCost = Math.max(100, input.repairCostInr || 2500);
  const repairLife = Math.max(3, input.expectedLifeAfterRepairMonths || 18);
  const replacementPrice = Math.max(1000, input.replacementPriceInr || 35000);
  const replacementLife = Math.max(12, input.replacementLifespanMonths || 36);
  const resaleValue = Math.max(0, input.estimatedResaleValueInr || 0);

  // Marginal net cost if replacing = Price - Resale of broken device
  const netReplacementCost = Math.max(1000, replacementPrice - Math.round(resaleValue * 0.6));

  // Amortized monthly cost:
  const repairMonthly = Math.round(repairCost / repairLife);
  const replacementMonthly = Math.round(netReplacementCost / replacementLife);

  // Upfront cash required difference:
  const upfrontDiff = netReplacementCost - repairCost;

  // Cost over a common 24-month horizon:
  // If keeping: Repair cost now + possible minor secondary maintenance (₹1,500)
  const cost2YrKeep = repairCost + (repairLife < 24 ? Math.round(repairCost * 0.4) : 0);
  // If replacing: Amortized 24-month share of new device
  const cost2YrReplace = Math.round(replacementMonthly * 24);
  const twoYearSavings = cost2YrReplace - cost2YrKeep;

  // Break-even month: when does repairing pay for itself compared to monthly replacement cost?
  const breakEvenMonths = Math.max(1, Math.round(repairCost / Math.max(1, replacementMonthly)));

  const repairRatio = (repairCost / netReplacementCost) * 100;

  let verdict: RepairVsReplaceResult['verdict'] = 'Repair appears more economical';
  let confidence: RepairVsReplaceResult['confidence'] = 'High';
  let headline = '';
  const reasons: string[] = [];

  if (repairRatio < 30 && input.currentDeviceAgeMonths < 42) {
    verdict = 'Repair appears more economical';
    confidence = 'High';
    headline = `Repairing for ₹${repairCost.toLocaleString('en-IN')} saves ₹${upfrontDiff.toLocaleString('en-IN')} upfront and pays for itself in just ${breakEvenMonths} months.`;
    reasons.push(
      `Repair cost is only ${repairRatio.toFixed(0)}% of the net replacement price (₹${netReplacementCost.toLocaleString('en-IN')}).`,
      `Your amortized cost to keep this phone is ₹${repairMonthly.toLocaleString('en-IN')}/month vs ₹${replacementMonthly.toLocaleString('en-IN')}/month for the new device.`,
      `Over 2 years, repairing saves an estimated ₹${twoYearSavings.toLocaleString('en-IN')} in capital expenditure.`,
      `Extending the phone by ${repairLife} months minimizes e-waste and keeps your configured apps intact.`
    );
  } else if (repairRatio > 60 || input.currentDeviceAgeMonths >= 48) {
    verdict = 'Replacement appears more economical';
    confidence = 'High';
    headline = `At ₹${repairCost.toLocaleString('en-IN')} (${repairRatio.toFixed(0)}% of replacement), upgrading offers superior longevity and fresh warranty.`;
    reasons.push(
      `The repair quote represents over ${repairRatio.toFixed(0)}% of replacement value on a ${input.currentDeviceAgeMonths}-month-old hardware platform.`,
      `Aging processor and discontinued software security updates make future component reliability unpredictable.`,
      `The replacement device comes with a full 12-month manufacturer warranty and current battery chemistry.`
    );
  } else {
    // 30% - 60% ratio: Context dependent
    if (input.userPriority === 'Save Upfront Cash') {
      verdict = 'Repair appears more economical';
      confidence = 'Moderate';
      headline = `Repairing minimizes immediate cash outflow by ₹${upfrontDiff.toLocaleString('en-IN')}, aligned with your budget goal.`;
      reasons.push(
        `Immediate out-of-pocket spend is strictly limited to ₹${repairCost.toLocaleString('en-IN')}.`,
        `Gives you ${repairLife} months of breathing room before making a larger capital purchase.`
      );
    } else if (input.userPriority === 'Latest Tech & Warranty') {
      verdict = 'Replacement appears more economical';
      confidence = 'Moderate';
      headline = `Given your preference for latest performance and full warranty, investing ₹${netReplacementCost.toLocaleString('en-IN')} provides higher peace of mind.`;
      reasons.push(
        `High repair quote on an older device carries risk of secondary motherboard or battery failure.`,
        `New handset includes upgraded modem, display brightness, and official warranty protection.`
      );
    } else {
      verdict = 'Marginal / Situational decision';
      confidence = 'Moderate';
      headline = `Repair and replacement have comparable 24-month amortized cost profiles. Choose based on cash availability.`;
      reasons.push(
        `Break-even point is at ${breakEvenMonths} months. If you intend to use the phone for longer than ${breakEvenMonths} months, repair is favorable.`,
        `If you need higher performance or security patches, replacement is warranted.`
      );
    }
  }

  return {
    verdict,
    confidence,
    repairMonthlyCostInr: repairMonthly,
    replacementMonthlyCostInr: replacementMonthly,
    monthlySavingsInr: Math.max(0, replacementMonthly - repairMonthly),
    breakEvenMonths,
    upfrontDifferenceInr: upfrontDiff,
    projectedCost2YearKeep: cost2YrKeep,
    projectedCost2YearReplace: cost2YrReplace,
    twoYearSavingsInr: twoYearSavings,
    headline,
    reasons,
    recommendationDetails: `By repairing, you avoid spending ₹${netReplacementCost.toLocaleString('en-IN')} immediately while keeping your device running for approx. ₹${repairMonthly.toLocaleString('en-IN')}/mo.`,
    actionAdvice: [
      'Obtain a binding written quote from a verified repair lab with at least 90-day parts warranty',
      'Perform a full cloud/local backup of all photos, authenticator apps, and messages before service',
      'Test touchscreen responsiveness, proximity sensor, and front camera before leaving the service counter'
    ]
  };
}

/**
 * LocalStorage wrapper for My Devices garage
 */
export interface UserSavedDevice {
  id: string;
  name: string;
  brand: string;
  purchaseDate: string;
  purchasePriceInr: number;
  condition: 'Excellent' | 'Good' | 'Minor Scratches' | 'Needs Repair';
  repairsLogged: {
    id: string;
    date: string;
    component: string;
    costInr: number;
    shopName: string;
  }[];
}

const STORAGE_KEY = 'revtech_user_garage_v1';

export function getSavedDevices(): UserSavedDevice[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed 1 default device for immediate visual satisfaction
      const initial: UserSavedDevice[] = [
        {
          id: 'dev-sample-1',
          name: 'Samsung Galaxy S23 (Daily Driver)',
          brand: 'Samsung',
          purchaseDate: '2023-04-15',
          purchasePriceInr: 54999,
          condition: 'Good',
          repairsLogged: [
            {
              id: 'rep-1',
              date: '2024-06-10',
              component: 'OEM Battery Replacement',
              costInr: 3200,
              shopName: 'Samsung SmartCare Plaza, Indore',
            },
          ],
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveDeviceToGarage(device: UserSavedDevice) {
  if (typeof window === 'undefined') return;
  const current = getSavedDevices();
  const existingIndex = current.findIndex((d) => d.id === device.id);
  if (existingIndex >= 0) {
    current[existingIndex] = device;
  } else {
    current.unshift(device);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function deleteDeviceFromGarage(id: string) {
  if (typeof window === 'undefined') return;
  const current = getSavedDevices().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}
