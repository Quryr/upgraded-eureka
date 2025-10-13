// Получение данных о выбранном кейсе
document.addEventListener("DOMContentLoaded", () => {
  const title = localStorage.getItem("selectedCaseTitle") || "Неизвестный кейс";
  const img = localStorage.getItem("selectedCaseImg");

  document.getElementById("case-title").textContent = title;
  if (img) document.getElementById("case-image").src = img;
});
