import Enemy from '../Enemy';

export default class MainScene extends Phaser.Scene {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    background!: Phaser.GameObjects.TileSprite;
    player!: Phaser.GameObjects.Arc;
    enemy!: Enemy;
    enemies: Enemy[] = [];
    totalWidth: number = 0;
    totalHeight: number = 0;
    constructor() {
        super({ key: 'main' });
    }

    preload() {
        this.load.image('space', 'space.jpeg');
    }

    create() {
        const { width, height } = this.game.canvas;
        this.totalWidth = width;
        this.totalHeight = height;

        this.background = this.add.tileSprite(width / 2, height / 2, width * 2, height * 2, 'space');

        this.player = this.add.circle(width / 2, height / 2, 30, 0xff0000);
        this.enemy = new Enemy({ scene: this, x: width / 2, y: 50, target: { x: this.player.x, y: this.player.y } });
        const enemyGroup = this.add.group({ defaultKey: 'test', defaultFrame: 1 });

        console.log(enemyGroup);

        this.enemy.create();
        this.time.addEvent({
            delay: 100,
            callback: () => {
                const enemy = new Enemy({ scene: this, x: width / 2, y: 50, target: { x: this.player.x, y: this.player.y } });

                // const aa = this.add.circle(width / 2, 100, 10, 0xffffff);
                // enemyGroup.add(aa);
                enemy.create();
                this.enemies.push(enemy);

                // console.log(enemyGroup.getChildren());
            },
            loop: true
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(-width / 2, -height / 2, width * 2, height * 1.5);
    }

    update(time: number, delta: number): void {
        this.background.tilePositionY -= 3;
        this.enemies.forEach((el, i) => {
            el.update();

            if (el.enemy.y < -this.totalHeight || el.enemy.y > this.totalHeight * 1.5) {
                el.enemy.destroy();
                setTimeout(() => this.enemies.splice(i, 1));
            }
        });

        if (this.cursors.left.isDown && this.player.x > -this.totalWidth / 2) {
            this.player.x -= 10;
        }
        if (this.cursors.right.isDown && this.player.x < this.totalWidth * 1.5) {
            this.player.x += 10;
        }
        if (this.cursors.up.isDown && this.player.y > -this.totalHeight / 2) {
            this.player.y -= 10;
        }
        if (this.cursors.down.isDown && this.player.y < this.totalHeight) {
            this.player.y += 10;
        }
    }
}
