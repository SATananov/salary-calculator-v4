import { Dealer, DealerMonthlyData, CalculationResult, Location } from './types.js';

// Селектори за елементи
const selectors = {
    // Location selectors
    locationsGrid: '#locationsGrid',
    locationName: '#locationName',
    locationCity: '#locationCity',
    locationAddress: '#locationAddress',
    locationType: '#locationType',
    
    // Dealer selectors
    dealerName: '#dealerName',
    dealerLocation: '#dealerLocation',
    coefGeneral: '#coefGeneral',
    coefPersonal: '#coefPersonal',
    dealersList: '#dealersList',
    
    // Filter
    filterLocation: '#filterLocation',
    
    // Global data
    globalTurnover: '#globalTurnover',
    month: '#month',
    year: '#year',
    
    // Results
    resultsSection: '#resultsSection',
    resultsBody: '#resultsBody'
} as const;

// Вземане на елемент по селектор
function getElement<T extends HTMLElement>(selector: string): T {
    const element = document.querySelector(selector);
    if (!element) {
        throw new Error(`Елементът ${selector} не е намерен`);
    }
    return element as T;
}

// Вземане на стойност от input
export function getInputValue(selector: string): string {
    const input = getElement<HTMLInputElement>(selector);
    return input.value.trim();
}

// Вземане на числова стойност от input
export function getNumberValue(selector: string): number {
    const value = getInputValue(selector);
    return parseFloat(value) || 0;
}

// Изчистване на input поле
export function clearInput(selector: string): void {
    const input = getElement<HTMLInputElement>(selector);
    input.value = '';
}

// ==================== LOCATIONS ====================

// Вземане на данни за нов обект
export function getNewLocationData(): { name: string; city: string; address: string; type: Location['type'] } | null {
    const name = getInputValue(selectors.locationName);
    const city = getInputValue(selectors.locationCity);
    const address = getInputValue(selectors.locationAddress);
    const typeSelect = getElement<HTMLSelectElement>(selectors.locationType);
    const type = typeSelect.value as Location['type'];
    
    if (!name) {
        alert('Моля, въведи име на обекта!');
        return null;
    }
    
    if (!city) {
        alert('Моля, въведи град!');
        return null;
    }
    
    return { name, city, address, type };
}

// Изчистване на формата за нов обект
export function clearNewLocationForm(): void {
    clearInput(selectors.locationName);
    clearInput(selectors.locationCity);
    clearInput(selectors.locationAddress);
}

// Рендериране на обектите
export function renderLocations(locations: Location[], onRemove: (id: number) => void): void {
    const grid = getElement<HTMLDivElement>(selectors.locationsGrid);
    
    if (locations.length === 0) {
        grid.innerHTML = '<p class="empty-state">Няма добавени обекти.</p>';
        return;
    }
    
    grid.innerHTML = locations.map(loc => `
        <div class="location-chip type-${loc.type}" data-location-id="${loc.id}">
            <div class="location-chip-info">
                <span class="location-chip-name">${escapeHtml(loc.name)}</span>
                <span class="location-chip-city">${escapeHtml(loc.city)}</span>
            </div>
            <button class="location-chip-remove" data-location-id="${loc.id}" title="Изтрий">×</button>
        </div>
    `).join('');
    
    // Event listeners за изтриване
    grid.querySelectorAll('.location-chip-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLButtonElement;
            const id = parseInt(target.dataset.locationId || '0');
            if (id && confirm('Сигурен ли си, че искаш да изтриеш този обект? Дилърите към него ще останат без обект.')) {
                onRemove(id);
            }
        });
    });
}

// Попълване на dropdown за обекти
export function populateLocationDropdowns(locations: Location[]): void {
    const dealerSelect = document.querySelector(selectors.dealerLocation) as HTMLSelectElement;
    const filterSelect = document.querySelector(selectors.filterLocation) as HTMLSelectElement;
    
    const options = locations.map(loc => 
        `<option value="${loc.id}">${escapeHtml(loc.name)} (${escapeHtml(loc.city)})</option>`
    ).join('');
    
    if (dealerSelect) {
        dealerSelect.innerHTML = options || '<option value="">Няма обекти</option>';
    }
    
    if (filterSelect) {
        filterSelect.innerHTML = '<option value="all">Всички обекти</option>' + options;
    }
}

// ==================== DEALERS ====================

// Вземане на данни за нов дилър
export function getNewDealerData(): { name: string; locationId: number; coefGeneral: number; coefPersonal: number } | null {
    const name = getInputValue(selectors.dealerName);
    const locationSelect = getElement<HTMLSelectElement>(selectors.dealerLocation);
    const locationId = parseInt(locationSelect.value);
    const coefGeneral = getNumberValue(selectors.coefGeneral);
    const coefPersonal = getNumberValue(selectors.coefPersonal);
    
    if (!name) {
        alert('Моля, въведи име на дилъра!');
        return null;
    }
    
    if (!locationId) {
        alert('Моля, избери обект!');
        return null;
    }
    
    if (isNaN(coefGeneral) || coefGeneral === 0) {
        alert('Моля, въведи валиден коефициент за общ оборот!');
        return null;
    }
    
    if (isNaN(coefPersonal) || coefPersonal === 0) {
        alert('Моля, въведи валиден коефициент за собствен оборот!');
        return null;
    }
    
    return { name, locationId, coefGeneral, coefPersonal };
}

// Изчистване на формата за нов дилър
export function clearNewDealerForm(): void {
    clearInput(selectors.dealerName);
    clearInput(selectors.coefGeneral);
    clearInput(selectors.coefPersonal);
}

// Запазване на текущите стойности от input полетата
function saveCurrentInputValues(dealers: Dealer[]): Map<number, { salary: string; turnover: string; vouchers: string }> {
    const savedValues = new Map();
    
    for (const dealer of dealers) {
        const salaryInput = document.querySelector(`#salary_${dealer.id}`) as HTMLInputElement;
        const turnoverInput = document.querySelector(`#turnover_${dealer.id}`) as HTMLInputElement;
        const vouchersInput = document.querySelector(`#vouchers_${dealer.id}`) as HTMLInputElement;
        
        if (salaryInput || turnoverInput || vouchersInput) {
            savedValues.set(dealer.id, {
                salary: salaryInput?.value || '',
                turnover: turnoverInput?.value || '',
                vouchers: vouchersInput?.value || ''
            });
        }
    }
    
    return savedValues;
}

// Възстановяване на стойностите в input полетата
function restoreInputValues(savedValues: Map<number, { salary: string; turnover: string; vouchers: string }>): void {
    savedValues.forEach((values, dealerId) => {
        const salaryInput = document.querySelector(`#salary_${dealerId}`) as HTMLInputElement;
        const turnoverInput = document.querySelector(`#turnover_${dealerId}`) as HTMLInputElement;
        const vouchersInput = document.querySelector(`#vouchers_${dealerId}`) as HTMLInputElement;
        
        if (salaryInput) salaryInput.value = values.salary;
        if (turnoverInput) turnoverInput.value = values.turnover;
        if (vouchersInput) vouchersInput.value = values.vouchers;
    });
}

// Вземане на избрания филтър
export function getFilterLocation(): number | 'all' {
    const select = document.querySelector(selectors.filterLocation) as HTMLSelectElement;
    if (!select || select.value === 'all') return 'all';
    return parseInt(select.value);
}

// Рендериране на списъка с дилъри (стар метод за съвместимост)
export function renderDealers(
    dealers: Dealer[], 
    locations: Location[],
    onRemove: (id: number) => void,
    filterLocationId: number | 'all' = 'all'
): void {
    const container = getElement<HTMLDivElement>(selectors.dealersList);
    
    // Запазване на текущите стойности преди рендериране
    const savedValues = saveCurrentInputValues(dealers);
    
    // Филтриране по обект
    let filteredDealers = dealers;
    if (filterLocationId !== 'all') {
        filteredDealers = dealers.filter(d => d.locationId === filterLocationId);
    }
    
    if (filteredDealers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Няма добавени дилъри${filterLocationId !== 'all' ? ' за този обект' : ''}.</p>
                <p>Добави дилър от формата по-горе.</p>
            </div>
        `;
        return;
    }
    
    // Групиране по обекти
    const dealersByLocation = new Map<number, Dealer[]>();
    filteredDealers.forEach(dealer => {
        const locDealers = dealersByLocation.get(dealer.locationId) || [];
        locDealers.push(dealer);
        dealersByLocation.set(dealer.locationId, locDealers);
    });
    
    let html = '';
    
    dealersByLocation.forEach((locDealers, locationId) => {
        const location = locations.find(l => l.id === locationId);
        const locationName = location ? `${location.name} (${location.city})` : 'Неизвестен обект';
        
        html += `<div class="location-group">
            <h3 class="location-group-title">📍 ${escapeHtml(locationName)}</h3>`;
        
        html += locDealers.map(dealer => `
            <div class="dealer-card" data-dealer-id="${dealer.id}">
                <div class="dealer-header">
                    <div>
                        <span class="dealer-name">${escapeHtml(dealer.name)}</span>
                        <div class="dealer-coefficients">
                            Коеф. общ: ${dealer.coefGeneral} | Коеф. собствен: ${dealer.coefPersonal}
                        </div>
                    </div>
                    <button class="btn-danger btn-remove" data-dealer-id="${dealer.id}">Изтрий</button>
                </div>
                <div class="dealer-inputs">
                    <div class="form-group">
                        <label>Основна заплата</label>
                        <input type="number" id="salary_${dealer.id}" placeholder="Напр. 750" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Собствен оборот</label>
                        <input type="number" id="turnover_${dealer.id}" placeholder="Напр. 27582" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Ваучери за храна</label>
                        <input type="number" id="vouchers_${dealer.id}" placeholder="Напр. 200" step="0.01">
                    </div>
                </div>
            </div>
        `).join('');
        
        html += '</div>';
    });
    
    container.innerHTML = html;
    
    // Възстановяване на запазените стойности
    restoreInputValues(savedValues);
    
    // Добавяне на event listeners за бутоните за изтриване
    const removeButtons = container.querySelectorAll('.btn-remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const target = e.target as HTMLButtonElement;
            const dealerId = parseInt(target.dataset.dealerId || '0');
            if (dealerId && confirm('Сигурен ли си, че искаш да изтриеш този дилър?')) {
                onRemove(dealerId);
            }
        });
    });
}

// Рендериране на дилъри за конкретен обект (нов опростен метод)
export function renderDealersForLocation(
    dealers: Dealer[], 
    onRemove: (id: number) => void
): void {
    const container = getElement<HTMLDivElement>(selectors.dealersList);
    
    // Запазване на текущите стойности преди рендериране
    const savedValues = saveCurrentInputValues(dealers);
    
    if (dealers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Няма добавени дилъри за този обект.</p>
                <p>Добави дилър от формата по-горе.</p>
            </div>
        `;
        return;
    }
    
    const html = dealers.map(dealer => `
        <div class="dealer-card" data-dealer-id="${dealer.id}">
            <div class="dealer-header">
                <div>
                    <span class="dealer-name">${escapeHtml(dealer.name)}</span>
                    <div class="dealer-coefficients">
                        Коеф. общ: ${dealer.coefGeneral} | Коеф. собствен: ${dealer.coefPersonal}
                    </div>
                </div>
                <button class="btn-danger btn-remove" data-dealer-id="${dealer.id}">Изтрий</button>
            </div>
            <div class="dealer-inputs">
                <div class="form-group">
                    <label>Основна заплата</label>
                    <input type="number" id="salary_${dealer.id}" placeholder="Напр. 750" step="0.01">
                </div>
                <div class="form-group">
                    <label>Собствен оборот</label>
                    <input type="number" id="turnover_${dealer.id}" placeholder="Напр. 27582" step="0.01">
                </div>
                <div class="form-group">
                    <label>Ваучери за храна</label>
                    <input type="number" id="vouchers_${dealer.id}" placeholder="Напр. 200" step="0.01">
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
    
    // Възстановяване на запазените стойности
    restoreInputValues(savedValues);
    
    // Добавяне на event listeners за бутоните за изтриване
    const removeButtons = container.querySelectorAll('.btn-remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const target = e.target as HTMLButtonElement;
            const dealerId = parseInt(target.dataset.dealerId || '0');
            if (dealerId && confirm('Сигурен ли си, че искаш да изтриеш този дилър?')) {
                onRemove(dealerId);
            }
        });
    });
}

// Вземане на данни за нов дилър (опростен вариант без location dropdown)
export function getNewDealerDataSimple(): { name: string; coefGeneral: number; coefPersonal: number } | null {
    const name = getInputValue(selectors.dealerName);
    const coefGeneral = getNumberValue(selectors.coefGeneral);
    const coefPersonal = getNumberValue(selectors.coefPersonal);
    
    if (!name) {
        alert('Моля, въведи име на дилъра!');
        return null;
    }
    
    if (isNaN(coefGeneral) || coefGeneral === 0) {
        alert('Моля, въведи валиден коефициент за общ оборот!');
        return null;
    }
    
    if (isNaN(coefPersonal) || coefPersonal === 0) {
        alert('Моля, въведи валиден коефициент за собствен оборот!');
        return null;
    }
    
    return { name, coefGeneral, coefPersonal };
}

// Вземане на месечните данни за всички дилъри
export function getMonthlyData(dealers: Dealer[]): Map<number, DealerMonthlyData> {
    const dataMap = new Map<number, DealerMonthlyData>();
    
    for (const dealer of dealers) {
        const salary = getNumberValue(`#salary_${dealer.id}`);
        const personalTurnover = getNumberValue(`#turnover_${dealer.id}`);
        const vouchers = getNumberValue(`#vouchers_${dealer.id}`);
        
        dataMap.set(dealer.id, {
            dealerId: dealer.id,
            salary,
            personalTurnover,
            vouchers
        });
    }
    
    return dataMap;
}

// ==================== GLOBAL DATA ====================

// Вземане на общия оборот
export function getGlobalTurnover(): number | null {
    const value = getNumberValue(selectors.globalTurnover);
    
    if (isNaN(value) || value === 0) {
        alert('Моля, въведи общия оборот!');
        return null;
    }
    
    return value;
}

// Вземане на таргета
export function getTarget(): number {
    const input = document.querySelector('#targetTurnover') as HTMLInputElement;
    if (!input) return 0;
    return parseFloat(input.value) || 0;
}

// Показване на статус за таргета
export function showTargetStatus(globalTurnover: number, target: number): void {
    const statusDiv = document.getElementById('targetStatus');
    const resultDiv = document.getElementById('targetResult');
    
    if (target <= 0) {
        if (statusDiv) statusDiv.style.display = 'none';
        if (resultDiv) resultDiv.style.display = 'none';
        return;
    }
    
    const percentage = (globalTurnover / target) * 100;
    const isReached = percentage >= 100;
    
    const statusHtml = isReached 
        ? `✅ Таргетът е достигнат! <strong>${percentage.toFixed(1)}%</strong> (${globalTurnover.toFixed(2)} лв. от ${target.toFixed(2)} лв.)`
        : `❌ Таргетът НЕ е достигнат: <strong>${percentage.toFixed(1)}%</strong> (${globalTurnover.toFixed(2)} лв. от ${target.toFixed(2)} лв.) — Остават ${(target - globalTurnover).toFixed(2)} лв.`;
    
    if (statusDiv) {
        statusDiv.innerHTML = statusHtml;
        statusDiv.className = `target-status ${isReached ? 'reached' : 'not-reached'}`;
        statusDiv.style.display = 'block';
    }
    
    if (resultDiv) {
        resultDiv.innerHTML = statusHtml;
        resultDiv.className = `target-result ${isReached ? 'reached' : 'not-reached'}`;
        resultDiv.style.display = 'block';
    }
}

// Вземане на избрания месец
export function getMonth(): string {
    const select = getElement<HTMLSelectElement>(selectors.month);
    return select.value;
}

// Вземане на годината
export function getYear(): number | null {
    const value = getNumberValue(selectors.year);
    
    if (isNaN(value) || value === 0) {
        alert('Моля, въведи година!');
        return null;
    }
    
    return value;
}

// Задаване на текущия месец и година по подразбиране
export function setDefaultMonthYear(): void {
    const now = new Date();
    const monthSelect = document.querySelector(selectors.month) as HTMLSelectElement;
    const yearInput = document.querySelector(selectors.year) as HTMLInputElement;
    
    if (monthSelect) {
        monthSelect.selectedIndex = now.getMonth();
    }
    
    if (yearInput) {
        yearInput.value = now.getFullYear().toString();
    }
}

// ==================== RESULTS ====================

// Рендериране на резултатите
export function renderResults(results: CalculationResult[]): void {
    const section = getElement<HTMLDivElement>(selectors.resultsSection);
    const tbody = getElement<HTMLTableSectionElement>(selectors.resultsBody);
    
    section.style.display = 'block';
    
    // Показване на месец и година в заглавието
    if (results.length > 0) {
        const periodInfo = document.querySelector('.results-period');
        if (periodInfo) {
            periodInfo.textContent = `${results[0].month} ${results[0].year}`;
        }
    }
    
    tbody.innerHTML = results.map(r => `
        <tr>
            <td>${escapeHtml(r.locationName)}</td>
            <td>${escapeHtml(r.name)}</td>
            <td class="number">${r.salary.toFixed(2)} лв.</td>
            <td class="number">${r.globalTurnover.toFixed(2)} лв.</td>
            <td class="number">${r.personalTurnover.toFixed(2)} лв.</td>
            <td class="number">${r.vouchers.toFixed(2)} лв.</td>
            <td class="number">${r.bruto.toFixed(2)} лв.</td>
            <td class="number ${r.bonus >= 0 ? 'bonus-positive' : 'bonus-negative'}">${r.bonus.toFixed(2)} лв.</td>
        </tr>
    `).join('');
    
    // Scroll към резултатите
    section.scrollIntoView({ behavior: 'smooth' });
}

// Рендериране на резултатите (опростен вариант за единичен обект)
export function renderResultsSimple(results: CalculationResult[]): void {
    const section = getElement<HTMLDivElement>(selectors.resultsSection);
    const tbody = getElement<HTMLTableSectionElement>(selectors.resultsBody);
    
    section.style.display = 'block';
    
    // Показване на месец и година в заглавието
    if (results.length > 0) {
        const periodInfo = document.querySelector('.results-period');
        if (periodInfo) {
            periodInfo.textContent = `${results[0].locationName} — ${results[0].month} ${results[0].year}`;
        }
    }
    
    tbody.innerHTML = results.map(r => `
        <tr>
            <td>${escapeHtml(r.name)}</td>
            <td class="number">${r.salary.toFixed(2)} лв.</td>
            <td class="number">${r.globalTurnover.toFixed(2)} лв.</td>
            <td class="number">${r.personalTurnover.toFixed(2)} лв.</td>
            <td class="number">${r.vouchers.toFixed(2)} лв.</td>
            <td class="number ${r.targetBonus > 0 ? 'bonus-positive' : ''}">${r.targetBonus.toFixed(2)} лв.</td>
            <td class="number">${r.bruto.toFixed(2)} лв.</td>
            <td class="number ${r.bonus >= 0 ? 'bonus-positive' : 'bonus-negative'}">${r.bonus.toFixed(2)} лв.</td>
        </tr>
    `).join('');
    
    // Scroll към резултатите
    section.scrollIntoView({ behavior: 'smooth' });
}

// Скриване на резултатите
export function hideResults(): void {
    const section = getElement<HTMLDivElement>(selectors.resultsSection);
    section.style.display = 'none';
}

// Изчистване на всички месечни полета
export function clearAllMonthlyInputs(dealers: Dealer[]): void {
    // Изчистване на общия оборот
    const globalInput = document.querySelector(selectors.globalTurnover) as HTMLInputElement;
    if (globalInput) {
        globalInput.value = '';
    }
    
    // Изчистване на таргета
    const targetInput = document.querySelector('#targetTurnover') as HTMLInputElement;
    if (targetInput) {
        targetInput.value = '';
    }
    
    // Скриване на статуса за таргета
    const targetStatus = document.getElementById('targetStatus');
    if (targetStatus) {
        targetStatus.style.display = 'none';
    }
    
    // Изчистване на полетата за всеки дилър
    for (const dealer of dealers) {
        const salaryInput = document.querySelector(`#salary_${dealer.id}`) as HTMLInputElement;
        const turnoverInput = document.querySelector(`#turnover_${dealer.id}`) as HTMLInputElement;
        const vouchersInput = document.querySelector(`#vouchers_${dealer.id}`) as HTMLInputElement;
        
        if (salaryInput) salaryInput.value = '';
        if (turnoverInput) turnoverInput.value = '';
        if (vouchersInput) vouchersInput.value = '';
    }
}

// Escape на HTML за предотвратяване на XSS
function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
