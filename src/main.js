import Phaser from 'phaser';

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
};

// Create the game. This draws the blank canvas with the background color.
new Phaser.Game(config);
