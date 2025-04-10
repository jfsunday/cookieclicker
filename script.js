let cookies = 0;
let clickPower = 1;
let cookiesPerSecond = 0;
let prestigePoints = 0;
let upgrades = { click: {}, auto: {}, prestige: {} };
let bonusActive = false;

const clickSound = document.getElementById("click-sound");
const cookieImg = document.getElementById("cookie");
const cookieCount = document.getElementById("cookie-count");
const clickPowerInfo = document.getElementById("clickpower-info");
const prestigeInfo = document.getElementById("prestige-info");

const clickUpgradeList = document.getElementById("click-upgrades");
const autoUpgradeList = document.getElementById("auto-upgrades");
const prestigeUpgradeList = document.getElementById("prestige-upgrades");

const gameView = document.getElementById("game-view");
const shopView = document.getElementById("shop-view");

const btnGame = document.getElementById("btn-game");
const btnShop = document.getElementById("btn-shop");
const btnPrestige = document.getElementById("prestige-button");
const btnReset = document.getElementById("reset-button");

const upgradeData = {
  click: [
    { name: "Starker Finger", price: 10, power: 1 },
    { name: "Goldfinger", price: 50, power: 5 },
    { name: "Hyperklick", price: 200, power: 15 },
    { name: "Klickbot", price: 1000, power: 50 }
  ],
  auto: [
    { name: "Oma", price: 20, cps: 0.2 },
    { name: "Keksfabrik", price: 100, cps: 1 },
    { name: "Keksplanet", price: 500, cps: 5 },
    { name: "Multiversum-Bäcker", price: 1500, cps: 10 }
  ],
  prestige: [
    { name: "Klick-Gott", price: 2, power: 10 },
    { name: "Keks-Sturm", price: 5, cps: 20 },
    { name: "Finger-Fusion", price: 10, power: 50 },
    { name: "CPS-Schmelze", price: 15, cps: 100 }
  ]
};

cookieImg.onclick = () => {
  cookies += clickPower;
  clickSound.play();

  if (!bonusActive && Math.random() < 0.01) {
    activateBonus();
  }

  updateDisplay();
  saveGame();
};

function activateBonus() {
  bonusActive = true;

  const oldClickPower = clickPower;
  const oldCPS = cookiesPerSecond;

  clickPower = Math.round(clickPower * 1.1);
  cookiesPerSecond = cookiesPerSecond * 1.1;

  const bonusMsg = document.createElement("div");
  bonusMsg.textContent = "🍀 Bonus! +10% CPS & Klickstärke für 60s!";
  bonusMsg.style.position = "fixed";
  bonusMsg.style.top = "20px";
  bonusMsg.style.left = "50%";
  bonusMsg.style.transform = "translateX(-50%)";
  bonusMsg.style.backgroundColor = "#00cc66";
  bonusMsg.style.color = "#fff";
  bonusMsg.style.padding = "10px";
  bonusMsg.style.borderRadius = "10px";
  bonusMsg.style.fontWeight = "bold";
  bonusMsg.style.zIndex = "1000";
  document.body.appendChild(bonusMsg);

  setTimeout(() => {
    document.body.removeChild(bonusMsg);
  }, 4000);

  setTimeout(() => {
    clickPower = oldClickPower;
    cookiesPerSecond = oldCPS;
    bonusActive = false;
    updateDisplay();
  }, 60000);
}

setInterval(() => {
  cookies += cookiesPerSecond;
  updateDisplay();
  saveGame();
}, 1000);

function updateDisplay() {
  cookieCount.textContent = `Cookies: ${Math.floor(cookies)}`;
  clickPowerInfo.textContent = `Klickstärke: ${clickPower} | CPS: ${cookiesPerSecond.toFixed(1)}`;
  prestigeInfo.textContent = `Prestige ab: 1000000 | Punkte: ${prestigePoints}`;
  renderUpgrades();
}

function buyUpgrade(type, index) {
  const item = upgradeData[type][index];
  const key = item.name;

  if (type === "prestige") {
    if (prestigePoints >= item.price) {
      prestigePoints -= item.price;
      upgrades[type][key] = (upgrades[type][key] || 0) + 1;
      if (item.power) clickPower += item.power;
      if (item.cps) cookiesPerSecond += item.cps;
    }
  } else {
    if (cookies >= item.price || upgrades[type][key]) {
      cookies -= item.price;
      upgrades[type][key] = (upgrades[type][key] || 0) + 1;
      if (item.power) clickPower += item.power;
      if (item.cps) cookiesPerSecond += item.cps;
    }
  }

  updateDisplay();
  saveGame();
}

function renderUpgrades() {
  ["click", "auto", "prestige"].forEach(type => {
    const container =
      type === "click" ? clickUpgradeList :
      type === "auto" ? autoUpgradeList :
      prestigeUpgradeList;

    container.innerHTML = "";
    upgradeData[type].forEach((item, index) => {
      const owned = upgrades[type][item.name] || 0;
      const canAfford = (type === "prestige" ? prestigePoints >= item.price : cookies >= item.price);
      const alreadyOwned = owned > 0;
      const shouldShow = canAfford || alreadyOwned;

      if (shouldShow) {
        const btn = document.createElement("button");
        btn.textContent = `${item.name} (${type === "prestige" ? item.price + " PP" : item.price}) x${owned}`;
        if (item.power) btn.textContent += ` [+${item.power} Klick]`;
        if (item.cps) btn.textContent += ` [+${item.cps} CPS]`;
        btn.onclick = () => buyUpgrade(type, index);
        container.appendChild(btn);
      }
    });
  });
}

function prestige() {
  if (cookies >= 1000000) {
    const bonus = Math.floor(cookies / 1000000);
    prestigePoints += bonus;
    cookies = 0;
    clickPower = 1;
    cookiesPerSecond = 0;
    upgrades = { click: {}, auto: {}, prestige: upgrades.prestige };
    saveGame();
    updateDisplay();
    alert(`Prestige! Du hast ${bonus} Punkt(e) erhalten.`);
  }
}

function resetGame() {
  // Alle Variablen zurücksetzen
  cookies = 0;
  clickPower = 1;
  cps = 0;
  prestigeLevel = 0;
  
  // Anzeigen zurücksetzen
  document.getElementById("cookie-count").textContent = `Cookies: ${cookies}`;
  document.getElementById("clickpower-info").textContent = `Klickstärke: ${clickPower} | CPS: ${cps}`;
  document.getElementById("prestige-info").textContent = `Prestige ab: 1000000`;
  
  // Falls es Upgrades gibt, zurücksetzen
  // Hier kannst du alle Upgrades zurücksetzen, je nachdem, wie du sie gespeichert hast
  
  alert("Das Spiel wurde zurückgesetzt!");
}


function saveGame() {
  const save = {
    cookies,
    clickPower,
    cookiesPerSecond,
    prestigePoints,
    upgrades
  };
  localStorage.setItem("cookieClickerSave", JSON.stringify(save));
}

function loadGame() {
  const save = localStorage.getItem("cookieClickerSave");
  if (save) {
    const data = JSON.parse(save);
    cookies = data.cookies || 0;
    clickPower = data.clickPower || 1;
    cookiesPerSecond = data.cookiesPerSecond || 0;
    prestigePoints = data.prestigePoints || 0;
    upgrades = data.upgrades || { click: {}, auto: {}, prestige: {} };
  }
}

loadGame();
updateDisplay();

btnGame.onclick = () => {
  gameView.classList.remove("hidden");
  shopView.classList.add("hidden");
};

btnShop.onclick = () => {
  shopView.classList.remove("hidden");
  gameView.classList.add("hidden");
};

btnPrestige.onclick = prestige;
btnReset.onclick = resetGame;

// === EXPORT / IMPORT (Binärcode) ===
const btnExport = document.getElementById("export-button");
const btnImport = document.getElementById("import-button");
const exportBox = document.getElementById("export-box");
const exportOutput = document.getElementById("export-output");
const importBox = document.getElementById("import-box");
const importInput = document.getElementById("import-input");
const importConfirm = document.getElementById("import-confirm");

function textToBinary(text) {
  return text.split('').map(char =>
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join(' ');
}

function binaryToText(binary) {
  return binary.split(' ').map(bin =>
    String.fromCharCode(parseInt(bin, 2))
  ).join('');
}

btnExport.onclick = () => {
  const save = localStorage.getItem("cookieClickerSave");
  const binary = textToBinary(save);
  exportOutput.value = binary;
  exportBox.classList.remove("hidden");
  importBox.classList.add("hidden");
};

btnImport.onclick = () => {
  importBox.classList.remove("hidden");
  exportBox.classList.add("hidden");
};

importConfirm.onclick = () => {
  try {
    const binText = importInput.value.trim();
    const json = binaryToText(binText);
    JSON.parse(json); // Validierung
    localStorage.setItem("cookieClickerSave", json);
    alert("Import erfolgreich! Spiel wird neu geladen.");
    location.reload();
  } catch (e) {
    alert("Ungültiger Binär-Code!");
  }
};
