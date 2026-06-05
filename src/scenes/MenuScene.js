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

    // How to Play button -> show the instructions scene.
    const howToButton = this.add.text(360, 850, 'How to Play', {
      fontSize: '40px',
      color: '#ffffff',
      backgroundColor: '#457b9d',
      padding: { x: 30, y: 16 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    howToButton.on('pointerdown', () => {
      this.scene.start('HowToPlayScene');
    });

    // Answers button -> show the scrollable sign-meanings study list.
    const answersButton = this.add.text(360, 960, 'Sign Answers', {
      fontSize: '40px',
      color: '#ffffff',
      backgroundColor: '#457b9d',
      padding: { x: 30, y: 16 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    answersButton.on('pointerdown', () => {
      this.scene.start('AnswersScene');
    });

    // Creator credit at the bottom of the screen.
    this.add.text(360, 1180, 'Created By:\nChew Zheng Wei\n23005014', {
      fontSize: '26px',
      color: '#a8dadc',
      align: 'center',
      lineSpacing: 4,
    }).setOrigin(0.5);
  }
}
