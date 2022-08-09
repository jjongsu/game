import Player from '../Player';
import Projectile from '../Player/Projectile';

export default class BonusScene extends Phaser.Scene {
    Player!: Player;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    question!: Phaser.GameObjects.Text;
    Projectile!: Projectile;

    constructor() {
        super({ key: 'bonus' });
    }

    preload() {
        // background
        this.load.image('background2', `sky.png`);

        // airplane
        const images = 'assets/images';
        this.load.atlas('airplane', `${images}/airplane.png`, `${images}/airplane.json`);

        // font
        this.loadFont('questionFont', 'assets/questionFont.ttf');

        // bomb
        this.load.image('bomb', `./bomb.png`);

        // missile
        this.load.audio('missile', 'assets/sounds/attackSound.mp3');

        // result sound
        this.load.audio('failure', 'assets/sounds/fail.mp3');
        this.load.audio('success', 'assets/sounds/success.mp3');
    }

    create() {
        const { width } = this.game.canvas;

        // background
        this.add.image(0, 0, 'background2').setScale(2, 2).setOrigin(0, 0);

        // PLAYER
        this.Player = new Player({ scene: this });
        this.Player.create({ projectile: false });

        this.cursors = this.input.keyboard.createCursorKeys();

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
            const bombImg = this.add.image((width * (i + 1)) / 4, 200, 'bomb').setScale(3);
            const bombText = this.add.text((width * (i + 1)) / 4, 200, el.text, { fontFamily: 'questionFont', fontSize: '25px', color: '#ffffff' }).setOrigin(0.5);
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
        });
    }

    update() {
        // PLAYER
        if (this.cursors.left.isDown) {
            this.Player.player.body.velocity.x = -700;
        } else if (this.cursors.right.isDown) {
            this.Player.player.body.velocity.x = 700;
        } else {
            this.Player.player.body.velocity.x = 0;
        }

        if (this.cursors.up.isDown) {
            this.Player.player.body.velocity.y = -700;
        } else if (this.cursors.down.isDown) {
            this.Player.player.body.velocity.y = 700;
        } else {
            this.Player.player.body.velocity.y = 0;
        }

        // IMAGE
        this.Player.player.anims.play('hold', true);
        this.cursors.left.isDown && this.Player.player.anims.play('left', true);
        this.cursors.right.isDown && this.Player.player.anims.play('right', true);
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
