class SpaceScene extends Phaser.Scene{
    constructor(){
        super("game");
    }

    create(){
        this.add.text(20, 20, "texthere", { color: "#000" });
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

