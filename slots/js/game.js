function init(spinButtonId, scoreTextId, infoTextId, slotsContainerId) {

spinButton = document.getElementById(spinButtonId);
scoreText = document.getElementById(scoreTextId);
infoText = document.getElementById(infoTextId);
slotContainer = document.getElementById(slotsContainerId);

score = localStorage.getItem('SpielautomatScore');
if( score == null ) score = 0;
score = parseInt(score);
setScoreText("Score:"+score);

setInfoText("Drücke SPIN zum Spielen");

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

}

// Liefert Zufallszahl inkl. min und max
function getRandomInt(min, max) {
    
}

// Rückgabe: true oder false, je nachdem ob Drehung in Gang
function isStillSpinning() {
    
}

// Auswertung des Spielergebnisses
function evaluateRound() {
    
}

// Gewonnen
function won(points) {
    
}

// Verlorem
function lose() {
    
}

// Drehbutton ein und ausschalten
function setSpinButton( active ) {
    setSpinButton.disabled = !active;
}

// Infotext
function setInfoText(txt) {
    setInfoText.innerText = txt;
}

// Scoretext
function setScoreText(txt) {
    setScoreText.innerText = txt;
}

// Aktualisiert das Spiel regelmässig
function update() {
    
}