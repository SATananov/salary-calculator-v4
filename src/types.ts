// Интерфейс за обект/локация
export interface Location {
    id: number;
    name: string;
    city: string;
    address: string;
    type: 'office' | 'warehouse' | 'store';  // Офис, Склад, Търговски обект
}

// Интерфейс за дилър (запазва се в localStorage)
export interface Dealer {
    id: number;
    name: string;
    locationId: number;    // Към кой обект принадлежи
    coefGeneral: number;   // Коефициент за общ оборот
    coefPersonal: number;  // Коефициент за собствен оборот
}

// Интерфейс за месечните данни на дилър
export interface DealerMonthlyData {
    dealerId: number;
    salary: number;           // Основна заплата
    personalTurnover: number; // Собствен оборот
    vouchers: number;         // Ваучери за храна
}

// Интерфейс за резултат от изчисление
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

// Интерфейс за Excel експорт
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

// Предефинирани обекти на AutoGrand (актуализирани)
export const DEFAULT_LOCATIONS: Omit<Location, 'id'>[] = [
    // Централен офис
    { name: 'Централен офис', city: 'София', address: 'бул. Черни връх 157', type: 'office' },
    
    // Централен склад
    { name: 'Централен склад', city: 'Стара Загора', address: 'ул. Новозагорско шосе 35001', type: 'warehouse' },
    
    // Регионални складове
    { name: 'Склад Рожен', city: 'София', address: 'бул. Рожен 22, НПЗ Военна рампа', type: 'warehouse' },
    { name: 'Регионален склад', city: 'Благоевград', address: 'бул. Васил Левски 38', type: 'warehouse' },
    { name: 'Регионален склад', city: 'Пловдив', address: 'бул. Асеновградско шосе 2', type: 'warehouse' },
    { name: 'Регионален склад', city: 'Стара Загора', address: 'ул. Новозагорско шосе 35001', type: 'warehouse' },
    { name: 'Регионален склад', city: 'Хасково', address: 'бул. Илинден 6', type: 'warehouse' },
    { name: 'Регионален склад', city: 'Бургас', address: 'ул. Индустриална 51', type: 'warehouse' },
    
    // Търговски обекти
    { name: 'Търговски обект', city: 'Ямбол', address: 'ул. Ормана 68', type: 'store' },
    { name: 'Търговски обект', city: 'Харманли', address: 'Главен път Е80 Паркинг КВЕЛЕ', type: 'store' },
    { name: 'Търговски обект', city: 'Сливен', address: 'бул. Цар Симеон 43', type: 'store' },
    { name: 'Търговски обект', city: 'Сандански', address: 'ул. Стефан Стамболов 49', type: 'store' },
    { name: 'Търговски обект', city: 'Петрич', address: 'ул. Места 18 Б', type: 'store' },
    { name: 'Търговски обект', city: 'Кърджали', address: 'бул. България 99', type: 'store' },
    { name: 'Търговски обект', city: 'Казанлък', address: 'бул. Александър Батенберг 12', type: 'store' },
    { name: 'Търговски обект', city: 'Димитровград', address: 'бул. Стефан Стамболов 6Б', type: 'store' }
];
