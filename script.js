let cookies = 0;
let clickPower = 1;
let cookiesPerSecond = 0;
let prestigeLevel = 0;
let prestigePoints = 0;
const prestigeThreshold = 1000000;

let upgrades = {
  click: [],
  auto: [],
  prestige: []
};

const clickUpgradesData = [
  { name: "Mauspad", cost: 10, value: 1 },
  { name: "Gaming-Maus", cost: 50, value: 5 },
  { name: "Keksfinger", cost: 200, value: 15 },
];

const autoUpgradesData = [
  { name: "Oma", cost: 20, value: 1 },
  { name: "Fabrik", cost: 100, value: 5 },
  { name: "Backroboter", cost: 500, value: 20 },
];

const prestigeUpgradesData = [
  { name: "Ewige Maus", cost: 1, valueClick: 5, valueCps: 0 },
  { name: "Göttliche Fabrik", cost: 2, valueClick: 0, valueCps: 10 },
];

const cookieDisplay = document.getElementById("cookie-count");
const clickPowerInfo = document.getElementById("clickpower-info");
const prestigeInfo = document.getElementById("prestige-info");
const clickSound = document.getElementById("click-sound");

const cookieImg = document.getElementById("cookie");
const clickUpgradesContainer = document.getElementById("click-upgrades");
const autoUpgradesContainer = document.getElementById("auto-upgrades");
const prestigeUpgradesContainer = document.getElementById("prestige-upgrades");

cookieImg.addEventListener("click", () => {
  cookies += clickPower;
  clickSound.currentTime = 0;
  clickSound.play();
  updateDisplay();
});

function createUpgradeElement(upgrade, index, type) {
  const button = document.createElement("button");
  button.id = `${type}-upgrade-${index}`;
  button.textContent = `${upgrade.name} (Kosten: ${upgrade.cost})`;

  button.addEventListener("click", () => buyUpgrade(type, index));

  return button;
}

function renderUpgrades() {
  clickUpgradesContainer.innerHTML = "";
  autoUpgradesContainer.innerHTML = "";
  prestigeUpgradesContainer.innerHTML = "";

  clickUpgradesData.forEach((upgrade, i) => {
    if (!upgrades.click[i]) upgrades.click[i] = 0;
    const btn = createUpgradeElement(upgrade, i, "click");
    if (cookies < upgrade.cost && upgrades.click[i] < 1) return;
    clickUpgradesContainer.appendChild(btn);
  });

  autoUpgradesData.forEach((upgrade, i) => {
    if (!upgrades.auto[i]) upgrades.auto[i] = 0;
    const btn = createUpgradeElement(upgrade, i, "auto");
    if (cookies < upgrade.cost && upgrades.auto[i] < 1) return;
    autoUpgradesContainer.appendChild(btn);
  });

  prestigeUpgradesData.forEach((upgrade, i) => {
    if (!upgrades.prestige[i]) upgrades.prestige[i] = 0;
    const btn = createUpgradeElement(upgrade, i, "prestige");
    if (prestigePoints < upgrade.cost && upgrades.prestige[i] < 1) return;
    btn.textContent += ` (benötigt ${upgrade.cost} Prestige)`;
    prestigeUpgradesContainer.appendChild(btn);
  });
}

function buyUpgrade(type, index) {
  if (type === "click") {
    const upg = clickUpgradesData[index];
    if (cookies >= upg.cost) {
      cookies -= upg.cost;
      clickPower += upg.value;
      upgrades.click[index]++;
    }
  } else if (type === "auto") {
    const upg = autoUpgradesData[index];
    if (cookies >= upg.cost) {
      cookies -= upg.cost;
      cookiesPerSecond += upg.value;
      upgrades.auto[index]++;
    }
  } else if (type === "prestige") {
    const upg = prestigeUpgradesData[index];
    if (prestigePoints >= upg.cost && upgrades.prestige[index] < 1) {
      prestigePoints -= upg.cost;
      clickPower += upg.valueClick;
      cookiesPerSecond += upg.valueCps;
      upgrades.prestige[index]++;
    }
  }
  updateDisplay();
  saveGame();
}

function updateDisplay() {
  if (cookies < 0) cookies = 0;
  cookieDisplay.textContent = `Cookies: ${Math.floor(cookies)}`;
  clickPowerInfo.textContent = `Klickstärke: ${clickPower} | CPS: ${cookiesPerSecond}`;
  prestigeInfo.textContent = `Prestige ab: ${prestigeThreshold}`;
  renderUpgrades();
}

setInterval(() => {
  cookies += cookiesPerSecond;
  updateDisplay();
}, 1000);

// Prestige
document.getElementById("prestige-button").addEventListener("click", () => {
  if (cookies >= prestigeThreshold) {
    prestigeLevel++;
    prestigePoints++;
    cookies = 0;
    clickPower = 1 + prestigeLevel;
    cookiesPerSecond = 0;
    upgrades = { click: [], auto: [], prestige: upgrades.prestige };
    updateDisplay();
    saveGame();
  }
});

// Shop/Spiel Navigation
document.getElementById("btn-shop").addEventListener("click", () => {
  document.getElementById("game-view").classList.add("hidden");
  document.getElementById("shop-view").classList.remove("hidden");
});
document.getElementById("btn-game").addEventListener("click", () => {
  document.getElementById("shop-view").classList.add("hidden");
  document.getElementById("game-view").classList.remove("hidden");
});

// Reset
document.getElementById("reset-button").addEventListener("click", () => {
  if (confirm("Willst du wirklich zurücksetzen?")) {
    if (confirm("Ganz sicher?")) {
      if (confirm("Wirklich wirklich sicher?")) {
        localStorage.clear();
        location.reload();
      }
    }
  }
});

// Save / Load
function saveGame() {
  const save = {
    cookies,
    clickPower,
    cookiesPerSecond,
    prestigeLevel,
    prestigePoints,
    upgrades
  };
  localStorage.setItem("cookieSave", JSON.stringify(save));
}

function loadGame() {
  const save = JSON.parse(localStorage.getItem("cookieSave"));
  if (save) {
    cookies = save.cookies || 0;
    clickPower = save.clickPower || 1;
    cookiesPerSecond = save.cookiesPerSecond || 0;
    prestigeLevel = save.prestigeLevel || 0;
    prestigePoints = save.prestigePoints || 0;
    upgrades = save.upgrades || { click: [], auto: [], prestige: [] };
  }
  updateDisplay();
}
loadGame();

// Export / Import mit Binärcode
function toBinary(str) {
  return [...str].map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
}

function fromBinary(bin) {
  return bin.split(" ").map(b => String.fromCharCode(parseInt(b, 2))).join("");
}

window.exportGame = function () {
  const json = JSON.stringify({
    cookies,
    clickPower,
    cookiesPerSecond,
    prestigeLevel,
    prestigePoints
  });
  prompt("Exportierter Spielstand (Binärcode):", toBinary(json));
};

window.importGame = function () {
  const bin = prompt("Füge hier den Binärcode ein:");
  if (!bin) return;
  const json = fromBinary(bin);
  try {
    const data = JSON.parse(json);
    cookies = data.cookies || 0;
    clickPower = data.clickPower || 1;
    cookiesPerSecond = data.cookiesPerSecond || 0;
    prestigeLevel = data.prestigeLevel || 0;
    prestigePoints = data.prestigePoints || 0;
    saveGame();
    updateDisplay();
  } catch (e) {
    alert("Ungültiger Code.");
  }
};
