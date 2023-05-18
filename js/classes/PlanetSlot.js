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
}