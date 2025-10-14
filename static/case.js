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

  // 🔍 Находим кейс по ID
  const selectedCase = allCases.find(c => c.id === caseId);

  if (!selectedCase) {
    console.warn(`⚠️ Кейс с ID "${caseId}" не найден.`);
    caseTitle.textContent = "CASE NOT FOUND";
    return;
  }

  // 🖼️ Отрисовываем данные кейса
  caseImage.src = selectedCase.img;
  caseTitle.textContent = selectedCase.name;

  // 💰 Отрисовка цены как на главной странице
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

  // 💡 Заполняем сетку предметов (если есть)
  if (selectedCase.items && selectedCase.items.length > 0) {
    itemsGrid.innerHTML = "";
    selectedCase.items.forEach(item => {
      const itemCard = document.createElement("div");
      itemCard.classList.add("item-card");
      itemCard.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="item-name">${item.name}</div>
        <div class="item-price">
          ${item.price}
          <img src="/static/assets/icons/star.png" alt="⭐">
        </div>
      `;
      itemsGrid.appendChild(itemCard);
    });
  } else {
    itemsGrid.innerHTML = `<div style="grid-column: 1/-1; opacity: 0.7;">No items found in this case</div>`;
  }
  // 🔘 Обработка выбора количества кейсов
const buttons = document.querySelectorAll(".multi-btn");
let selectedCount = 1; // по умолчанию выбрано 1

buttons.forEach(button => {
  button.addEventListener("click", () => {
    // Снять активный класс со всех
    buttons.forEach(btn => btn.classList.remove("active"));

    // Добавить активный к текущей
    button.classList.add("active");

    // Запомнить выбранное количество
    selectedCount = parseInt(button.dataset.count);

    console.log(`✅ Выбрано количество кейсов: ${selectedCount}`);
  });
});

});
