import { Dealer, DealerMonthlyData, CalculationResult, Location } from './types.js';
export declare function calculateBruto(salary: number, globalTurnover: number, personalTurnover: number, coefGeneral: number, coefPersonal: number, targetBonus: number): number;
export declare function calculateTargetBonus(globalTurnover: number, target: number): number;
export declare function calculateBonus(bruto: number, salary: number, vouchers: number): number;
export declare function calculateForDealer(dealer: Dealer, monthlyData: DealerMonthlyData, globalTurnover: number, target: number, month: string, year: number, locations: Location[]): CalculationResult;
export declare function calculateForAllDealers(dealers: Dealer[], monthlyDataMap: Map<number, DealerMonthlyData>, globalTurnover: number, target: number, month: string, year: number, locations: Location[]): CalculationResult[];
//# sourceMappingURL=calculator.d.ts.map