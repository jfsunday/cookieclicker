// Export / Import Funktionalitäten
const btnExport = document.getElementById("export-button");
const btnImport = document.getElementById("import-button");
const exportBox = document.getElementById("export-box");
const exportOutput = document.getElementById("export-output");
const importBox = document.getElementById("import-box");
const importInput = document.getElementById("import-input");
const importConfirm = document.getElementById("import-confirm");
const saveButton = document.getElementById("save-button");

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

function saveGame() {
  const cookies = document.getElementById("cookies").value;
  const cps = document.getElementById("cps").value;
  const clickStrength = document.getElementById("clickStrength").value;
  const upgrades = document.getElementById("upgrades").value;
  const prestige = document.getElementById("prestige").value;
  
  const gameData = {
    cookies: cookies,
    cps: cps,
    clickStrength: clickStrength,
    upgrades: upgrades,
    prestige: prestige
  };

  const gameDataJSON = JSON.stringify(gameData);
  localStorage.setItem("cookieClickerSave", gameDataJSON);
  alert("Spiel gespeichert!");
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

saveButton.onclick = saveGame;
