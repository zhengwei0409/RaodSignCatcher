import Phaser from 'phaser';

// GameOverScene: shown when the game ends (final score later).
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  // data is whatever the previous scene passed in scene.start(..., data).
  create(data) {
    const finalScore = data?.score ?? 0;

    this.add.text(360, 520, 'Game Over', {
      fontSize: '64px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(360, 640, 'Final Score: ' + finalScore, {
      fontSize: '40px',
      color: '#a8dadc',
    }).setOrigin(0.5);

    // FR-12: restart button -> start a fresh GameScene.
    const restartButton = this.add.text(360, 780, 'Restart', {
      fontSize: '44px',
      color: '#ffffff',
      backgroundColor: '#457b9d',
      padding: { x: 30, y: 16 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    restartButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}
