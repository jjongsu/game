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
        const projectile = this.scene.add.circle(x, y - 30, 30, 0x4432a8);
        this.projectiles.add(projectile);
        projectile.body.velocity.y = -this.speed;
    }

    upgrade() {}
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
