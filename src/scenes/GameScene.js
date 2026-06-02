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
    this.add.text(360, 720, '(tap to continue)', {
      fontSize: '28px',
      color: '#a8dadc',
    }).setOrigin(0.5);

    // Temporary: tap anywhere to go to the next scene (for testing FR-02).
    this.input.once('pointerdown', () => {
      this.scene.start('GameOverScene');
    });
  }
}
