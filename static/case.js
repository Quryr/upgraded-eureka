document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const caseId = params.get("id");

  const caseImage = document.getElementById("case-image");
  const caseTitle = document.getElementById("case-title");
  const casePrice = document.getElementById("case-price");
  const itemsGrid = document.getElementById("items-grid");

  if (!window.allCases && !window.casesData) {
    console.error("❌ Данные кейсов не найдены. Проверь cases_data.js");
    caseTitle.textContent = "DATA NOT LOADED";
    return;
  }

  // Находим кейс в общей структуре (поиск и в allCases, и в casesData)
  let selectedCase = null;

  if (window.allCases) {
    selectedCase = allCases.find(c => c.id === caseId);
  } else {
    for (const category of Object.values(casesData)) {
      const found = category.find(c => c.id === caseId);
      if (found) {
        selectedCase = found;
        break;
      }
    }
  }

  if (!selectedCase) {
    console.warn(`⚠️ Кейс с ID "${caseId}" не найден.`);
    caseTitle.textContent = "CASE NOT FOUND";
    return;
  }

  // 🖼️ Отрисовываем кейс
  caseImage.src = selectedCase.img;
  caseTitle.textContent = selectedCase.name;

  // 💰 Отрисовываем цену — 1 в 1 как в script.js
casePrice.innerHTML = `
  <span>${selectedCase.price}</span>
  <img src="/static/assets/icons/star.png" class="star-icon" alt="⭐">
`;

});
