
const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
    preload,
    create,
    update,
  });

  function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = "#eee";
  }
  
  function create() {
    var ball = game.add.sprite(50, 50, "ball");
    var paddle = game.add.sprite(75, 10, "paddle");
    var brick = game.add.sprite(50, 20, "brick");
  }

  function update() {}