import './style.css';
import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import HowToPlayScene from './scenes/HowToPlayScene.js';

// Game configuration: a portrait (tall) canvas sized for mobile phones.
const config = {
  type: Phaser.AUTO,        // let Phaser pick WebGL or Canvas automatically
  width: 720,               // game width in pixels
  height: 1280,             // game height in pixels (taller than wide = portrait)
  backgroundColor: '#1d3557', // dark blue background fill
  parent: 'app',            // put the canvas inside the <div id="app"> in index.html
  scale: {
    mode: Phaser.Scale.FIT,           // scale the canvas to fit the screen
    autoCenter: Phaser.Scale.CENTER_BOTH, // center it horizontally and vertically
  },
  // Register all scenes. The first one in the list starts automatically.
  scene: [BootScene, MenuScene, GameScene, GameOverScene, HowToPlayScene],
};

// Create the game.
new Phaser.Game(config);
