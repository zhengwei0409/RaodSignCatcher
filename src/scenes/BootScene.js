import Phaser from 'phaser';

// BootScene: the first scene. Later it will load images.
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene'); // the unique name we use to refer to this scene
  }

  create() {
    // Show the scene name in the center so we can see which scene is active.
    this.add.text(360, 640, 'BootScene', {
      fontSize: '48px',
      color: '#ffffff',
    }).setOrigin(0.5);
  }
}
