//to - do
/*

this should really be running on deltatime instead of frames

start location of rotation / rotationRadius should be the coordinates of the planetSlot

- popup messages on incorrect answer
- intro messages
- high score / time record - send to results scene. 

can't seem to just cleanly destroy() the SingleUseTextbox and everything inside it - not a priority leave it for now.




*/

const introMessageText = [
    "Drag the planets back to the correct order.", 
    "Aliens"
]

class Textbox extends Phaser.GameObjects.GameObject{
    constructor(textArray, _x, _y, _width, _height, scene){
        super(scene, "TextBox");
        this.currentPage = 0;
        this.textArray = textArray;
        this.scene = scene;
        this.isFadingOut = false;

        this.background = scene.add.rexRoundRectangle(_x, _y, _width, _height, 20, 0xffffff); //200, 150, 400, 200, 30 (corner radius), 0xffffff
        
        this.zone = scene.add.zone(0, 0, 1000, 600)
            .setOrigin(0, 0); // fullscreen zone to change messages      


        this.displayText = scene.add.text(_x, _y, 'TEXT HERE', {
			fontSize: '25px',
			color: '#000',
            fontFamily: 'Arial', // Add site font here ( https://webtips.dev/webtips/phaser/custom-fonts-in-phaser3 )
			wordWrap: { width: 300 }
		}).setOrigin(0.5, 0.5);
        
        
        if (typeof this.textArray == "string"){
            this.displayText.setText(this.textArray);
        }
        else{
            this.displayText.setText(this.textArray[0]);
        }
        this.setFadeOut(3000); 

        this.updateListener = scene.events.on('update', this.update, this);
    }

    update(){
        if (this.isFadingOut){
            this.displayText.alpha -= 0.05;
            this.background.alpha -= 0.05;
            if (this.displayText.alpha <= 0){     
                this.closeTextbox(this.scene);
            }
        }
    }

    setFadeOut(delay){
        this.scene.time.delayedCall(delay, function(){
            this.isFadingOut = true;
        }, [], this); // is this in the wrong scope?
    }

    closeTextbox(_scene){ // I somehow cannot get this thing to destroy() itself and its components in a smooth way.
        //this.zone.removeInteractive();
        this.zone.setScale(0, 0);
        // I cannot find a way to delete this.updateListener cleanly - for some reason the planet orbiting breaks when I just destroy() it. Wild.
        this.destroyAllInArray([this.background, this.zone, this]);
    }

    destroyAllInArray(_array){
        for (let i = 0; i < _array.length; i++){
            _array[i].destroy();
        }
    }    
}

class FullscreenTextbox extends Textbox{
    constructor(textArray, _x, _y, _width, _height, scene){
        super(textArray, _x, _y, _width, _height, scene);
        
        this.zone.setInteractive()
        
        this.zone.on("pointerdown", function(){
            this.currentPage++;
            if (this.currentPage >= this.textArray.length){
                this.closeTextbox(scene);
            }
            this.displayText.setText(this.textArray[this.currentPage]); // progress to next page
        }, this); 
    }
}


class PopupTextbox extends Textbox{
    constructor(textArray, _x, _y, _width, _height, scene){
        super(textArray, _x, _y, _width, _height, scene);

        this.displayText = scene.add.text(_x, _y, 'TEXT HERE', {
			fontSize: '18px',
			color: '#000',
            fontFamily: 'Arial', // Add site font here ( https://webtips.dev/webtips/phaser/custom-fonts-in-phaser3 )
			wordWrap: { width: 300 }
		}).setOrigin(0.5, 0.5);


        let zone = scene.add.zone(0, 0, _width, _height)
            .setInteractive()
            .setOrigin(0, 0); // Interactable section is limited to the size of the box.

            // Remove interaction if it becomes a pain.

            this.scene.time.delayedCall(3000, function(){
                this.isFadingOut = true;
            },this);
    }
}



// Bits and pieces of code taken from: https://labs.phaser.io/edit.html?src=src/input/zones/drop%20zone.js

class SpaceScene extends Phaser.Scene{
    constructor(){
        super({
            key: 'SpaceScene'
        })
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
        var background = this.add.image(0, 0, "spaceBackground")
            .setOrigin(0, 0);
        this.sun = this.add.image(0, 300, "sunBackground")
            .setOrigin(0, 0.5)
            .setScale(1.5);
        // Elements
        this.planetSlots = this.createDropZones();
        this.planets = this.createPlanets(); // Create planet(s)
        this.createDragAndDropListeners();

        //check for overlap
  
        let introTextbox = this.add.existing(new FullscreenTextbox(introMessageText, 200, 150, 400, 200, this));
        introTextbox.setFadeOut(3000); 
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
            console.log(planet.id + " - - - " + planetSlot.id);
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
        console.log("correct");
        // give audio / visual feedback
        _planetSlot.removeInteractive();
        this.physics.world.disable(_planetSlot);
        _planetSlot.graphics.clear();
        _planet.isOrbiting = true;
        this.slotFilled();
        this.isEverySlotFilled()
    }

    runIncorrectAnswer(_planet, _planetSlot){
        console.log("incorrect");
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
    width: 1000,
    height: 600,

    scene:[SpaceScene],
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

