import Phaser from 'phaser';

// HowToPlayScene: a simple instructions page reached from the menu.
export default class HowToPlayScene extends Phaser.Scene {
  constructor() {
    super('HowToPlayScene');
  }

  create() {
    // Reuse the menu background, with a dark overlay for text contrast.
    this.add.image(360, 640, 'menuBackground').setDisplaySize(720, 1280);
    this.add.rectangle(360, 640, 720, 1280, 0x000000, 0.6);

    // Title.
    this.add.text(360, 180, 'How to Play', {
      fontSize: '64px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);

    // The instruction lines. Kept as an array so it's easy to edit/reorder.
    const lines = [
      '1. A road sign appears at the top.',
      '',
      '2. Descriptions fall from the sky.',
      '',
      '3. Move the car left/right to catch',
      '   the description that matches',
      '   the sign.',
      '',
      '   Drag/tap on phone, or use the',
      '   arrow keys on desktop.',
      '',
      '4. Catch the CORRECT one to score',
      '   and move to the next sign.',
      '',
      '5. Catch a WRONG one and you lose',
      '   a heart  ❤️.  Lose all 3 and the',
      '   game is over.',
      '',
      '6. Clear all signs to WIN!',
    ];

    this.add.text(360, 360, lines.join('\n'), {
      fontSize: '32px', color: '#a8dadc', align: 'center', lineSpacing: 4,
    }).setOrigin(0.5, 0);

    // Back button -> return to the menu.
    const backButton = this.add.text(360, 1120, 'Back', {
      fontSize: '48px', color: '#ffffff',
      backgroundColor: '#457b9d', padding: { x: 50, y: 18 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    backButton.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
