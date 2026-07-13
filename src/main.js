"use strict";

import Phaser, { Scale } from "phaser";
import { GameScene } from "./scenes/gameScene.js";

const windoWidth = window.innerWidth;
const windoHeight = window.innerHeight;

const config = {
  type: Phaser.AUTO,
  width: windoWidth,
  height: windoHeight,
  scene: GameScene,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 800 },
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const game = new Phaser.Game(config);
