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
        this.isCorrectAnswer = false;
    }

    preload(){
        this.load.image("spaceBackground", "img/space_bg_1920x1080.jpg");
        // Loading each image individually is silly but I'll do it
        // planet images are HUGE (4500x4500 ??!!!) - rescale and ideally store as one spritesheet or tilemap
        this.load.image("planet-0", "img/Planets/mercury.png");
    }

    create(){
        // Background
        this.background = this.add.image(10, 10, "spaceBackground");
        this.background.setOrigin(0, 0);
        // Elements
        this.planets = this.createPlanets(); // Create planet(s)
        this.planetSlots = this.createDropZones();
        this.createDragAndDropListeners();

        //check for overlap
        this.physics.add.overlap(this.planets, this.planetSlots, null, function(planet, planetSlot)
            {
                if(planet.id == planetSlot.id){
                    planetSlot.isOverlappingCorrectPlanet();
                    
                }
                // id check here
            }
        );        
    }

    update(){
        console.log(this.isCorrectAnswer);
        if (this.isCorrectAnswer){
            this.isCorrectAnswer = false;
        }
        for (let i = 0; i < this.planetSlots.length; i++){
            this.planetSlots[i].update();
            if(this.planetSlots[i].isCorrect == true){
                this.isCorrectAnswer = true;
            }
        }
        
    }

    createPlanets(){
        let x = 100;
        let y = 400;
        let planetsArray = [];
        for (let i = 0; i < 3; i++){
            let planet = this.children.add(new Planet("planet-" + 0, i, x, y, this)).setInteractive();
            //let planet = this.children.add(new Planet("planet-" + i, i, x, y, this)).setInteractive();
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
        this.input.on("dragstart", function(pointer, planet){ 
            this.children.bringToTop(planet); // brings image to top layer
        }, this);

        this.input.on("drag", function(pointer, planet, dragX, dragY){
            planet.x = dragX;
            planet.y = dragY;
        }, this);

        this.input.on('dragenter', function(pointer, gameObject, dropZone) {
            // show change in graphic when hovering over the dropbox
        }, this);

        this.input.on('dragleave', function(pointer, gameObject, dropZone){
            // graphic change after entering >> leaving a hover over the dropbox
            
        }, this);

        this.input.on('drop', function(pointer, planet, planetSlot){
            if (this.isCorrectAnswer){
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

        this.input.on('dragend', function(pointer, planet, dropped){

            if (!dropped){
                // If not dropped, return to start position
                planet.x = planet.input.dragStartX;
                planet.y = planet.input.dragStartY;
            }

            // change graphic line color
        }, this);

    }

    runCorrectAnswer(_planet, _planetSlot){
        // give audio / visual feedback
        this.physics.world.disable(_planetSlot);
        this.slotFilled();
        this.isEverySlotFilled()
    }

    runIncorrectAnswer(_planet, _planetSlot){
        // give audio / visual feedback
        this.showHint(_planetSlot.id);
    }

    showHint(_id){
        alert("show hint for planetSlot " + _id + " here.");
    }

    slotFilled(){
        // check if every slot is filled
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

