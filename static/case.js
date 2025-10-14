document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const caseId = params.get("id");

  const caseImage = document.getElementById("case-image");
  const caseTitle = document.getElementById("case-title");
  const casePrice = document.getElementById("case-price");
  const itemsGrid = document.getElementById("items-grid");

  if (!window.allCases) {
    console.error("❌ allCases не найден. Проверь cases_data.js");
    caseTitle.textContent = "DATA NOT LOADED";
    return;
  }

  // 🔍 Ищем кейс по ID
  const selectedCase = allCases.find(c => c.id === caseId);

  if (!selectedCase) {
    console.warn(`⚠️ Кейс с ID "${caseId}" не найден.`);
    caseTitle.textContent = "CASE NOT FOUND";
    return;
  }

  // 🖼️ Отрисовываем кейс
  caseImage.src = selectedCase.img;
  caseTitle.textContent = selectedCase.name;

  // 💰 Отрисовываем цену точно как на главной странице
  if (selectedCase.price) {
    casePrice.innerHTML = `
      <div class="case-subtitle">
        <span>${selectedCase.price}</span>
        <img src="/static/assets/icons/star.png" alt="⭐" class="star-icon">
      </div>
    `;
  } else {
    casePrice.innerHTML = `
      <div class="case-subtitle">БЕСПЛАТНО</div>
    `;
  }
});
