let slotContainer, //Element in dem die Slots sind
        slots, //Array für Slot-Instanzen
        spinButton, //Element Spin-Button
        displayText, //Element Output für Informationen
        scoreText, // Element Output für den Score
        score; // Score als Ganzzahl (Integer)

    const spinSpeed = 100;

    window.addEventListener("load", (event) => {
        init("spinButton", "scoreText", "infoText", "slots");
    });

    // Html-Element gesucht und zugewiesen
function init(spinButtonId, scoreTextId, infoTextId, slotsContainerId) {
spinButton = document.getElementById(spinButtonId);
scoreText = document.getElementById(scoreTextId);
infoText = document.getElementById(infoTextId);
slotContainer = document.getElementById(slotsContainerId);

// gespeicherten Score laden und ausgeben
score = localStorage.getItem('SpielautomatScore');
if( score == null ) score = 0;
score = parseInt(score);
setScoreText("Score:"+score);

// Infotext ausgeben
setInfoText("Drücke SPIN zum Spielen");
slots = createSlots( slotContainer, 3);

// interval für die Aktualisierungsfunktion einrichten
setInterval( update, spinSpeed);

console.log("Init is done");
}

// Rückgabe: Array mit den Slot-Instanzen
function createSlots( container, count) {
    let slots=[];

    for(let i=0; i<count; i++) {
        slots.push( new Slot (40, 15, 9, container));
    }

    return slots;
}

// Setzt das Drehen der Slots in Gang
function spin() {
    // Für jede Instanz von Slot Reset ausführen
    slots.forEach( (slot) => {
        slot.resetSlot();
    });

    setInfoText("Viel Glück!");
    setSpinButton(false);
}

// Liefert Zufallszahl inkl. min und max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min +1) + min);
}

// Rückgabe: true oder false, je nachdem ob Drehung in Gang
function isStillSpinning() {
    for(let i=0; i< slots.length; i++) {
        if( slots[i].isStillSpinning() )
            return true;
    }

    return false
}

// Auswertung des Spielergebnisses
function evaluateRound() {
    var set = new Set();

    slots.forEach( (slot)=> { set.add(slot.imageNumber) });

    var points = (slots.length - set.size)*100;
    if( points >=100)
        won( points );
    else
        lose();
}

// Gewonnen
function won(points) {
    console.log("won:"+ points);
    setInfoText("Gewonnen ! " + points + "Punkte!");
    score += points;
    setScoreText("Score: "+score);
    localStorage.setItem('SpielautomatScore', score);

    // slots.forEach( slot=> {slot.resetSlot() } );
    setSpinButton(true);
}

// Verlorem
function lose() {
    console.log("lose");
    setInfoText("Leider nichts, versuch es nochmal!");
    setSpinButton(true);
}

// Drehbutton ein und ausschalten
function setSpinButton( active ) {
    spinButton.disabled = !active;
}

// Infotext
function setInfoText(txt) {
    infoText.innerText = txt;
}

// Scoretext
function setScoreText(txt) {
    scoreText.innerText = txt;
}

// Aktualisiert das Spiel regelmässig
function update() {
    if(spinButton.disabled) {
        slots.forEach( (slot)=> {
            slot.spinSlot();
        });

        if( !isStillSpinning() )
            evaluateRound();
    }
}