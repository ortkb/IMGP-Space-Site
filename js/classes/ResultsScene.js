class ResultsScene extends Phaser.Scene{
    constructor(){
        super({ key: "ResultsScene"})
    }

    init (data){
        this.minutes = data.minutes;
        this.seconds = data.seconds;
        !data.time ? this.time = "[No Recorded Time]" : this.time = data.time;
    }

    preload(){
        this.load.image("spaceBackground", "img/space_bg_1920x1080.jpg");
    }

    create(){
        
        let background = this.add.image(0, 0, "spaceBackground").setOrigin(0, 0);

        //let textBackground = new Phaser.Geom.Rectangle(500, 300, 600, 400);
        let graphics = this.add.graphics()
            .fillStyle(0xffffff, 0.9)
            .fillRoundedRect(200, 100, 600, 400, 20);

        let text = this.add.text(500, 300, "CONGRATULATIONS!\nYour time was\n\n" + this.minutes + " minutes, " + this.seconds + " seconds\n\nWant to try again?\n", {
			fontSize: '25px',
			color: '#000',
            fontFamily: 'Arial', // Add site font here ( https://webtips.dev/webtips/phaser/custom-fonts-in-phaser3 )
			wordWrap: { width: 300 },
            lineSpacing: 10,
            align: "center"
		}).setOrigin(0.5, 0.5);

        let homeButton = this.makeButton("Quit Game", 550, 425, 150, 50, this)
        homeButton.zone.setInteractive().on("pointerdown", ()=> {
            console.log("quit game");
            window.location.href = 'planets.html';
            window.location = "planets.html";
        }, this);
        
        let retryButton = this.makeButton("Retry", 300, 425, 150, 50, this)
        retryButton.zone.setInteractive().on("pointerdown", this.resetGame, this);
    }

    resetGame(){ // values set to classes (such as planet rotation) are NOT reset by a start() or restart() and need to be redeclared in the init() or create()
        this.scene.start("SpaceScene");

        //var gameScene = this.scene.get('SpaceScene');

        //gameScene.scene.restart();
    }

    makeButton(text, x, y, width, height, scene){
        let buttonGraphics = scene.add.graphics()
            .fillStyle(0xdddddd, 1)
            .fillRoundedRect(x, y, width, height, 10);

        let buttonText = this.add.text(x + width / 2, y + height / 2, text, {
			fontSize: '18px',
			color: '#000',
            fontFamily: 'Arial', // Add site font here ( https://webtips.dev/webtips/phaser/custom-fonts-in-phaser3 )
			wordWrap: { width: width },
            align: "center"
		}).setOrigin(0.5, 0.5);

        let buttonZone = scene.add.zone(x, y, width, height).setOrigin(0, 0);
        
        return {background: buttonGraphics, text: buttonText, zone: buttonZone};
    }
}