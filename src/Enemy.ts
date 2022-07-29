export default class Enemy {
    scene!: Phaser.Scene;
    enemy!: Phaser.GameObjects.Arc;

    target: { x: number; y: number } = { x: 0, y: 0 };
    x: number = 0;
    y: number = 0;
    dx: number = 0;
    dy: number = 0;

    constructor({ scene, x, y, target }: { scene: Phaser.Scene; x: number; y: number; target: { x: number; y: number } }) {
        const angle = Math.atan2(y - target.y, x - target.x);
        // const speed = Math.random() * 3 + 5;
        const speed = 3;
        // this.dx = Math.cos(angle) * speed;
        // this.dy = Math.sin(angle) * speed;

        this.dx = 0 * speed;
        this.dy = -1 * speed;

        this.scene = scene;
        this.x = x;
        this.y = y;
        this.target = target;
    }

    create() {
        this.enemy = this.scene.add.circle(this.x, this.y, 10, 0xffffff);

        // setTimeout(() => {
        //     this.projectile1 = this.scene.add.circle(this.x, this.enemy.y + 10, 10, 0xff0000);
        // }, 1000);
        // setTimeout(() => {
        //     this.projectile2 = this.scene.add.circle(this.x, this.enemy.y + 10, 10, 0xff0000);
        // }, 2000);
        // setTimeout(() => {
        //     this.projectile3 = this.scene.add.circle(this.x, this.enemy.y + 10, 10, 0xff0000);
        // }, 3000);
    }

    update() {
        this.enemy.x -= this.dx;
        this.enemy.y -= this.dy;

        // if (this.projectile1) this.projectile1.y -= this.dy - 2;
        // if (this.projectile2) this.projectile2.y -= this.dy - 2;
        // if (this.projectile3) this.projectile3.y -= this.dy - 2;
    }
}
