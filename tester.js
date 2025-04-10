// Export / Import Funktionalitäten
const btnExport = document.getElementById("export-button");
const btnImport = document.getElementById("import-button");
const exportBox = document.getElementById("export-box");
const exportOutput = document.getElementById("export-output");
const importBox = document.getElementById("import-box");
const importInput = document.getElementById("import-input");
const importConfirm = document.getElementById("import-confirm");
const saveButton = document.getElementById("save-button");
const secretKeyInput = document.getElementById("secretKey");

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

// Funktion zur AES-Verschlüsselung
function encryptText(text, secretKey) {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
}

// Funktion zur AES-Entschlüsselung
function decryptText(encryptedText, secretKey) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Funktion zum Speichern des Spiels
function saveGame() {
  // Den geheimen Schlüssel aus dem Eingabefeld holen
  const secretKey = secretKeyInput.value.trim();
  if (!secretKey) {
    alert("Bitte gib einen geheimen Schlüssel ein.");
    return;
  }

  // Beispiel für Spielwerte
  const gameData = {
    cookies: 1000000,
    clickPower: 50,
    cps: 500,
    prestigeLevel: 3
  };

  // Den JSON-String erzeugen
  const gameDataJSON = JSON.stringify(gameData);

  // Verschlüsseln der JSON-Daten mit dem Benutzer-Schlüssel
  const encryptedData = encryptText(gameDataJSON, secretKey);

  // Den verschlüsselten Text in Binär umwandeln
  const binaryData = textToBinary(encryptedData);

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
    const encryptedText = binaryToText(binText);  // Binärdaten in verschlüsselten Text umwandeln

    // Den geheimen Schlüssel aus dem Eingabefeld holen
    const secretKey = secretKeyInput.value.trim();
    if (!secretKey) {
      alert("Bitte gib den gleichen geheimen Schlüssel ein, um zu entschlüsseln.");
      return;
    }

    // Entschlüsseln der Daten
    const decryptedData = decryptText(encryptedText, secretKey);

    // Den entschlüsselten JSON-String parsen
    const parsedData = JSON.parse(decryptedData);

    // Das Spiel mit den importierten Daten neu setzen
    localStorage.setItem("cookieClickerSave", binText);
    alert("Import erfolgreich! Spiel wird neu geladen.");
    location.reload(); // Seite neu laden
  } catch (e) {
    alert("Ungültiger Binär-Code oder falscher Schlüssel!");
  }
};

// Speichern Button
saveButton.onclick = saveGame;
