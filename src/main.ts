import './style.css';
import Phaser from 'phaser';
import MainScene from './scenes/MainScene';
import EndScene from './scenes/EndScene';
import BonusScene from './scenes/BonusScene';

new Phaser.Game({
    type: Phaser.AUTO,
    width: '50%',
    height: '100%',

    physics: {
        default: 'arcade',
        arcade: {
            debug: !import.meta.env.DEV,
            gravity: { x: 0, y: 0 }
        }
    },
    scene: [MainScene, EndScene, BonusScene]
    // scene: [BonusScene]
});

// scene: {
//     preload() {
//         this.load.image('sky', 'sky.png');
//         this.load.image('ground', 'platform.png');
//         this.load.image('star', 'star.png');
//         this.load.image('bomb', 'bomb.png');
//         this.load.spritesheet('dude', 'dude.png', { frameWidth: 32, frameHeight: 48 });
//         this.load.spritesheet('dude1', 'dude.png', { frameWidth: 32, frameHeight: 48 });
//     },
//     create() {
//         this.add.image(0, 0, 'sky').setOrigin(0, 0);
//         // static group
//         platforms = this.physics.add.staticGroup();
//         platforms.create(400, 568, 'ground').setScale(2).refreshBody();
//         platforms.create(600, 400, 'ground');
//         platforms.create(50, 250, 'ground');
//         platforms.create(750, 220, 'ground');

//         // player
//         player = this.physics.add.sprite(100, 450, 'dude');
//         player2 = this.physics.add.sprite(200, 450, 'dude1');

//         player.setCollideWorldBounds(true);
//         player2.setCollideWorldBounds(true);

//         this.physics.add.collider(player, platforms);
//         player.body.setGravityY(600);

//         this.anims.create({
//             key: 'left',
//             frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
//             frameRate: 10,
//             repeat: -1
//         });
//         this.anims.create({
//             key: 'turn',
//             frames: [{ key: 'dude', frame: 4 }],
//             frameRate: 20
//         });
//         this.anims.create({
//             key: 'right',
//             frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
//             frameRate: 10,
//             repeat: -1
//         });

//         stars = this.physics.add.group({
//             key: 'star',
//             repeat: 11,
//             setXY: { x: 12, y: 0, stepX: 70 }
//         });
//         this.physics.add.collider(stars, platforms);
//         this.physics.add.overlap(
//             player,
//             stars,
//             function (player, star) {
//                 star.disableBody(true, true);

//                 console.log(stars.countActive(true));

//                 if (stars.countActive(true) === 0) {
//                     stars.children.iterate(function (child) {
//                         child.enableBody(true, child.x, 0, true, true);
//                     });

//                     var x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

//                     var bomb = bombs.create(x, 16, 'bomb');
//                     bomb.setBounce(1);
//                     bomb.setCollideWorldBounds(true);
//                     bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
//                 }
//             },
//             undefined,
//             this
//         );

//         bombs = this.physics.add.group();
//         this.physics.add.collider(bombs, platforms);

//         this.physics.add.collider(
//             player,
//             bombs,
//             function (player, bomb) {
//                 this.physics.pause();

//                 player.setTint(0xff0000);

//                 player.anims.play('turn');

//                 gameOver = true;
//             },
//             undefined,
//             this
//         );

//         cursors = this.input.keyboard.createCursorKeys();
//     },
//     update() {
//         if (cursors.left.isDown) {
//             player.setVelocityX(-160);
//             player.anims.play('left', true);
//         } else if (cursors.right.isDown) {
//             player.setVelocityX(160);
//             player.anims.play('right', true);
//         } else {
//             player.setVelocityX(0);
//             player.anims.play('turn');
//         }
//         if (cursors.up.isDown) {
//             player.setVelocityY(-200);
//         }
//     }
// }
