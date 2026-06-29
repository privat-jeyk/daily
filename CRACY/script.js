document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.getElementById('grid');
    const scoreDisplay = document.getElementById('score');
    const resetBtn = document.getElementById('reset-btn');
    
    const width = 8;
    const numColors = 6;
    let board = [];
    let score = 0;
    let firstSelectedTile = null;

    // Spielfeld initialisieren
    function createBoard() {
        gridDisplay.innerHTML = '';
        board = [];
        for (let i = 0; i < width * width; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            // Zufällige Farbe zuweisen
            let randomColor = Math.floor(Math.random() * numColors);
            tile.classList.add(`color-${randomColor}`);
            tile.setAttribute('id', i);
            
            // Event Listener für Klicks
            tile.addEventListener('click', handleTileClick);
            
            gridDisplay.appendChild(tile);
            board.push(tile);
        }
        
        // Verhindern, dass beim Start direkt Matches existieren
        while (checkAndClearMatches(false)) {
            refillBoard(false);
        }
        score = 0;
        scoreDisplay.textContent = score;
    }

    // Klick-Verarbeitung
    function handleTileClick() {
        if (!firstSelectedTile) {
            // Erster Kachelklick
            firstSelectedTile = this;
            this.classList.add('selected');
        } else {
            // Zweiter Kachelklick
            const id1 = parseInt(firstSelectedTile.getAttribute('id'));
            const id2 = parseInt(this.getAttribute('id'));

            // Prüfen, ob die Kacheln Nachbarn sind
            const validMoves = [id1 - 1, id1 + 1, id1 - width, id1 + width];
            const isNeighbor = validMoves.includes(id2);

            // Verhindern von Zeilenumbrüchen-Sprüngen bei Links/Rechts-Checks
            const isRowWrap = (id1 % width === 0 && id2 === id1 - 1) || ((id1 + 1) % width === 0 && id2 === id1 + 1);

            if (isNeighbor && !isRowWrap) {
                swapColors(firstSelectedTile, this);
                
                // Prüfen, ob der Tausch ein Match erzeugt
                let hasMatches = checkAndClearMatches(true);
                
                if (!hasMatches) {
                    // Wenn kein Match, Tausch sofort rückgängig machen
                    setTimeout(() => {
                        swapColors(firstSelectedTile, this);
                    }, 200);
                } else {
                    // Kettenreaktion starten, falls Steine nachrücken
                    setTimeout(gameLoop, 400);
                }
            }

            firstSelectedTile.classList.remove('selected');
            firstSelectedTile = null;
        }
    }

    // Farben zweier Kacheln tauschen
    function swapColors(tile1, tile2) {
        const color1 = getTileColorClass(tile1);
        const color2 = getTileColorClass(tile2);
        
        tile1.classList.remove(color1);
        tile1.classList.add(color2);
        
        tile2.classList.remove(color2);
        tile2.classList.add(color1);
    }

    // Hilfsfunktion: Gibt die aktuelle Farbklasse zurück
    function getTileColorClass(tile) {
        return Array.from(tile.classList).find(cl => cl.startsWith('color-'));
    }

    // Findet Matches (3er Reihen) und löscht sie optional
    function checkAndClearMatches(shouldUpdateScore) {
        let matchFound = false;
        let tilesToClear = new Set();

        // Horizontale Matches prüfen
        for (let i = 0; i < width * width; i++) {
            if (i % width < width - 2) { // Nicht die letzten beiden Spalten prüfen
                let matchIndex = [i, i + 1, i + 2];
                let baseColor = getTileColorClass(board[i]);
                
                if (baseColor && matchIndex.every(idx => getTileColorClass(board[idx]) === baseColor)) {
                    matchIndex.forEach(idx => tilesToClear.add(idx));
                    matchFound = true;
                }
            }
        }

        // Vertikale Matches prüfen
        for (let i = 0; i < width * (width - 2); i++) {
            let matchIndex = [i, i + width, i + (width * 2)];
            let baseColor = getTileColorClass(board[i]);
            
            if (baseColor && matchIndex.every(idx => getTileColorClass(board[idx]) === baseColor)) {
                matchIndex.forEach(idx => tilesToClear.add(idx));
                matchFound = true;
            }
        }

        // Gefundene Kacheln leeren (Farbklasse entfernen)
        if (matchFound) {
            tilesToClear.forEach(idx => {
                const colorClass = getTileColorClass(board[idx]);
                if (colorClass) {
                    board[idx].classList.remove(colorClass);
                    if (shouldUpdateScore) score += 10;
                }
            });
            if (shouldUpdateScore) scoreDisplay.textContent = score;
        }

        return matchFound;
    }

    // Steine nach unten fallen lassen und oben neue generieren
    function refillBoard(animate = true) {
        // Spaltenweise von unten nach oben durchgehen
        for (let col = 0; col < width; col++) {
            let emptySpaces = 0;
            
            for (let row = width - 1; row >= 0; row--) {
                let currentIndex = row * width + col;
                
                if (!getTileColorClass(board[currentIndex])) {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    // Stein nach unten verschieben
                    let targetIndex = currentIndex + (emptySpaces * width);
                    let colorClass = getTileColorClass(board[currentIndex]);
                    board[currentIndex].classList.remove(colorClass);
                    board[targetIndex].classList.add(colorClass);
                }
            }

            // Neue Steine oben auffüllen
            for (let e = 0; e < emptySpaces; e++) {
                let targetIndex = e * width + col;
                let randomColor = Math.floor(Math.random() * numColors);
                board[targetIndex].classList.add(`color-${randomColor}`);
            }
        }
    }

    // Spiel-Schleife für Combos/Kettenreaktionen
    function gameLoop() {
        refillBoard(true);
        // Erneut prüfen, ob durch das Nachrücken neue Matches entstanden sind
        setTimeout(() => {
            if (checkAndClearMatches(true)) {
                setTimeout(gameLoop, 400); // Erneuter Durchlauf bei Combo
            }
        }, 200);
    }

    resetBtn.addEventListener('click', createBoard);
    createBoard();
});