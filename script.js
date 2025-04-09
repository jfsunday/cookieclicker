// Spiel-Variablen
let cookies = parseInt(localStorage.getItem("cookies")) || 0;
let clickPower = parseInt(localStorage.getItem("clickPower")) || 1;
let cps = parseInt(localStorage.getItem("cps")) || 0;
let prestigePoints = parseInt(localStorage.getItem("prestigePoints")) || 0;
let prestigeThreshold = 1000000; // 1 Million Cookies für Prestige
let prestigeBonus = 1 + prestigePoints * 0.1; // 10% Bonus pro Prestige-Punkt

const cookieCount = document.getElementById("cookie-count");
const clickPowerInfo = document.getElementById("clickpower-info");
const prestigeStatus = document.getElementById("prestige-status");
const cookieImg = document.getElementById("cookie");
const clickSound = document.getElementById("click-sound");
const achievementBox = document.getElementById("achievement");

// Klick-Upgrades Shop
const clickUpgrades = [
  { name: "Klickstärke Level 1", price: 50, increase: 1 },
  { name: "Klickstärke Level 2", price: 200, increase: 2 },
  { name: "Klickstärke Level 3", price: 500, increase: 3 },
  { name: "Klickstärke Level 4", price: 1000, increase: 4 },
];

// Passive-Upgrades Shop (CPS)
const autoUpgrades = [
  { name: "Keks-Fabrik", price: 1000, cpsIncrease: 0.5 },
  { name: "Keks-Mine", price: 5000, cpsIncrease: 1 },
  { name: "Keks-Planet", price: 10000, cpsIncrease: 2 },
];

function showAchievement(text) {
  achievementBox.textContent = text;
  achievementBox.classList.remove("hidden");
  setTimeout(() => achievementBox.classList.add("hidden"), 3000);
}

function updateDisplay() {
  cookieCount.textContent = `Cookies: ${cookies}`;
  clickPowerInfo.textContent = `Klickstärke: ${clickPower}`;
  prestigeStatus.textContent = prestigePoints;
  localStorage.setItem("cookies", cookies);
  localStorage.setItem("clickPower", clickPower);
  localStorage.setItem("cps", cps);
  localStorage.setItem("prestigePoints", prestigePoints);
  renderShop(); // Shop nach jedem Update neu rendern
}

function prestige() {
  if (cookies >= prestigeThreshold) {
    prestigePoints += 1;
    localStorage.setItem("prestigePoints", prestigePoints);
    clickPower = Math.floor(clickPower * prestigeBonus);
    cps = Math.floor(cps * prestigeBonus);
    cookies = 0;
    localStorage.setItem("cookies", cookies);
    showAchievement(`Prestige erreicht! Du hast jetzt ${prestigePoints} Prestige-Punkte.`);
    updateDisplay();
  } else {
    alert("Du hast noch nicht genug Cookies für Prestige!");
  }
}

function renderShop() {
  // Klick-Upgrades anzeigen
  const clickUpgradeDiv = document.getElementById("click-upgrades");
  clickUpgradeDiv.innerHTML = ''; // Vorherige Upgrades entfernen
  clickUpgrades.forEach((upgrade, index) => {
    const button = document.createElement("button");
    button.textContent = `Kaufen: ${upgrade.name} (Preis: ${upgrade.price} Cookies)`;
    button.onclick = () => buyMultipleClickUpgrades(index);
    clickUpgradeDiv.appendChild(button);
  });

  // Auto-Upgrades anzeigen
  const autoUpgradeDiv = document.getElementById("auto-upgrades");
  autoUpgradeDiv.innerHTML = ''; // Vorherige Upgrades entfernen
  autoUpgrades.forEach((upgrade, index) => {
    const button = document.createElement("button");
    button.textContent = `Kaufen: ${upgrade.name} (Preis: ${upgrade.price} Cookies)`;
    button.onclick = () => buyMultipleAutoUpgrades(index);
    autoUpgradeDiv.appendChild(button);
  });
}

function buyMultipleClickUpgrades(index) {
  const upgrade = clickUpgrades[index];
  const levels = prompt("Wie viele Level möchtest du kaufen? (Max: 10)");
  if (levels !== null && !isNaN(levels) && levels > 0 && levels <= 10) {
    const totalPrice = upgrade.price * levels;
    if (cookies >= totalPrice) {
      cookies -= totalPrice;
      clickPower += upgrade.increase * levels;
      showAchievement(`Du hast ${levels} Level ${upgrade.name} gekauft!`);
      updateDisplay();
    } else {
      alert("Nicht genug Cookies!");
    }
  } else {
    alert("Ungültige Anzahl!");
  }
}

function buyMultipleAutoUpgrades(index) {
  const upgrade = autoUpgrades[index];
  const levels = prompt("Wie viele Level möchtest du kaufen? (Max: 10)");
  if (levels !== null && !isNaN(levels) && levels > 0 && levels <= 10) {
    const totalPrice = upgrade.price * levels;
    if (cookies >= totalPrice) {
      cookies -= totalPrice;
      cps += upgrade.cpsIncrease * levels;
      showAchievement(`Du hast ${levels} Level ${upgrade.name} gekauft!`);
      updateDisplay();
    } else {
      alert("Nicht genug Cookies!");
    }
  } else {
    alert("Ungültige Anzahl!");
  }
}

// Klick auf Cookie für Cookies sammeln
cookieImg.onclick = () => {
  cookies += clickPower;
  clickSound.play();
  updateDisplay();
};

// Reset-Button
document.getElementById("reset-button").onclick = () => {
  if (confirm("Möchtest du wirklich deinen Spielstand zurücksetzen?")) {
    cookies = 0;
    clickPower = 1;
    cps = 0;
    prestigePoints = 0;
    localStorage.clear();
    updateDisplay();
  }
};

// Prestige-Button
document.getElementById("prestige-button").onclick = prestige;

renderShop(); // Initiale Shop-Darstellung
updateDisplay(); // Initiale Anzeige aktualisieren
