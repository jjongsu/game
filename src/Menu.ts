export default class Menu {
    [x: string]: any;
    scene!: Phaser.Scene;
    constructor() {
        {
            ('menu');
        }
    }
    preload() {
        this.load.image('star', 'star.png');
    }
    create() {
        console.log('%c MainMenu ', 'background: green; color: white; display: block;');

        const star = this.add.image(0, 0, 'star');

        star.once(
            'pointerup',
            function () {
                this.scene.start('game');
            },
            this
        );
    }
}
