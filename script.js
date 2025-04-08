let cookies = parseInt(localStorage.getItem("cookies")) || 0;
let clickPower = parseInt(localStorage.getItem("clickPower")) || 1;
let prestigePoints = parseInt(localStorage.getItem("prestigePoints")) || 0;

const cookieCount = document.getElementById("cookie-count");
const clickPowerInfo = document.getElementById("clickpower-info");
const prestigeStatus = document.getElementById("prestige-status");
const cookieImg = document.getElementById("cookie");
const clickSound = document.getElementById("click-sound");

const prestigeThreshold = 1000000; // 1 Million Cookies für Prestige
let prestigeBonus = 1 + prestigePoints * 0.1; // 10% Bonus pro Prestige-Punkt

// Klick- und Auto-Upgrades
const clickUpgrades = [
  { name: "Klickstärke Level 1", price: 50, increase: 1 },
  { name: "Klickstärke Level 2", price: 200, increase: 2 },
  { name: "Klickstärke Level 3", price: 500, increase: 3 },
  { name: "Klickstärke Level 4", price: 1000, increase: 4 },
];

const autoUpgrades = [
  { name: "Keks-Fabrik", price: 1000, cpsIncrease: 0.5 },
  { name: "Keks-Mine", price: 5000, cpsIncrease: 1 },
  { name: "Keks-Planet", price: 10000, cpsIncrease: 2 },
];

// Funktionen zum Anzeigen der aktuellen Werte
function updateDisplay() {
  cookieCount.textContent = `Cookies: ${cookies}`;
  clickPowerInfo.textContent = `Klickstärke: ${clickPower}`;
  localStorage.setItem("cookies", cookies);
  localStorage.setItem("clickPower", clickPower);
  localStorage.setItem("prestigePoints", prestigePoints);
}

function prestige() {
  if (cookies >= prestigeThreshold) {
    prestigePoints += 1;
    clickPower = Math.floor(clickPower * prestigeBonus);
    cookies = 0;
    localStorage.setItem("cookies", cookies);
    localStorage.setItem("prestigePoints", prestigePoints);
    alert(`Prestige erreicht! Du hast jetzt ${prestigePoints} Prestige-Punkte.`);
    updateDisplay();
  } else {
    alert("Du hast noch nicht genug Cookies für Prestige!");
  }
}

cookieImg.onclick = () => {
  cookies += clickPower;
  clickSound.play();
  updateDisplay();
};

document.getElementById("prestige-button").onclick = prestige;

// Reset-Button
document.getElementById("reset-button").onclick = () => {
  if (confirm("Möchtest du wirklich deinen Spielstand zurücksetzen?")) {
    // Alle gespeicherten Daten löschen
    localStorage.clear();
    
    // Spielstand zurücksetzen
    cookies = 0;
    clickPower = 1;
    prestigePoints = 0;
    
    // Anzeige aktualisieren
    updateDisplay();
  }
};

// Wechseln zwischen Spiel und Shop
document.getElementById("btn-shop").onclick = () => {
  document.getElementById("game-view").classList.add("hidden");
  document.getElementById("shop-view").classList.remove("hidden");
  document.getElementById("btn-shop").classList.add("hidden");
  document.getElementById("btn-game").classList.remove("hidden");
};

document.getElementById("btn-game").onclick = () => {
  document.getElementById("shop-view").classList.add("hidden");
  document.getElementById("game-view").classList.remove("hidden");
  document.getElementById("btn-shop").classList.remove("hidden");
  document.getElementById("btn-game").classList.add("hidden");
};

// Shop-Logik
function renderShop() {
  const clickUpgradeDiv = document.getElementById("click-upgrades");
  clickUpgradeDiv.innerHTML = '';
  clickUpgrades.forEach((upgrade, index) => {
    const button = document.createElement("button");
    button.textContent = `Kaufen: ${upgrade.name} (Preis: ${upgrade.price} Cookies)`;
    button.onclick = () => buyClickUpgrade(index);
    clickUpgradeDiv.appendChild(button);
  });

  const autoUpgradeDiv = document.getElementById("auto-upgrades");
  autoUpgradeDiv.innerHTML = '';
  autoUpgrades.forEach((upgrade, index) => {
    const button = document.createElement("button");
    button.textContent = `Kaufen: ${upgrade.name} (Preis: ${upgrade.price} Cookies)`;
    button.onclick = () => buyAutoUpgrade(index);
    autoUpgradeDiv.appendChild(button);
  });
}

function buyClickUpgrade(index) {
  const upgrade = clickUpgrades[index];
  if (cookies >= upgrade.price) {
    cookies -= upgrade.price;
    clickPower += upgrade.increase;
    alert(`Du hast ${upgrade.name} gekauft!`);
    renderShop();
    updateDisplay();
  } else {
    alert("Nicht genug Cookies!");
  }
}

function buyAutoUpgrade(index) {
  const upgrade = autoUpgrades[index];
  if (cookies >= upgrade.price) {
    cookies -= upgrade.price;
    alert(`Du hast ${upgrade.name} gekauft!`);
    renderShop();
    updateDisplay();
  } else {
    alert("Nicht genug Cookies!");
  }
}

renderShop(); // Initiale Shop-Darstellung
updateDisplay(); // Initiale Anzeige aktualisieren
