class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }
  preload() {
    this.load.image("star", "star.png");
    this.load.image("light", "mask.png");
    this.load.image("maze", "maze.png");
    this.load.image("dipper", "dipper.png");
    this.load.image("dipperSolution", "dipperSol.png");
    this.load.image("white", "white200.png");
  }
  create() {

    //this.add.image(-150, 100, 'dipper').setOrigin(0, 0).setScale(0.75);
    
    // Create a green square as a drop zone
    this.squares = [];
    this.squares.push(this.add.image(295, 255, 'white'));

    this.squares.push(this.add.image(520, 175, 'white'));

    this.squares.push(this.add.image(625, 340, 'white'));

    this.squares.push(this.add.image(425, 435, 'white'));

    this.squares.push(this.add.image(70, 460, 'white'));

    for (let i = 0; i < this.squares.length; i++){
      this.squares[i]
      .setScale(0.15)
      .setOrigin(0.5,0.5)
      .setInteractive({ dropZone: true })
      .setDepth(0)
      .setTint(0x0);
    }

    this.stars = [];
    for (let i = 1; i < 5 +1; i++) {
      let newstar = this.add.sprite(80 * i - 40, 50, "star");
      newstar.setTint(0xFFFFFF);
      newstar.setInteractive({draggable: true});
      newstar.setDepth(100);
      //newstar.orderid = starorder[i - 1];
      this.stars.push(newstar);
    }

    this.input.on("drag", (_, star, dragX, dragY) => {
      let x = Math.max(0, Math.min(dragX, 800));
      let y = Math.max(0, Math.min(dragY, 600));

      star.x = x;
      star.y = y;

    });


    let numOfGreenStars = 0;

    // Handle drag start event
    this.input.on('dragstart', function (pointer, gameObject) {
      if(gameObject.tint == 0x00ff00)
        numOfGreenStars--;

      gameObject.setTint(0xffffff); // Reset tint when dragging starts
    });

    // Handle drag event
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    // Handle drag end event
    this.input.on('dragend',  (pointer, gameObject) => {

      // Check if the player is dropped onto the green square
      for(let i = 0; i < this.squares.length; i++){

        if (Phaser.Geom.Rectangle.ContainsPoint(this.squares[i].getBounds(), new Phaser.Geom.Point(gameObject.x, gameObject.y))) {
          gameObject.setTint(0x00ff00); // Turn the player green if dropped onto the green square
          numOfGreenStars++;
        }

      }

      console.log("Number of green stars:" + numOfGreenStars);

      
      if(numOfGreenStars == this.squares.length){
        console.log("WIN");
        this.add.image(-150, 100, 'dipperSolution')
        .setOrigin(0, 0)
        .setScale(0.75)
        .setDepth(1);
      }

    });

  }

  update() {}
}

const game = new Phaser.Game({
  type: Phaser.WEBGL,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
  },
  scene: [Game],
  title: "Seeing Stars",
});
