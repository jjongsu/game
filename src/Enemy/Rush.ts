export default class Rush {
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
        const enemy = this.scene.add.circle(Phaser.Math.Between(0, this.width), -this.height / 2, 30, 0xff0000);
        this.scene.physics.add.existing(enemy);
        this.enemies.add(enemy);
        const angle = Math.atan2(enemy.y - target.y, enemy.x - target.x);
        const speed = Phaser.Math.Between(500, 1000);
        enemy.body.velocity.x = -Math.cos(angle) * speed;
        enemy.body.velocity.y = -Math.sin(angle) * speed;
    }
    update() {
        this.enemies.children.iterate((child) => {
            // @ts-ignore

            // if (child.body.touching.down) {
            //     setTimeout(() => {
            //         this.enemies.remove(child);
            //         child.destroy();
            //     });
            // }

            if (child.body.position.y > this.height * 2) {
                setTimeout(() => {
                    this.enemies.remove(child);
                    child.destroy();
                });
            }
        });
    }
}
