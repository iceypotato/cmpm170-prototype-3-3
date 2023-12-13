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
    this.load.image("orionSolution", "OrionSol.png");
    this.load.image("cepheusSolution", "CepheusSol.png")
    this.load.image("white", "white200.png");
    this.load.image("map", "map.png");
  }

  showMap() {
    this.mapSolution.alpha = 1.0;
  }

  hideMap() {
    this.mapSolution.alpha = 0.0;
  }

  create() {
    // get random
    let puzzleChosen = Phaser.Math.Between(0, 2);
    console.log("puzzle chosen:" + puzzleChosen);

    this.mapicon = this.add.image(800 - 64, 600 - 64, 'map');
    this.mapicon.setInteractive().setDepth(150);
    this.mapicon.on('pointerover', () => this.showMap());
    this.mapicon.on('pointerout', () => this.hideMap());

    //this.add.image(-100, 0, 'cepheusSolution').setOrigin(0, 0).setScale(0.75);
    
    // Create a green square as a drop zone
    
    this.squares = [];
    
    if(puzzleChosen == 0){ // dipper
        this.mapSolution = this.add.image(800 - 200, 600 - 120, 'dipperSolution');
        this.mapSolution.setScale(0.25).setDepth(200);
        this.hideMap();
      
      this.squares.push(this.add.image(295, 255, 'white'));

      this.squares.push(this.add.image(520, 175, 'white'));

      this.squares.push(this.add.image(625, 340, 'white'));

      this.squares.push(this.add.image(425, 435, 'white'));

      this.squares.push(this.add.image(70, 460, 'white'));
    }

    if(puzzleChosen == 1){ // orion
        this.mapSolution = this.add.image(800 - 200, 600 - 120, 'orionSolution');
        this.mapSolution.setScale(0.25).setDepth(200);
        this.hideMap();

      this.squares.push(this.add.image(290, 290, 'white'));

      this.squares.push(this.add.image(380, 260, 'white'));

      this.squares.push(this.add.image(455, 250, 'white'));

      this.squares.push(this.add.image(485, 60, 'white'));

      this.squares.push(this.add.image(240, 80, 'white'));

      this.squares.push(this.add.image(280, 480, 'white'));

      this.squares.push(this.add.image(560, 420, 'white'));
    }

    if(puzzleChosen == 2){ // cepheus
        this.mapSolution = this.add.image(800 - 200, 600 - 120, 'cepheusSolution');
        this.mapSolution.setScale(0.25).setDepth(200);
        this.hideMap();
      
      this.squares.push(this.add.image(170, 290, 'white'));

      this.squares.push(this.add.image(390, 170, 'white'));

      this.squares.push(this.add.image(515, 360, 'white'));

      this.squares.push(this.add.image(195, 100, 'white'));

      this.squares.push(this.add.image(300, 500, 'white'));
    }

    for (let i = 0; i < this.squares.length; i++){
      this.squares[i]
      .setScale(0.15)
      .setOrigin(0.5,0.5)
      .setInteractive({ dropZone: true })
      .setDepth(0)
      .setTint(0x0);
    }

    this.stars = [];
    for (let i = 0; i < this.squares.length; i++) {
      let newstar = this.add.sprite(
        Phaser.Math.Between(10, game.config.width - 10),
        Phaser.Math.Between(10, game.config.height - 10),
        "star");
      newstar.setTint(0xFFFFFF);
      newstar.setInteractive({draggable: true});
      newstar.setDepth(500);
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
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;

      gameObject.setTint(0xffffff); // Reset tint

      // Check if the player is dropped onto the green square
      for(let i = 0; i < this.squares.length; i++){

        if (Phaser.Geom.Rectangle.ContainsPoint(this.squares[i].getBounds(), new Phaser.Geom.Point(gameObject.x, gameObject.y))) {
          gameObject.setTint(0x00ff00); // Turn the player green if dropped onto the green square
          //numOfGreenStars++;
        } 

      }
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

        if(puzzleChosen == 0){ // dipper
        this.add.image(-150, 100, 'dipperSolution')
        .setOrigin(0, 0)
        .setScale(0.75)
        .setDepth(1);
        }

        if (puzzleChosen == 1){ // orion
          this.add.image(-100, 0, 'orionSolution')
          .setOrigin(0, 0)
          .setScale(0.75)
          .setDepth(1);
        
        }

        if (puzzleChosen == 2) { // cepheus
          this.add.image(-100, 0, 'cepheusSolution')
          .setOrigin(0, 0)
          .setScale(0.75)
          .setDepth(1);
    
        }



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
