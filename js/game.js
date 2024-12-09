
const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
    preload,
    create,
    update,
  });




let backgroundMusic;
let title;
let play = false;
let startBtn;
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
let startText;
let velocityMultiplier = 0.0;
let background;

  function preload() {
    game.stage.smoothed = false;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = "#eee";
  
    game.load.image("paddle", "assets/paddle.png");
    game.load.image("background", "assets/background.png");
    game.load.image("Title", "assets/Title.png");
    game.load.image("backgroundNight", "assets/backgroundNight.png");
    game.load.spritesheet("ball", "assets/ball-Sheet.png", 20, 20);
    game.load.spritesheet("brick", "assets/brickbreak-Sheet.png", 74,34);
    game.load.audio("backgroundMusic", "assets/Loop.wav");
    game.load.audio("pongHit", "assets/Hit.wav");
    game.load.audio("break", "assets/Break.wav");
  }
  
  function create() {
    game.load.audio("backgroundMusic");
    game.load.audio("pongHit");
    game.load.audio("break");
    getTimeAndBackground();
  
    startBtn = game.add.button(game.world.width, game.world.height,"", Start, this);
    startBtn.anchor.set(0.5);

    pongHit = game.add.audio("pongHit");
    breakSound = game.add.audio("break");
    backgroundMusic = game.add.audio("backgroundMusic");
    backgroundMusic.loop = true;

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

    paddle = game.add.sprite(game.world.width *0.5, game.world.height - 5, "paddle");
    paddle.anchor.set(0.5, 1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;

    initBricks();

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

    title = game.add.sprite(240,100,"Title");
    title.anchor.set(0.5);

    startText = game.add.text(
      game.world.width * 0.5,
      game.world.height * 0.5,
      "Click to start!",
      { font: "18px VCR", fill: "#0095DD" }
    )

    lifeLossText.anchor.set(0.5);
    lifeLossText.visible = false;

    ball.reset(game.world.width * 0.5, game.world.height - 25);
    paddle.reset(game.world.width * 0.5, game.world.height - 5);

    startText.visible = true;
    startText.anchor.set(0.5);

    game.input.onDown.addOnce(() => {
      ball.body.velocity.set(150, -150);
      title.destroy();
      startText.visible = false;
      backgroundMusic.play();
    }, this);
  }

  function update() {
    game.physics.arcade.collide(ball, paddle, ballHitPaddle);
    game.physics.arcade.collide(ball, bricks, ballHitBrick);
    paddle.x = game.input.x || game.world.width * 0.5;
  }

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
    breakSound.play();
    brick.body.enable = false;
    
    score += 10;
    scoreText.setText(`Points: ${score}`);

    game.time.events.add(Phaser.Timer.SECOND* 0.24, function() {
      brick.kill();
    
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
    pongHit.play();
    velocityMultiplier += 0.005;
    ball.body.velocity.set(((-5 * (paddle.x - ball.x) + (ball.body.velocity.x*velocityMultiplier))),(ball.body.velocity.y + ((ball.body.velocity.y*velocityMultiplier))));
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

  function Start() {
    startBtn.destroy();
    play = true;
    ball.body.velocity.set(150, -150);
  }

  async function getTimeAndBackground()
  {
    const url = 'https://worldtimeapi.org/api/ip';
    try {
      const response = await fetch(url);
      const data = await response.json();
      const time = new Date(data.datetime);
      const hours = time.getHours();
      console.log(hours);
      if (hours < 18)
      {
        background = game.add.sprite(0,0,"background");
        background.sendToBack();
      }
      else if (hours > 18)
      {  
        background = game.add.sprite(0,0,"backgroundNight");
        background.sendToBack();
      }
    }
    catch(error)
    {
      background = game.add.sprite(0,0,"background");
      background.sendToBack();
      console.log("Error");
    }
    
  }
