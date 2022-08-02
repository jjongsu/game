import './style.css';
import Phaser from 'phaser';
import MainScene from './scenes/MainScene';
import EndScene from './scenes/EndScene';

const Main = new MainScene();
const End = new EndScene();

new Phaser.Game({
    type: Phaser.AUTO,
    width: '50%',
    height: '100%',

    physics: {
        default: 'arcade',
        arcade: {
            debug: import.meta.env.DEV
        }
    },
    scene: [Main, End]
});
