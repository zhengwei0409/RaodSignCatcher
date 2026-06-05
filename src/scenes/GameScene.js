import Phaser from 'phaser';
import { generateQuestion, buildOptions } from '../data/questionGenerator.js';
import { SIGNS } from '../data/signs.js';

// GameScene: where the actual game is played.
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // Draw the game background to fill the whole 720x1280 canvas.
    this.add.image(360, 640, 'gameBackground').setDisplaySize(720, 1280);

    // Dark overlay on top of the background to boost contrast for the sign,
    // car, and falling text. Added early so it stays below all game elements.
    this.add.rectangle(360, 640, 720, 1280, 0x000000, 0.35);

    // A shuffled queue of signs we haven't shown yet. We pull from it so no sign
    // repeats until every sign has appeared once; then it refills + reshuffles.
    this.signQueue = [];

    // FR-05: build the first question, using the next sign from the queue.
    this.question = generateQuestion(2, false, this.nextSign());

    // FR-06: show this question's sign image near the top of the screen.
    // - 360 is horizontal centre (canvas width 720).
    // - 220 is a y position close to the top.
    // - setDisplaySize keeps the sign a sensible size regardless of the
    //   image file's original pixel dimensions.
    // Stored on `this` so we can swap its texture when the question changes.
    this.signImage = this.add
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

    // Sound effects, prepared once so we can replay them instantly on catch.
    this.correctSound = this.sound.add('sfx_correct');
    this.wrongSound = this.sound.add('sfx_wrong');

    // --- FR-10: score ---
    this.score = 0;
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '36px',
      color: '#ffffff',
    }).setDepth(1000); // FR-17: keep HUD above falling descriptions

    // How many signs the player has answered correctly. Answering all of them
    // (one full pass through SIGNS) wins the game.
    this.signsCleared = 0;

    // --- FR-11: lives (start with 3) ---
    this.lives = 3;
    this.livesText = this.add.text(700, 20, 'Lives: 3', {
      fontSize: '36px',
      color: '#ffffff',
    }).setOrigin(1, 0).setDepth(1000); // anchor top-right, above descriptions

    // --- FR-08: falling descriptions ---
    // A "group" is Phaser's container for many similar objects. We keep all the
    // falling description texts in here so we can loop over them every frame.
    this.descriptions = this.add.group();

    // How fast (pixels per frame) the descriptions fall.
    this.fallSpeed = 4;

    // We spawn options in a shuffled order, one at a time. spawnQueue holds the
    // options waiting to drop; when it empties we refill+reshuffle it.
    this.spawnQueue = [];

    // Current gap (ms) between spawns. FR-14 shrinks this as score grows.
    this.spawnDelay = 1200;
    this.startSpawnTimer();

    this.setupPause();
  }

  // --- FR-18: pause / resume ---
  setupPause() {
    // A "Pause" button in the HUD.
    const pauseButton = this.add.text(360, 30, '|| Pause', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#457b9d',
      padding: { x: 16, y: 8 },
    }).setOrigin(0.5, 0).setDepth(1000).setInteractive({ useHandCursor: true });
    pauseButton.on('pointerdown', () => this.pauseGame());

    // Also allow the P key to toggle pause/resume.
    this.input.keyboard.on('keydown-P', () => {
      if (this.isPaused) this.resumeGame();
      else this.pauseGame();
    });

    // A full-screen overlay shown while paused. Hidden by default.
    this.pauseOverlay = this.add.container(0, 0).setDepth(2000).setVisible(false);
    const dim = this.add.rectangle(360, 640, 720, 1280, 0x000000, 0.6);
    const pausedText = this.add.text(360, 580, 'PAUSED', {
      fontSize: '72px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);
    const resumeText = this.add.text(360, 700, 'Tap to resume', {
      fontSize: '36px', color: '#a8dadc',
    }).setOrigin(0.5);

    // An "End Game" button that quits back to the main menu.
    const endButton = this.add.text(360, 820, 'End Game', {
      fontSize: '40px', color: '#ffffff',
      backgroundColor: '#e63946', padding: { x: 30, y: 16 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    endButton.on('pointerdown', () => this.scene.start('MenuScene'));

    // Order matters: dim is added first (bottom), endButton last (top) so the
    // dim's "tap to resume" doesn't swallow clicks on the button above it.
    this.pauseOverlay.add([dim, pausedText, resumeText, endButton]);

    // Tapping the dim overlay resumes.
    dim.setInteractive().on('pointerdown', () => this.resumeGame());

    // Paused flag checked by update() and the spawn timer. We use a flag rather
    // than scene.pause() so the overlay/keys still receive input while paused.
    this.isPaused = false;
  }

  pauseGame() {
    if (this.isPaused) return;
    this.isPaused = true;
    this.pauseOverlay.setVisible(true);
    this.spawnTimer.paused = true; // stop spawning new descriptions
  }

  resumeGame() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.pauseOverlay.setVisible(false);
    this.spawnTimer.paused = false;
  }

  // Starts (or restarts) the repeating spawn timer using this.spawnDelay.
  startSpawnTimer() {
    if (this.spawnTimer) this.spawnTimer.remove();
    this.spawnTimer = this.time.addEvent({
      delay: this.spawnDelay,
      loop: true,
      callback: () => this.spawnDescription(),
    });
  }

  // Returns the next sign to show, with no repeats until all signs have been
  // used. When the queue empties, refill it with a fresh shuffle of all signs.
  nextSign() {
    if (this.signQueue.length === 0) {
      this.signQueue = Phaser.Utils.Array.Shuffle([...SIGNS]);
    }
    return this.signQueue.pop();
  }

  // Picks a fresh question and updates the screen to show it.
  loadNextQuestion() {
    // New sign (no repeats) + new options (respect hard mode if unlocked).
    this.question = generateQuestion(2, false, this.nextSign());
    if (this.hardMode) {
      this.question.options = buildOptions(this.question.sign, 2, true);
    }

    // Swap the top sign image to the new sign.
    this.signImage.setTexture(this.question.sign.key).setDisplaySize(240, 240);

    // Clear every old description still falling, so the new sign's options
    // don't get mixed up with the previous sign's. clear(true, true) removes
    // them from the group AND destroys them from the scene.
    this.descriptions.clear(true, true);

    // Empty the queue so the next spawn refills from the NEW options.
    this.spawnQueue = [];
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
    // FR-18: while paused, freeze all game logic (no movement/falling/catching).
    if (this.isPaused) return;

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
          this.correctSound.play();

          // FR-10: catching a correct description adds points.
          this.score += 10;
          this.scoreText.setText('Score: ' + this.score);

          // FR-13: descriptions fall faster as the score grows. Base speed 4,
          // +1 for every 30 points, capped at 12 so it never gets unplayable.
          this.fallSpeed = Math.min(4 + Math.floor(this.score / 30), 12);

          // FR-14: spawn more often as score grows. Start 1200ms, -50ms per 10
          // points, floored at 500ms. Restart the timer with the new delay.
          const newDelay = Math.max(1200 - Math.floor(this.score / 10) * 50, 500);
          if (newDelay !== this.spawnDelay) {
            this.spawnDelay = newDelay;
            this.startSpawnTimer();
          }

          // FR-15: once past 50 points, switch the wrong options to the harder,
          // same-category set. Only rebuild once (when crossing the threshold).
          if (this.score >= 50 && !this.hardMode) {
            this.hardMode = true;
            this.question.options = buildOptions(this.question.sign, 2, true);
            this.spawnQueue = []; // force the queue to refill from new options
          }

          // Win check: once the player has answered every sign correctly,
          // the game is won. Pass won:true so GameOverScene shows a win screen.
          this.signsCleared += 1;
          if (this.signsCleared >= SIGNS.length) {
            this.scene.start('GameOverScene', { score: this.score, won: true });
            return;
          }

          // Correct answer -> move on to a new sign + new options.
          this.loadNextQuestion();
          return; // the old labels are gone; stop looping the old list
        } else {
          this.wrongSound.play();

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
