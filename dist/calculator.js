// Изчисляване на бруто заплата
export function calculateBruto(salary, globalTurnover, personalTurnover, coefGeneral, coefPersonal, targetBonus) {
    // Формула: Бруто = Осн. заплата + (Общ оборот × Коеф. общ) + (Собствен оборот × Коеф. собствен) + Бонус таргет
    const bruto = salary + (globalTurnover * coefGeneral) + (personalTurnover * coefPersonal) + targetBonus;
    return Math.round(bruto * 100) / 100;
}
// Изчисляване на бонус таргет
export function calculateTargetBonus(globalTurnover, target) {
    // Демо формула: Ако оборотът >= таргета, бонус = (% над таргета) × 50 лв
    // Пример: 110% от таргета = 10% × 50 = 5 лв
    if (target <= 0)
        return 0;
    const percentage = (globalTurnover / target) * 100;
    if (percentage >= 100) {
        const aboveTarget = percentage - 100;
        const bonus = aboveTarget * 0.5; // 0.5 лв за всеки % над таргета (50 лв на 100%)
        return Math.round(bonus * 100) / 100;
    }
    return 0;
}
// Изчисляване на бонус
export function calculateBonus(bruto, salary, vouchers) {
    // Формула: Бонус = Бруто - Осн. заплата - Ваучери
    const bonus = bruto - salary - vouchers;
    return Math.round(bonus * 100) / 100;
}
// Изчисляване за един дилър
export function calculateForDealer(dealer, monthlyData, globalTurnover, target, month, year, locations) {
    const targetBonus = calculateTargetBonus(globalTurnover, target);
    const bruto = calculateBruto(monthlyData.salary, globalTurnover, monthlyData.personalTurnover, dealer.coefGeneral, dealer.coefPersonal, targetBonus);
    const bonus = calculateBonus(bruto, monthlyData.salary, monthlyData.vouchers);
    // Намиране на името на обекта
    const location = locations.find(l => l.id === dealer.locationId);
    const locationName = location ? `${location.name} (${location.city})` : 'Неизвестен';
    return {
        name: dealer.name,
        locationName,
        month,
        year,
        salary: monthlyData.salary,
        globalTurnover,
        personalTurnover: monthlyData.personalTurnover,
        coefGeneral: dealer.coefGeneral,
        coefPersonal: dealer.coefPersonal,
        vouchers: monthlyData.vouchers,
        targetBonus,
        bruto,
        bonus
    };
}
// Изчисляване за всички дилъри
export function calculateForAllDealers(dealers, monthlyDataMap, globalTurnover, target, month, year, locations) {
    const results = [];
    for (const dealer of dealers) {
        const monthlyData = monthlyDataMap.get(dealer.id);
        if (monthlyData) {
            const result = calculateForDealer(dealer, monthlyData, globalTurnover, target, month, year, locations);
            results.push(result);
        }
    }
    // Сортиране по обект
    results.sort((a, b) => a.locationName.localeCompare(b.locationName));
    return results;
}
//# sourceMappingURL=calculator.js.map