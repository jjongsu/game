import Player from './Player';

export default class Projectile {
    Player!: Player;
    scene!: Phaser.Scene;
    projectiles!: Phaser.Physics.Arcade.Group;
    width!: number;
    height!: number;
    level: number = 1;
    speed: number = 1000;

    constructor({ scene }: { scene: Phaser.Scene }) {
        const { width, height } = scene.game.canvas;
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.projectiles = scene.physics.add.group();
    }

    create({ player }: { player: Player }) {
        this.Player = player;
        const { x, y } = player.player;
        // const projectile = this.scene.add.circle(x, y - 30, 30, 0x4432a8);

        for (let index = 0; index < this.level; index++) {
            const offset = -80 + (160 * (index + 1)) / (this.level + 1);
            const projectile = this.scene.physics.add.image(x + offset, y - 30, 'missile');
            this.projectiles.add(projectile);

            projectile.body.velocity.x = offset * 3;
            projectile.body.velocity.y = -this.speed;
        }
    }

    upgrade() {
        this.level++;
    }
    update() {
        this.projectiles.children.iterate((child) => {
            if (child.body.position.y < -this.height / 2) {
                setTimeout(() => {
                    this.projectiles.remove(child);
                    child.destroy();
                });
            }
        });
    }
}
