import { loadDealers, addDealer, removeDealer, saveDealers, loadLocations, addLocation, removeLocation, getDealersByLocation } from './storage.js';
import { calculateForAllDealers } from './calculator.js';
import * as UI from './ui.js';
// Състояние на приложението
let dealers = [];
let locations = [];
let results = [];
let selectedLocationId = null;
let isManageLocationsVisible = false;
// Инициализация
function init() {
    // Зареждане на данните от localStorage
    locations = loadLocations();
    dealers = loadDealers();
    // Попълване на dropdown за избор на обект
    populateLocationSelector();
    // Рендериране на обектите в управлението
    UI.renderLocations(locations, handleRemoveLocation);
    // Задаване на текущия месец и година
    UI.setDefaultMonthYear();
    // Закачане на event listeners
    setupEventListeners();
    console.log('Приложението е заредено успешно!');
    console.log(`Заредени ${locations.length} обекта и ${dealers.length} дилъра`);
}
// Попълване на dropdown за избор на обект
function populateLocationSelector() {
    const selector = document.getElementById('locationSelector');
    if (!selector)
        return;
    // Групиране на обекти по тип
    const offices = locations.filter(l => l.type === 'office');
    const warehouses = locations.filter(l => l.type === 'warehouse');
    const stores = locations.filter(l => l.type === 'store');
    let html = '<option value="">-- Избери обект --</option>';
    if (offices.length > 0) {
        html += '<optgroup label="🏢 Офиси">';
        offices.forEach(loc => {
            html += `<option value="${loc.id}">${loc.name} — ${loc.city}</option>`;
        });
        html += '</optgroup>';
    }
    if (warehouses.length > 0) {
        html += '<optgroup label="📦 Складове">';
        warehouses.forEach(loc => {
            html += `<option value="${loc.id}">${loc.name} — ${loc.city}</option>`;
        });
        html += '</optgroup>';
    }
    if (stores.length > 0) {
        html += '<optgroup label="🏪 Търговски обекти">';
        stores.forEach(loc => {
            html += `<option value="${loc.id}">${loc.name} — ${loc.city}</option>`;
        });
        html += '</optgroup>';
    }
    selector.innerHTML = html;
}
// Настройка на event listeners
function setupEventListeners() {
    // Dropdown за избор на обект
    const locationSelector = document.getElementById('locationSelector');
    locationSelector?.addEventListener('change', handleLocationSelect);
    // Бутон за управление на обекти
    const manageBtn = document.getElementById('btnManageLocations');
    manageBtn?.addEventListener('click', toggleManageLocations);
    // Бутон за добавяне на обект
    const addLocationBtn = document.getElementById('btnAddLocation');
    addLocationBtn?.addEventListener('click', handleAddLocation);
    // Бутон за добавяне на дилър
    const addDealerBtn = document.getElementById('btnAddDealer');
    addDealerBtn?.addEventListener('click', handleAddDealer);
    // Бутон за изчисляване
    const calculateBtn = document.getElementById('btnCalculate');
    calculateBtn?.addEventListener('click', handleCalculate);
    // Бутон за изчистване
    const clearBtn = document.getElementById('btnClear');
    clearBtn?.addEventListener('click', handleClear);
    // Бутон за експорт
    const exportBtn = document.getElementById('btnExport');
    exportBtn?.addEventListener('click', handleExport);
    // Качване на Excel файл
    const excelUpload = document.getElementById('excelUpload');
    excelUpload?.addEventListener('change', handleExcelUpload);
    // Сваляне на шаблон
    const templateBtn = document.getElementById('btnDownloadTemplate');
    templateBtn?.addEventListener('click', handleDownloadTemplate);
    // Enter key за добавяне на дилър
    const dealerInputs = ['#dealerName', '#coefGeneral', '#coefPersonal'];
    dealerInputs.forEach(selector => {
        const input = document.querySelector(selector);
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleAddDealer();
            }
        });
    });
}
// ==================== LOCATION SELECTION ====================
function handleLocationSelect(e) {
    const select = e.target;
    const locationId = select.value ? parseInt(select.value) : null;
    selectedLocationId = locationId;
    const mainInterface = document.getElementById('mainInterface');
    const selectMessage = document.getElementById('selectLocationMessage');
    const locationInfo = document.getElementById('selectedLocationInfo');
    const locationBadge = document.getElementById('locationBadge');
    const locationNameHeader = document.getElementById('locationNameHeader');
    const locationNameDealers = document.getElementById('locationNameDealers');
    if (locationId) {
        const location = locations.find(l => l.id === locationId);
        if (location) {
            // Показване на основния интерфейс
            if (mainInterface)
                mainInterface.style.display = 'block';
            if (selectMessage)
                selectMessage.style.display = 'none';
            // Показване на badge с избрания обект
            if (locationInfo)
                locationInfo.style.display = 'block';
            if (locationBadge) {
                const typeIcon = location.type === 'office' ? '🏢' : location.type === 'warehouse' ? '📦' : '🏪';
                locationBadge.textContent = `${typeIcon} ${location.name} — ${location.city}`;
            }
            // Обновяване на заглавията
            const displayName = `${location.name} (${location.city})`;
            if (locationNameHeader)
                locationNameHeader.textContent = displayName;
            if (locationNameDealers)
                locationNameDealers.textContent = displayName;
            // Рендериране на дилърите за този обект
            const locationDealers = getDealersByLocation(dealers, locationId);
            UI.renderDealersForLocation(locationDealers, handleRemoveDealer);
            // Скриване на управлението на обекти
            const manageSection = document.getElementById('manageLocationsSection');
            if (manageSection)
                manageSection.style.display = 'none';
            isManageLocationsVisible = false;
            // Скриване на резултатите
            UI.hideResults();
            results = [];
            console.log(`Избран обект: ${location.name} (${location.city})`);
        }
    }
    else {
        // Скриване на основния интерфейс
        if (mainInterface)
            mainInterface.style.display = 'none';
        if (selectMessage)
            selectMessage.style.display = 'block';
        if (locationInfo)
            locationInfo.style.display = 'none';
        selectedLocationId = null;
    }
}
function toggleManageLocations() {
    const manageSection = document.getElementById('manageLocationsSection');
    const btn = document.getElementById('btnManageLocations');
    isManageLocationsVisible = !isManageLocationsVisible;
    if (manageSection) {
        manageSection.style.display = isManageLocationsVisible ? 'block' : 'none';
    }
    if (btn) {
        btn.textContent = isManageLocationsVisible ? '✕ Затвори' : '⚙️ Управление';
    }
}
// ==================== LOCATION HANDLERS ====================
function handleAddLocation() {
    const data = UI.getNewLocationData();
    if (!data) {
        return;
    }
    locations = addLocation(locations, data.name, data.city, data.address, data.type);
    UI.renderLocations(locations, handleRemoveLocation);
    populateLocationSelector();
    UI.clearNewLocationForm();
    console.log(`Добавен обект: ${data.name}`);
}
function handleRemoveLocation(id) {
    // Проверка дали има дилъри в този обект
    const locationDealers = getDealersByLocation(dealers, id);
    if (locationDealers.length > 0) {
        if (!confirm(`Този обект има ${locationDealers.length} дилър(а). Изтриването ще премахне и дилърите. Продължаваш ли?`)) {
            return;
        }
        // Изтриване на дилърите от този обект
        dealers = dealers.filter(d => d.locationId !== id);
        saveDealers(dealers);
    }
    locations = removeLocation(locations, id);
    UI.renderLocations(locations, handleRemoveLocation);
    populateLocationSelector();
    // Ако изтрития обект е текущо избраният, нулираме избора
    if (selectedLocationId === id) {
        selectedLocationId = null;
        const selector = document.getElementById('locationSelector');
        if (selector)
            selector.value = '';
        const mainInterface = document.getElementById('mainInterface');
        const selectMessage = document.getElementById('selectLocationMessage');
        const locationInfo = document.getElementById('selectedLocationInfo');
        if (mainInterface)
            mainInterface.style.display = 'none';
        if (selectMessage)
            selectMessage.style.display = 'block';
        if (locationInfo)
            locationInfo.style.display = 'none';
    }
    console.log(`Изтрит обект с ID: ${id}`);
}
// ==================== DEALER HANDLERS ====================
function handleAddDealer() {
    if (!selectedLocationId) {
        alert('Моля, първо избери обект!');
        return;
    }
    const data = UI.getNewDealerDataSimple();
    if (!data) {
        return;
    }
    dealers = addDealer(dealers, data.name, selectedLocationId, data.coefGeneral, data.coefPersonal);
    // Рендериране само на дилърите за текущия обект
    const locationDealers = getDealersByLocation(dealers, selectedLocationId);
    UI.renderDealersForLocation(locationDealers, handleRemoveDealer);
    UI.clearNewDealerForm();
    UI.hideResults();
    results = [];
    console.log(`Добавен дилър: ${data.name}`);
}
function handleRemoveDealer(id) {
    dealers = removeDealer(dealers, id);
    if (selectedLocationId) {
        const locationDealers = getDealersByLocation(dealers, selectedLocationId);
        UI.renderDealersForLocation(locationDealers, handleRemoveDealer);
    }
    UI.hideResults();
    results = [];
    console.log(`Изтрит дилър с ID: ${id}`);
}
// ==================== CALCULATION HANDLERS ====================
function handleCalculate() {
    if (!selectedLocationId) {
        alert('Моля, първо избери обект!');
        return;
    }
    const globalTurnover = UI.getGlobalTurnover();
    const target = UI.getTarget();
    const month = UI.getMonth();
    const year = UI.getYear();
    if (globalTurnover === null || year === null) {
        return;
    }
    const locationDealers = getDealersByLocation(dealers, selectedLocationId);
    if (locationDealers.length === 0) {
        alert('Няма добавени дилъри за този обект!');
        return;
    }
    const location = locations.find(l => l.id === selectedLocationId);
    const monthlyData = UI.getMonthlyData(locationDealers);
    results = calculateForAllDealers(locationDealers, monthlyData, globalTurnover, target, month, year, location ? [location] : []);
    // Показване на статус за таргета
    UI.showTargetStatus(globalTurnover, target);
    UI.renderResultsSimple(results);
    console.log('Изчислението е завършено:', results);
}
function handleClear() {
    if (!selectedLocationId)
        return;
    if (confirm('Сигурен ли си, че искаш да изчистиш всички въведени данни?')) {
        const locationDealers = getDealersByLocation(dealers, selectedLocationId);
        UI.clearAllMonthlyInputs(locationDealers);
        UI.hideResults();
        results = [];
        console.log('Данните са изчистени');
    }
}
// ==================== EXPORT HANDLER ====================
function handleExport() {
    if (results.length === 0) {
        alert('Първо изчисли заплатите!');
        return;
    }
    // Подготовка на данните за Excel
    const excelData = results.map(r => ({
        'Месец': r.month,
        'Година': r.year,
        'Обект': r.locationName,
        'Име': r.name,
        'Основна заплата': r.salary,
        'Общ оборот': r.globalTurnover,
        'Собствен оборот': r.personalTurnover,
        'Коеф. общ': r.coefGeneral,
        'Коеф. собствен': r.coefPersonal,
        'Ваучери': r.vouchers,
        'Бонус таргет': r.targetBonus,
        'Бруто': r.bruto,
        'Бонус': r.bonus
    }));
    // Създаване на workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    // Настройка на ширините на колоните
    ws['!cols'] = [
        { wch: 12 }, // Месец
        { wch: 8 }, // Година
        { wch: 30 }, // Обект
        { wch: 20 }, // Име
        { wch: 15 }, // Основна заплата
        { wch: 15 }, // Общ оборот
        { wch: 15 }, // Собствен оборот
        { wch: 12 }, // Коеф. общ
        { wch: 14 }, // Коеф. собствен
        { wch: 12 }, // Ваучери
        { wch: 12 }, // Бонус таргет
        { wch: 12 }, // Бруто
        { wch: 12 } // Бонус
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Заплати');
    // Генериране на име на файла с обект, месец и година
    const location = locations.find(l => l.id === selectedLocationId);
    const locationName = location ? `${location.city}` : 'AutoGrand';
    const month = results[0].month;
    const year = results[0].year;
    const fileName = `AutoGrand_${locationName}_${month}_${year}.xlsx`;
    // Сваляне на файла
    XLSX.writeFile(wb, fileName);
    console.log(`Експортиран файл: ${fileName}`);
}
// ==================== EXCEL UPLOAD HANDLERS ====================
function handleExcelUpload(e) {
    const input = e.target;
    const file = input.files?.[0];
    const statusDiv = document.getElementById('uploadStatus');
    if (!file)
        return;
    if (!selectedLocationId) {
        alert('Моля, първо избери обект!');
        input.value = '';
        return;
    }
    const locationDealers = getDealersByLocation(dealers, selectedLocationId);
    if (locationDealers.length === 0) {
        alert('Няма добавени дилъри за този обект! Първо добави дилъри.');
        input.value = '';
        return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = new Uint8Array(event.target?.result);
            const workbook = XLSX.read(data, { type: 'array' });
            // Вземане на първия лист
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            // Конвертиране към JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            if (jsonData.length === 0) {
                showUploadStatus('❌ Файлът е празен!', 'error');
                return;
            }
            // Обработка на данните
            const result = processExcelData(jsonData, locationDealers);
            if (result.success) {
                showUploadStatus(`✅ Успешно заредени данни за ${result.matched} дилър(а)!${result.notFound.length > 0 ? `<br>⚠️ Не са намерени: ${result.notFound.join(', ')}` : ''}`, 'success');
                // Попълване на общия оборот (от първия ред)
                if (result.globalTurnover) {
                    const globalInput = document.getElementById('globalTurnover');
                    if (globalInput) {
                        globalInput.value = result.globalTurnover.toString();
                    }
                }
            }
            else {
                showUploadStatus(`❌ ${result.error}`, 'error');
            }
        }
        catch (error) {
            console.error('Грешка при четене на файла:', error);
            showUploadStatus('❌ Грешка при четене на файла!', 'error');
        }
        // Нулиране на input-а
        input.value = '';
    };
    reader.readAsArrayBuffer(file);
}
function processExcelData(data, locationDealers) {
    const notFound = [];
    let matched = 0;
    let globalTurnover;
    // Търсене на колоните (поддържа различни имена)
    const firstRow = data[0];
    const keys = Object.keys(firstRow);
    // Намиране на колоната за име
    const nameKey = keys.find(k => k.toLowerCase().includes('име') ||
        k.toLowerCase().includes('name') ||
        k.toLowerCase().includes('дилър') ||
        k.toLowerCase().includes('dealer'));
    // Намиране на колоната за личен оборот
    const personalKey = keys.find(k => k.toLowerCase().includes('личен') ||
        k.toLowerCase().includes('собствен') ||
        k.toLowerCase().includes('personal'));
    // Намиране на колоната за общ оборот
    const globalKey = keys.find(k => k.toLowerCase().includes('общ') ||
        k.toLowerCase().includes('total') ||
        k.toLowerCase().includes('global'));
    if (!nameKey) {
        return { success: false, matched: 0, notFound: [], error: 'Не е намерена колона с имена! Използвай колона "Име".' };
    }
    if (!personalKey) {
        return { success: false, matched: 0, notFound: [], error: 'Не е намерена колона за личен оборот! Използвай колона "Личен оборот".' };
    }
    // Обработка на всеки ред
    for (const row of data) {
        const name = String(row[nameKey] || '').trim();
        const personalTurnover = parseFloat(row[personalKey]) || 0;
        if (globalKey && !globalTurnover) {
            globalTurnover = parseFloat(row[globalKey]) || undefined;
        }
        if (!name)
            continue;
        // Търсене на дилъра по име (case-insensitive)
        const dealer = locationDealers.find(d => d.name.toLowerCase().trim() === name.toLowerCase());
        if (dealer) {
            // Попълване на полето за оборот
            const turnoverInput = document.getElementById(`turnover_${dealer.id}`);
            if (turnoverInput) {
                turnoverInput.value = personalTurnover.toString();
                matched++;
            }
        }
        else {
            notFound.push(name);
        }
    }
    return { success: true, matched, notFound, globalTurnover };
}
function showUploadStatus(message, type) {
    const statusDiv = document.getElementById('uploadStatus');
    if (statusDiv) {
        statusDiv.innerHTML = message;
        statusDiv.className = `upload-status ${type}`;
        statusDiv.style.display = 'block';
        // Скриване след 5 секунди
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}
function handleDownloadTemplate() {
    if (!selectedLocationId) {
        alert('Моля, първо избери обект!');
        return;
    }
    const locationDealers = getDealersByLocation(dealers, selectedLocationId);
    const location = locations.find(l => l.id === selectedLocationId);
    // Създаване на шаблон с имената на дилърите
    const templateData = locationDealers.length > 0
        ? locationDealers.map(d => ({
            'Име': d.name,
            'Личен оборот': '',
            'Общ оборот': ''
        }))
        : [
            { 'Име': 'Пример Иванов', 'Личен оборот': 27582, 'Общ оборот': 122000 },
            { 'Име': 'Пример Петров', 'Личен оборот': 31200, 'Общ оборот': 122000 }
        ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);
    ws['!cols'] = [
        { wch: 25 }, // Име
        { wch: 15 }, // Личен оборот
        { wch: 15 } // Общ оборот
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Данни');
    const locationName = location ? location.city : 'Шаблон';
    XLSX.writeFile(wb, `AutoGrand_${locationName}_Шаблон.xlsx`);
    console.log('Шаблонът е свален');
}
// Стартиране при зареждане на страницата
document.addEventListener('DOMContentLoaded', init);
//# sourceMappingURL=app.js.map