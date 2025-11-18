// 🎡 Запуск рулетки
window.startCaseSpin = function(selectedCase, selectedCount, caseInfo, caseName) {

    console.log("▶️ Рулетка запущена:", caseName);

    const grid = document.getElementById("items-grid");
    if (!grid) {
        console.error("❌ items-grid не найден");
        return;
    }

    grid.style.display = "none";

    let wheel = document.getElementById("case-roulette");
    if (!wheel) {
        wheel = document.createElement("div");
        wheel.id = "case-roulette";
        wheel.style.width = "100%";
        wheel.style.overflow = "hidden";
        wheel.style.marginTop = "40px";
        wheel.style.whiteSpace = "nowrap";
        wheel.style.position = "relative";
        document.querySelector(".case-container").appendChild(wheel);
    }

    wheel.innerHTML = "";

    const names = window.caseItemNames?.[caseName];
    const prices = window.caseItemPrices?.[caseName];

    if (!names || !prices) {
        console.error("❌ Нет данных о предметах для кейса:", caseName);
        return;
    }

    const items = [];
    for (let i = 1; i <= 15; i++) {
        items.push({
            id: i,
            name: names[i] || ("Item " + i),
            price: prices[i] || 0,
            img: `${caseInfo.path}${i}.png`
        });
    }

    const longTape = [];
    for (let k = 0; k < 30; k++) {
        longTape.push(...items);
    }

    longTape.forEach(it => {
        const d = document.createElement("div");
        d.className = "roulette-item";
        d.style.display = "inline-block";
        d.style.width = "140px";
        d.style.textAlign = "center";
        d.style.margin = "0 10px";

        d.innerHTML = `
            <img src="${it.img}" style="width:100px;">
            <div style="color:#fff;">${it.name}</div>
        `;
        wheel.appendChild(d);
    });

    const winner = items[Math.floor(Math.random() * items.length)];
    console.log("🏆 Победитель:", winner);

    const winnerIndex = longTape.findIndex(it => it.id === winner.id);
    const stopPosition = winnerIndex * 160;

    wheel.style.transition = "transform 4s cubic-bezier(.1,.7,0,1)";
    wheel.style.transform = `translateX(-${stopPosition}px)`;

    setTimeout(() => {
        showWinResult(winner);
    }, 4200);
};


// 🎉 Показываем выигрыш
function showWinResult(winner) {

    let result = document.getElementById("case-win-result");
    if (!result) {
        result = document.createElement("div");
        result.id = "case-win-result";
        result.style.marginTop = "40px";
        result.style.textAlign = "center";
        result.style.color = "#fff";
        result.style.fontSize = "32px";

        document.querySelector(".case-container").appendChild(result);
    }

    result.innerHTML = `
        <div style="transform: scale(0.5); transition: 0.4s;" id="win-scale">
            <img src="${winner.img}" style="width:160px;">
            <div>${winner.name}</div>
            <div style="font-size:20px; color:#0f0;">⭐ ${winner.price}</div>
        </div>
        <button id="btn-keep" style="margin:20px;">Оставить</button>
        <button id="btn-sell">Продать</button>
    `;

    setTimeout(() => {
        document.getElementById("win-scale").style.transform = "scale(1)";
    }, 20);

    document.getElementById("btn-keep").onclick = () => {
        result.innerHTML = "";
        alert("Ты оставил предмет!");
    };

    document.getElementById("btn-sell").onclick = () => {
        result.innerHTML = "";
        alert("Ты продал предмет!");
    };
}
