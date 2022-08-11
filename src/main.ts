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
            debug: import.meta.env.DEV,
            gravity: { x: 0, y: 0 }
        }
    },
    scene: [MainScene, EndScene, BonusScene]
    // scene: [BonusScene]
});
