// =========================================
// 🎡 CS:GO STYLE CASE OPENING ROULETTE
// =========================================

window.startCaseSpin = function({ caseName, caseInfo, count }) {

    const container = document.querySelector(".case-header");
    const grid = document.getElementById("items-grid");
    const roulette = document.getElementById("roulette-wrapper");
    const strip = document.getElementById("roulette-strip");
    const rewardBlock = document.getElementById("reward-block");

    // скрываем всё кроме рулетки
    container.style.display = "none";
    grid.style.display = "none";
    rewardBlock.style.display = "none";

    roulette.style.display = "block";

    strip.innerHTML = ""; // очищаем рулетку

    const names = window.caseItemNames[caseName];
    const prices = window.caseItemPrices[caseName];

    const items = [];
    for (let i = 1; i <= caseInfo.count; i++) {
        items.push({
            id: i,
            name: names[i],
            price: prices[i],
            img: `${caseInfo.path}${i}.png`
        });
    }

    // ---------------------------------------
    // Дублируем предметы для длинной ленты
    // ---------------------------------------
    const reel = [];
    for (let i = 0; i < 40; i++) {
        reel.push(...items);
    }

    // ---------------------------------------
    // РЕНДЕРИМ ЛЕНТУ
    // ---------------------------------------
    reel.forEach(item => {
        const cell = document.createElement("div");
        cell.className = "roulette-cell";

        cell.innerHTML = `
            <img src="${item.img}" class="roulette-img">
            <div class="roulette-name">${item.name}</div>
        `;

        strip.appendChild(cell);
    });

    // ---------------------------------------
    // Выбираем победителя
    // ---------------------------------------
    const winner = items[Math.floor(Math.random() * items.length)];

    // ищем ВХОЖДЕНИЕ winner.id в reel
    const winnerIndex = reel.findIndex(it => it.id === winner.id);

    // ширина одного блока
    const cellWidth = 160;

    // позиция сдвига к центру
    const stopX = winnerIndex * cellWidth - 400; // центр рамки

    // Анимация
    strip.style.transition = "transform 4.2s cubic-bezier(.08,.6,0,1)";
    strip.style.transform = `translateX(-${stopX}px)`;

    // После остановки — вывод результата
    setTimeout(() => {
        showReward(winner);
    }, 4400);
};


// =========================================
// 🎉 ВЫВОД ВЫПАВШЕГО ПРЕДМЕТА
// =========================================

function showReward(item) {

    const rewardBlock = document.getElementById("reward-block");

    document.getElementById("reward-img").src = item.img;
    document.getElementById("reward-name").textContent = item.name;
    document.getElementById("reward-price").innerHTML = `⭐ ${item.price}`;

    rewardBlock.style.display = "block";

    document.getElementById("btn-keep").onclick = () => {
        rewardBlock.style.display = "none";
        alert("Предмет оставлен (пока без инвентаря)");
        location.reload();
    };

    document.getElementById("btn-sell").onclick = () => {
        rewardBlock.style.display = "none";
        alert("Предмет продан");
        location.reload();
    };
}
