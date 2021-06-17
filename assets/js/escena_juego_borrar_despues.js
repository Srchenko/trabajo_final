class escena_juego extends Phaser.Scene {
    constructor () {
        super('juego');
    }

    create () {
        //  A simple background for our game
        this.add.image(400, 300, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(400, 175, 'ground2').setScale(0.5).refreshBody();

        //  Now let's create some ledges
        platforms.create(600, 425, 'ground');
        platforms.create(50, 325, 'ground');
        platforms.create(750, 300, 'ground');

        arreglo = platforms.getChildren()[1];

        // The player and its settings
        player = this.physics.add.sprite(100, 450, 'pibefront').setScale(0.6);

        //  Player physics properties. Give the little guy a slight bounce.
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        //  Input Events
        if (cursors =! undefined){
            cursors = this.input.keyboard.createCursorKeys();
        }

        if (salto_personaje =! undefined){
            salto_personaje = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        }

        //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        // otras estrellas más copadas
        stars2 = this.physics.add.group({
            key: 'star2',
            repeat: 4,
            setXY: { x: 47, y: 0, stepX: 140 }
        });

        stars.children.iterate(function (child) {
            //  Give each star a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        stars2.children.iterate(function (child) {
            child.setBounceY(1);
            child.setScale(0.07);
        });

        bombs = this.physics.add.group();

        //  The score
        scoreText = this.add.text(16, 550, 'Puntitos: 0', { fontFamily: 'Arial Black', fontSize: '36px', fill: '#F00', stroke: '#000000', strokeThickness: 6 });
        
        //  esto es para que las estrellas sigan el movimiento de una plataforma si esas estrellas reposan en esa plataforma
        stars.children.iterate(function (child) {
            this.physics.add.collider(child, arreglo, this.moverConPlataforma, null, this);
        }, this);
        stars2.children.iterate(function (child) {
            this.physics.add.collider(child, arreglo, this.moverConPlataforma, null, this);
        }, this);

        //  Collide the player and the stars with the platforms
        //  esto es para que el jugador siga el movimiento de una plataforma si ese mismo jugador reposa en esa plataforma
        this.physics.add.collider(player, arreglo, this.moverConPlataforma, null, this);

        //  si el jugador toca alguna plataforma, solo puede saltar desde ella y de ningún otro elemento
        this.physics.add.collider(player, platforms, this.tocaPlataforma, null, this);

        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(stars2, platforms);
        this.physics.add.collider(bombs, platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(player, stars, this.collectStar, null, this);
        this.physics.add.overlap(player, stars2, this.collectStar, null, this);

        this.physics.add.collider(player, bombs, this.hitBomb, null, this);

        //  texto del tiempo que lleva el usuario jugando
        text_tiempo = this.add.text(784, 595, 'Tiempito: 00:00', { fontFamily: 'Arial Black', fontSize: '36px', fill: '#F00', stroke: '#000000', strokeThickness: 6 });
        text_tiempo.setOrigin(1);

        //  sonido cuando se junta una estrella
        pick_coin = this.sound.add('pick_coin', {volume: 0.01});

        //  sonido cuando el personaje se suicida
        sonido_escopeta = this.sound.add('sonido_escopeta', {volume: 0.4});

        //  checkea si el usuario presionó la tecla f
        this.input.keyboard.on('keydown-F', () => {
            tecla_f = true;
            return;
        })

        //  imagen y texto cuando se pierde el juego, son invisibles mientras se juega
        endgame = this.add.image(400, 300, 'fondo_perdiste');
        endgame.alpha = 0.9;
        endgame.visible = false;

        text_endgame = this.add.text(0, 0, 'Perdiste.\n\nPulsá\ncualquier tecla\npara reiniciar.', { align: 'center', fontFamily: 'Arial Black', fontSize: '36px', fill: '#000'});
        text_endgame.setOrigin(0.5);
        text_endgame.setX(endgame.getCenter().x);
        text_endgame.setY(endgame.getCenter().y);
        text_endgame.visible = false;
    }

    update (time, delta) {
        
        if (gameOver)
        {
            //  para saber si se pulsa cualquier tecla al perder el juego
            this.input.keyboard.on('keydown', () => {
                tecla_reinicio = true;
                return;
            });

            espera_un_segundo_capo += delta;

            //  el reinicio del juego no es inmediato apenas aparece el cartel de derrota, dando tiempo al jugador de leer y/o darse cuenta que hay un cartel dando indicaciones
            //  se comprueban teclas presionadas y tiempo transcurrido para reiniciar el juego luego de perder
            if (espera_un_segundo_capo < 750){
                tecla_reinicio = false;
            }
            else{
                if(tecla_reinicio){
                    this.registry.destroy();
                    this.events.off();
                    this.scene.restart();

                    gameOver = false;

                    score = 0;
                    cambio = false;

                    endgame.visible = false;
                    text_endgame.visible = false;
                    tecla_reinicio = false;

                    tiempo_transcurrido_frames = 0;
                    tiempo_transcurrido_segundos = 0;
                    espera_un_segundo_capo = 0;

                    tecla_f = false;
                }
            }
            return;
        }

        //  si presionás la tecla f, te suicidás, nunca había sido tan fácil
        //  se usa mayoritariamente para el testeo del game over de manera rápida sin esperar a que una bomba choque con el jugador

        if(tecla_f){
            this.gameOverFunction();
            player.anims.play('turn');
            tecla_f = false;
            if(player.x <= 75){
                player.setOrigin(0, 1)
                player.angle = 90;
            }
            else{
                player.setOrigin(1, 1);
                player.angle = -90;
            }
            sonido_escopeta.play();
            return;
        }

        //  se hace un temporizador comparando el framerate, en este caso hay 60 fps, por lo cual hay 16.66666 milisegundos, pero el código sirve para que acepte mayor/menor framerate también
        //  cada vez que los frames llegan a 1000, se agrega 1 segundo
        tiempo_transcurrido_frames += delta;
        if(tiempo_transcurrido_frames >= 1000){
            tiempo_transcurrido_segundos ++;
            tiempo_transcurrido_frames -= 1000;
            this.actualizarTemporizador(tiempo_transcurrido_segundos);
        }

        if (cursors.left.isDown && player.body.touching.down)
        {
            player.setVelocityX(-160);

            player.anims.play('left', true);
            player.setSize(100, 117, true);
        }
        else{
            if(cursors.left.isDown && !player.body.touching.down){
                player.setVelocityX(-160);

                player.anims.play('left_air', true);
                player.setSize(100, 117, true);
            }
            else{
                if(cursors.right.isDown && player.body.touching.down){
                    player.setVelocityX(160);

                    player.anims.play('right', true);
                    player.setSize(100, 117, true);
                }
                else{
                    if(cursors.right.isDown && !player.body.touching.down){
                        player.setVelocityX(160);

                        player.anims.play('right_air', true);
                        player.setSize(100, 117, true);
                    }
                    else{
                        player.setVelocityX(0);

                        player.anims.play('turn');
                        player.setSize(63, 117, true);
                    }

                }
            }

        }

        //  un bloque se moverá de izquierda a derecha y viceversa constantemente en una parte de la pantalla, la variable cambio indicará para qué lado debe moverse el bloque
        if(arreglo.x < 550 && !cambio){
            arreglo.x += movimiento_plataforma;
            arreglo.refreshBody();
            if(arreglo.x >= 550){
                cambio = true;
            }
        }
        else{
            if(arreglo.x > 250 && cambio){
                arreglo.x -= movimiento_plataforma;
                arreglo.refreshBody();
                if(arreglo.x <= 250){
                    cambio = false;
                }
            }
        }

    }

    tocaPlataforma (player, platforms) {
        this.saltarEnPlataforma();
    }
    
    //  se calculan los minutos y segundos para el temporizador
    actualizarTemporizador (segundosTotales) {
    
        minutos = parseInt(segundosTotales/60);
        segundos = segundosTotales-(minutos*60);
    
        text_tiempo.setText('Tiempito: ' + this.tiempoDosDigitos(minutos) + ':' + this.tiempoDosDigitos(segundos));
    }
    
    //  se intenta que los números siempre queden en dos dígitos, por ej 00, 05, 09, 12, 50
    tiempoDosDigitos (numero) {
        if(numero < 10){
            return '0' + numero;
        }
        else{
            return '' + numero;
        }
    }
    
    moverConPlataforma (pibe, arreglo) {
        if(pibe.body.touching.down && !cambio){
            pibe.x += movimiento_plataforma;
        }
        else{
            if(pibe.body.touching.down && cambio){
                pibe.x -= movimiento_plataforma;
            }
        }
        if(pibe == player){
            this.saltarEnPlataforma();
        }
    }
    
    //  evita que el jugador salte en estrellas
    saltarEnPlataforma () {
        if (Phaser.Input.Keyboard.JustDown(salto_personaje) && player.body.touching.down)
        {
            player.setBounce(0);
            player.setVelocityY(-375);
        }
    }
    
    collectStar (player, star) {
        star.disableBody(true, true);
    
        //  se reproduce sonido al juntar estrella
        pick_coin.play();
    
        //  Add and update the score
        if(star.texture.key == 'star2'){
            score += 15;
        }
        else{
            score += 10;
        }
        scoreText.setText('Puntitos: ' + score);
    
        let ancho = 12
        let ancho2 = 47
        if (stars.countActive(true) === 0 && stars2.countActive(true) === 0)
        {
            //  A new batch of stars to collect
            stars.children.iterate(function (child) {
                child.enableBody(true, ancho, 0, true, true);
                ancho = ancho + 70;
            });
    
            stars2.children.iterate(function (child) {
                child.enableBody(true, ancho2, 0, true, true);
                ancho2 = ancho2 + 140;
            });
    
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    
            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }
    }
    
    hitBomb (player, bomb) {
        this.gameOverFunction();
    }

    gameOverFunction(){
        this.physics.pause();
    
        player.setTint(0xff0000);

        player.anims.stop();

        endgame.visible = true;
        text_endgame.visible = true;
        this.children.bringToTop(endgame);
        this.children.bringToTop(text_endgame);

        gameOver = true;
    }
}