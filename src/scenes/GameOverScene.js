import Phaser from 'phaser';

// GameOverScene: shown when the game ends (final score later).
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    this.add.text(360, 640, 'GameOverScene', {
      fontSize: '48px',
      color: '#ffffff',
    }).setOrigin(0.5);
  }
}
