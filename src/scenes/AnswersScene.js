import Phaser from 'phaser';
import { SIGNS } from '../data/signs.js';

// AnswersScene: a scrollable study/review list showing every road sign
// alongside its correct meaning. Reached from the menu. This is the "serious
// game" part: a place to learn the answers, not just be tested on them.
export default class AnswersScene extends Phaser.Scene {
  constructor() {
    super('AnswersScene');
  }

  create() {
    // Background + dark overlay for contrast (same style as the other scenes).
    this.add.image(360, 640, 'menuBackground').setDisplaySize(720, 1280);
    this.add.rectangle(360, 640, 720, 1280, 0x000000, 0.6);

    // Fixed title (stays put while the list scrolls underneath it).
    this.add.text(360, 90, 'Sign Answers', {
      fontSize: '56px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(10);

    // --- The scrollable content lives inside one container we move up/down. ---
    this.list = this.add.container(0, 0);

    const rowHeight = 150; // vertical space per sign
    const top = 200;       // y of the first row

    SIGNS.forEach((sign, i) => {
      const y = top + i * rowHeight;

      // Small sign image on the left.
      const icon = this.add.image(120, y, sign.key).setDisplaySize(110, 110);

      // Its correct meaning on the right, wrapped so long text stays on screen.
      const text = this.add.text(210, y, sign.correct, {
        fontSize: '30px', color: '#ffffff',
        wordWrap: { width: 440 },
      }).setOrigin(0, 0.5);

      this.list.add([icon, text]);
    });

    // How far the list can scroll: total content height minus the visible area.
    const contentHeight = top + SIGNS.length * rowHeight;
    this.minY = Math.min(0, 1180 - contentHeight); // most-scrolled-up position
    this.maxY = 0;                                  // top of the list

    this.setupScrolling();

    // Fixed Back button on top of everything.
    const backButton = this.add.text(360, 1200, 'Back', {
      fontSize: '44px', color: '#ffffff',
      backgroundColor: '#457b9d', padding: { x: 40, y: 14 },
    }).setOrigin(0.5).setDepth(10).setInteractive({ useHandCursor: true });
    backButton.on('pointerdown', () => this.scene.start('MenuScene'));
  }

  // Lets the player scroll the list by mouse wheel or by dragging up/down.
  setupScrolling() {
    // Mouse wheel: dy>0 scrolls content up. Clamp so it can't go past the ends.
    this.input.on('wheel', (pointer, over, dx, dy) => {
      this.list.y = Phaser.Math.Clamp(this.list.y - dy, this.minY, this.maxY);
    });

    // Touch / mouse drag: move the list by however far the pointer moved since
    // the last frame (pointer.velocity is per-frame movement in pixels).
    this.input.on('pointermove', (pointer) => {
      if (!pointer.isDown) return;
      this.list.y = Phaser.Math.Clamp(
        this.list.y + pointer.velocity.y, this.minY, this.maxY,
      );
    });
  }
}
