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
    this.add.text(360, 720, '(tap to restart)', {
      fontSize: '28px',
      color: '#a8dadc',
    }).setOrigin(0.5);

    // Temporary: tap anywhere to go back to the menu (for testing FR-02).
    this.input.once('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
