class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }
  preload() {
    this.load.image("star", "star.png");
    this.load.image("light", "mask.png");
    this.load.image("maze", "maze.png");
  }
  create() {
    let bmask = this.add.bitmapMask(null, 0, 0, "light");
    this.mazepieces = [];
    for (let i = 0; i < 10; i++) {
      let mazepiece = this.add.image(400, 429, "maze");
      mazepiece.setCrop(i * 80, 0, 80, 292);
      mazepiece.setMask(bmask);
      mazepiece.depth = 1;
      this.mazepieces.push(mazepiece);
    }

    let mazeorder = [8, 3, 4, 9, 1, 0, 5, 6, 2, 7];
    let starorder = [5, 4, 8, 1, 2, 6, 7, 9, 0, 3];
    this.mazepieces.sort(function (a, b) {
      return mazeorder.indexOf(a) - mazeorder.indexOf(b);
    });

    this.stars = [];
    for (let i = 1; i < 11; i++) {
      let newstar = this.add.sprite(80 * i - 40, 50, "star");
      newstar.tint = HueToCol((i - 1) * 0.1);
      newstar.setInteractive();
      this.input.setDraggable(newstar);
      newstar.orderid = starorder[i - 1];
      this.stars.push(newstar);
    }

    this.input.on("drag", (_, star, dragX, dragY) => {
      let x = Math.max(0, Math.min(dragX, 800));
      let y = Math.max(0, Math.min(dragY, 600));

      star.x = x;
      star.y = y;

      let newmask = this.add.bitmapMask(null, x, y, "light");
      this.mazepieces[star.orderid].setMask(newmask);
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

function HueToCol(hue) {
  var r, g, b, i, f, q;
  i = Math.floor(hue * 6);
  f = hue * 6 - i;
  q = 1 - f;
  switch (i % 6) {
    case 0:
      (r = 1), (g = f), (b = 0);
      break;
    case 1:
      (r = q), (g = 1), (b = 0);
      break;
    case 2:
      (r = 0), (g = 1), (b = f);
      break;
    case 3:
      (r = 0), (g = q), (b = 1);
      break;
    case 4:
      (r = f), (g = 0), (b = 1);
      break;
    case 5:
      (r = 1), (g = 0), (b = q);
      break;
  }
  return (
    Math.round(r * 255) * 65536 +
    Math.round(g * 255) * 256 +
    Math.round(b * 255)
  );
}
