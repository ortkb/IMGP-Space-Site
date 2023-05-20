//to - do
/*

this should really be running on deltatime instead of frames

- custom font
- convert seconds to minutes

*/

const introMessageText = [
    "Drag the planets back to the correct order.", 
    "Aliens"
]

// Bits and pieces of code taken from: https://labs.phaser.io/edit.html?src=src/input/zones/drop%20zone.js



class ResultsScene extends Phaser.Scene{
    constructor(){
        super({ key: "ResultsScene"})
    }

    init (data){
        this.minutes = data.minutes;
        this.seconds = data.seconds;
        !data.time ? this.time = "[No Recorded Time]" : this.time = data.time;
    }

    preload(){
        this.load.image("spaceBackground", "img/space_bg_1920x1080.jpg");
    }

    create(){
        
        let background = this.add.image(0, 0, "spaceBackground").setOrigin(0, 0);

        //let textBackground = new Phaser.Geom.Rectangle(500, 300, 600, 400);
        let graphics = this.add.graphics()
            .fillStyle(0xffffff, 0.9)
            .fillRoundedRect(200, 100, 600, 400, 20);

        let text = this.add.text(500, 300, "CONGRATULATIONS!\nYour time was\n\n" + this.minutes + " minutes, " + this.seconds + " seconds\n\nWant to try again?\n", {
			fontSize: '25px',
			color: '#000',
            fontFamily: 'Arial', // Add site font here ( https://webtips.dev/webtips/phaser/custom-fonts-in-phaser3 )
			wordWrap: { width: 300 },
            lineSpacing: 10,
            align: "center"
		}).setOrigin(0.5, 0.5);

        let homeButton = this.makeButton("Quit Game", 550, 425, 150, 50, this)
        homeButton.zone.setInteractive().on("pointerdown", ()=> {
            console.log("quit game");
            window.location.href = 'planets.html';
            window.location = "planets.html";
        }, this);
        
        let retryButton = this.makeButton("Retry", 300, 425, 150, 50, this)
        retryButton.zone.setInteractive().on("pointerdown", this.resetGame, this);
    }

    resetGame(){ // values set to classes (such as planet rotation) are NOT reset by a start() or restart() and need to be redeclared in the init() or create()
        this.scene.start("SpaceScene");

        //var gameScene = this.scene.get('SpaceScene');

        //gameScene.scene.restart();
    }

    makeButton(text, x, y, width, height, scene){
        let buttonGraphics = scene.add.graphics()
            .fillStyle(0xdddddd, 1)
            .fillRoundedRect(x, y, width, height, 10);

        let buttonText = this.add.text(x + width / 2, y + height / 2, text, {
			fontSize: '18px',
			color: '#000',
            fontFamily: 'Arial', // Add site font here ( https://webtips.dev/webtips/phaser/custom-fonts-in-phaser3 )
			wordWrap: { width: width },
            align: "center"
		}).setOrigin(0.5, 0.5);

        let buttonZone = scene.add.zone(x, y, width, height).setOrigin(0, 0);
        
        return {background: buttonGraphics, text: buttonText, zone: buttonZone};
    }
}

class SpaceScene extends Phaser.Scene{
    constructor(){
        super({ key: 'SpaceScene' });
        this.isCorrectAnswer = false;
    }
    
    preload(){
        this.load.image("spaceBackground", "img/space_bg_1920x1080.jpg");
        this.load.image("sunBackground", "img/sun 2.png");
        // Loading each image individually is silly but I'll do it
        // planet images are HUGE (4500x4500 ??!!!) - rescale and ideally store as one spritesheet or tilemap
        this.load.image("planet-0", "img/Planets/mercury.png");
    }

    create(){
        // Background
        let background = this.add.image(0, 0, "spaceBackground").setOrigin(0, 0);
        this.sun = this.add.image(0, 300, "sunBackground")
            .setOrigin(0, 0.5)
            .setScale(1.5);
        // Elements
        this.planetSlots = this.createDropZones();
        this.planets = this.createPlanets(); // Create planet(s)
        this.createDragAndDropListeners();

        this.startTime = 0;

        // Intro textbox
        let introTextbox = this.add.existing(new FullscreenTextbox(introMessageText, 500, 300, 600, 400, this)).on('destroy', ()=> {
                this.startTime = this.time.now; // Set timer once messagebox closes
        }, this);
    }

    update(){
    }

    createPlanets(){
        let x = 100;
        let y = 400;
        let planetsArray = [];
        for (let i = 0; i < 3; i++){
            let planet = this.children.add(new Planet("planet-" + 0, i, x, y, this)).setInteractive();
            this.input.setDraggable(planet);

            x += 120;
            y += 20;

            planetsArray.push(planet);
        }
        
        return planetsArray;
    }

    createDropZones(){
        let x = 300;
        const y = 200;
        const width = 100;
        const height = 100;
        let zonesArray = [];
        
        for (let i = 0; i < 3; i++){
            let newPlanetSlot = this.children.add(new PlanetSlot(i, x, y, width, height, this));
            this.physics.add.existing(newPlanetSlot, true); // add physics
            
            x += 200;

            zonesArray.push(newPlanetSlot);
        }
        return zonesArray;        
    }

    createDragAndDropListeners(){
        this.input.on("dragstart", (pointer, planet) =>{ 
            this.children.bringToTop(planet); // brings image to top layer
        }, this);

        this.input.on("drag", (pointer, planet, dragX, dragY) => {
            planet.x = dragX;
            planet.y = dragY;
        }, this);
        this.input.on('drop', (pointer, planet, planetSlot) => {
            if (planet.id == planetSlot.id){
                // Position of the gameObject (the held planet) is snapped to the dropZone's origin.
                planet.x = planetSlot.x;
                planet.y = planetSlot.y;
                // Make it so that the gameobject can't be interacted with after dropping
                planet.input.enabled = false;
                this.runCorrectAnswer(planet, planetSlot);
            }else{
                this.runIncorrectAnswer(planet, planetSlot);
                planet.x = planet.input.dragStartX;
                planet.y = planet.input.dragStartY;
            }
            
        }, this);

        this.input.on('dragend', (pointer, planet, dropped) =>{

            if (!dropped){
                // If not dropped, return to start position
                planet.x = planet.input.dragStartX;
                planet.y = planet.input.dragStartY;
            }
        }, this);

    }

    runCorrectAnswer(_planet, _planetSlot){
        console.log("correct");
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
        // give audio / visual feedback
        this.showHint(_planetSlot);
    }

    showHint(_planetSlot){
        this.add.existing(new PopupTextbox(_planetSlot.getHintText(), _planetSlot.x, _planetSlot.y - 100, 200, 80, this));
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
        let endTimeTotalSeconds = Phaser.Math.RoundTo( (this.time.now - this.startTime) * 0.001, -2);
        let endTimeSeconds = endTimeTotalSeconds % 60;
        let endTimeMinutes = Math.floor(endTimeTotalSeconds / 60);
        this.scene.start("ResultsScene", { time: endTimeTotalSeconds, minutes: endTimeMinutes, seconds: endTimeSeconds });
    }

    destroyAll(){
        // may be unnecessary?
        this.sun.destroy();
        for (let item of this.planets){
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
    //scene:[ResultsScene, SpaceScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true // remove debug to get rid of blue boxes, lines, etc
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

