class PlanetSlot extends Phaser.GameObjects.Zone{
    constructor(id, x, y, width, height, scene){
        super(scene, x, y, width, height);
        this.id = id;
        
        this.currentlyOverlappingCorrectPlanet = false;
        this.isCorrect = false;

        // set up dropzone
        this.setRectangleDropZone(width, height);

        // Graphics 
        this.graphics = scene.add.graphics();
        this.graphics.lineStyle(2, 0xFFFFFF).fillStyle(0x5A5494, 0.8)
        this.drawGraphics();

        scene.events.on('update', this.update, this);
    }

    drawGraphics(){
        this.graphics.strokeCircle(this.x, this.y, this.input.hitArea.width / 2);
        this.graphics.fillCircle(this.x, this.y, this.input.hitArea.width / 2);

    }

    changeGraphicColor(color){
        this.graphics.clear();
        this.graphics.lineStyle(2, color);
        drawGraphics();
    }

    update(){
    
    }

    getSquareRadius = (sideLength) => sideLength * Math.sqrt(2)/2;

    getHintText(){ // Yes, it's hardcoded, I'm sorry.
        let hintText;
        switch(this.id){
            case 0:
                hintText = "Wrong planet!\nLook for the smallest planet in the solar system.";
                break;
            case 1:
                hintText = "Error! \nFind a planet very similar to earth.";
                break;
            case 2:
                hintText = "Try again! \nLook for the water planet, close to home.";
                break;
            case 3:
                hintText = "Incorrect! \nFind the rust planet.";
                break;
            case 4:
                hintText = "Oopsie! \nGet the biggest planet in our solar system.";
                break
            case 5:
                hintText = "Wrong planet! \nFind the planet with the biggest brightest rings.";
                break
            case 6:
                hintText = "Try again! \nFind the coldest planet.";
                break
            case 7:
                hintText = "Incorrect! \nFind the planet that’s not visible naked eye.";
                break
            default:   
                hintText = "Wrong planet. \nTry again!";
        }
        return hintText;
    }
}