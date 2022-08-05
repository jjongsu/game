export default class Attack {
    enemies!: Phaser.Physics.Arcade.Group;
    scene!: Phaser.Scene;
    timer!: Phaser.Time.TimerEvent;
    width!: number;
    height!: number;

    constructor({ scene }: { scene: Phaser.Scene }) {
        const { width, height } = scene.game.canvas;
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.enemies = scene.physics.add.group();
    }

    create({ target, energy }: { target: { x: number; y: number }; energy: number }) {
        const [x, y] = [target.x + Phaser.Math.Between(-this.width / 2, this.width / 2), -this.height / 2];
        // ENEMY
        const enemy = this.scene.physics.add.sprite(x, y, 'enemy-attack').setScale(2);

        // ENEMY SPRITE
        this.scene.anims.create({ key: 'energy1', frames: [{ key: 'enemy-attack', frame: 'ship_0001' }], frameRate: 30, repeat: 0 });
        this.scene.anims.create({ key: 'energy2', frames: [{ key: 'enemy-attack', frame: 'ship_0002' }], frameRate: 30, repeat: 0 });
        this.scene.anims.create({ key: 'energy3', frames: [{ key: 'enemy-attack', frame: 'ship_0003' }], frameRate: 30, repeat: 0 });

        enemy.anims.play('energy3');

        this.enemies.add(enemy);
        enemy.body.velocity.y = 300;

        const projectile = this.scene.time.addEvent({
            delay: 1500,
            callback: () => this.createProjectile(enemy.x, enemy.y),
            loop: false
        });

        enemy.setData({ energy, projectile });
    }
    update() {
        this.enemies.children.iterate((child) => {
            if (child.body.position.y > this.height * 2) {
                setTimeout(() => {
                    this.enemies.remove(child);
                    child.destroy();
                });
            }
        });
    }
    createProjectile(x: number, y: number) {
        const projectile = this.scene.physics.add.image(x, y, 'enemy-missile');
        projectile.setData({ type: 'projectile' });
        projectile.setRotation(Math.PI);
        this.enemies.add(projectile);
        projectile.body.velocity.y = 400;
    }
}
