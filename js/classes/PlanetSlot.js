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
        
    }

    drawGraphics(){
        //graphics.strokeRect(this.x - this.input.hitArea.width / 2, this.y - this.input.hitArea.height / 2, this.input.hitArea.width, this.input.hitArea.height);
        this.graphics.strokeCircle(this.x, this.y, this.getSquareRadius(this.input.hitArea.width));

    }

    changeGraphicColor(color){ // this
        this.graphics.clear();
        this.graphics.lineStyle(2, color);
        drawGraphics();
    }

    update(){
        // if currently 
        // if currentlyOverlappingCorrectPlanet is not set to true every frame, isCorrect will equal false.
        if (this.isCorrect){
            this.isCorrect = false;
        }
        
        if (this.currentlyOverlappingCorrectPlanet == true){
            this.isCorrect = true;
            this.currentlyOverlappingCorrectPlanet = false;
        }
        
    }

    getSquareRadius = (sideLength) => sideLength * Math.sqrt(2)/2;
}