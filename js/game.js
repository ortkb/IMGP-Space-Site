//to - do
/*
Create planet and dropZone / slot classes.
Do I really need the line graphics changing color? An outline and bg would do. Cut if unneeded.
*/


// Bits and pieces of code taken from: https://labs.phaser.io/edit.html?src=src/input/zones/drop%20zone.js

class Planet extends Phaser.GameObjects.Image{
    constructor (img, id, x, y, scene){
        super(scene);
        this.id = id;
        this.setTexture(img);
        this.setPosition(x, y);
        this.setScale(0.02);

        scene.physics.world.enableBody(this);
    }

    orbitSun(){
        // set origin to sun's position (or a point offscreen)
        // rotate
    }

}

class SpaceScene extends Phaser.Scene{
    constructor(){
        super("game");
    }

    preload(){
        this.load.image("spaceBackground", "img/space_bg_1920x1080.jpg");
        // Loading each image individually is silly but I'll do it
        // planet images are HUGE (4500x4500 ??!!!) - rescale and ideally store as one spritesheet or tilemap
        this.load.image("planet-1", "img/Planets/mercury.png");
    }

    create(){
        // Background
        this.background = this.add.image(10, 10, "spaceBackground");
        this.background.setOrigin(0, 0);
        // Elements
        this.planets = this.createPlanets(); // Create planet(s)
        this.planetSlots = this.createDropZones();
        this.createDragAndDropListeners();
        
        // Test
        this.mouseSprite = this.physics.add.image(400, 300, 'spaceBackground').setScale(0.05).setInteractive();
        this.input.setDraggable(this.mouseSprite);

        //check for overlap
        this.physics.add.overlap(this.planets, this.planetSlots, null, function(planet, planetSlot)
            {
                if(planet.id == planetSlot.id){
                    planetSlot.overlappingCorrectPlanet = true;
                    console.log("correct"); 
                    
                }
                // id check here
            }
        );        
    }

    update(){

        //this.isCorrect = checkIfCorrect();
        if (this.isCorrect){
            this.isCorrect = false;
        }
        for (let i = 0; i < this.planetSlots.length; i++){
            this.planetSlots[i].update();
            if(this.planetSlots[i].isCorrect == true){
                this.isCorrect = true;
                console.log("is truee");
            }
        }
        
    }

    createPlanets(){
        let x = 100;
        let y = 400;
        let planetsArray = [];
        for (let i = 0; i < 3; i++){
            let planet = this.children.add(new Planet("planet-" + 1, i+1, x, y, this)).setInteractive();
            //let planet = this.children.add(new Planet("planet-" + i, i+1, x, y, this)).setInteractive();
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
            let newPlanetSlot = this.children.add(new PlanetSlot(i + 1, x, y, width, height, this));
            this.physics.add.existing(newPlanetSlot, true); // add physics
            
            x += 200;

            zonesArray.push(newPlanetSlot);
        }
        return zonesArray;        
    }

    createDragAndDropListeners(){
        this.input.on("dragstart", function(pointer, gameObject){ 
            this.children.bringToTop(gameObject); // brings image to top layer
        }, this);

        this.input.on("drag", function(pointer, gameObject, dragX, dragY){
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragenter', function(pointer, gameObject, dropZone) {
            // show change in graphic when hovering over the dropbox
        });

        this.input.on('dragleave', function(pointer, gameObject, dropZone){
            // graphic change after entering >> leaving a hover over the dropbox
            
        });

        this.input.on('drop', function(pointer, gameObject, dropZone){
            
            // Position of the gameObject (the held planet) is snapped to the dropZone's origin.s
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            // Make it so that the gameobject can't be interacted with after dropping
            gameObject.input.enabled = false;
        });

        this.input.on('dragend', function(pointer, gameObject, dropped){

            if (!dropped){
                // If not dropped, return to start position
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }

            // change graphic line color
        });

    }

    showHint(index){

    }

    slotFilled(){
        // check if every slot is filled
        this.isEverySlotFilled()
    }

    isEverySlotFilled(){

    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,

    scene:[SpaceScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true // remove debug to get rid of blue boxes, lines, etc
        }
    },

    backgroundColor: "#ddd"
}

const game = new Phaser.Game(config); 

