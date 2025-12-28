import { DEFAULT_LOCATIONS } from './types.js';
const DEALERS_KEY = 'salary_calculator_dealers';
const LOCATIONS_KEY = 'salary_calculator_locations';
// ==================== LOCATIONS ====================
// Зареждане на обекти от localStorage
export function loadLocations() {
    const data = localStorage.getItem(LOCATIONS_KEY);
    if (!data) {
        // Първо зареждане - създаваме обектите по подразбиране
        const defaultLocs = initializeDefaultLocations();
        return defaultLocs;
    }
    try {
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Грешка при зареждане на обекти:', error);
        return initializeDefaultLocations();
    }
}
// Инициализиране на обектите по подразбиране
function initializeDefaultLocations() {
    const locations = DEFAULT_LOCATIONS.map((loc, index) => ({
        ...loc,
        id: Date.now() + index
    }));
    saveLocations(locations);
    return locations;
}
// Запазване на обекти в localStorage
export function saveLocations(locations) {
    try {
        localStorage.setItem(LOCATIONS_KEY, JSON.stringify(locations));
    }
    catch (error) {
        console.error('Грешка при запазване на обекти:', error);
    }
}
// Добавяне на обект
export function addLocation(locations, name, city, address, type) {
    const newLocation = {
        id: Date.now(),
        name,
        city,
        address,
        type
    };
    const updatedLocations = [...locations, newLocation];
    saveLocations(updatedLocations);
    return updatedLocations;
}
// Изтриване на обект
export function removeLocation(locations, id) {
    const updatedLocations = locations.filter(l => l.id !== id);
    saveLocations(updatedLocations);
    return updatedLocations;
}
// Вземане на обект по ID
export function getLocationById(locations, id) {
    return locations.find(l => l.id === id);
}
// ==================== DEALERS ====================
// Зареждане на дилъри от localStorage
export function loadDealers() {
    const data = localStorage.getItem(DEALERS_KEY);
    if (!data) {
        return [];
    }
    try {
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Грешка при зареждане на данни:', error);
        return [];
    }
}
// Запазване на дилъри в localStorage
export function saveDealers(dealers) {
    try {
        localStorage.setItem(DEALERS_KEY, JSON.stringify(dealers));
    }
    catch (error) {
        console.error('Грешка при запазване на данни:', error);
    }
}
// Добавяне на дилър
export function addDealer(dealers, name, locationId, coefGeneral, coefPersonal) {
    const newDealer = {
        id: Date.now(),
        name,
        locationId,
        coefGeneral,
        coefPersonal
    };
    const updatedDealers = [...dealers, newDealer];
    saveDealers(updatedDealers);
    return updatedDealers;
}
// Изтриване на дилър
export function removeDealer(dealers, id) {
    const updatedDealers = dealers.filter(d => d.id !== id);
    saveDealers(updatedDealers);
    return updatedDealers;
}
// Вземане на дилъри по обект
export function getDealersByLocation(dealers, locationId) {
    return dealers.filter(d => d.locationId === locationId);
}
// Изчистване на всички данни
export function clearAllData() {
    localStorage.removeItem(DEALERS_KEY);
    localStorage.removeItem(LOCATIONS_KEY);
}
//# sourceMappingURL=storage.js.map