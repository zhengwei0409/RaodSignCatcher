import Phaser from 'phaser';

// GameScene: where the actual game is played.
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.add.text(360, 640, 'GameScene', {
      fontSize: '48px',
      color: '#ffffff',
    }).setOrigin(0.5);
  }
}
