
const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
    preload,
    create,
    update,
  });

let ball;

  function preload() {
    game.stage.smoothed = false;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = "#eee";
  
    game.load.image("ball", "/assets/ball.png")
    
    //Uncomment when testing paddle and brick
    //game.load.image("paddle", "/assets/paddle.png")
    //game.load.image("brick", "/assets/brick.png")
  }
  
  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    ball = game.add.sprite(50, 50, "ball");
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.velocity.set(150, 150);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    //Uncomment these after loading and implementing paddle and bricks
    //var paddle = game.add.sprite(75, 10, "paddle");
    //var brick = game.add.sprite(50, 20, "brick");
  }

  function update() {
  }