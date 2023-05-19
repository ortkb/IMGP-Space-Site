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
        this.graphics.lineStyle(2, 0xFFFFFF)
        this.drawGraphics();

        scene.events.on('update', this.update, this);
    }

    drawGraphics(){
        this.graphics.strokeCircle(this.x, this.y, this.getSquareRadius(this.input.hitArea.width));

    }

    changeGraphicColor(color){ // this
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
                hintText = "Wrong planet! Look for the smallest planet in the solar system.";
                break;
            case 1:
                hintText = "Error! Find a planet very similar to earth.";
                break;
            case 2:
                hintText = "Try again! Look for the water planet, close to home.";
                break;
            case 3:
                hintText = "Incorrect! Find the rust planet.";
                break;
            case 4:
                hintText = "Oopsie! Get the biggest planet in our solar system.";
                break
            case 5:
                hintText = "Wrong planet! Find the planet with the biggest brightest rings.";
                break
            case 6:
                hintText = "Try again! Find the coldest planet.";
                break
            case 7:
                hintText = "Incorrect! Find the planet that’s not visible naked eye.";
                break
            default:   
                hintText = "Sorry, wrong answer.";
        }
        return hintText;
    }
}