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
  }
}
