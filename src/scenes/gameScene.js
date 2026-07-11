import Phaser from "phaser";

let background;
let player;
const keyboard = {};
let columns;
let scoreZone;
let scoreText;

const configForText = {
  fontFamily: "Montserrat-bold",
  color: "#fe7411",
  fontSize: "25px",
  align: 'center',
  shadow: {
    offsetX: 0.5,
    offsetY: 2,
    blur: 2,
    color: "#67462e93",
    fill: true,
  },
};

export class GameScene extends Phaser.Scene {
  preload() {
    this.load.font("Montserrat", "assets/fonts/Montserrat-Regular.ttf");

    this.load.font("Montserrat-bold", "assets/fonts/Montserrat-Bold.ttf");

    this.load.image("background", "assets/images/background.png");
    this.load.image("plane", "assets/images/Planes/plane-red.png");
    this.load.image("top-rock", "assets/images/rockDown.png");
    this.load.image("bot-rock", "assets/images/rock.png");
  }

  create() {
    this.isGameOver = false;
    this.score = 0;
    //#region background
    background = this.add.tileSprite(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      "background",
    )

    const scaleImgY = this.scale.height / background.texture.getSourceImage().height;
      
    background.setTileScale(1, scaleImgY);
    //#endregion

    //#region player
    player = this.physics.add.image(
      this.scale.width / 5,
      this.scale.height / 2,
      "plane",
    );
    player.setScale(0.5).refreshBody();
    player.setCollideWorldBounds(true);
    player.body.setCircle((player.body.width + player.body.height) / 2, 10, -5);
    player.body.setVelocityY(-350);
    //#endregion

    keyboard.space = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    keyboard.space.on("down", this.jump);
    this.input.on('pointerdown', this.jump);

    this.time.addEvent({
      callbackScope: this,
      callback: this.createColumn,
      loop: true,
      delay: 1500,
    });

    scoreText = this.add.text(
      this.scale.width * 0.95,
      this.scale.width / 20,
      `Score: 0`,
      configForText,
    );

    scoreText.setOrigin(1, 0).setDepth(1);

    scoreZone = this.physics.add.group();
    columns = this.physics.add.group();

    this.physics.add.overlap(player, scoreZone, this.giveScore, null, this);
    this.physics.add.collider(player, columns, this.crash, null, this);
  }

  update() {
    if (this.isGameOver) {
      if (keyboard.space.isDown || this.input.activePointer.isDown) {
        this.scene.restart();
      }

      return;
    }

    background.tilePositionX += 0.5;

    //#region player
    if (player.body.velocity.y > 0) {
      player.body.rotation = 15;
    } else if (player.body.velocity.y < 0) {
      player.body.rotation = -20;
    } else {
      player.body.rotation = -12;
    }
    //#endregion

    columns.getChildren().forEach((c) => {
      if (c.x < -(this.scale.width / 2)) {
        if (c.bindedZone && c.bindedZone.active) {
          c.bindedZone.destroy();
        }

        c.destroy();
      }
    });
  }

  createColumn() {
    const speedColumn = -250;
    const spaceBetweenColumn = 60;
    const positionX = this.scale.width * 1.5;
    const positionY = this.scale.height / 2 + Phaser.Math.Between(-180, 180);

    const topRock = columns.create(
      positionX,
      positionY - spaceBetweenColumn,
      "top-rock",
    );

    const botRock = columns.create(
      positionX,
      positionY + spaceBetweenColumn,
      "bot-rock",
    );

    topRock.setOrigin(0.5, 1);
    botRock.setOrigin(0.5, 0);

    topRock.setScale(0.5, 1.8).refreshBody();
    botRock.setScale(0.5, 1.8).refreshBody();

    const zone = this.add.zone(
      positionX + topRock.body.width,
      positionY,
      topRock.body.width / 2,
      spaceBetweenColumn * 2,
    );
    scoreZone.add(zone);

    zone.body.setAllowGravity(false);
    topRock.body.setAllowGravity(false);
    botRock.body.setAllowGravity(false);

    zone.body.setVelocityX(speedColumn);
    topRock.setVelocityX(speedColumn);
    botRock.setVelocityX(speedColumn);

    topRock.bindedZone = zone;
  }

  crash() {
    this.isGameOver = true;
    this.physics.pause();

    const text = `Press "space" or tap to screen \nto restart game`;

    this.add
      .text(this.scale.width / 2, this.scale.height / 2, text, configForText)
      .setOrigin(0.5) ;
  }

  giveScore(player, zone) {
    zone.destroy();
    this.score += 1;
    scoreText.setText("Score: " + this.score);
  }

  jump() {
    if (this.isGameOver) return;

    player.body.setVelocityY(-350);
  }
}