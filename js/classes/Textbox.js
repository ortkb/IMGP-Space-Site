class Textbox extends Phaser.GameObjects.GameObject{
    constructor(textArray, _x, _y, _width, _height, scene, fontSize = "25px"){
        super(scene, "TextBox");
        this.currentPage = 0;
        this.textArray = textArray;
        this.scene = scene;
        this.isFadingOut = false;
        this.dimensions = {width: _width, height: _height};

        this.background = scene.add.graphics();
        this.backgroundColor = {color: 0xffffff, alpha: 1}
        this.backgroundRadius = 20;

        this.zone = scene.add.zone(_x, _y, _width, _height).setInteractive();

        this.displayText = scene.add.text(_x, _y, 'TEXT HERE', {
			fontSize: fontSize,
			color: '#000',
            fontFamily: 'Rubik', // Add site font here ( https://webtips.dev/webtips/phaser/custom-fonts-in-phaser3 )
            fontStyle: "300",
			wordWrap: { width: 400 },
            align: "center"
		}).setOrigin(0.5, 0.5);

        this.setCustomPosition(_x, _y);
        
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
                this.closeTextbox();
            }
        }
    }

    setCustomPosition(_x, _y){
        this.background.clear();
        this.background.fillStyle(this.backgroundColor.color, this.backgroundColor.alpha)
            .fillRoundedRect(_x - this.dimensions.width / 2, _y - this.dimensions.height / 2, this.dimensions.width, this.dimensions.height, this.backgroundRadius);
        this.displayText.setPosition(_x, _y);
        this.zone.setPosition(_x, _y);
    }

    changeBackgroundColor(color, alpha = this.backgroundColor.alpha){
        this.backgroundColor = {color, alpha};
        this.setCustomPosition(this.displayText.x, this.displayText.y);
    }

    changeBackgroundRadius(radius){
        this.backgroundRadius = radius;
        this.setCustomPosition(this.zone.x, this.zone.y);
    }

    changeTextColor(_color){ // can't get to work
        this.displayText.setTintFill(_color);
    }

    setFadeOut(delay){
        this.scene.time.delayedCall(delay, function(){
            this.isFadingOut = true;
        }, [], this);
    }

    closeTextbox(){ // I somehow cannot get this thing to destroy() itself and its components in a smooth way.
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

    static updateFont(){
        //this.
    }
}

class FullscreenTextbox extends Textbox{
    constructor(textArray, _x, _y, _width, _height, scene, fontSize = "25px"){
        super(textArray, _x, _y, _width, _height, scene, fontSize);
        
        this.displayText.setWordWrapWidth(500);
        
        this.zone.setSize(this.scene.sys.game.canvas.width, this.scene.sys.game.canvas.height)
        this.zone.setInteractive();
        this.zone.on("pointerdown", function(){
            this.currentPage++;
            if (this.currentPage >= this.textArray.length){
                this.closeTextbox();
            }
            else{
                this.displayText.setText(this.textArray[this.currentPage]); // progress to next page
            }
        }, this); 
    }
}


class PopupTextbox extends Textbox{
    constructor(textArray, _x, _y, _width, _height, scene, fontSize = "14px"){
        super(textArray, _x, _y, _width, _height, scene, fontSize);

        this.displayText
        .setFontSize(fontSize)
        .setColor("#000")
        .setWordWrapWidth(_width - 20);

        this.setFadeOut(3000); 

        this.zone.on("pointerdown", function(){
            this.closeTextbox();
        }, this); 
    }
}

class OutlineTextbox extends Textbox{

    constructor(textArray, _x, _y, _width, _height, scene, fontSize = "25px"){
        super(textArray, _x, _y, _width, _height, scene, fontSize);
        this.background.lineStyle(2, 0xffffff);
        this.displayText.setFontFamily("Bebas Neue");
    }

    drawOutline(_x, _y){
        this.background.strokeRoundedRect(_x - this.dimensions.width/2, _y - this.dimensions.height/2, this.dimensions.width, this.dimensions.height, this.backgroundRadius);
    }

    setCustomPosition(_x, _y){
        this.background.clear();
        this.background.fillStyle(this.backgroundColor.color, this.backgroundColor.alpha)
            .fillRoundedRect(_x - this.dimensions.width / 2, _y - this.dimensions.height / 2, this.dimensions.width, this.dimensions.height, this.backgroundRadius);
        this.displayText.setPosition(_x, _y);
        this.zone.setPosition(_x, _y);
        this.drawOutline(_x, _y);
    }

}