
const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
    preload,
    create,
    update,
  });

let ball;
let paddle;

  function preload() {
    game.stage.smoothed = false;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = "#eee";
  
    game.load.image("ball", "/assets/ball.png")
    game.load.image("paddle", "/assets/paddle.png")
    
    //Uncomment when testing paddle and brick
    //game.load.image("brick", "/assets/brick.png")
  }
  
  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    ball = game.add.sprite(game.world.width * 0.5, game.world.height - 25, "ball");
    ball.anchor.set(0.5);
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.velocity.set(150, -150);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);

    game.physics.arcade.checkCollision.down = false;
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(() => {
      alert("Game Over!");
      location.reload();
    }, this);
    //Uncomment these after loading and implementing paddle and bricks
    //var paddle = game.add.sprite(75, 10, "paddle");
    paddle = game.add.sprite(game.world.width *0.5, game.world.height - 5, "paddle");
    paddle.anchor.set(0.5, 1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;
    //var brick = game.add.sprite(50, 20, "brick");

  }

  function update() {
    game.physics.arcade.collide(ball, paddle);
    paddle.x = game.input.x || game.world.width * 0.5;
  }