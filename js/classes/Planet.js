
class Planet extends Phaser.GameObjects.Image{
    constructor (img, id, x, y, scene){
        super(scene);

        this.id = id;
        
        this.scene = scene; // used when calling scene from functions
        this.planetSlotObject = this.scene.planetSlots[this.id];
        this.setTexture(img)
            .setPosition(x, y)
            .setScale(0.02);
        scene.physics.world.enableBody(this);

        this.isOrbiting = false;
        this.orbitRotation = 0;

        this.params = this.getParameters();
    }

    orbitSun(){        
        this.body.rotation += 1; // spinning in place
        this.orbitRotation += this.params.rotationSpeed;
        Phaser.Math.RotateTo(this, 0, 300, this.orbitRotation, this.params.rotationRadius);
        if (this.orbitRotation >= 360) {this.rotation = 0;}
    }


    update(){
        if (this.isOrbiting){
            this.orbitSun();
        }
    }

    getParameters(){
        //return {rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x - this.planetSlotObject.width / 2}
        return {rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x}
    }

}