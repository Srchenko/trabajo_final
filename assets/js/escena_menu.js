class escena_menu extends Phaser.Scene {
    constructor () {
        super('menu');
    }

    preload () {

        //  pantalla de carga por si tardan en cargar los archivos
        let cargando = this.add.graphics({
            fillStyle: {
                color: 0xff7f27
            }
        })

        this.load.on('progress', (porcentaje) => {
            cargando.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * porcentaje, 50);
        })

        //  un plugin para escribir mejor un texto
        this.load.plugin('rexbbcodetextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js', true);

        // se cargan las imágenes
        this.load.image('boton_creditos', 'assets/images/boton_creditos.png');
        this.load.image('boton_play', 'assets/images/boton_play.png');
        this.load.image('menu_principal', 'assets/images/menu_principal.png');
        this.load.image('creditos', 'assets/images/creditos.png');
        this.load.image('boton_volver', 'assets/images/boton_volver.png');
        this.load.image('sky', 'assets/images/sky.png');
        this.load.image('ground', 'assets/images/platform.png');
        this.load.image('ground2', 'assets/images/platform2.png');
        this.load.image('star', 'assets/images/star.png');
        this.load.image('star2', 'assets/images/star2.png');
        this.load.image('bomb', 'assets/images/bomb.png');
        this.load.image('fondo_perdiste', 'assets/images/fondo_perdiste.png');
        this.load.image('pibefront', 'assets/images/pibefront.png');

        //  se cargan las imágenes de los spritesheets y se divide cada sub-imagen formando un arreglo
        this.load.spritesheet('pibeleft', 'assets/images/pibeleft.png', { frameWidth: 122.22, frameHeight: 122});
        this.load.spritesheet('piberight', 'assets/images/piberight.png', { frameWidth: 122.22, frameHeight: 122});

        //  se cargan los archivos de audio
        this.load.audio('pick_coin', 'assets/audio/Pickup_Coin.mp3');
        this.load.audio('sonido_escopeta', 'assets/audio/sonido_escopeta.mp3');
        
        //  esto sirve para dar una pantalla de carga más fluida y no tan molesta de ver
        for (let i = 0; i < 250; i++) {
            this.load.image('fondo_perdiste'+i, 'assets/images/fondo_perdiste.png');
        }
    }

    create () {
        //  Our player animations, turning, walking left and walking right.
        //  si el jugador está en el aire, no tiene por qué caminar, se agregan otras 2 animaciones
        this.anims.create({
            key: 'left_air',
            frames: [ { key: 'pibeleft', frame: 0} ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right_air',
            frames: [ { key: 'piberight', frame: 0} ],
            frameRate: 20
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('pibeleft', { start: 0, end: 8 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'pibefront'} ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('piberight', { start: 0, end: 8 }),
            frameRate: 12,
            repeat: -1
        });

        //  se crea el menú principal y los creditos (estos escondidos para verlos después)
        //  se agregan variables en los botones para luego interactuar con ellos
        //  se agregan sombras a los textos para que el usuario se de cuenta que puede interactuar con ellos

        this.add.image(0, 0, 'menu_principal').setOrigin(0);

        let sombra_play = this.add.image(config.width / 2 + 3, config.height / 2 - 47, 'boton_play');
        sombra_play.visible = false;
        sombra_play.tint = 0x000000;
        sombra_play.alpha = 0.6;
        let boton_play = this.add.image(config.width / 2 , config.height / 2 - 50, 'boton_play');

        let sombra_creditos = this.add.image(config.width / 2 + 3, config.height / 2 + 53, 'boton_creditos');
        sombra_creditos.visible = false;
        sombra_creditos.tint = 0x000000;
        sombra_creditos.alpha = 0.6;
        let boton_creditos = this.add.image(config.width / 2, config.height / 2 + 50, 'boton_creditos');

        let creditos = this.add.image(config.width / 2 , config.height / 2, 'creditos');
        creditos.visible = false;

        let sombra_volver = this.add.image(config.width / 2 + 3, config.height / 2 + 123, 'boton_volver');
        sombra_volver.visible = false;
        sombra_volver.tint = 0x000000;
        sombra_volver.alpha = 0.6;
        let boton_volver = this.add.image(config.width / 2 , config.height / 2 + 120, 'boton_volver');
        boton_volver.visible = false;

        //  texto para los créditos con partes en negrita, normal y diferentes tamaños
        let text_credits_bold = '[size=20]Juego creado por[/size]\n[size=24][b]Phaser Tutorials[/b][/size]\n\n[size=20]Juego modificado por[/size]\n[size=24][b]Sergio Bressán[/size][/b]\n\n[size=20]Sprite Sheet creado por[/size]\n[size=24][b]Daphne Demoet[/b][/size]';

        let text_credits = this.add.rexBBCodeText(config.width / 2 , config.height / 2 - 25, text_credits_bold, { align: 'center', fontFamily: 'Helvetica', fill: '#000', lineSpacing: 8});
        text_credits.setOrigin(0.5);
        text_credits.visible = false;

        let text_tutorial_menu = '[size=24][b]←↑→[/b]   Moverse\n\n     [b]F[/b]     Suicidarse[/size]';

        let text_tutorial = this.add.rexBBCodeText(config.width / 2 , config.height / 2 + 225, text_tutorial_menu, { align: 'center', fontFamily: 'Helvetica', fill: '#000'});
        text_tutorial.setOrigin(0.5);
        text_tutorial.visible = true;

        //  si se pone el mouse arriba de los botones, ocurre tal cosa
        //  con pointerdown es cuando se les hace click, ocurre tal cosa
        boton_play.setInteractive();
        boton_play.on('pointerover', () => {
            sombra_play.visible = true;
        })
        boton_play.on('pointerout', () => {
            sombra_play.visible = false;
        })
        boton_play.on('pointerdown', () => {
            this.scene.start('juego');
        })

        boton_creditos.setInteractive();
        boton_creditos.on('pointerover', () => {
            sombra_creditos.visible = true;
        })
        boton_creditos.on('pointerout', () => {
            sombra_creditos.visible = false;
        })
        boton_creditos.on('pointerdown', () => {
            boton_play.visible = false;
            boton_creditos.visible = false;
            creditos.visible = true;
            boton_volver.visible = true;
            text_credits.visible = true;
        })

        boton_volver.setInteractive();
        boton_volver.on('pointerover', () => {
            sombra_volver.visible = true;
        })
        boton_volver.on('pointerout', () => {
            sombra_volver.visible = false;
        })
        boton_volver.on('pointerdown', () => {
            boton_play.visible = true;
            boton_creditos.visible = true;
            creditos.visible = false;
            boton_volver.visible = false;
            sombra_volver.visible = false;
            text_credits.visible = false;
        })

        //  konami code para abrir un video super serio para reflexionar de la vida en youtube
        this.input.keyboard.createCombo('CHENKITO');

        this.input.keyboard.on('keycombomatch', () => {
            window.open('https://www.youtube.com/watch?v=V51OJr0ee6E');
        });
    }
}