// =========================================================
// 🎰 ИДЕАЛЬНАЯ РУЛЕТКА — ОДИНАРНЫЙ ПРОКРУТ + ПЛАВНОЕ ДОЛГОЕ ЗАМЕДЛЕНИЕ
// =========================================================

window.startCaseSpin = function (caseName, caseInfo) {

    const header = document.querySelector(".case-header");
    const wrapper = document.getElementById("roulette-wrapper");
    const strip = document.getElementById("roulette-strip");
    const reward = document.getElementById("reward-block");

    header.style.display = "none";
    wrapper.style.display = "block";
    reward.style.display = "none";

    strip.innerHTML = "";
    strip.style.transition = "none";
    strip.style.transform = "translateX(0)";

    const names = window.caseItemNames[caseName];
    const prices = window.caseItemPrices[caseName];
    const drops  = window.caseDropRates?.[caseName] || {};

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

    // взвешенный рандом
    const weighted = [];
    items.forEach(it => {
        for (let c = 0; c < it.chance * 10; c++) weighted.push(it);
    });
    const winner = weighted[Math.floor(Math.random() * weighted.length)];

    // супер длинная лента
    const reel = [];
    for (let r = 0; r < 140; r++) reel.push(...items);

    reel.forEach(it => {
        const d = document.createElement("div");
        d.className = "roulette-cell";
        d.innerHTML = `
            <img src="${it.img}" class="roulette-img">
            <div class="roulette-name">${it.name}</div>
        `;
        strip.appendChild(d);
    });

    // === расчёт остановки ===
    const CELL = 150;

    const indexes = [];
    reel.forEach((it, i) => {
        if (it.id === winner.id) indexes.push(i);
    });

    // берём очень далёкий элемент → долгое вращение
    const index = indexes[indexes.length - 5];

    // ❗ НЕТ центрирования вообще
    const realStopX = index * CELL;

    // плавное замедление с очень сильным тормозом
    setTimeout(() => {
        strip.style.transition = "transform 7.5s cubic-bezier(.08,.85,.2,1)";
        strip.style.transform = `translateX(-${realStopX}px)`;
    }, 50);

    // через 8 секунд показываем выигрыш
    setTimeout(() => showReward(winner), 8200);
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

    document.getElementById("btn-keep").onclick = () => location.reload();
    document.getElementById("btn-sell").onclick = () => location.reload();

    document.getElementById("btn-again").onclick = () => {
        reward.style.display = "none";
        document.querySelector(".case-header").style.display = "block";
        document.getElementById("roulette-wrapper").style.display = "none";
    };
}
