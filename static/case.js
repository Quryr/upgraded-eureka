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
  casePrice.innerHTML = `
    <span>${selectedCase.price}</span>
    <img src="/static/assets/icons/star.png" alt="⭐">
  `;
});
document.addEventListener("DOMContentLoaded", () => {
  // Выбор количества
  const buttons = document.querySelectorAll(".multi-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Открытие кейсов
  const openOne = document.querySelector(".open-one");
  const openFive = document.querySelector(".open-five");

  openOne.addEventListener("click", () => {
    const demo = document.getElementById("demo-toggle").checked;
    const count = document.querySelector(".multi-btn.active").dataset.count;
    alert(`Открываю ${count} кейсов ${demo ? "(демо режим)" : ""}`);
  });

  openFive.addEventListener("click", () => {
    const demo = document.getElementById("demo-toggle").checked;
    alert(`Открываю 5 кейсов ${demo ? "(демо режим)" : ""}`);
  });
});
