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

    create({ target }: { target: { x: number; y: number } }) {
        const enemy = this.scene.physics.add.image(target.x + Phaser.Math.Between(-100, 100), -this.height / 2, 'ship2').setScale(2);
        this.enemies.add(enemy);
        const speed = 300;

        enemy.body.velocity.y = speed;
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
}
