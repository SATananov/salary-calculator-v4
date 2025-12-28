import { Dealer, DealerMonthlyData, CalculationResult, Location } from './types.js';
export declare function getInputValue(selector: string): string;
export declare function getNumberValue(selector: string): number;
export declare function clearInput(selector: string): void;
export declare function getNewLocationData(): {
    name: string;
    city: string;
    address: string;
    type: Location['type'];
} | null;
export declare function clearNewLocationForm(): void;
export declare function renderLocations(locations: Location[], onRemove: (id: number) => void): void;
export declare function populateLocationDropdowns(locations: Location[]): void;
export declare function getNewDealerData(): {
    name: string;
    locationId: number;
    coefGeneral: number;
    coefPersonal: number;
} | null;
export declare function clearNewDealerForm(): void;
export declare function getFilterLocation(): number | 'all';
export declare function renderDealers(dealers: Dealer[], locations: Location[], onRemove: (id: number) => void, filterLocationId?: number | 'all'): void;
export declare function renderDealersForLocation(dealers: Dealer[], onRemove: (id: number) => void): void;
export declare function getNewDealerDataSimple(): {
    name: string;
    coefGeneral: number;
    coefPersonal: number;
} | null;
export declare function getMonthlyData(dealers: Dealer[]): Map<number, DealerMonthlyData>;
export declare function getGlobalTurnover(): number | null;
export declare function getTarget(): number;
export declare function showTargetStatus(globalTurnover: number, target: number): void;
export declare function getMonth(): string;
export declare function getYear(): number | null;
export declare function setDefaultMonthYear(): void;
export declare function renderResults(results: CalculationResult[]): void;
export declare function renderResultsSimple(results: CalculationResult[]): void;
export declare function hideResults(): void;
export declare function clearAllMonthlyInputs(dealers: Dealer[]): void;
//# sourceMappingURL=ui.d.ts.map