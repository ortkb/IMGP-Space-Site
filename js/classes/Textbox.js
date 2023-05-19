class Textbox extends Phaser.GameObjects.GameObject{
    constructor(textArray, _x, _y, _width, _height, scene){
        super(scene, "TextBox");
        this.currentPage = 0;
        this.textArray = textArray;
        this.scene = scene;
        this.isFadingOut = false;

        this.background = scene.add.graphics()
            .fillStyle(0xffffff, 0.9)
            .fillRoundedRect(_x - _width / 2, _y - _height / 2, _width, _height, 20);

        
        this.zone = scene.add.zone(0, 0, 1000, 600)
            .setOrigin(0, 0); // fullscreen zone to change messages      


        this.displayText = scene.add.text(_x, _y, 'TEXT HERE', {
			fontSize: '25px',
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

    setFadeOut(delay){
        this.scene.time.delayedCall(delay, function(){
            this.isFadingOut = true;
        }, [], this);
    }

    closeTextbox(_scene){ // I somehow cannot get this thing to destroy() itself and its components in a smooth way.
        this.zone.setScale(0, 0);
        // I cannot find a way to delete this.updateListener cleanly - for some reason the planet orbiting breaks when I just destroy() it. Wild.
        this.destroyAllInArray([this.background, this.zone, this]);
    }

    destroyAllInArray(_array){
        for (let i = 0; i < _array.length; i++){
            _array[i].destroy();
        }
    }    
}

class FullscreenTextbox extends Textbox{
    constructor(textArray, _x, _y, _width, _height, scene){
        super(textArray, _x, _y, _width, _height, scene);
        
        this.zone.setInteractive()
        
        this.zone.on("pointerdown", function(){
            this.currentPage++;
            if (this.currentPage >= this.textArray.length){
                this.closeTextbox(scene);
            }
            this.displayText.setText(this.textArray[this.currentPage]); // progress to next page
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

        let zone = scene.add.zone(0, 0, _width, _height)
            .setInteractive()
            .setOrigin(0, 0); // Interactable section is limited to the size of the box.

        this.setFadeOut(3000); 
    }
}