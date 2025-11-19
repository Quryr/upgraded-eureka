// =====================================================
// 📦 ОТРИСОВКА СТРАНИЦЫ + ЗАПУСК РУЛЕТКИ
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const caseId = params.get("id");

    const caseImage = document.getElementById("case-image");
    const caseTitle = document.getElementById("case-title");
    const casePrice = document.getElementById("case-price");
    const itemsGrid = document.getElementById("items-grid");
    const openCaseBtn = document.querySelector(".case-btn-main");

    if (!window.allCases) {
        caseTitle.textContent = "DATA NOT LOADED";
        return;
    }

    const selectedCase = allCases.find(c => c.id === caseId);
    if (!selectedCase) {
        caseTitle.textContent = "CASE NOT FOUND";
        return;
    }

    // ----------------------------------
    // 🖼️ ОТРИСОВКА КАРТОЧКИ КЕЙСА
    // ----------------------------------

    caseImage.src = selectedCase.img;
    caseTitle.textContent = selectedCase.name;

    if (selectedCase.price) {
        casePrice.innerHTML = `
            <div class="case-price-outer">
                <span class="case-price-num">${selectedCase.price}</span>
                <img src="/static/assets/icons/star.png" class="case-price-star">
            </div>
        `;

    } else {
        casePrice.innerHTML = `<div class="case-subtitle">БЕСПЛАТНО</div>`;
    }

    // ----------------------------------
    // 🧱 ОТРИСОВКА ПРЕДМЕТОВ
    // ----------------------------------

    const caseName = selectedCase.name.trim();
    const caseInfo = caseMap[caseName];

    if (caseInfo) {
        renderCaseItems("items-grid", caseInfo.path, caseInfo.count, caseName);
    } else {
        itemsGrid.innerHTML = `<p style="color:#aaa;">Items not found for this case</p>`;
    }

    // ----------------------------------
    // 🔢 КОЛИЧЕСТВО КЕЙСОВ
    // ----------------------------------

    const buttons = document.querySelectorAll(".multi-btn");
    let selectedCount = 1;

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            selectedCount = parseInt(button.dataset.count);
        });
    });

    // ----------------------------------
    // 🎡 ЗАПУСК РУЛЕТКИ
    // ----------------------------------

    if (openCaseBtn) {
        openCaseBtn.addEventListener("click", () => {
            startCaseSpin(caseName, caseInfo, selectedCount);
        });
    }
});




