
class Planet extends Phaser.GameObjects.Image{
    constructor (img, id, x, y, scene){
        super(scene);

        this.id = id;
        this.scene = scene; // used when calling scene from functions
        this.planetSlotObject = this.scene.planetSlots[this.id];
        this.setTexture(img)
            .setPosition(x, y)
            .setScale(0.015);
        scene.physics.world.enableBody(this);

        this.isOrbiting = false;
        this.orbitRotation = 0;

        this.params = this.getParameters();

        this.maximumOffscreenTime = 3;

        scene.events.on('update', this.update, this);


        scene.input.keyboard.on("keydown-SPACE", this.teleportPlanet, this);
    }

    orbitSun(){        
        if(this.body){ // if this currently has a physics body..
            this.body.rotation += 1; // spinning in place
        }
        this.orbitRotation += this.params.rotationSpeed;
        Phaser.Math.RotateTo(this, 0, 300, this.orbitRotation, this.params.rotationRadius);
        if (this.orbitRotation >= 360) {this.rotation = 0;}
    }


    update(){

        if (this.isOrbiting){
            this.orbitSun();
            this.checkTimeSpentOffscreen();
        }
    }

    checkTimeSpentOffscreen(){
        const sceneWidth = this.scene.sys.game.canvas.width;
        const sceneHeight = this.scene.sys.game.canvas.height;
        let isOffscreen = this.x < 0 || this.x > sceneWidth || this.y < 0 || this.y > sceneHeight;
        let timeSinceOffscreenStartTime;
        if(this.wasOffscreen != true && isOffscreen){
            this.offscreenStartTime = Date.now(); // if the planet has just started to go offscreen, record when it went offscreen.
        }
        if (isOffscreen){
            timeSinceOffscreenStartTime = Date.now() - this.offscreenStartTime;
            console.log(timeSinceOffscreenStartTime);
        }

        if(timeSinceOffscreenStartTime * 0.001 > this.maximumOffscreenTime){
            this.teleportPlanet(this.params.teleportOffset);
        }

        this.wasOffscreen = isOffscreen;
    }

    teleportPlanet(offset = 0){
        if (this.isOrbiting){
            this.orbitRotation = Phaser.Math.DegToRad(270 + offset);
        }
    }

    getParameters(){
        let params;
        switch(this.id){
            case 0:
                params = {rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
                break
            case 1:
                params = {rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
                break
            case 2:
                params = {rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
                break
            case 3:
                params = {rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
                break
            case 4:
                params = {rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
                break
            case 5:
                params = {rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
                break
            case 6:
                params = {rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
                break
            case 7:
                params = {rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
                break
            default:
                params = {rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
        }

        return params;
    }

}