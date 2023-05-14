class PlanetSlot extends Phaser.GameObjects.Zone{
    constructor(id, x, y, width, height, scene){
        super(scene, x, y, width, height);
        this.id = id;
        
        // set up dropzone
        this.setRectangleDropZone(width, height);

        // Graphics 
        const graphics = scene.add.graphics();
        graphics.lineStyle(2, 0xFFFFFF)
        //graphics.strokeRect(this.x - this.input.hitArea.width / 2, this.y - this.input.hitArea.height / 2, this.input.hitArea.width, this.input.hitArea.height);
        //graphics.strokeCircle(x, y, this.getSquareRadius(this.input.hitArea.width));

    }

    getSquareRadius = (sideLength) => sideLength * Math.sqrt(2)/2;
}