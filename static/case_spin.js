// === 🎰 FUNCTION: start roulette spin ===
window.startCaseSpin = function(caseName, casePath, itemCount) {

    document.querySelector(".case-header").style.display = "none";
    document.getElementById("items-grid").style.display = "none";

    const rouletteWrapper = document.getElementById("roulette-wrapper");
    const rouletteStrip = document.getElementById("roulette-strip");
    rouletteWrapper.style.display = "block";

    rouletteStrip.innerHTML = "";

    const prices = window.caseItemPrices[caseName];
    const names = window.caseItemNames[caseName];
    const dropRates = window.caseDropRates[caseName];

    // === Генерация 50 предметов в ленте ===
    let items = [];
    for (let i = 0; i < 50; i++) {
        const id = (i % itemCount) + 1;
        items.push({
            id: id,
            img: `${casePath}${id}.png`,
            name: names[id],
            price: prices[id]
        });
    }

    // === Построение HTML ===
    for (const item of items) {
        const div = document.createElement("div");
        div.className = "roulette-item";
        div.innerHTML = `
            <img src="${item.img}" />
            <p>${item.name}</p>
        `;
        rouletteStrip.appendChild(div);
    }

    // === Выбор победителя по шансам ===
    const weightedList = [];
    for (let id = 1; id <= itemCount; id++) {
        const chance = dropRates[id] || 1;
        for (let x = 0; x < chance * 10; x++) {
            weightedList.push(id);
        }
    }

    const winningId = weightedList[Math.floor(Math.random() * weightedList.length)];
    const stopIndex = 25 * 160 + (winningId - 1) * 160;

    // === Анимация ===
    setTimeout(() => {
        rouletteStrip.style.transform = `translateX(-${stopIndex}px)`;
    }, 100);

    // === Показываем приз после остановки ===
    setTimeout(() => {
        showReward(caseName, casePath, winningId);
    }, 6500);
};


// === 🎁 FUNCTION: show reward ===
function showReward(caseName, casePath, id) {
    const rewardBlock = document.getElementById("reward-block");
    rewardBlock.style.display = "block";

    const name = window.caseItemNames[caseName][id];
    const price = window.caseItemPrices[caseName][id];
    const img = `${casePath}${id}.png`;

    document.getElementById("reward-img").src = img;
    document.getElementById("reward-name").textContent = name;
    document.getElementById("reward-price").textContent = `⭐ ${price}`;

    // === SELL ===
    document.getElementById("btn-sell").onclick = () => {
        rewardBlock.style.display = "none";
        alert("Sold for: " + price);
        location.reload();
    };

    // === KEEP ===
    document.getElementById("btn-keep").onclick = () => {
        rewardBlock.style.display = "none";
        alert("Kept!");
        location.reload();
    };
}
