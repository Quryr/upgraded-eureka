// Извлекаем ID кейса из URL
const params = new URLSearchParams(window.location.search);
const caseName = params.get("id");

const caseTitle = document.getElementById("case-name");
const caseImg = document.getElementById("case-img");
const casePrice = document.getElementById("case-price");

if (caseName && typeof casesData === "object") {
  let found = null;

  // Перебор категорий
  for (const category in casesData) {
    found = casesData[category].find(c => c.name.toLowerCase().replace(/\s+/g, "_") === caseName);
    if (found) break;
  }

  if (found) {
    caseTitle.textContent = found.name;
    caseImg.src = found.img;
    casePrice.textContent = found.price;
  } else {
    caseTitle.textContent = "CASE NOT FOUND";
  }
} else {
  caseTitle.textContent = "INVALID CASE";
}
