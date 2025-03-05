"use strict"; // для використання нових стандартів JavaScript через увімкнення строгого режиму

// Межі інтеграла
const P_TOP = 5.25;
const P_LOW = 4.75;

// Функція для апроксимації функції помилки (erf) за Абрамовицем і Стегином з високою точністю
function erf(x) {
    // Аппроксимація функції помилки за Абрамовицем і Стегином (висока точність)
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    // Абсолютне значення x для обчислень
    let t = Math.abs(x);
    // Обчислення t для полінома
    t = 1.0 / (1.0 + p * t);

    // Обчислення полінома для визначення значення функції помилки
    let y = 1.0 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x);

    // Ураховуємо знак x для повернення правильного значення
    return x >= 0 ? y : -y;
}

// Функція, яка обчислює значення кумулятивної функції розподілу нормального розподілу
// за допомогою функції помилки (erf)
function derivativeFormula(p, p_c, sigma) {
    // Формула: (abs(sigma) * erf((p - pc) / (sqrt(2) * abs(sigma)))) / (2 * sigma)
    const absSigma = Math.abs(sigma);
    const z = (p - p_c) / (Math.sqrt(2) * absSigma);
    const erfValue = erf(z);
    return (absSigma * erfValue) / (2 * sigma);
}

// Функція для отримання числового значення з елемента форми за його ID
function getValueByID(id) {
    return +document.getElementById(id).value;
}

// Функція для встановлення текстового значення в елемент за його ID
function setValueByID(id, value) {
    document.getElementById(id).innerText = value;
}

// Функція для обчислення інтеграла (різниці значень кумулятивної функції розподілу)
// на заданому інтервалі [a, b] для нормального розподілу
function calcIntegral(p_c, sigma, a = P_LOW, b = P_TOP) {
    return derivativeFormula(b, p_c, sigma) - derivativeFormula(a, p_c, sigma);
}

// Функція, яка повертає перше від’ємне значення з масиву чисел або null, якщо таких немає
// Приймає довільну кількість аргументів і ітерується по них за допомогою for...in
function findFirstNegative(...numbers) {
    for (let num in numbers) {
        if (num < 0) return num;
    }
    return null;
}

// Функція для обчислення прибутку після урахування штрафів або втрат,
// враховуючи частку енергії в заданому інтервалі та стандартне відхилення
function calcProfitAfterFine(avg_power, cost, std) {
    const energyShare = calcIntegral(avg_power, std);
    const profit1 = energyShare * avg_power * 24 * cost;
    return profit1 - avg_power * 24 * (1 - energyShare) * cost;
}

// Основна функція для виконання розрахунків на основі введених даних
function calculate() {
    const avg_power = getValueByID("avg-power");
    const cost = getValueByID("electricity-cost");
    const std_before = getValueByID("std-dev-before");
    const std_after = getValueByID("std-dev-after");

    let negative = findFirstNegative(avg_power, cost, std_before, std_after);
    if (negative) { // якщо функція знайшла значення, то повідомити про помилку та вийти із функції
        alert(`На вхід було отримано від’ємне число: ${negative}\nВведіть невід’ємне.`);
        return;
    }

    const profit_before = calcProfitAfterFine(avg_power, cost, std_before);
    const profit_after = calcProfitAfterFine(avg_power, cost, std_after);

    // Вивід результатів зі скороченням з точністю до 2 знаків у дробовій частині
    setValueByID("profit_before", profit_before.toFixed(2));
    setValueByID("profit_after", profit_after.toFixed(2));
    setValueByID("profit_difference", (profit_after - profit_before).toFixed(2));
}
