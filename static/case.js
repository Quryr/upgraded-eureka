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

    // --- Отрисовываем карточку кейса ---
    caseImage.src = selectedCase.img;
    caseTitle.textContent = selectedCase.name;

    if (selectedCase.price) {
        casePrice.innerHTML = `
            <div class="case-subtitle">
                <span>${selectedCase.price}</span>
                <img src="/static/assets/icons/star.png" class="star-icon" alt="⭐">
            </div>
        `;
    } else {
        casePrice.innerHTML = `<div class="case-subtitle">БЕСПЛАТНО</div>`;
    }

    // --- Отрисовываем предметы ---
    const caseName = selectedCase.name.trim();
    const caseInfo = caseMap[caseName];

    if (caseInfo) {
        renderCaseItems("items-grid", caseInfo.path, caseInfo.count, caseName);
    } else {
        itemsGrid.innerHTML = `<p style="color:#aaa;">Items not found for this case</p>`;
    }

    // --- Кнопки количества ---
    const buttons = document.querySelectorAll(".multi-btn");
    let selectedCount = 1;

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            selectedCount = parseInt(button.dataset.count);
        });
    });

    // --- Запуск рулетки ---
    if (openCaseBtn) {
        openCaseBtn.addEventListener("click", () => {
            startCaseSpin(
                selectedCase,     // объект кейса
                selectedCount,    // количество кейсов
                caseInfo,         // {path:"...", count:"..."}
                caseName          // строка: "Crystal Candy"
            );
        });
    }
});
