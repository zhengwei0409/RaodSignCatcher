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

    // --- FR-10: score ---
    this.score = 0;
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '36px',
      color: '#ffffff',
    });

    // --- FR-11: lives (start with 3) ---
    this.lives = 3;
    this.livesText = this.add.text(700, 20, 'Lives: 3', {
      fontSize: '36px',
      color: '#ffffff',
    }).setOrigin(1, 0); // anchor top-right

    // --- FR-08: falling descriptions ---
    // A "group" is Phaser's container for many similar objects. We keep all the
    // falling description texts in here so we can loop over them every frame.
    this.descriptions = this.add.group();

    // How fast (pixels per frame) the descriptions fall.
    this.fallSpeed = 4;

    // We spawn options in a shuffled order, one at a time. spawnQueue holds the
    // options waiting to drop; when it empties we refill+reshuffle it.
    this.spawnQueue = [];

    // A repeating timer: every 1200ms it calls spawnDescription().
    // loop: true means it keeps firing forever (not just once).
    this.time.addEvent({
      delay: 1200,
      loop: true,
      callback: () => this.spawnDescription(),
    });
  }

  // Creates ONE falling description text near the top of the screen.
  spawnDescription() {
    // Refill the queue if it's empty, so options keep cycling.
    if (this.spawnQueue.length === 0) {
      this.spawnQueue = Phaser.Utils.Array.Shuffle([...this.question.options]);
    }
    const option = this.spawnQueue.pop();

    // Random x so they don't all fall in the same column. The box can be up to
    // ~280px wide, so its centre must stay ~160px from each edge or a wide box
    // would clip off-screen. Hence the 160..560 range instead of 100..620.
    const x = Phaser.Math.Between(160, 560);

    const label = this.add
      .text(x, -40, option.text, {
        fontSize: '30px',
        color: '#ffffff',
        backgroundColor: '#457b9d',
        padding: { x: 12, y: 8 },
        align: 'center', // centre each line within the box (looks tidy on >1 line)
        // Auto-wrap long text onto multiple lines once it passes 240px wide,
        // so long descriptions no longer run off the screen edges.
        wordWrap: { width: 240, useAdvancedWrap: true },
      })
      .setOrigin(0.5);

    // Remember whether this text was the correct answer. We attach our own
    // field onto the text object so FR-09 can read it when the car catches it.
    label.isCorrect = option.isCorrect;

    this.descriptions.add(label);
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

    // --- FR-08: make every description fall, and remove ones off-screen ---
    // getChildren() returns the array of all texts currently in the group.
    this.descriptions.getChildren().forEach((label) => {
      label.y += this.fallSpeed;

      // FR-09: did the car catch this description? Check if their bounding
      // boxes overlap. If so, read the isCorrect flag we attached at spawn.
      const carBounds = this.car.getBounds();
      const labelBounds = label.getBounds();
      if (Phaser.Geom.Intersects.RectangleToRectangle(carBounds, labelBounds)) {
        if (label.isCorrect) {
          // FR-10: catching a correct description adds points.
          this.score += 10;
          this.scoreText.setText('Score: ' + this.score);
        } else {
          // FR-11: catching a wrong description loses a life.
          this.lives -= 1;
          this.livesText.setText('Lives: ' + this.lives);

          // FR-12: out of lives -> go to game over, passing the final score.
          if (this.lives <= 0) {
            this.scene.start('GameOverScene', { score: this.score });
            return;
          }
        }
        label.destroy();
        return; // this label is gone; skip the off-screen check below
      }

      // If it has fallen past the bottom edge (canvas height 1280), it was not
      // caught. destroy() removes it from the scene AND the group, freeing it
      // so objects don't pile up forever.
      if (label.y > 1280) {
        label.destroy();
      }
    });
  }
}
