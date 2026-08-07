// DOM Elemente referenzieren
const diaryForm = document.getElementById('diaryForm');
const diaryDate = document.getElementById('diaryDate');
const diaryComment = document.getElementById('diaryComment');
const entriesContainer = document.getElementById('entriesContainer');
const exportJsonBtn = document.getElementById('exportJson');

// Sichere Funktion zum Ermitteln des heutigen Datums im Format YYYY-MM-DD
function getTodayString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Setzen des heutigen Datums beim Start
diaryDate.value = getTodayString();

// Speicher-Array (Laden aus LocalStorage oder leeres Array erzeugen)
let diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];

// Funktion: Listeneinträge rendern
function renderEntries() {
    entriesContainer.innerHTML = '';

    if (diaryEntries.length === 0) {
        entriesContainer.innerHTML = '<p class="no-entries">Noch keine Einträge vorhanden.</p>';
        return;
    }

    // Sortiert die Einträge chronologisch (neueste oben)
    const sortedEntries = [...diaryEntries].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedEntries.forEach((entry) => {
        const entryItem = document.createElement('div');
        entryItem.className = 'entry-item';

        // Erzeuge visuelle Stern-Anzeige
        const stars = '★'.repeat(entry.mood) + '☆'.repeat(5 - entry.mood);

        // Datum für deutsche Anzeige schön formatieren
        const formattedDate = new Date(entry.date).toLocaleDateString('de-DE', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        entryItem.innerHTML = `
            <div class="entry-header">
                <span class="entry-date">${formattedDate}</span>
                <span class="entry-stars">${stars}</span>
            </div>
            <div class="entry-text">${escapeHtml(entry.comment)}</div>
            <button class="delete-btn" onclick="deleteEntry('${entry.id}')">Eintrag löschen</button>
        `;

        entriesContainer.appendChild(entryItem);
    });
}

// Sicherheitsfunktion: Verhindert HTML-Injektionen in den Kommentaren (XSS Schutz)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

// Event-Listener: Formular absenden & neuen Eintrag generieren
diaryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Aktuell gewählte Radio-Stimmung ermitteln
    const checkedRadio = document.querySelector('input[name="mood"]:checked');
    if (!checkedRadio) {
        alert("Bitte wähle eine Tagesstimmung aus!");
        return;
    }
    const selectedMood = checkedRadio.value;

    // JS-Objekt für JSON strukturieren
    const newEntry = {
        id: Date.now().toString(), // Einzigartiger Timestamp als ID
        date: diaryDate.value,
        mood: parseInt(selectedMood),
        comment: diaryComment.value
    };

    // Daten lokal pushen & persistent speichern
    diaryEntries.push(newEntry);
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));

    // Formularfelder zurücksetzen
    diaryComment.value = '';
    checkedRadio.checked = false;
    diaryDate.value = getTodayString();
    
    renderEntries();
});

// Funktion: Einzelnen Eintrag aus der Liste löschen
window.deleteEntry = function(id) {
    if(confirm('Möchtest du diesen Tagebucheintrag löschen?')) {
        diaryEntries = diaryEntries.filter(entry => entry.id !== id);
        localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
        renderEntries();
    }
};

// Event-Listener: Array in ein echtes JSON-File umwandeln und herunterladen
exportJsonBtn.addEventListener('click', () => {
    if (diaryEntries.length === 0) {
        alert('Es gibt noch keine Einträge zum Exportieren!');
        return;
    }

    // JSON-String generieren (strukturiert formatiert mit Einrückungen)
    const jsonString = JSON.stringify(diaryEntries, null, 2);
    
    // Virtuellen Datei-Blob erstellen
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Temporären Download-Link erzeugen und triggern
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tagebuch_daten.json';
    document.body.appendChild(a);
    a.click();
    
    // Speicherbereinigung
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// App-Start: Gespeicherte Daten initial auf den Schirm rendern
renderEntries();