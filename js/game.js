
const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
    preload,
    create,
    update,
  });

let ball;
let paddle;
let bricks;
let newBrick;
let brickInfo;
let scoreText;
let score = 0;
let life = 2;
let lifeText;
let lifeLossText;
let velocityMultiplier = 0.0;

  function preload() {
    game.stage.smoothed = false;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = "#eee";
  
    //game.load.image("ball", "assets/ball.png");
    game.load.image("paddle", "assets/paddle.png");
    //game.load.image("brick", "assets/brick.png");
    game.load.image("background", "assets/background.png");
    game.load.spritesheet("ball", "assets/ball-Sheet.png", 20, 20);
    game.load.spritesheet("brick", "assets/brickbreak-Sheet.png", 74,34)
    
  }
  
  function create() {
    game.add.sprite(0,0,"background")
    game.physics.startSystem(Phaser.Physics.ARCADE);
    ball = game.add.sprite(game.world.width * 0.5, game.world.height - 25, "ball");
    ball.animations.add("wobble", [ 0, 5, 6,7,8,7,6,0, 1, 2, 3, 4, 3,2 , 1,0], 40);

    ball.anchor.set(0.5);
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.velocity.set(150, -150);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);

    game.physics.arcade.checkCollision.down = false;
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(ballLeaveScreen, this);
    //Uncomment these after loading and implementing paddle and bricks
    //var paddle = game.add.sprite(75, 10, "paddle");
    paddle = game.add.sprite(game.world.width *0.5, game.world.height - 5, "paddle");
    paddle.anchor.set(0.5, 1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;

    //var brick = game.add.sprite(50, 20, "brick");
    initBricks();

    //Show score
    scoreText = game.add.text(5, 5, "Points: 0", {
      font: "18px VCR",
      fill: "#0095DD",
    });

    lifeText = game.add.text(game.world.width-5, 5, `Life: ${life}`, {
      font: "18px VCR",
      fill: "#0095DD",
    });
    lifeText.anchor.set(1,0);

    lifeLossText = game.add.text(
      game.world.width * 0.5,
      game.world.height * 0.5,
      "Life lost, click to continue",
      { font: "18px VCR", fill: "#0095DD" },
    );

    lifeLossText.anchor.set(0.5);
    lifeLossText.visible = false;
  }

  function update() {
    game.physics.arcade.collide(ball, paddle, ballHitPaddle);
    game.physics.arcade.collide(ball, bricks, ballHitBrick);
    paddle.x = game.input.x || game.world.width * 0.5;
  }


  //Need help fixing the brick field
  function initBricks() {
    brickInfo = {
      width: 50,
      height: 20,
      count: {
        row: 7,
        col: 4
      },
      offset: {
        top: 50,
        left: 60
      },
      padding: 10,
    };

    bricks = game.add.group();
    for(c=0; c<brickInfo.count.col; c++) {
      for(r=0; r<brickInfo.count.row; r++) {
          let brickX = (r*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
          let brickY = (c*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;
          newBrick = game.add.sprite(brickX, brickY, 'brick');
          game.physics.enable(newBrick, Phaser.Physics.ARCADE);
          newBrick.body.immovable = true;
          newBrick.anchor.set(0.5);
          newBrick.body.setSize(50,20,10,7);
          bricks.add(newBrick);
      }
    }
  }

  function ballHitBrick(ball, brick) {
    brick.animations.add("brickbreak", [0,1,2,3,4], 24);
    brick.animations.play("brickbreak");
    brick.body.enable = false;
    game.time.events.add(Phaser.Timer.SECOND* 0.24, function() {
      brick.kill();
    
      
    
    
    score += 10;
    scoreText.setText(`Points: ${score}`);

    //Check if user wins
    let countAlive = 0;
    for (let i = 0; i < bricks.children.length; i++) {
      if (bricks.children[i].alive) {
        countAlive++;
      }
    }
    if (countAlive === 0) {
      alert("You won the game, congratulations!");
      location.reload();
    }
  },this);
  }

  function ballHitPaddle(ball, paddle){
    ball.animations.play("wobble");
    velocityMultiplier += 0.005;
    ball.body.velocity.set((ball.body.velocity.x + (ball.body.velocity.x*velocityMultiplier)),(ball.body.velocity.y + ((ball.body.velocity.y*velocityMultiplier))));
    //ball.body.getVelocity();
  }

  function ballLeaveScreen() {
    life--;
    if (life) {
      lifeText.setText(`Life: ${life}`);
      lifeLossText.visible = true;
      ball.reset(game.world.width * 0.5, game.world.height - 25);
      paddle.reset(game.world.width * 0.5, game.world.height - 5);
      velocityMultiplier = 0.0;
      game.input.onDown.addOnce(() => {
        lifeLossText.visible = false;
        ball.body.velocity.set(150, -150);
      }, this);
    } else {
      alert("You lost, game over!");
      location.reload();
    }
  }
  