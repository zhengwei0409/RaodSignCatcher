import Phaser from 'phaser';

// MenuScene: the main menu (title + Play button later).
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    // Background fills the whole 720x1280 canvas.
    this.add.image(360, 640, 'menuBackground').setDisplaySize(720, 1280);

    // Dark overlay on top of the background to boost contrast for the text.
    // Added right after the background so it sits above it but below the text.
    this.add.rectangle(360, 640, 720, 1280, 0x000000, 0.45);

    // FR-16: title.
    this.add.text(360, 400, 'Sign Catcher', {
      fontSize: '72px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(360, 490, 'Malaysian Road Sign Challenge', {
      fontSize: '32px',
      color: '#a8dadc',
    }).setOrigin(0.5);

    // FR-16: Play button -> start the game.
    const playButton = this.add.text(360, 720, 'Play', {
      fontSize: '52px',
      color: '#ffffff',
      backgroundColor: '#457b9d',
      padding: { x: 50, y: 20 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    playButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}
