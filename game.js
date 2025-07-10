const game = new Phaser.Game({
    renderer: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
});

function preload(){

  this.load.image('background', 'assets/background.png');
  this.load.image('road', 'assets/road.png');
  this.load.image('column', 'assets/column.png');
  this.load.spritesheet('bird', 'assets/sprite.png', { frameWidth: 64, frameHeight: 96 });
}

let bird;
let hasLanded = false;
let cursors;
let hasBumped = false;

function create(){
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    background.displayWidth = this.sys.game.config.width;
    background.displayHeight = this.sys.game.config.height;
    const roads = this.physics.add.staticGroup();
    const topCols = this.physics.add.staticGroup({
        key: "column",
        repeat: 7,
        setXY: {x:200, y: 0.25*innerHeight, stepX: 300},
    });
    const bottomCols = this.physics.add.staticGroup({
        key: "column",
        repeat: 7,
        setXY: {x: 350, y: 0.68*innerHeight, stepX: 300}
    });
    
    const road = roads.create(background.displayWidth/2, background.displayHeight, "road").setScale(2).refreshBody();
    road.displayWidth = background.displayWidth;

    bird = this.physics.add.sprite(0, 50, "bird").setScale(2)
    bird.setBounce(0.2);
    bird.setCollideWorldBounds(true);
    this.physics.add.overlap(bird, road, () => hasLanded = true, null, this);
    this.physics.add.collider(bird, road)
    this.physics.add.overlap(bird, topCols, () => hasBumped = true, null, this);
    this.physics.add.overlap(bird, bottomCols, () => hasBumped = true, null, this)
    this.physics.add.collider(bird, topCols);
    this.physics.add.collider(bird, bottomCols);

    cursors = this.input.keyboard.createCursorKeys();
}

let hasGameStarted = false;

function update(){
    if (cursors.up.isDown && !hasLanded && !hasBumped){
        bird.setVelocityY(-160)
    }
    if (!hasLanded && !hasBumped &&!hasGameStarted){
        bird.setVelocityX(50);
    }
    if (hasLanded){
        bird.setVelocityX(0);
    }
    if (cursors.space.isDown && !hasGameStarted){
        hasGameStarted = true;
    }
    if(!hasGameStarted){
        bird.setVelocityY(-160);
    }
}