// Export / Import Funktionalitäten
const btnExport = document.getElementById("export-button");
const btnImport = document.getElementById("import-button");
const exportBox = document.getElementById("export-box");
const exportOutput = document.getElementById("export-output");
const importBox = document.getElementById("import-box");
const importInput = document.getElementById("import-input");
const importConfirm = document.getElementById("import-confirm");
const saveButton = document.getElementById("save-button");

// Funktion zum Umwandeln von Text in Binär
function textToBinary(text) {
  return text.split('').map(char =>
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join(' ');
}

// Funktion zum Umwandeln von Binär in Text
function binaryToText(binary) {
  return binary.split(' ').map(bin =>
    String.fromCharCode(parseInt(bin, 2))
  ).join('');
}

// Funktion zum Speichern des Spiels
function saveGame() {
  // Hier definierst du die Werte, die in JSON gespeichert werden
  const gameData = {
    cookies: 1000000, // Beispielwert
    clickPower: 50,   // Beispielwert
    cps: 500,         // Beispielwert
    prestigeLevel: 3  // Beispielwert
  };

  // Den JSON-String erzeugen
  const gameDataJSON = JSON.stringify(gameData);

  // Den JSON-String in Binärform umwandeln
  const binaryData = textToBinary(gameDataJSON);

  // Speichern der Binärdaten im LocalStorage
  localStorage.setItem("cookieClickerSave", binaryData);
  alert("Spiel gespeichert!");
}

// Export Button klickt
btnExport.onclick = () => {
  const save = localStorage.getItem("cookieClickerSave");
  if (save) {
    // Den gespeicherten Binärcode anzeigen
    exportOutput.value = save;
    exportBox.classList.remove("hidden");
    importBox.classList.add("hidden");
  } else {
    alert("Es gibt keine gespeicherten Daten.");
  }
};

// Import Button klickt
btnImport.onclick = () => {
  importBox.classList.remove("hidden");
  exportBox.classList.add("hidden");
};

// Import bestätigen Button
importConfirm.onclick = () => {
  try {
    const binText = importInput.value.trim();
    const json = binaryToText(binText); // Binärdaten in Text umwandeln

    // Prüfen, ob der JSON-Text gültig ist
    const parsedData = JSON.parse(json);

    // Das Spiel mit den importierten Daten neu setzen
    localStorage.setItem("cookieClickerSave", binText);
    alert("Import erfolgreich! Spiel wird neu geladen.");
    location.reload(); // Seite neu laden
  } catch (e) {
    alert("Ungültiger Binär-Code!");
  }
};

// Speichern Button
saveButton.onclick = saveGame;
