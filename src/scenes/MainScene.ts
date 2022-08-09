import Player from '../Player';
import Rush from '../Enemy/Rush';
import Attack from '../Enemy/Attack';

export default class MainScene extends Phaser.Scene {
    static damage() {
        throw new Error('Method not implemented.');
    }
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    background!: Phaser.GameObjects.TileSprite;
    Player!: Player;
    Rush!: Rush;
    rushEnemies!: Phaser.Physics.Arcade.Group;
    gameOver!: boolean;
    number: number = 0;
    score!: Phaser.GameObjects.Text;
    starcount!: Phaser.GameObjects.Group;
    Attack!: Attack;
    bonusScene = false;

    constructor() {
        super({ key: 'main' });
    }
    init() {
        this.gameOver = false;
        this.number = 0;
        this.bonusScene = false;
    }

    preload() {
        const images = 'assets/images';
        const ships = 'ships/ship_';
        this.load.image('space', `${images}/space.jpeg`);
        this.load.atlas('airplane', `${images}/airplane.png`, `${images}/airplane.json`);
        this.load.atlas('enemy-attack', `${images}/attack.png`, `${images}/attack.json`);
        this.load.image('enemy-missile', `${images}/enemy_missile.png`);
        this.load.image('spark-blue', `${images}/blue.png`);
        this.load.image('spark-red', `${images}/red.png`);
        this.load.image('star', `./star.png`);
        this.load.image('bomb', './bomb.png');
        this.load.image('ship0', `${ships}0000.png`);
        this.load.image('ship1', `${ships}0001.png`);
        this.load.image('ship2', `${ships}0002.png`);
        this.load.image('ship3', `${ships}0003.png`);
        this.load.image('missile', './ships/spaceMissiles_024.png');
    }

    create() {
        const { width, height } = this.game.canvas;

        // BACKGROUND
        this.background = this.add.tileSprite(-width / 2, -height / 2, width * 2, height * 2, 'space').setOrigin(0, 0);
        this.physics.world.setBounds(-width / 2, -height / 2, width * 2, height * 2);

        // PLAYER
        this.Player = new Player({ scene: this });
        this.Player.create({ projectile: true });

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

        // PARTICLES
        const emitter1 = this.add.particles('spark-blue').createEmitter({
            x: 0,
            y: -height / 2,
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'SCREEN',
            active: true,
            lifespan: 600
        });
        const emitter2 = this.add.particles('spark-red').createEmitter({
            x: 0,
            y: -height / 2,
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'SCREEN',
            active: true,
            lifespan: 600
        });
        emitter1.stop();
        emitter2.stop();

        /* ENEMY */
        // RUSH TYPE
        this.Rush = new Rush({ scene: this });
        this.createEnemy({ enemy: this.Rush, delay: 300 });

        // ATTACK TYPE
        this.Attack = new Attack({ scene: this });
        this.createEnemy({ enemy: this.Attack, delay: 500 });

        /* OVERLAP */
        // PLAYER(BODY) - ENEMY(RUSH-BODY)
        this.physics.add.overlap(this.Player.player, this.Rush.enemies, async (player, enemy) => {
            this.damage();
            enemy.destroy();
            this.Rush.enemies.remove(enemy);
            if (this.Player.life === 0) {
                this.time.removeAllEvents();
                this.end();
            }
        });

        // PLAYER(BODY) - ENEMY(ATTACK-BODY)
        this.physics.add.overlap(this.Player.player, this.Attack.enemies, async (player, enemy) => {
            this.damage();
            enemy.destroy();
            this.Attack.enemies.remove(enemy);
            if (this.Player.life === 0) {
                this.Player.projectileTimer.destroy();
                this.time.removeAllEvents();
                this.end();
            }
        });

        // PLAYER(PROJECTILE) - ENEMY(RUSH)
        this.physics.add.overlap(this.Player.Projectile.projectiles, this.Rush.enemies, (projectile, enemy) => {
            emitter1.explode(Phaser.Math.Between(3, 8), enemy.body.x + enemy.body.width / 2, enemy.body.y + enemy.body.height / 2);
            enemy.destroy();
            this.Rush.enemies.remove(enemy);
            projectile.destroy();
            this.Player.Projectile.projectiles.remove(projectile);
            this.addToScore(100);
        });

        // PLAYER(PROJECTILE) - ENEMY(ATTACK)
        this.physics.add.overlap(this.Player.Projectile.projectiles, this.Attack.enemies, (projectile, enemy) => {
            if (enemy.data.values.type === 'projectile') return;

            emitter2.explode(Phaser.Math.Between(3, 8), enemy.body.x + enemy.body.width / 2, enemy.body.y + enemy.body.height / 2);
            enemy.data.values.energy -= 1;
            // @ts-ignore
            enemy.anims.play('energy' + ((enemy.data.values.energy % 3) + 1));
            if (enemy.data.values.energy === 0) {
                this.time.removeEvent(enemy.data.values.projectile);
                enemy.destroy();
                this.Attack.enemies.remove(enemy);
            }

            projectile.destroy();
            this.Player.Projectile.projectiles.remove(projectile);
            this.addToScore(100);
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.Player.player);
        this.cameras.main.setBounds(-width / 2, -height / 2, width * 2, height * 2);

        this.events.on('resume', (system: any, data: any) => {
            if (data.answer) {
                const addLife = 5;
                this.Player.life += addLife;
                for (let index = this.Player.life; index < this.Player.life + addLife; index++) {
                    this.starcount.add(
                        this.add
                            .image(16 * index, 23, 'star')
                            .setScale(0.7)
                            .setScrollFactor(0),
                        true
                    );
                }
            }
            this.bonusScene = false;
        });
    }

    async update(time: number, delta: number): Promise<void> {
        if (this.bonusScene) return;
        if (Math.floor(this.number / 1000) >= this.Player.Projectile.level && this.Player.Projectile.level < 10) this.Player.Projectile.upgrade();

        if (this.Player.Projectile.level > 1 && this.number % 10000 < 100) {
            this.bonusScene = true;
            await new Promise((resolve) => setTimeout(resolve, 300));
            this.scene.pause('main');
            this.scene.launch('bonus');
        }
        if (this.gameOver) return;
        // BACKGROUND
        this.background.tilePositionY -= 3;

        // SCORE
        // this.addToScore(1);

        // PLAYER
        this.Player.update({ cursors: this.cursors });

        // PLAYER(PROJECTILE)
        this.Player.Projectile.update();

        // ENEMY - RUSH
        this.Rush.update();
        this.Attack.update();
    }
    createEnemy({ enemy, delay }: { enemy: Rush | Attack; delay: number }) {
        this.time.addEvent({
            delay,
            callback: () => {
                const { x, y } = this.Player.player;
                enemy.create({ target: { x, y }, energy: Phaser.Math.Between(3, 100) });
            },
            loop: true
        });
    }

    addToScore(score: number) {
        this.number += score;
        this.score.setText(`Score: ${this.number}`);
    }
    damage() {
        this.cameras.main.flash(1000, undefined, undefined, undefined, true);
        this.Player.life -= 1;
        this.Player.life > -1 && this.starcount.getChildren()[this.Player.life].destroy();
    }
    async end() {
        this.physics.pause();
        this.gameOver = true;
        await new Promise((resolve) => setTimeout(resolve, 300));
        this.cameras.main.fade(1500);
        await new Promise((resolve) => setTimeout(resolve, 1800));

        this.scene.stop();
        this.scene.start('end');
    }
}
