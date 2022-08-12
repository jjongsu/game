export default class EndScene extends Phaser.Scene {
    endSceneMusic!: Phaser.Sound.BaseSound;
    gameoverVoice!: Phaser.Sound.BaseSound;
    constructor() {
        super({ key: 'end' });
    }
    preload() {
        this.load.audio('endSceneMusic', 'assets/sounds/endSceneMusic.mp3');
        this.load.audio('gameoverVoice', 'assets/sounds/gameoverVoice.mp3');
    }

    create() {
        const { width, height } = this.game.canvas;

        // BACKGROUND MUSIC
        this.endSceneMusic = this.sound.add('endSceneMusic', { loop: true });
        this.endSceneMusic.play();
        this.gameoverVoice = this.sound.add('gameoverVoice');
        this.gameoverVoice.play();

        const text = this.add.text(width / 2, height / 2, `GAME OVER`, { fontSize: '50px', color: '#ffffff' }).setOrigin(0.5, 0.5);

        this.input.once(
            'pointerup',
            () => {
                this.scene.start('main');
                this.endSceneMusic.stop();
            },
            text
        );
    }
}
