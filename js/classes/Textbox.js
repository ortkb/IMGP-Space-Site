class Textbox extends Phaser.GameObjects.GameObject{
    constructor(textArray, _x, _y, _width, _height, scene, fontSize = "25px"){
        super(scene, "TextBox");
        this.currentPage = 0;
        this.textArray = textArray;
        this.scene = scene;
        this.isFadingOut = false;

        this.background = scene.add.graphics();   

        this.zone = scene.add.zone(_x, _y, _width, _height);

        this.displayText = scene.add.text(_x, _y, 'TEXT HERE', {
			fontSize: fontSize,
			color: '#000',
            fontFamily: 'Arial', // Add site font here ( https://webtips.dev/webtips/phaser/custom-fonts-in-phaser3 )
			wordWrap: { width: 300 },
            align: "center"
		}).setOrigin(0.5, 0.5);
        
        if (typeof this.textArray == "string"){
            this.displayText.setText(this.textArray);
        }
        else{
            this.displayText.setText(this.textArray[0]);
        }

        this.updateListener = scene.events.on('update', this.update, this);
    }

    update(){
        if (this.isFadingOut){
            this.displayText.alpha -= 0.05;
            this.background.alpha -= 0.05;
            if (this.displayText.alpha <= 0){     
                this.closeTextbox(this.scene);
            }
        }
    }

    setCustomPosition(_x, _y){
        this.background.clear();
        this.background.fillStyle(0xffffff, 0.9)
        .fillRoundedRect(_x - _width / 2, _y - _height / 2, _width, _height, 20);
        this.displayText.setPosition(_x, _y);
        this.zone.setPosition(_x, _y);
    }

    setFadeOut(delay){
        this.scene.time.delayedCall(delay, function(){
            this.isFadingOut = true;
        }, [], this);
    }

    closeTextbox(_scene){ // I somehow cannot get this thing to destroy() itself and its components in a smooth way.
        this.zone.setScale(0, 0);
        // I cannot find a way to delete this.updateListener cleanly - for some reason the planet orbiting breaks when I just destroy() it. Wild.
        this.destroyAllInArray([this.background, this.displayText, this.zone, this]);
    }

    destroyAllInArray(_array){
        for (let i = 0; i < _array.length; i++){
            _array[i].destroy();
        }
    }

    toggleInteractive(setToInteractive){
        switch(setToInteractive){
            case true:
                this.zone.setInteractive();
                break
            case false:
                this.zone.disableInteractive();
                break
            default:
                console.warn(this, "- toggleInteractive() parameter must be boolean");
        }
    }
}

class FullscreenTextbox extends Textbox{
    constructor(textArray, _x, _y, _width, _height, scene){
        super(textArray, _x, _y, _width, _height, scene);
        /*
        this.zone.width = this.scene.sys.game.canvas.width;
        this.zone.height = this.scene.sys.game.canvas.height;
        */
        console.log(this.scene.sys.game.canvas.width, this.scene.sys.game.canvas.height);
        this.zone.setSize(this.scene.sys.game.canvas.width, this.scene.sys.game.canvas.height)
        this.zone.setInteractive();
        
        this.zone.on("pointerdown", function(){
            this.currentPage++;
            if (this.currentPage >= this.textArray.length){
                this.closeTextbox(scene);
            }
            else{
                this.displayText.setText(this.textArray[this.currentPage]); // progress to next page
            }
        }, this); 
    }
}


class PopupTextbox extends Textbox{
    constructor(textArray, _x, _y, _width, _height, scene){
        super(textArray, _x, _y, _width, _height, scene);

        // get formatting function to change word wrap

        this.displayText
        .setFontSize("14px")
        .setColor("#000")
        .setWordWrapWidth(_width - 20);
        
        this.background.radius = 5;

        this.zone.setInteractive()
            .setOrigin(0.5, 0.5); // Interactable section is limited to the size of the box.

        this.setFadeOut(3000); 

        this.zone.on("pointerdown", function(){
            this.closeTextbox(scene);
        }, this); 
    }
}