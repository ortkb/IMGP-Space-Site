class Planet extends Phaser.GameObjects.Image{
    constructor (img, id, x, y, scene){
        super(scene);

        this.id = id;
        this.scene = scene; // used when calling scene from functions

        this.planetSlotObject = this.scene.planetSlots[this.id];

        this.params = this.getParameters();

        this.isOrbiting = false;
        this.orbitRotation = 0;

        this.maximumOffscreenTime = 2.5;

        scene.events.on('update', this.update, this);

        scene.input.keyboard.on("keydown-SPACE", this.teleportPlanet, this);

        //this.setTexture(img)
        this.setTexture("planetsSpritesheet", this.id)
            .setPosition(this.params.x, this.params.y)
            .setScale(0.15);
        scene.physics.world.enableBody(this);
    }

    orbitSun(){        
        if(this.body){ // if this currently has a physics body..
            this.body.rotation += 1; // spinning in place
        }
        this.orbitRotation += this.params.rotationSpeed;
        if (this.scene){
            Phaser.Math.RotateTo(this, this.scene.sun.x, this.scene.sun.y, this.orbitRotation, this.params.rotationRadius);
        }
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
            this.offscreenStartTime = Date.now();
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
                params = {name: "Mercury", x: 750, y: 180, rotationSpeed: 0.015, rotationRadius: this.planetSlotObject.x, teleportOffset: -15}
                break
            case 1:
                params = {name: "Venus", x: 200, y: 400, rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: -10}
                break
            case 2:
                params = {name: "Earth", x: 900, y: 110, rotationSpeed: 0.008, rotationRadius: this.planetSlotObject.x, teleportOffset: 30}
                break
            case 3:
                params = {name: "Mars", x: 160, y: 110, rotationSpeed: 0.007, rotationRadius: this.planetSlotObject.x, teleportOffset: 40}
                break
            case 4:
                params = {name: "Jupiter", x: 710, y: 425, rotationSpeed: 0.006, rotationRadius: this.planetSlotObject.x, teleportOffset: 50}
                break
            case 5:
                params = {name: "Saturn", x: 615, y: 560, rotationSpeed: 0.005, rotationRadius: this.planetSlotObject.x, teleportOffset: 58}
                break
            case 6:
                params = {name: "Uranus", x: 460, y: 120, rotationSpeed: 0.004, rotationRadius: this.planetSlotObject.x, teleportOffset: 65}
                break
            case 7:
                params = {name: "Neptune", x: 405, y: 500, rotationSpeed: 0.003, rotationRadius: this.planetSlotObject.x, teleportOffset: 71}
                break
            default:
                params = {name: "error", x: 0, y: 0, rotationSpeed: 0.01, rotationRadius: this.planetSlotObject.x, teleportOffset: 0}
        }
        return params;
    }

    shutdownPlanet(){
        console.log("shutdown " + this.params.name);
        this.scene.input.keyboard.remove("keydown-SPACE", this.teleportPlanet, this);
    }

}