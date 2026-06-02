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
  }
}
