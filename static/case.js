document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const caseId = params.get("id");

  const caseImage = document.getElementById("case-image");
  const caseTitle = document.getElementById("case-title");
  const casePrice = document.getElementById("case-price");
  const itemsGrid = document.getElementById("items-grid");

  if (!window.allCases) {
    console.error("❌ allCases не найден. Проверь файл cases_data.js");
    caseTitle.textContent = "DATA NOT LOADED";
    return;
  }

  const selectedCase = allCases.find(c => c.id === caseId);
  if (!selectedCase) {
    console.warn(`⚠️ Кейс с ID "${caseId}" не найден.`);
    caseTitle.textContent = "CASE NOT FOUND";
    return;
  }

  // 🧱 Отрисовываем данные кейса
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

  // 🎯 Генерация карточек предметов
  const caseName = selectedCase.name.trim().toLowerCase();
  const caseKey = Object.keys(caseMap).find(key => key.toLowerCase() === caseName);
  const caseInfo = caseMap[caseKey];

  if (caseInfo) {
    renderCaseItems("items-grid", caseInfo.path, caseInfo.count, caseKey);
  } else {
    console.warn(`⚠️ Нет данных для кейса "${selectedCase.name}" в caseMap`);
    itemsGrid.innerHTML = `<p style="color:#aaa;">Items not found for this case</p>`;
  }

  // 🔘 Кнопки количества кейсов
  const buttons = document.querySelectorAll(".multi-btn");
  let selectedCount = 1;

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      selectedCount = parseInt(button.dataset.count);
      console.log(`✅ Выбрано количество кейсов: ${selectedCount}`);
    });
  });

  // 🎁 Кнопка открытия кейса (демо-режим)
  const openCaseBtn = document.querySelector(".case-btn-main");
  if (openCaseBtn) {
    openCaseBtn.addEventListener("click", () => {
      alert(`Открыто ${selectedCount} кейсов "${selectedCase.name}"!`);
    });
  }
});
