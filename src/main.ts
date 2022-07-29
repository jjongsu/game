import './style.css';
import Phaser from 'phaser';
import MainScene from './scenes/MainScene';

let platforms: Phaser.Physics.Arcade.StaticGroup;
let player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
let player2: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: import.meta.env.DEV
        }
    },
    scene: {
        preload() {
            this.load.image('sky', 'sky.png');
            this.load.image('ground', 'platform.png');
            this.load.image('star', 'star.png');
            this.load.image('bomb', 'bomb.png');
            this.load.spritesheet('dude', 'dude.png', { frameWidth: 32, frameHeight: 48 });
            this.load.spritesheet('dude1', 'dude.png', { frameWidth: 32, frameHeight: 48 });
        },
        create() {
            this.add.image(0, 0, 'sky').setOrigin(0, 0);
            platforms = this.physics.add.staticGroup();
            platforms.create(400, 568, 'ground').setScale(2).refreshBody();
            platforms.create(600, 400, 'ground');
            platforms.create(50, 250, 'ground');
            platforms.create(750, 220, 'ground');

            player = this.physics.add.sprite(100, 450, 'dude');
            player2 = this.physics.add.sprite(200, 450, 'dude1');

            player.setCollideWorldBounds(true);
            player2.setCollideWorldBounds(true);

            this.physics.add.collider(player, platforms);


            player.body.setGravityY(600)

            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'turn',
                frames: [{ key: 'dude', frame: 4 }],
                frameRate: 20
            });

            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
        },
        update() {}
    }
});
