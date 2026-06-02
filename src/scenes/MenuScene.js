import Phaser from 'phaser';

// MenuScene: the main menu (title + Play button later).
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.add.text(360, 640, 'MenuScene', {
      fontSize: '48px',
      color: '#ffffff',
    }).setOrigin(0.5);
    this.add.text(360, 720, '(tap to continue)', {
      fontSize: '28px',
      color: '#a8dadc',
    }).setOrigin(0.5);

    // Temporary: tap anywhere to go to the next scene (for testing FR-02).
    this.input.once('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}
