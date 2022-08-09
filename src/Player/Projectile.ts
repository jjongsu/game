import Player from './Player';

export default class Projectile {
    Player!: Player;
    scene!: Phaser.Scene;
    projectiles!: Phaser.Physics.Arcade.Group;
    width!: number;
    height!: number;
    level: number = 1;
    speed: number = 1000;
    gap: number = 100;

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

        for (let index = 0; index < this.level; index++) {
            const offset = -this.gap + (2 * this.gap * (index + 1)) / (this.level + 1);
            const projectile = this.scene.physics.add.image(x + offset, y - 30, 'missile');

            const angle = Math.atan2(-this.speed, offset * 3);
            projectile.setRotation(angle - Math.PI / 2);
            this.projectiles.add(projectile);
            projectile.body.velocity.x = offset * 3;
            projectile.body.velocity.y = -this.speed;
        }
    }

    upgrade() {
        if (this.Player) {
            this.level++;
            this.Player.projectileTimer.timeScale = Math.max(1, this.level * 0.8);
        }
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
