/* ========================================================================= */
/* FINAL CASE ROULETTE – SMOOTH, CENTERED, CORRECT */
/* ========================================================================= */

window.startCaseSpin = async function (selectedCase, selectedCount, caseInfo, caseName) {

    const header = document.querySelector(".case-header");
    const grid = document.getElementById("items-grid");
    const wrapper = document.getElementById("roulette-wrapper");
    const strip = document.getElementById("roulette-strip");
    const reward = document.getElementById("reward-block");

    /* ------------------------- */
    /* UI PREP */
    /* ------------------------- */

    header.style.display = "none";
    grid.style.opacity = "0.25";

    wrapper.style.display = "block";
    reward.style.display = "none";
    strip.innerHTML = "";

    const names = window.caseItemNames[caseName];
    const prices = window.caseItemPrices[caseName];

    /* ------------------------- */
    /* BUILD ITEMS */
    /* ------------------------- */

    const items = [];
    for (let i = 1; i <= caseInfo.count; i++) {
        items.push({
            id: i,
            name: names[i],
            price: prices[i],
            img: `${caseInfo.path}${i}.png`
        });
    }

    /* ------------------------- */
    /* PRELOAD IMAGES (important fix) */
    /* ------------------------- */

    await Promise.all(items.map(it => {
        return new Promise(res => {
            const img = new Image();
            img.onload = res;
            img.onerror = res;
            img.src = it.img;
        });
    }));

    /* ------------------------- */
    /* BUILD REEL (60 items) */
    /* ------------------------- */

    const reel = [];
    for (let i = 0; i < 60; i++) reel.push(...items);

    /* Build DOM */
    reel.forEach(it => {
        const d = document.createElement("div");
        d.className = "roulette-cell";
        d.innerHTML = `
            <img src="${it.img}" class="roulette-img">
            <div class="roulette-name">${it.name}</div>
        `;
        strip.appendChild(d);
    });

    /* ------------------------- */
    /* TRUE WINNER */
    /* ------------------------- */

    const winner = items[Math.floor(Math.random() * items.length)];

    /* Find FIRST matching element in reel */
    const index = reel.findIndex(r => r.id === winner.id);

    /* ------------------------- */
    /* ANIMATION CALC */
    /* ------------------------- */

    const CELL = 150;     // Must match CSS .roulette-cell width
    const FRAME_WIDTH = 900; // Must match CSS .roulette-frame width
    const CENTER_OFFSET = (FRAME_WIDTH / 2) - (CELL / 2);

    /*
        Example:
        If index = 120 → scroll = index * CELL - CENTER_OFFSET
    */

    const stopX = index * CELL - CENTER_OFFSET;

    /* ------------------------- */
    /* FORCE LAYOUT BEFORE ANIMATING */
    /* ------------------------- */

    strip.style.transform = "translateX(0px)";
    strip.style.transition = "none";
    strip.offsetHeight; // force reflow

    /* ------------------------- */
    /* SPIN ANIMATION */
    /* ------------------------- */

    setTimeout(() => {
        strip.style.transition = "transform 6.2s cubic-bezier(.08,.6,0,1)";
        strip.style.transform = `translateX(-${stopX}px)`;
    }, 50);

    /* ------------------------- */
    /* ON SPIN END → SHOW REWARD */
    /* ------------------------- */

    setTimeout(() => {
        showReward(winner);
    }, 6300);
};


/* ========================================================================= */
/* SHOW REWARD */
/* ========================================================================= */

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

/* ========================================================================= */
/* END */
/* ========================================================================= */
