"use strict";

import Phaser, { Scale } from "phaser";
import { GameScene } from "./scenes/gameScene.js";

const windoWidth = window.innerWidth;
const windoHeight = window.innerHeight;

const config = {
  width: windoWidth,
  height: windoHeight,
  scene: GameScene,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 800 },
    },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.Center,
  },
};

const game = new Phaser.Game(config);
