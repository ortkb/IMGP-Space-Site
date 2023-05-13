//to - do
/*
Create planet and dropZone / slot classes.
Do I really need the line graphics changing color? An outline and bg would do. Cut if unneeded.


do I need a physics object to trigger an overlap?   
*/


// Bits and pieces of code taken from: https://labs.phaser.io/edit.html?src=src/input/zones/drop%20zone.js

class Planet extends Phaser.Physics.Arcade.Image{
    constructor (img, id, x, y, scene){
        super(scene);
        this.id = id;
        this.setTexture(img);
        this.setPosition(x, y);
        this.setScale(0.02);
    }


}

class PlanetSlot extends Phaser.GameObjects.Zone{
    constructor(id, x, y, width, height, scene){
        super(scene, x, y, width, height);
        this.id = id;
        
        // set up dropzone
        this.setRectangleDropZone(width, height);

        const graphics = scene.add.graphics();
        graphics.lineStyle(2, 0xFFFFFF)
        // Hitbox is slightly larger than indicator to let in less precise inputs.
        //graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);
        graphics.strokeCircle(x, y, this.getSquareRadius(this.input.hitArea.width));


        // Overlap
        //scene.physics.add.existing(this, true); // 'true' means this is a static physics body
        
        /*
        scene.physics.add.overlap(this, function(thisElement, collisionObject, planetBody, collisionBody){
            if (collisionObject instanceof Planet){
                alert("holy shit collision detected");
            }
            else{
                console.log("collision detected : " + collisionObject);
            }
        });
        */
    }

    getSquareRadius = (sideLength) => sideLength * Math.sqrt(2)/2;
    

    // group graphic in this class 
    // so the planetslot ID and the graphic are stored in the same slot
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
        this.background = this.add.image(10, 10, "spaceBackground");
        this.background.setOrigin(0,0);
        
        this.planets = this.createPlanets(); // Create planet(s)
        this.zones = this.createDropZones();
        this.createDragAndDropListeners();
        
        //check for overlap
        this.physics.add.overlap(this.zones, function(){
            console.log("overlap success?!");
        }, null, this);

        /*
        for (let i = 0; i < this.zones.length; i++){
            console.log(this.zones[i]);
        }
        */
        
    }

    /// ///


    createPlanets(){
        //let planet = this.add.image(100, 300, "planet-1").setInteractive();
        let planet = this.children.add(new Planet("planet-1", 1, 400, 400, this)).setInteractive();
        //this.children.add(new Planet("planet-1", this, 400, 400);
        this.input.setDraggable(planet);

        return planet;
    }

    createDropZones(){
        let x = 300;
        const y = 200;
        const width = 100;
        const height = 100;
        let zones = [];
        
        for (let i = 0; i < 3; i++){
            let newPlanetSlot = this.children.add(new PlanetSlot(i + 1, x, y, width, height, this));
            //let zone = this.add.zone(x, y, 100, 100).setRectangleDropZone(100, 100);
            x += 200;
            zones.push(newPlanetSlot);
        }
        return zones;        
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

    changeGraphics(gameObject, color){

    }

    createGraphicsOutline(_zone, _x, _y, graphicsObject){

    }

    clickDrag(){

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
            debug: true
        }
    },

    backgroundColor: "#ddd"
}

const game = new Phaser.Game(config); 

