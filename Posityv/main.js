const diaryForm = document.getElementById('diaryForm');
const diaryDate = document.getElementById('diaryDate');
const diaryComment = document.getElementById('diaryComment');

const entriesContainer =
    document.getElementById('entriesContainer');

const exportJsonBtn =
    document.getElementById('exportJson');

const importJsonBtn =
    document.getElementById('importJsonBtn');

const importJsonInput =
    document.getElementById('importJsonInput');

const hardReloadBtn =
    document.getElementById('hardReloadBtn');


const STORAGE_KEY = 'diaryEntries';


/* HEUTIGES DATUM */

function getTodayString() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return ${year}-${month}-${day};
}

diaryDate.value = getTodayString();


/* EINTRÄGE LADEN */

function loadEntries() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);

        if (!data) {
            return [];
        }

        const parsed = JSON.parse(data);

        return Array.isArray(parsed) ? parsed : [];

    } catch (error) {
        console.error('Fehler beim Laden:', error);
        return [];
    }
}


let diaryEntries = loadEntries();


/* EINTRÄGE SPEICHERN */

function saveEntries() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(diaryEntries)
    );
}


/* HTML SICHER DARSTELLEN */

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}


/* DATUM FORMATIEREN */

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');

    return date.toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}


/* EINTRÄGE ANZEIGEN */

function renderEntries() {

    entriesContainer.innerHTML = '';

    if (diaryEntries.length === 0) {

        entriesContainer.innerHTML = `
            <p class="no-entries">
                Noch keine Einträge vorhanden.
            </p>
        `;

        return;
    }


    const sortedEntries = [...diaryEntries].sort((a, b) => {

        const dateA = new Date(a.date + 'T00:00:00');
        const dateB = new Date(b.date + 'T00:00:00');

        if (dateA.getTime() === dateB.getTime()) {
            return Number(b.id) - Number(a.id);
        }

        return dateB - dateA;
    });


    sortedEntries.forEach(entry => {

        const entryItem = document.createElement('div');

        entryItem.className = 'entry-item';


        const mood = Math.min(
            5,
            Math.max(1, Number(entry.mood))
        );


        const stars =
            '★'.repeat(mood) +
            '☆'.repeat(5 - mood);


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
            entryItem.querySelector('.delete-btn');


        deleteButton.addEventListener('click', () => {
            deleteEntry(entry.id);
        });


        entriesContainer.appendChild(entryItem);
    });
}


/* EINTRAG SPEICHERN */

diaryForm.addEventListener('submit', event => {

    event.preventDefault();


    const checkedRadio =
        document.querySelector(
            'input[name="mood"]:checked'
        );


    if (!checkedRadio) {
        alert('Bitte wähle eine Tagesstimmung aus!');
        return;
    }


    const comment =
        diaryComment.value.trim();


    if (!comment) {
        alert('Bitte gib einen Kommentar ein.');
        return;
    }


    const newEntry = {

        id: Date.now().toString(),

        date: diaryDate.value,

        mood: Number(
            checkedRadio.value
        ),

        comment: comment
    };


    diaryEntries.push(newEntry);

    saveEntries();

    diaryComment.value = '';

    checkedRadio.checked = false;

    diaryDate.value = getTodayString();

    renderEntries();
});


/* EINTRAG LÖSCHEN */

function deleteEntry(id) {

    if (!confirm(
        'Möchtest du diesen Tagebucheintrag wirklich löschen?'
    )) {
        return;
    }


    diaryEntries = diaryEntries.filter(
        entry => entry.id !== id
    );


    saveEntries();

    renderEntries();
}


/* JSON EXPORT */

exportJsonBtn.addEventListener('click', () => {

    if (diaryEntries.length === 0) {

        alert(
            'Es gibt noch keine Einträge zum Exportieren!'
        );

        return;
    }


    const jsonString = JSON.stringify(
        diaryEntries,
        null,
        2
    );


    const blob = new Blob(
        [jsonString],
        {
            type: 'application/json'
        }
    );


    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.download =
        tagebuch_backup_${getTodayString()}.json;


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

});


/* IMPORT BUTTON */

importJsonBtn.addEventListener('click', () => {
    importJsonInput.click();
});


/* JSON IMPORT */

importJsonInput.addEventListener('change', event => {

    const file = event.target.files[0];

    if (!file) {
        return;
    }


    if (!file.name.toLowerCase().endsWith('.json')) {

        alert(
            'Bitte wähle eine JSON-Datei aus.'
        );

        importJsonInput.value = '';

        return;
    }


    const reader = new FileReader();


    reader.onload = () => {

        try {

            const importedData =
                JSON.parse(reader.result);


            if (!validateImportedData(importedData)) {

                alert(
                    'Die JSON-Datei hat kein gültiges Tagebuch-Format.'
                );

                return;
            }


            const action = prompt(
                'Wie möchtest du importieren?\n\n' +
                '1 = Einträge zusammenführen\n' +
                '2 = Vorhandene Einträge ersetzen\n\n' +
                'Abbrechen = nichts ändern',
                '1'
            );


            if (action === null) {
                return;
            }


            if (action === '1') {

                mergeEntries(importedData);

            } else if (action === '2') {

                replaceEntries(importedData);

            } else {

                alert(
                    'Ungültige Auswahl. Bitte 1 oder 2 eingeben.'
                );
            }

        } catch (error) {

            console.error(error);

            alert(
                'Die JSON-Datei konnte nicht gelesen werden.'
            );
        }
    };


    reader.onerror = () => {

        alert(
            'Die Datei konnte nicht gelesen werden.'
        );
    };


    reader.readAsText(file);

    importJsonInput.value = '';
});


/* JSON VALIDIEREN */

function validateImportedData(data) {

    if (!Array.isArray(data)) {
        return false;
    }


    for (const entry of data) {

        if (
            typeof entry !== 'object' ||
            entry === null
        ) {
            return false;
        }


        if (
            typeof entry.date !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)
        ) {
            return false;
        }


        if (
            !Number.isInteger(Number(entry.mood)) ||
            Number(entry.mood) < 1 ||
            Number(entry.mood) > 5
        ) {
            return false;
        }


        if (typeof entry.comment !== 'string') {
            return false;
        }
    }


    return true;
}


/* IMPORTIERTE EINTRÄGE HINZUFÜGEN */

function mergeEntries(importedEntries) {

    let added = 0;


    importedEntries.forEach(imported => {

        let id = String(
            imported.id ||
            Date.now() +
            Math.random().toString(36)
        );


        /*
         * Falls ID bereits existiert,
         * neue ID erzeugen.
         */

        while (
            diaryEntries.some(
                entry => entry.id === id
            )
        ) {

            id =
                Date.now() +
                Math.random()
                    .toString(36);
        }


        diaryEntries.push({

            id: id,

            date: imported.date,

            mood: Number(imported.mood),

            comment: imported.comment

        });


        added++;
    });


    saveEntries();

    renderEntries();


    alert(
        ${added} Einträge wurden importiert.
    );
}


/* VORHANDENE EINTRÄGE ERSETZEN */

function replaceEntries(importedEntries) {

    if (!confirm(
        'ACHTUNG!\n\n' +
        'Deine aktuell gespeicherten Einträge werden ersetzt.\n\n' +
        'Möchtest du wirklich fortfahren?'
    )) {
        return;
    }


    diaryEntries =
        importedEntries.map(entry => ({

            id: String(
                entry.id ||
                Date.now() +
                Math.random().toString(36)
            ),

            date: entry.date,

            mood: Number(entry.mood),

            comment: entry.comment

        }));


    saveEntries();

    renderEntries();


    alert(
        ${diaryEntries.length} Einträge wurden wiederhergestellt.
    );
}


/* HARD RELOAD */

hardReloadBtn.addEventListener('click', () => {

    const url =
        new URL(window.location.href);


    url.searchParams.set(
        'reload',
        Date.now()
    );


    window.location.replace(
        url.toString()
    );
});


/* START */

renderEntries();