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