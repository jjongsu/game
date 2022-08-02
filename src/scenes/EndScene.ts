import MainScene from './MainScene';

export default class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'end' });
    }

    create() {
        const life = this.add.text(16, 16, `Game Over`, { fontSize: '16px', color: '#ffffff' }).setScrollFactor(0);

        this.input.once(
            'pointerdown',
            () => {
                // 다른 씬?
                this.scene.start('main');
            },
            this
        );
    }
}
