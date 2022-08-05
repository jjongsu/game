export default class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'end' });
    }

    create() {
        const { width, height } = this.game.canvas;
        const text = this.add.text(width / 2, height / 2, `GAME OVER`, { fontSize: '50px', color: '#ffffff' }).setOrigin(0.5, 0.5);

        this.input.once('pointerup', () => this.scene.start('main'), text);
    }
}
