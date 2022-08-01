import Player from '../Player';

export default class MainScene extends Phaser.Scene {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    background!: Phaser.GameObjects.TileSprite;
    Player!: Player;
    rushEnemies!: Phaser.Physics.Arcade.Group;
    gameOver!: boolean;
    life: number = 100;

    constructor() {
        super({ key: 'main' });
    }

    preload() {
        const images = 'assets/images';
        this.load.image('space', `${images}/space.jpeg`);
        this.load.atlas('airplane', `${images}/airplane.png`, `${images}/airplane.json`);
    }

    create() {
        const { width, height } = this.game.canvas;
        this.physics.world.setBounds(-width / 2, -height / 2, width * 2, height * 2);

        // BACKGROUND
        this.background = this.add.tileSprite(-width / 2, -height / 2, width * 2, height * 2, 'space').setOrigin(0, 0);

        // GAME INFO
        const life = this.add.text(16, 16, `Life: ${this.life}`, { fontSize: '16px', color: '#ffffff' }).setScrollFactor(0);

        // PLAYER
        this.Player = new Player({ scene: this });
        this.Player.create();

        // ENEMY - RUSH TYPE
        this.rushEnemies = this.physics.add.group();
        const timer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                const enemy = this.add.circle(Phaser.Math.Between(0, width), -height / 2, 30, 0xff0000);
                this.rushEnemies.add(enemy);
                const angle = Math.atan2(enemy.y - this.Player.player.y, enemy.x - this.Player.player.x);
                const speed = Phaser.Math.Between(500, 1000);
                enemy.body.velocity.x = -Math.cos(angle) * speed;
                enemy.body.velocity.y = -Math.sin(angle) * speed;

                this.rushEnemies.children.iterate((el) => {
                    if (el.body.position.y > 2 * height)
                        setTimeout(() => {
                            this.rushEnemies.remove(el);
                            el.destroy();
                        });
                });
            },
            loop: true
        });

        // HANDLER
        this.physics.add.collider(
            this.Player.player,
            this.rushEnemies,
            async (player, enemy) => {
                this.cameras.main.flash(1000, undefined, undefined, undefined, true);
                this.life -= 1;
                life.setText(`Life: ${this.life}`);
                enemy.destroy();
                this.rushEnemies.remove(enemy);
                if (this.life === 0) {
                    this.physics.pause();
                    timer.destroy();
                    this.gameOver = true;
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                    this.cameras.main.fade(2000);
                }
            },
            undefined,
            this
        );

        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.startFollow(this.Player.player);
        this.cameras.main.setBounds(-width / 2, -height / 2, width * 2, height * 2);
    }

    update(time: number, delta: number): void {
        if (this.gameOver) return;

        // BACKGROUND
        this.background.tilePositionY -= 3;

        // PLAYER
        this.Player.update({ cursors: this.cursors });
    }
}
