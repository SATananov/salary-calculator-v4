import { Dealer, Location } from './types.js';
export declare function loadLocations(): Location[];
export declare function saveLocations(locations: Location[]): void;
export declare function addLocation(locations: Location[], name: string, city: string, address: string, type: Location['type']): Location[];
export declare function removeLocation(locations: Location[], id: number): Location[];
export declare function getLocationById(locations: Location[], id: number): Location | undefined;
export declare function loadDealers(): Dealer[];
export declare function saveDealers(dealers: Dealer[]): void;
export declare function addDealer(dealers: Dealer[], name: string, locationId: number, coefGeneral: number, coefPersonal: number): Dealer[];
export declare function removeDealer(dealers: Dealer[], id: number): Dealer[];
export declare function getDealersByLocation(dealers: Dealer[], locationId: number): Dealer[];
export declare function clearAllData(): void;
//# sourceMappingURL=storage.d.ts.map