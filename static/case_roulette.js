// =========================================================
// 🎰 ПЛАВНАЯ РУЛЕТКА — БЕЗ ДЁРГАНИЙ, БЕЗ ЦЕНТРИРОВАНИЯ,
// ОСТАНАВЛИВАЕТСЯ ТАМ, ГДЕ ДОЛЖНА, МАКСИМАЛЬНО РЕАЛИСТИЧНО
// =========================================================

window.startCaseSpin = function (caseName, caseInfo, count = 1) {

    // элементы
    const header = document.querySelector(".case-header");
    const itemsGrid = document.getElementById("items-grid");
    const wrapper = document.getElementById("roulette-wrapper");
    const strip = document.getElementById("roulette-strip");
    const reward = document.getElementById("reward-block");

    // скрываем только header, сетку НЕ скрываем
    header.style.display = "none";

    // рулетка видна
    wrapper.style.display = "block";
    reward.style.display = "none";

    // сброс
    strip.innerHTML = "";
    strip.style.transition = "none";
    strip.style.transform = "translateX(0)";

    // данные кейса
    const names = window.caseItemNames[caseName];
    const prices = window.caseItemPrices[caseName];
    const drops = window.caseDropRates?.[caseName] || {};

    const items = [];
    for (let i = 1; i <= caseInfo.count; i++) {
        items.push({
            id: i,
            name: names[i],
            price: prices[i],
            img: `${caseInfo.path}${i}.png`,
            chance: drops[i] || 1
        });
    }

    // выбор победителя по шансам
    const weighted = [];
    items.forEach(it => {
        for (let c = 0; c < it.chance * 10; c++) weighted.push(it);
    });
    const winner = weighted[Math.floor(Math.random() * weighted.length)];

    // строим длинную ленту
    const reel = [];
    for (let r = 0; r < 80; r++) reel.push(...items);

    // рендер ячеек
    reel.forEach(it => {
        const d = document.createElement("div");
        d.className = "roulette-cell";
        d.innerHTML = `
            <img src="${it.img}" class="roulette-img">
            <div class="roulette-name">${it.name}</div>
        `;
        strip.appendChild(d);
    });

    // параметры
    const CELL = 150; // твоя ширина ячейки

    // список индексов победного предмета
    const indexes = [];
    reel.forEach((it, i) => {
        if (it.id === winner.id) indexes.push(i);
    });

    // выбираем дальний индекс для длинного вращения
    const index = indexes[indexes.length - 6];

    // ⚠️ НИКАКОГО центрирования!  
    // рулетка останавливается ЕСТЕСТВЕННО.
    const stopX = index * CELL;

    // =========================================================
    // 🎬 ПЛАВНАЯ ДОЛГАЯ ОСТАНОВКА — НИКАКИХ СКАЧКОВ И ПОДГОНКИ
    // =========================================================
    setTimeout(() => {
        strip.style.transition = "transform 9s cubic-bezier(0.05, 0.30, 0.10, 1)";
        strip.style.transform = `translateX(-${stopX}px)`;
    }, 50);

    // показать награду после завершения вращения
    setTimeout(() => {
        showReward(winner);
    }, 9200);
};


// =========================================================
// 🎁 БЛОК НАГРАДЫ
// =========================================================

function showReward(item) {

    const reward = document.getElementById("reward-block");

    document.getElementById("reward-img").src = item.img;
    document.getElementById("reward-name").textContent = item.name;
    document.getElementById("reward-price").textContent = `⭐ ${item.price}`;

    reward.style.display = "block";

    // оставить предмет
    document.getElementById("btn-keep").onclick = () => {
        alert("Предмет оставлен!");
        location.reload();
    };

    // продать предмет
    document.getElementById("btn-sell").onclick = () => {
        alert("Предмет продан!");
        location.reload();
    };

    // крутить ещё
    document.getElementById("btn-again").onclick = () => {
        reward.style.display = "none";
        document.querySelector(".case-header").style.display = "block";
        document.getElementById("roulette-wrapper").style.display = "none";
        // itemsGrid остаётся видимым — ты просил
    };
}
