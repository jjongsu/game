import Player from '../Player';
import Projectile from '../Player/Projectile';
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js';

export default class BonusScene extends Phaser.Scene {
    Player!: Player;
    cursors!:
        | Phaser.Types.Input.Keyboard.CursorKeys
        | { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
    question!: Phaser.GameObjects.Text;
    Projectile!: Projectile;
    bonusSceneMusic!: Phaser.Sound.BaseSound;
    joyStick!: VirtualJoystick;
    detect!: 'desktop' | 'mobile';
    attackButton!: Phaser.GameObjects.Image;
    constructor() {
        super({ key: 'bonus' });
    }

    preload() {
        const images = 'assets/images';

        // background
        this.load.image('background2', `${images}/bonusBackgroundImg.jpg`);

        // question background
        this.load.image('questionBackground', `${images}/questionBackground.png`);

        // mobile attack button
        this.load.image('button', `${images}/button.png`);

        // airplane
        this.load.atlas('airplane', `${images}/airplane.png`, `${images}/airplane.json`);

        // font
        this.loadFont('questionFont', 'assets/questionFont.ttf');

        // bomb
        this.load.image('bomb', `./bomb.png`);
        this.load.image('choiceBackground', `${images}/choiceBackground.png`);

        // missile
        this.load.audio('missile', 'assets/sounds/attackSound.mp3');

        // result sound
        this.load.audio('failure', 'assets/sounds/fail.mp3');
        this.load.audio('success', 'assets/sounds/success.mp3');

        // background music
        this.load.audio('bonusSceneMusic', 'assets/sounds/bonusSceneMusic.mp3');
    }

    create() {
        const { width, height } = this.game.canvas;

        // BACKGROUND MUSIC
        this.bonusSceneMusic = this.sound.add('bonusSceneMusic', { loop: true });
        this.bonusSceneMusic.play();

        // background
        this.add.image(0, 0, 'background2').setScale(0.6, 0.6).setOrigin(0, 0);
        this.add
            .image(width / 2, 22, 'questionBackground')
            .setScale(0.3, 0.3)
            .setOrigin(0.5, 0);

        // PLAYER
        this.Player = new Player({ scene: this });
        this.Player.create({ projectile: false });

        // detect mobile or desktop
        if (this.sys.game.device.os.desktop) {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.detect = 'desktop';
        } else {
            // joystick
            this.joyStick = new VirtualJoystick(this, {
                x: width - 100,
                y: height - 100,
                radius: 100,
                base: this.add.circle(0, 0, 100, 0x888888),
                thumb: this.add.circle(0, 0, 50, 0xcccccc)
            });
            this.cursors = this.joyStick.createCursorKeys();
            this.detect = 'mobile';
            this.attackButton = this.add
                .image(70, height - 70, 'button')
                .setScale(0.2, 0.2)
                .setOrigin(0.5, 0.5)
                .setInteractive()
                .on('pointerdown', () => {
                    missile.play();
                    this.Projectile.create({ player: this.Player });
                });
        }

        // question
        const a = Phaser.Math.Between(1, 9);
        const b = Phaser.Math.Between(1, 9);

        this.add.text(16, 16, `Question`, { fontSize: '16px', color: '#ffffff' });
        this.question = this.add.text(width / 2, 65, `${a} + ${b} = ??`, { fontFamily: 'questionFont', fontSize: '50px', color: '#ffffff' }).setOrigin(0.5);

        // bomb
        const choice = [
            { text: `${a}${b}`, answer: false },
            { text: `${a + b}`, answer: true },
            { text: `${a + b + 1}`, answer: false }
        ].sort(() => Math.random() - 0.5);
        const choiceG = this.physics.add.group();
        choice.map((el, i: number) => {
            const bombImg = this.add.image((width * (i + 1)) / 4, 196, 'choiceBackground').setScale(0.15);
            const bombText = this.add
                .text((width * (i + 1)) / 4, 200, el.text, { fontFamily: 'questionFont', fontSize: '25px', color: '#ffffff' })
                .setOrigin(0.5);
            bombImg.setData({ text: bombText, answer: el.answer });
            choiceG.add(bombImg);
        });

        // missile
        this.Projectile = new Projectile({ scene: this });
        const missile = this.sound.add('missile');
        this.input.keyboard.on('keydown-SPACE', () => {
            missile.play();
            this.Projectile.create({ player: this.Player });
        });

        // crash bomb - missile
        this.physics.add.overlap(this.Projectile.projectiles, choiceG, async (projectile, choice) => {
            const answer = choice.getData('answer');

            if (answer) {
                // 정답
                const result = this.sound.add('success');
                result.play();
            } else {
                // 오답
                const result = this.sound.add('failure');
                result.play();
            }

            projectile.destroy();
            choice.getData('text').destroy();
            choice.destroy();

            await new Promise((resolve) => setTimeout(resolve, 1000));
            this.scene.stop();
            this.scene.resume('main', { answer });
            this.bonusSceneMusic.stop();
        });
    }

    update() {
        // this.Player.update({ cursors: this.cursors, os: this.detect });
        this.Player.update({ cursors: this.cursors });
    }

    // font
    loadFont(name: string, url: any) {
        var newFont = new FontFace(name, `url(${url})`);
        newFont
            .load()
            .then(function (loaded) {
                // @ts-ignore
                document.fonts.add(loaded);
            })
            .catch(function (error) {
                return error;
            });
    }
}
