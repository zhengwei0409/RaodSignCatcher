import Phaser from 'phaser';
import { generateQuestion } from '../data/questionGenerator.js';

// GameScene: where the actual game is played.
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // Draw the game background to fill the whole 720x1280 canvas.
    this.add.image(360, 640, 'gameBackground').setDisplaySize(720, 1280);

    // FR-05: build one question. We store it on `this` (as this.question) so
    // later requirements (FR-08 falling descriptions, FR-09 catch detection)
    // can read the same question's options.
    this.question = generateQuestion();

    // FR-06: show this question's sign image near the top of the screen.
    // - 360 is horizontal centre (canvas width 720).
    // - 220 is a y position close to the top.
    // - setDisplaySize keeps the sign a sensible size regardless of the
    //   image file's original pixel dimensions.
    this.add
      .image(360, 220, this.question.sign.key)
      .setDisplaySize(240, 240);

    // FR-07: the player's car, near the bottom (canvas height 1280).
    // Stored on `this` so update() can move it every frame.
    this.car = this.add.image(360, 1180, 'car').setDisplaySize(120, 120);

    // How many pixels the car moves per frame while a control is held.
    this.carSpeed = 12;

    // Arrow-key controls. createCursorKeys() gives us .left/.right/.up/.down,
    // each of which has an .isDown flag that is true while the key is held.
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  // update() runs automatically on EVERY frame (~60 times a second). This is
  // where continuous movement lives, because create() only runs once.
  update() {
    // --- Arrow keys ---
    if (this.cursors.left.isDown) {
      this.car.x -= this.carSpeed;
    } else if (this.cursors.right.isDown) {
      this.car.x += this.carSpeed;
    }

    // --- Touch / mouse ---
    // While the screen is pressed, the car follows the pointer's x position.
    // We don't snap the car instantly to pointer.x (that feels jumpy). Instead
    // we move 25% of the remaining distance each frame, so it smoothly catches
    // up to where you point or drag. Linear(from, to, t): t=0 stays put, t=1
    // jumps fully; 0.25 is a soft follow.
    const pointer = this.input.activePointer;
    if (pointer.isDown) {
      this.car.x = Phaser.Math.Linear(this.car.x, pointer.x, 0.25);
    }

    // --- Clamp on-screen ---
    // The car image is 120 wide, so its centre must stay 60px from each edge,
    // otherwise half the car would slide off. Clamp forces car.x into range.
    this.car.x = Phaser.Math.Clamp(this.car.x, 60, 720 - 60);
  }
}
