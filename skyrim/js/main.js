// 1. Daten beim Start laden
    let rezepte = JSON.parse(localStorage.getItem('rezepte')) || [];

    const form = document.getElementById('rezept-form');
    const liste = document.getElementById('rezept-liste');

// Platzhalter-Bild falls kein Bild hochgeladen wird
    const standardBild = "data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='100' height='100' viewBox='0 0 24 24' fill='%23aaa'><path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/></svg>";

// 2. Event-Listener für das Formular
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const titel = document.getElementById('titel').value;
        const zutaten = document.getElementById('zutaten').value;
        const bildInput = document.getElementById('bild');

// Funktion zum Erstellen des Rezept-Objekts
        const erstelleRezept = (bildDaten) => {
            const neuesRezept = {
                id: Date.now(),
                titel: titel,
                zutaten: zutaten,
                bild: bildDaten || standardBild
            };

            rezepte.push(neuesRezept);
            speichereDaten();
            rendereRezepte();
            form.reset();
        };

// Prüfen, ob ein Bild ausgewählt wurde
        if (bildInput.files && bildInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
        // Konvertiert das Bild in einen Base64-String, der im JSON gespeichert werden kann [1]
                erstelleRezept(event.target.result);
            };
            reader.readAsDataURL(bildInput.files[0]);
        } else {
        // Wenn kein Bild gewählt wurde, Standardbild nutzen
            erstelleRezept(null);
        }
    });

// 3. Rezepte im Browser-Speicher sichern
    function speichereDaten() {
        localStorage.setItem('rezepte', JSON.stringify(rezepte));
    }

// 4. Rezepte auf der Webseite anzeigen
    function rendereRezepte() {
        liste.innerHTML = '';

        if (rezepte.length === 0) {
            liste.innerHTML = '<p style="grid-column: 1/-1;">Noch keine Rezepte eingetragen.</p>';
            return;
        }

        rezepte.forEach(rezept => {
            const karte = document.createElement('div');
            karte.className = 'rezept-karte';
            
            karte.innerHTML = `
                <img class="rezept-bild" src="${rezept.bild}" alt="${rezept.titel}">
                <button class="loesch-btn" onclick="loescheRezept(${rezept.id})">Löschen</button>
                <div class="rezept-inhalt">
                    <h3>${rezept.titel}</h3>
                    <h4>Zutaten:</h4>
                    <p class="zutaten">${rezept.zutaten}</p>
                </div>
            `;
            liste.appendChild(karte);
        });
    }

// 5. Rezept löschen
    function loescheRezept(id) {
        rezepte = rezepte.filter(r => r.id !== id);
        speichereDaten();
        rendereRezepte();
    }

// 6. JSON-Datei herunterladen (Export) inkl. Bildern
    function exportiereJSON() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rezepte, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "rezeptbuch_mit_bildern.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }

// 7. JSON-Datei einlesen (Import)
    function importiereJSON(input) {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importierteRezepte = JSON.parse(e.target.result);
                if (Array.isArray(importierteRezepte)) {
                    rezepte = importierteRezepte;
                    speichereDaten();
                    rendereRezepte();
                    alert('Rezepte inklusive Bilder erfolgreich importiert!');
                } else {
                    alert('Ungültiges Dateiformat.');
                }
            } catch (error) {
                alert('Fehler beim Lesen der JSON-Datei.');
            }
        };
        reader.readAsText(file);
    }

// Erste Anzeige beim Laden der Seite
    rendereRezepte();