import Player from '../Player';
import Rush from '../Enemy/Rush';

export default class MainScene extends Phaser.Scene {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    background!: Phaser.GameObjects.TileSprite;
    Player!: Player;
    Rush!: Rush;
    rushEnemies!: Phaser.Physics.Arcade.Group;
    gameOver!: boolean;
    number: number = 0;
    score!: Phaser.GameObjects.Text;
    starcount!: Phaser.GameObjects.Group;

    constructor() {
        super({ key: 'main' });
    }

    preload() {
        const images = 'assets/images';
        this.load.image('space', `${images}/space.jpeg`);
        this.load.atlas('airplane', `${images}/airplane.png`, `${images}/airplane.json`);
        this.load.image('star', `./star.png`);
    }

    create() {
        const { width, height } = this.game.canvas;

        // BACKGROUND
        this.background = this.add.tileSprite(-width / 2, -height / 2, width * 2, height * 2, 'space').setOrigin(0, 0);
        this.physics.world.setBounds(-width / 2, -height / 2, width * 2, height * 2);

        // PLAYER
        this.Player = new Player({ scene: this });
        this.Player.create();

        // GAME INFO
        this.add.text(16, 16, `Life:`, { fontSize: '16px', color: '#ffffff' }).setScrollFactor(0);
        this.starcount = this.add.group({ classType: Image });
        for (let i = 0; i < this.Player.life; i++) {
            this.starcount.add(
                this.add
                    .image(16 * (i + 5), 23, 'star')
                    .setScale(0.7)
                    .setScrollFactor(0),
                true
            );
        }
        this.score = this.add.text(16, 35, `Score: ${this.number}`, { fontSize: '16px', color: '#ffffff' }).setScrollFactor(0);

        // ENEMY - RUSH TYPE
        this.Rush = new Rush({ scene: this });
        const timer = this.time.addEvent({
            delay: 300,
            callback: () => {
                const { x, y } = this.Player.player;
                this.Rush.create({ target: { x, y } });
            },
            loop: true
        });

        // COLLIDER PLAYER - ENEMY
        this.physics.add.collider(this.Player.player, this.Rush.enemies, async (player, enemy) => {
            this.cameras.main.flash(1000, undefined, undefined, undefined, true);
            this.Player.life -= 1;
            this.starcount.getChildren()[this.Player.life].destroy();
            enemy.destroy();
            this.Rush.enemies.remove(enemy);
            if (this.Player.life === 0) {
                this.physics.pause();
                timer.destroy();
                this.gameOver = true;
                await new Promise((resolve) => setTimeout(resolve, 1500));
                this.cameras.main.fade(2000);
                this.scene.stop();
                this.scene.start('end');
            }
        });

        // COLLIDER PLAYER(PROJECTILE) - ENEMY
        this.physics.add.collider(this.Player.Projectile.projectiles, this.Rush.enemies, (projectile, enemy) => {
            enemy.destroy();
            this.Rush.enemies.remove(enemy);
            projectile.destroy();
            this.Player.Projectile.projectiles.remove(projectile);
            this.number += 100;
            this.score.setText(`Score: ${this.number}`);
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.Player.player);
        this.cameras.main.setBounds(-width / 2, -height / 2, width * 2, height * 2);
    }

    update(time: number, delta: number): void {
        if (this.gameOver) return;
        // BACKGROUND
        this.background.tilePositionY -= 3;

        // SCORE
        this.number += 1;
        this.score.setText(`Score: ${this.number}`);

        // PLAYER
        this.Player.update({ cursors: this.cursors });

        // PLAYER(PROJECTILE)
        this.Player.Projectile.update();

        // ENEMY - RUSH
        this.Rush.update();
    }
}
