import './style.css';
import Phaser from 'phaser';
import MainScene from './scenes/MainScene';

let platforms: Phaser.Physics.Arcade.StaticGroup;

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
        },
        create() {
            this.add.image(0, 0, 'sky').setOrigin(0, 0);

            platforms = this.physics.add.staticGroup();

            platforms.create(400, 568, 'ground').setScale(2).refreshBody();

            platforms.create(600, 400, 'ground');
            platforms.create(50, 250, 'ground');
            platforms.create(750, 220, 'ground');
        },
        update() {}
    }
});
