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

    getHintText(){
        let hintText;
        switch(this.id){
            case 0:
                hintText = "Wrong planet! Look for the smallest planet in the solar system.";
                break;
            case 1:
                hintText = "Error! Find a planet very similar to earth."
                break;
            case 2:
                hintText = "Try again! This planet is close to home."
                break;
            case 1:
                hintText = "Try again! Find ."
                break;
            default:   
                hintText = "Sorry, wrong answer.";
        }
        return hintText;
    }
}