/*
class PlanetSlot extends Phaser.Physics.Arcade.Sprite{
    
    constructor(scene, x, y){
        super(scene, x, y, )

    }

    initHitbox(){
        this.hitbox = this.scene.add.zone(this.x, this.y, 200, 200);
        this.scene.physics.add.overlap();
    }
}
*/

class SpaceScene extends Phaser.Scene{
    constructor(){
        super("game");
    }

    preload(){
        this.load.image("spaceBackground", "img/space_bg_1920x1080.jpg");
        // Loading each image individually is silly but I'll do it
        // planet images are HUGE (4500x4500 ??!!!) - rescale and ideally store as one spritesheet or tilemap
        this.load.image("planet-1", "img/Planets/mercury.png")
    }

    create(){
        this.background = this.add.image(10, 10, "spaceBackground");
        this.background.setOrigin(0,0);
        
        this.createPlanets(); // Create planet(s)

        
        this.input.on("pointerdown", this.dragStart, this);
    }

    update(){

    }

    /// ///




    /// /// 

    // Click + Drag code from WClarkson (Youtube):
    // Link: https://youtu.be/t56DvozbZX4

    /*
    createPlanets(){
        let placeholder = this.add.image(100, 300, "planet-1");
        placeholder.setScale(0.05);
        placeholder.setInteractive();
    }
    
    dragStart(pointer, targets){
        this.input.off("pointerdown", this.dragStart, this);
        this.dragObject = targets[0];
        this.input.on("pointermove", this.dragMove, this);
        this.input.on("pointerup", this.dragEnd, this);
    }

    dragMove(pointer){
        if (typeof this.dragObject !== "undefined") {
            this.dragObject.x = pointer.x;
            this.dragObject.y = pointer.y;
        }
    }

    dragEnd(){
        this.input.on("pointerdown", this.dragStart, this);
        this.input.off("pointermove", this.dragMove, this);
        this.input.off("pointerup", this.dragEnd, this);
    }
    */

    // End of borrowed code


    clickDrag(){

    }

    showHint(index){

    }

    slotFilled(){
        // check if every slot is filled
        this.isEverySlotFilled()
    }

    isEverySlotFilled(){

    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,

    scene:[SpaceScene],

    backgroundColor: "#ddd"
}

const game = new Phaser.Game(config); 

