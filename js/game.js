//to - do
/*

    LOOK OVER EVERYTHING THAT NEEDS TO BE DONE

    localstorage high score > visible on corner?
    

    combine and minify all game related scripts.

*/

// I'm sorry, this got more and more sloppy as it went on. Should have actually written out a proper design document.

const introMessageText = [
    "Aliens have put the planets in the wrong places!",
    "Tap + Drag the planets back to the correct order.", 
    "Correct answer: +10 points\nIncorrect answer: -5 points.\n\nAim for a high score!"
]

const errorMessageSpread = document.getElementById("errormessage-spread");
let errorMessageStyle = getComputedStyle(errorMessageSpread);

class SpaceScene extends Phaser.Scene{
    constructor(){
        super({ key: 'SpaceScene' });
        this.isCorrectAnswer = false;
    }
    
    preload(){
        this.load.audio("backgroundAudio", "audio/underwater-white-noise-46423.mp3");
        this.load.image("spaceBackground", "img/space_bg_1920x1080.jpg");
        this.load.spritesheet("planetsSpritesheet", "img/game/game-spritesheet.png", { frameWidth: 550, frameHeight: 550});
        this.load.image("sunBackground", "img/sun 4.png");
    }

    create(){

        // Background
        this.add.image(0, 0, "spaceBackground").setOrigin(0, 0);
        this.sun = this.add.image(0, 275, "sunBackground")
            .setOrigin(0, 0.5)
            .setScale(0.6);

        // Audio

        const audio = this.sound.add("backgroundAudio", {
            volume: 0.05,
            loop: true
        });
        audio.play();

        // Elements
        this.planetSlots = this.createDropZones();
        this.planets = this.createPlanets(); // Create planet(s)
        this.createDragAndDropListeners();

        this.interactionsArePaused = false;
        this.introTextboxActive = true;

        this.startTime = 0;

        // Score display
        this.score = 0;
        this.scoreDisplay = this.add.existing(new Textbox("Score: " + this.score, 940, 30, 100, 40, this, "14px"));

        // Home button
        let homeButton = this.add.existing(new OutlineTextbox("HOME", 60, 30, 100, 40, this, "20px"));
        homeButton.zone.setInteractive().on("pointerdown", ()=> {
            console.log("quit game");
            window.location.href = 'planets.html';
            window.location = "planets.html";
        }, this);
        homeButton.changeBackgroundColor(0x5A5494);
        homeButton.changeBackgroundRadius(5);
        homeButton.changeTextColor(0xffffff);

        // Intro textbox
        
        this.introTextbox = new FullscreenTextbox(introMessageText, 500, 300, 600, 400, this);
        this.add.existing(this.introTextbox).on('destroy', ()=> {
                this.startTime = this.time.now; // Set timer once messagebox closes
                this.introTextboxActive = false;
        }, this);
        
    }

    
    update(){
        if (errorMessageStyle.display != "none" && !this.interactionsArePaused){ // If the errorscreen is visible
            this.removeInteractions();
            this.interactionsArePaused = true;
        }
        if (errorMessageStyle.display == "none" && this.interactionsArePaused){ // If the errorscreen is not visible
            this.setInteractions();
            this.interactionsArePaused = false;
        }
    }

    removeInteractions(){
        console.log("remove interactions");
        if (this.introTextboxActive){
            this.introTextbox.toggleInteractive(false);
        }
        for (let planet of this.planets){
            planet.disableInteractive();
        }
    }

    setInteractions(){
        console.log("resume interactions");
        if (this.introTextboxActive){
            this.introTextbox.toggleInteractive(true);
        }
        for (let planet of this.planets){
            planet.setInteractive();
        }
    }

    createPlanets(){
        let planetsArray = [];
        for (let i = 0; i < 8; i++){
            let planet = this.children.add(new Planet("planet-" + 0, i, 0, 0, this)).setInteractive();
            this.input.setDraggable(planet);
            planetsArray.push(planet);
        }
        return planetsArray;
    }

    createDropZones(){
        let x = 140;
        const y = this.sun.y;
        const width = 80;
        const height = 80;
        let margin = 110;
        let marginIncrease = 0;
        let zonesArray = [];
        
        for (let i = 0; i < 8; i++){
            let newPlanetSlot = this.children.add(new PlanetSlot(i, x, y, width, height, this));
            this.physics.add.existing(newPlanetSlot, true); // add physics
            
            x += margin;
            margin += marginIncrease;

            zonesArray.push(newPlanetSlot);
        }
        return zonesArray;        
    }

    createDragAndDropListeners(){
        this.input.on("dragstart", (pointer, planet) =>{ 
            this.children.bringToTop(planet); // brings image to top layer
            this.makePlanetLabel(planet);
        }, this);

        this.input.on("drag", (pointer, planet, dragX, dragY) => {
            planet.x = dragX;
            planet.y = dragY;
            this.planetNamePopup.setCustomPosition(dragX, dragY - 80);
        }, this);

        this.input.on('drop', (pointer, planet, planetSlot) => {
            if (planet.id == planetSlot.id){
                // Position of the gameObject (the held planet) is snapped to the dropZone's origin.
                planet.x = planetSlot.x;
                planet.y = planetSlot.y;
                // Make it so that the gameobject can't be interacted with after dropping
                planet.input.enabled = false;
                // remove label
                this.planetNamePopup.closeTextbox();
                // run correct answer
                this.runCorrectAnswer(planet, planetSlot);
            }else{
                this.runIncorrectAnswer(planet, planetSlot);
                planet.x = planet.input.dragStartX;
                planet.y = planet.input.dragStartY;
            }
            
        }, this);

        this.input.on('dragend', (pointer, planet, dropped) =>{
            // remove label
            this.planetNamePopup.closeTextbox();
            if (!dropped){
                // If not dropped, return to start position
                planet.x = planet.input.dragStartX;
                planet.y = planet.input.dragStartY;
            }
        }, this);

    }

    makePlanetLabel(_planet){
        if(this.planetNamePopup){
            this.planetNamePopup.closeTextbox();
            this.planetNamePopup.destroy();
        }
        this.planetNamePopup = new Textbox(_planet.params.name, _planet.x, _planet.y - 80, 100, 40, this, "14px");
        this.planetNamePopup.background.radius = 1;
    }

    runCorrectAnswer(_planet, _planetSlot){
        console.log("correct");
        this.editScore(10);
        // give audio / visual feedback
        _planetSlot.removeInteractive();
        this.physics.world.disable(_planetSlot);
        _planetSlot.graphics.clear();
        _planet.isOrbiting = true;      
        
        this.removePlanetSlot(_planetSlot);
        this.isEverySlotFilled(this.planetSlots);
    }

    runIncorrectAnswer(_planet, _planetSlot){
        console.log("incorrect");
        this.editScore(-5);
        // give audio / visual feedback
        this.showHint(_planetSlot);
    }

    showHint(_planetSlot){
        this.add.existing(new PopupTextbox(_planetSlot.getHintText(), _planetSlot.x, _planetSlot.y - 100, 200, 80, this));
    }

    editScore(_scoreChange){
        this.score += _scoreChange;
        let isPositiveScore = _scoreChange >= 0;
        let plusMinus = isPositiveScore ? "+" : "";
        this.scoreDisplay.displayText.setText("Score: " + this.score);
        this.showScorePopup(plusMinus + _scoreChange + " points", isPositiveScore);
    }

    showScorePopup(_text, _isPositiveScore){
        let scorePopup = new PopupTextbox(_text, 940, 30, 100, 40, this, "14px");
        scorePopup.changeBackgroundColor(_isPositiveScore ? 0xa2eba8 : 0xe398b9, 1);
        scorePopup.setFadeOut(1000);
        this.add.existing(scorePopup);
    }

    removePlanetSlot(_planetSlot){
        this.planetSlots = this.planetSlots.toSpliced(this.planetSlots.indexOf(_planetSlot), 1);
    }

    isEverySlotFilled(slots){
        if (slots.length <= 0){
            this.gameOver();
        }
    }

    gameOver(){
        let endTimeTotalSeconds = (this.time.now - this.startTime) * 0.001;
        let endTimeSeconds = Phaser.Math.RoundTo(endTimeTotalSeconds % 60, -2);
        let endTimeMinutes = Math.floor(endTimeTotalSeconds / 60);
        this.destroyAll();
        this.scene.start("ResultsScene", { score: this.score, time: endTimeTotalSeconds, minutes: endTimeMinutes, seconds: endTimeSeconds });
    }

    destroyAll(){
        this.sun.destroy();
        for (let item of this.planets){
            item.isOrbiting = false;
            item.destroy();
        }

        for (let item of this.planetSlots){
            item.destroy();
        }
        
        this.input.removeListener('dragstart');
        this.input.removeListener('drop');
        this.input.removeListener('dragend');
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,

    scene:[SpaceScene, ResultsScene],
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true // remove debug to get rid of blue boxes, lines, etc
        }
    },
    scale: {
        parent: 'gameContainer',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,

        min: {
            width: 800,
            height: 600
        },

        max: {
            width: 1600,
            height: 1200
        }
    },


    backgroundColor: "#ddd"
}

const game = new Phaser.Game(config); 

