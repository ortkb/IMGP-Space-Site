//to - do
/*

this should really be running on deltatime instead of frames

- high score / time record - send to results scene. 

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
        console.log("init", data);
    }

    preload(){
        this.load.image("spaceBackground", "img/space_bg_1920x1080.jpg");
    }

    create(){
        let background = this.add.image(0, 0, "spaceBackground").setOrigin(0, 0);

        //let textBackground = new Phaser.Geom.Rectangle(500, 300, 600, 400);
        let graphics = this.add.graphics();
        graphics.fillStyle(0xffffff, 0.9);
        graphics.fillRect(500, 300, 600, 400);
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

        // Round rectangles
        this.load.plugin('rexroundrectangleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexroundrectangleplugin.min.js', true);
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

        //check for overlap
  
        // Intro textbox
        let introTextbox = this.add.existing(new FullscreenTextbox(introMessageText, 500, 300, 600, 400, this));
        //introTextbox.setFadeOut(3000); 

    }

    update(){
        //console.log(Phaser.Math.RoundTo(this.time.now * 0.001, -2));
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

        this.input.on('dragenter', (pointer, gameObject, dropZone) => {
            // show change in graphic when hovering over the dropbox
        }, this);

        this.input.on('dragleave', (pointer, gameObject, dropZone) =>{
            // graphic change after entering >> leaving a hover over the dropbox
            
        }, this);

        this.input.on('drop', (pointer, planet, planetSlot) => {
            //console.log(planet.id + " _ _ " + planetSlot.id);
            if (planet.id == planetSlot.id){
                this.runCorrectAnswer(planet, planetSlot);
                // Position of the gameObject (the held planet) is snapped to the dropZone's origin.
                planet.x = planetSlot.x;
                planet.y = planetSlot.y;
                // Make it so that the gameobject can't be interacted with after dropping
                planet.input.enabled = false;
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

            // change graphic line color
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
        this.scene.start("ResultsScene", { time: Phaser.Math.RoundTo(this.time.now * 0.001, -2) });
    }


}

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,

    scene:[SpaceScene, ResultsScene],
    scene:[ResultsScene],
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

