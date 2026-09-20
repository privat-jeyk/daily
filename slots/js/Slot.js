class Slot {

    turn = 0;

    constructor(maxTurns, minTurns, imageCount, container) {
        this.maxTurns = maxTurns;
        this.minTurns = minTurns;
        this.imageCount = imageCount;

        // Zufallsnummer für Anfangsbild
        this.imageNumber = getRandomInt(0, imageCount-1);

        this.image = document.createElement("img");
        this.image.src = "img/Image"+this.imageNumber+".png";
        container.appendChild(this.image);
        console.log("instance: ", this.constructor.name);
    }

    resetSlot() {
        this.turn = getRandomInt(this.minTurns, this.maxTurns);
    }

    spinSlot() {
        if (this.isStillSpinning()) {
            this.imageNumber = ++this.imageNumber % (this.imageCount-1);
            this.image.src ="img/Image" + this.imageNumber + ".png";
            this.turn--;
        }
    }

    // Rückgabe: ob sich Slot noch dreht als true oder false
    isStillSpinning() {
        return this.turn > 0 
    }
}