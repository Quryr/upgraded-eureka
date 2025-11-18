window.startCaseSpin = function (selectedCase, selectedCount, caseInfo, caseName) {

    const header = document.querySelector(".case-header");
    const grid = document.getElementById("items-grid");
    const wrapper = document.getElementById("roulette-wrapper");
    const strip = document.getElementById("roulette-strip");
    const reward = document.getElementById("reward-block");

    header.style.display = "none";
    grid.style.opacity = "0.25";

    wrapper.style.display = "block";
    strip.innerHTML = "";
    reward.style.display = "none";

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

    const reel = [];
    for (let i = 0; i < 60; i++) reel.push(...items);

    reel.forEach(it => {
        const d = document.createElement("div");
        d.className = "roulette-cell";
        d.innerHTML = `
            <img src="${it.img}" class="roulette-img">
            <div class="roulette-name">${it.name}</div>
        `;
        strip.appendChild(d);
    });

    const winner = items[Math.floor(Math.random() * items.length)];
    const index = reel.findIndex(r => r.id === winner.id);

    const CELL = 140;
    const CENTER = 450;

    const stopX = index * CELL - CENTER;

    strip.style.transition = "transform 6s cubic-bezier(.08,.6,0,1)";
    strip.style.transform = `translateX(-${stopX}px)`;

    setTimeout(() => {
        showReward(winner);
    }, 6200);
};

function showReward(item) {

    const reward = document.getElementById("reward-block");

    document.getElementById("reward-img").src = item.img;
    document.getElementById("reward-name").textContent = item.name;
    document.getElementById("reward-price").textContent = `⭐ ${item.price}`;

    reward.style.display = "block";

    document.getElementById("btn-keep").onclick = () => {
        reward.style.display = "none";
        location.reload();
    };

    document.getElementById("btn-sell").onclick = () => {
        reward.style.display = "none";
        location.reload();
    };
}
