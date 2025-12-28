export interface Location {
    id: number;
    name: string;
    city: string;
    address: string;
    type: 'office' | 'warehouse' | 'store';
}
export interface Dealer {
    id: number;
    name: string;
    locationId: number;
    coefGeneral: number;
    coefPersonal: number;
}
export interface DealerMonthlyData {
    dealerId: number;
    salary: number;
    personalTurnover: number;
    vouchers: number;
}
export interface CalculationResult {
    name: string;
    locationName: string;
    month: string;
    year: number;
    salary: number;
    globalTurnover: number;
    personalTurnover: number;
    coefGeneral: number;
    coefPersonal: number;
    vouchers: number;
    targetBonus: number;
    bruto: number;
    bonus: number;
}
export interface ExcelRow {
    'Месец': string;
    'Година': number;
    'Обект': string;
    'Име': string;
    'Основна заплата': number;
    'Общ оборот': number;
    'Собствен оборот': number;
    'Коеф. общ': number;
    'Коеф. собствен': number;
    'Ваучери': number;
    'Бонус таргет': number;
    'Бруто': number;
    'Бонус': number;
}
export declare const DEFAULT_LOCATIONS: Omit<Location, 'id'>[];
//# sourceMappingURL=types.d.ts.map