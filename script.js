// Cookie Clicker Script mit Prestige, Upgrades und Auto-Cookies
let cookies = parseInt(localStorage.getItem("cookies")) || 0;
let clickPower = parseInt(localStorage.getItem("clickPower")) || 1;
let prestigePoints = parseInt(localStorage.getItem("prestigePoints")) || 0;
let cookiesPerSecond = parseFloat(localStorage.getItem("cookiesPerSecond")) || 0;

const prestigeThreshold = 1000000;
const cookieCount = document.getElementById("cookie-count");
const clickPowerInfo = document.getElementById("clickpower-info");
const prestigeInfo = document.getElementById("prestige-info");
const cookieImg = document.getElementById("cookie");
const clickSound = document.getElementById("click-sound");

let prestigeBonus = 1 + prestigePoints * 0.1;

const clickUpgrades = [
  { name: "Klickstufe 1", price: 50, increase: 1 },
  { name: "Klickstufe 2", price: 200, increase: 2 },
  { name: "Klickstufe 3", price: 500, increase: 3 },
  { name: "Klickstufe 4", price: 1000, increase: 4 },
  { name: "Klickstufe 5", price: 2000, increase: 6 }
];

const autoUpgrades = [
  { name: "Keks-Fabrik", price: 200, cpsIncrease: 0.5 },
  { name: "Keks-Mine", price: 1000, cpsIncrease: 1 },
  { name: "Keks-Planet", price: 2000, cpsIncrease: 2 },
  { name: "Mondbäcker", price: 4000, cpsIncrease: 4 },
  { name: "Sternensnack", price: 8000, cpsIncrease: 6 },
  { name: "Milchstraße-Prozessor", price: 15000, cpsIncrease: 10 }
];

const prestigeUpgrades = [
  { name: "Goldene Hände", price: 5000, type: "click", increase: 2, requiredPrestige: 1 },
  { name: "Himmlisches Backwerk", price: 10000, type: "cps", increase: 5, requiredPrestige: 1 },
  { name: "Keks-Gottheit", price: 20000, type: "cps", increase: 10, requiredPrestige: 2 }
];

function updateDisplay() {
  cookieCount.textContent = `Cookies: ${Math.floor(cookies)}`;
  clickPowerInfo.textContent = `Klickstärke: ${clickPower} | CPS: ${cookiesPerSecond.toFixed(1)}`;
  prestigeInfo.textContent = cookies >= prestigeThreshold
    ? `Du kannst Prestige aktivieren!`
    : `Prestige ab: ${prestigeThreshold} (Fehlen: ${prestigeThreshold - cookies})`;

  localStorage.setItem("cookies", cookies);
  localStorage.setItem("clickPower", clickPower);
  localStorage.setItem("cookiesPerSecond", cookiesPerSecond);
  localStorage.setItem("prestigePoints", prestigePoints);
}

function prestige() {
  if (cookies >= prestigeThreshold) {
    prestigePoints++;
    clickPower = Math.floor(clickPower * prestigeBonus);
    cookies = 0;
    cookiesPerSecond = 0;
    localStorage.setItem("prestigePoints", prestigePoints);
    alert(`Prestige aktiviert! Du hast jetzt ${prestigePoints} Prestige.`);
    updateDisplay();
    renderShop();
  } else {
    alert("Du brauchst mehr Cookies für Prestige.");
  }
}

function renderShop() {
  const clickDiv = document.getElementById("click-upgrades");
  clickDiv.innerHTML = "";
  clickUpgrades.forEach((upg, i) => {
    const btn = document.createElement("button");
    btn.textContent = `${upg.name} (${upg.price} Cookies, +${upg.increase}/Click)`;
    btn.onclick = () => buyClickUpgrade(i);
    clickDiv.appendChild(btn);
  });

  const autoDiv = document.getElementById("auto-upgrades");
  autoDiv.innerHTML = "";
  autoUpgrades.forEach((upg, i) => {
    const btn = document.createElement("button");
    btn.textContent = `${upg.name} (${upg.price} Cookies, +${upg.cpsIncrease}/Sek)`;
    btn.onclick = () => buyAutoUpgrade(i);
    autoDiv.appendChild(btn);
  });

  const prestigeDiv = document.getElementById("prestige-upgrades");
  prestigeDiv.innerHTML = "";
  prestigeUpgrades.forEach((upg, i) => {
    if (prestigePoints >= upg.requiredPrestige) {
      const btn = document.createElement("button");
      btn.classList.add("prestige-only");
      btn.textContent = `${upg.name} (${upg.price} Cookies, +${upg.increase} ${upg.type === "click" ? "/Click" : "/Sek"})`;
      btn.onclick = () => buyPrestigeUpgrade(i);
      prestigeDiv.appendChild(btn);
    }
  });
}

function buyClickUpgrade(i) {
  const upg = clickUpgrades[i];
  if (cookies >= upg.price) {
    cookies -= upg.price;
    clickPower += upg.increase;
    updateDisplay();
  }
}

function buyAutoUpgrade(i) {
  const upg = autoUpgrades[i];
  if (cookies >= upg.price) {
    cookies -= upg.price;
    cookiesPerSecond += upg.cpsIncrease;
    updateDisplay();
  }
}

function buyPrestigeUpgrade(i) {
  const upg = prestigeUpgrades[i];
  if (cookies >= upg.price) {
    cookies -= upg.price;
    if (upg.type === "click") clickPower += upg.increase;
    else cookiesPerSecond += upg.increase;
    updateDisplay();
  }
}

cookieImg.onclick = () => {
  cookies += clickPower;
  clickSound.play();
  updateDisplay();
};

document.getElementById("prestige-button").onclick = prestige;

document.getElementById("reset-button").onclick = () => {
  if (confirm("Wirklich zurücksetzen?")) {
    if (confirm("Ganz sicher?")) {
      localStorage.clear();
      cookies = 0;
      clickPower = 1;
      cookiesPerSecond = 0;
      prestigePoints = 0;
      updateDisplay();
      renderShop();
    }
  }
};

document.getElementById("btn-shop").onclick = () => {
  document.getElementById("game-view").classList.add("hidden");
  document.getElementById("shop-view").classList.remove("hidden");
};

document.getElementById("btn-game").onclick = () => {
  document.getElementById("shop-view").classList.add("hidden");
  document.getElementById("game-view").classList.remove("hidden");
};

setInterval(() => {
  cookies += cookiesPerSecond;
  updateDisplay();
}, 1000);

renderShop();
updateDisplay();
