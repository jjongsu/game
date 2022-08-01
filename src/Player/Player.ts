import Projectile from './Projectile';

export default class Player {
    player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    scene!: Phaser.Scene;
    Projectile!: Projectile;
    life: number = 3;
    constructor({ scene }: { scene: Phaser.Scene }) {
        this.scene = scene;
    }

    create() {
        const { width, height } = this.scene.game.canvas;
        // PLAYER
        this.player = this.scene.physics.add.sprite(width / 2, height * 1.4, 'airplane').setScale(0.5);
        this.player.setCollideWorldBounds(true);

        // PLAYER SPRITE
        this.scene.anims.create({ key: 'left', frames: [{ key: 'airplane', frame: '05' }], frameRate: 30, repeat: 0 });
        this.scene.anims.create({ key: 'right', frames: [{ key: 'airplane', frame: '09' }], frameRate: 30, repeat: 0 });
        this.scene.anims.create({ key: 'hold', frames: [{ key: 'airplane', frame: '07' }], frameRate: 30, repeat: 0 });

        // PROJECTILE
        this.Projectile = new Projectile({ scene: this.scene });
        this.Projectile.create({ player: this });

        const timer = this.scene.time.addEvent({
            delay: 150,
            callback: () => {
                this.Projectile.create({ player: this });
                this.life === 0 && timer.destroy();
            },
            loop: true
        });
    }

    update({ cursors }: { cursors: Phaser.Types.Input.Keyboard.CursorKeys }) {
        // MOVE
        if (cursors.left.isDown) {
            this.player.body.velocity.x = -500;
        } else if (cursors.right.isDown) {
            this.player.body.velocity.x = 500;
        } else {
            this.player.body.velocity.x = 0;
        }

        if (cursors.up.isDown) {
            this.player.body.velocity.y = -500;
        } else if (cursors.down.isDown) {
            this.player.body.velocity.y = 500;
        } else {
            this.player.body.velocity.y = 0;
        }

        // IMAGE
        this.player.anims.play('hold', true);
        cursors.left.isDown && this.player.anims.play('left', true);
        cursors.right.isDown && this.player.anims.play('right', true);
    }
}