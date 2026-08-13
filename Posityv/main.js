// ===============================
// DOM ELEMENTE
// ===============================

const diaryForm = document.getElementById("diaryForm");
const diaryDate = document.getElementById("diaryDate");
const diaryComment = document.getElementById("diaryComment");
const entriesContainer = document.getElementById("entriesContainer");
const exportJsonBtn = document.getElementById("exportJson");
const importJsonBtn = document.getElementById("importJsonBtn");
const importJsonInput = document.getElementById("importJsonInput");
const hardReloadBtn = document.getElementById("hardReloadBtn");


// ===============================
// LOCAL STORAGE
// ===============================

const STORAGE_KEY = "diaryEntries";


// ===============================
// HEUTIGES DATUM
// ===============================

function getTodayString() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}

diaryDate.value = getTodayString();


// ===============================
// EINTRÄGE LADEN
// ===============================

function loadEntries() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return [];
    }

    try {
        const entries = JSON.parse(saved);

        if (Array.isArray(entries)) {
            return entries;
        }

        return [];

    } catch (error) {
        console.error("Fehler beim Laden der Einträge:", error);
        return [];
    }
}


let diaryEntries = loadEntries();


// ===============================
// EINTRÄGE SPEICHERN
// ===============================

function saveEntries() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(diaryEntries)
    );
}


// ===============================
// HTML SICHER MACHEN
// ===============================

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


// ===============================
// DATUM FORMATIEREN
// ===============================

function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("de-DE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}


// ===============================
// EINTRÄGE ANZEIGEN
// ===============================

function renderEntries() {

    entriesContainer.innerHTML = "";

    if (diaryEntries.length === 0) {

        entriesContainer.innerHTML = `
            <p class="no-entries">
                Noch keine Einträge vorhanden.
            </p>
        `;

        return;
    }


    // Neueste Einträge zuerst
    const sortedEntries = [...diaryEntries].sort(
        (a, b) => {

            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            return dateB - dateA;
        }
    );


    sortedEntries.forEach(entry => {

        const entryItem = document.createElement("div");

        entryItem.className = "entry-item";


        const mood = Number(entry.mood);

        const stars =
            "★".repeat(mood) +
            "☆".repeat(5 - mood);


        entryItem.innerHTML = `

            <div class="entry-header">

                <span class="entry-date">
                ${escapeHtml(formatDate(entry.date))}
                </span>

                <span class="entry-stars">
                    ${stars}
                </span>

            </div>

            <div class="entry-text">
                ${escapeHtml(entry.comment)}
            </div>

            <button class="delete-btn">
                Eintrag löschen
            </button>
        `;


        const deleteButton =
            entryItem.querySelector(".delete-btn");


        deleteButton.addEventListener("click", () => {
            deleteEntry(entry.id);
        });


        entriesContainer.appendChild(entryItem);
    });
}


// ===============================
// EINTRAG SPEICHERN
// ===============================

diaryForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const checkedRadio =
        document.querySelector(
            'input[name="mood"]:checked'
        );


    if (!checkedRadio) {

        alert("Bitte wähle eine Stimmung aus.");

        return;
    }


    const comment =
        diaryComment.value.trim();


    if (!comment) {

        alert("Bitte gib einen Kommentar ein.");

        return;
    }


    // Neuen Eintrag erstellen
    const newEntry = {

        id: Date.now().toString(),

        date: diaryDate.value,

        mood: Number(checkedRadio.value),

        comment: comment

    };


    // Eintrag ins Array
    diaryEntries.push(newEntry);


    // In localStorage speichern
    saveEntries();


    // Anzeige sofort aktualisieren
    renderEntries();


    // Formular zurücksetzen
    diaryComment.value = "";

    checkedRadio.checked = false;

    diaryDate.value = getTodayString();

});


// ===============================
// EINTRAG LÖSCHEN
// ===============================

function deleteEntry(id) {

    if (!confirm(
        "Möchtest du diesen Tagebucheintrag wirklich löschen?"
    )) {
        return;
    }


    diaryEntries = diaryEntries.filter(
        entry => entry.id !== id
    );


    saveEntries();

    renderEntries();
}


// ===============================
// JSON EXPORT
// ===============================

exportJsonBtn.addEventListener("click", function() {

    if (diaryEntries.length === 0) {

        alert(
            "Es gibt noch keine Einträge zum Exportieren!"
        );

        return;
    }


    const json = JSON.stringify(
        diaryEntries,
        null,
        2
    );


    const blob = new Blob(
        [json],
        {
            type: "application/json"
        }
    );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        `tagebuch_backup_${getTodayString()}.json`;


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
});


// ===============================
// JSON IMPORT BUTTON
// ===============================

importJsonBtn.addEventListener("click", function() {

    importJsonInput.click();

});


// ===============================
// JSON IMPORT
// ===============================

importJsonInput.addEventListener(
    "change",
    function(event) {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload = function() {

            try {

                const importedEntries =
                    JSON.parse(reader.result);


                if (!Array.isArray(importedEntries)) {

                    alert(
                        "Die JSON-Datei enthält keine gültigen Tagebucheinträge."
                    );

                    return;
                }
                const choice = confirm(
                    "OK = importierte Einträge hinzufügen\n" +
                    "Abbrechen = vorhandene Einträge ersetzen"
                );


                if (choice) {

                    // Hinzufügen
                    importedEntries.forEach(entry => {

                        diaryEntries.push({
                            id:
                                Date.now().toString() +
                                Math.random()
                                    .toString(36)
                                    .substring(2),

                            date: entry.date,

                            mood: Number(entry.mood),

                            comment: String(entry.comment)
                        });

                    });

                } else {

                    // Ersetzen
                    diaryEntries =
                        importedEntries.map(entry => ({

                            id:
                                String(
                                    entry.id ||
                                    Date.now().toString()
                                ),

                            date: entry.date,

                            mood: Number(entry.mood),

                            comment: String(entry.comment)

                        }));
                }


                saveEntries();

                renderEntries();


                alert(
                    "Die Einträge wurden erfolgreich importiert."
                );


            } catch (error) {

                console.error(
                    "Import-Fehler:",
                    error
                );


                alert(
                    "Die JSON-Datei konnte nicht gelesen werden."
                );
            }
        };


        reader.readAsText(file);

        importJsonInput.value = "";
    }
);


// ===============================
// NEU LADEN
// ===============================

hardReloadBtn.addEventListener(
    "click",
    function() {

        window.location.reload(true);

    }
);


// ===============================
// START
// ===============================

renderEntries();