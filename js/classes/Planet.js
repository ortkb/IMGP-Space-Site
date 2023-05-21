
class Planet extends Phaser.GameObjects.Image{
    constructor (img, id, x, y, scene){
        super(scene);

        this.id = id;
        this.scene = scene; // used when calling scene from functions

        this.planetSlotObject = this.scene.planetSlots[this.id];

        this.params = this.getParameters();

        this.isOrbiting = false;
        this.orbitRotation = 0;

        this.maximumOffscreenTime = 3;

        scene.events.on('update', this.update, this);

        scene.input.keyboard.on("keydown-SPACE", this.teleportPlanet, this);

        this.setTexture(img)
            .setPosition(this.params.x, this.params.y)
            .setScale(0.015);
        scene.physics.world.enableBody(this);
    }

    orbitSun(){        
        if(this.body){ // if this currently has a physics body..
            this.body.rotation += 1; // spinning in place
        }
        this.orbitRotation += this.params.rotationSpeed;
        Phaser.Math.RotateTo(this, this.scene.sun.x, this.scene.sun.y, this.orbitRotation, this.params.rotationRadius);
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
        }

        if(timeSinceOffscreenStartTime * 0.001 > this.maximumOffscreenTime){
            console.log("teleported planet " + this.id);
            this.teleportPlanet(this.params.teleportOffset);
            timeSinceOffscreenStartTime = 0;
        }

        this.wasOffscreen = isOffscreen;
    }

    teleportPlanet(offset = 0){
        if (this.isOrbiting){
            this.orbitRotation = Phaser.Math.DegToRad(40 + offset);
        }
    }

    getParameters(){
        let params;
        switch(this.id){
            case 0:
                params = {x: 750, y: 180, rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
                break
            case 1:
                params = {x: 60, y: 400, rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
                break
            case 2:
                params = {x: 900, y: 100, rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
                break
            case 3:
                params = {x: 160, y: 110, rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
                break
            case 4:
                params = {x: 710, y: 425, rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
                break
            case 5:
                params = {x: 615, y: 560, rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
                break
            case 6:
                params = {x: 460, y: 80, rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
                break
            case 7:
                params = {x: 315, y: 500, rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
                break
            default:
                params = {x: 540, y: 185, rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
        }
        console.log(params.x + " . . " + params.y);
        return params;
    }

}