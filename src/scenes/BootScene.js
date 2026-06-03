import Phaser from 'phaser';

// BootScene: the first scene. It loads all images, then goes to MenuScene.
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  // preload() runs before create(). This is where Phaser loads files.
  preload() {
    this.showLoadingBar();

    // --- Backgrounds ---
    this.load.image('menuBackground', 'assets/menu_background_scene.png');
    this.load.image('gameBackground', 'assets/game_scene_background.png');

    // --- Player car ---
    this.load.image('car', 'assets/car.png');

    // --- Road signs (key -> file). The key is how we refer to it in code. ---
    this.load.image('sign_caution', 'assets/signs/caution.png');
    this.load.image('sign_no_entry', 'assets/signs/no_entry_for_any_vehicle.png');
    this.load.image('sign_roundabout', 'assets/signs/roundabout_ahead.png');
    this.load.image('sign_slippery', 'assets/signs/slippery_road.png');
    this.load.image('sign_stop', 'assets/signs/stop_at_intersection.png');
    this.load.image('sign_t_junction', 'assets/signs/t_junction.png');

    // If any file fails to load, log it clearly instead of failing silently.
    this.load.on('loaderror', (file) => {
      console.error('Failed to load asset:', file.key, 'from', file.src);
    });
  }

  create() {
    // All assets are loaded here. Move on to the menu.
    this.scene.start('MenuScene');
  }

  // Draws a simple progress bar that fills up as assets load.
  showLoadingBar() {
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2 - 80, 'Loading...', {
      fontSize: '40px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Outline of the bar.
    const barWidth = 400;
    const barHeight = 40;
    const barX = width / 2 - barWidth / 2;
    const barY = height / 2;

    const border = this.add.graphics();
    border.lineStyle(3, 0xffffff, 1);
    border.strokeRect(barX, barY, barWidth, barHeight);

    // The fill that grows with progress.
    const fill = this.add.graphics();

    // 'progress' fires repeatedly with a value from 0 (start) to 1 (done).
    this.load.on('progress', (value) => {
      fill.clear();
      fill.fillStyle(0xa8dadc, 1);
      fill.fillRect(barX, barY, barWidth * value, barHeight);
    });
  }
}
