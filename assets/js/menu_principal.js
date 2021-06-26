class Menu_Principal extends Phaser.Scene {

  constructor () {

    super('menu_principal');

  }

  preload () {

    

  }

  create (){

    //  se cargan animaciones del jugador y de los enemigos
    this.agregarAnimaciones();
    
    this.add.image(0, 0, 'menu_principal').setOrigin(0);

    //  se asignan variables a los botones para usarlos luego
    let jugar = this.add.image(config.width / 2 , config.height / 2 - 200, 'boton_jugar');
    let creditos = this.add.image(config.width / 2 , config.height / 2, 'boton_creditos');

    //  texto con un mini-tutorial de cómo funciona el juego
    let tutorial_menu = '[b]CONTROLES:[/b]\n[b]Flechas:[/b] Saltar, moverse izquierda/derecha\n[b]Barra espaciadora:[/b] Disparar';
    let tutorial = this.add.rexBBCodeText(config.width / 2 , config.height / 2 + 225, tutorial_menu, { align: 'center', fontFamily: 'Helvetica', fill: '#000', fontSize: '22px', lineSpacing: 8});
    tutorial.setOrigin(0.5);

    let puntuaciones = '[b]Puntuación Máxima Nivel 1: [/b]' + puntuacion_maxima_definitiva[0] + ' puntos\n[b]Puntuación Máxima Nivel 2: [/b]' + puntuacion_maxima_definitiva[1] + ' puntos';
    let puntuaciones_max = this.add.rexBBCodeText(config.width / 2 , config.height / 2 + 375, puntuaciones, { align: 'center', fontFamily: 'Helvetica', fill: '#000', fontSize: '25px', lineSpacing: 8});
    puntuaciones_max.setOrigin(0.5);

    //  se agrega una imagen de inicio que luego desaparecerá presionando una tecla o haciendo click
    imagen_inicio = this.add.image(0, 0, 'pantalla_inicio').setOrigin(0);

    imagen_inicio.setInteractive();
    this.input.keyboard.on('keydown', () => {
      presiona_cualquier_tecla = true;
      return;
    });
    imagen_inicio.on('pointerdown', () => {
      presiona_cualquier_tecla = true;
    });

    if(musica == undefined){

      musica = this.sound.add('musica_menu_principal', {volume: 0.2, loop: true});

    }

    sonido_interactuar_mouse = this.sound.add('interactuar_mouse', {volume: 0.5});
    //  los botones de jugar y créditos se hacen interactivos
    //  hacen diferentes cosas dependiendo si se pasa el mouse por encima o se lo quita, y también cuando se les hace click se abren las escenas correspondientes
    jugar.setInteractive();
    creditos.setInteractive();

    jugar.on('pointerover', () => {
        jugar.setTint(0x0000ff);
    })
    jugar.on('pointerout', () => {
        jugar.setTint(0xffffff);
    })
    jugar.on('pointerdown', () => {
      if(!imagen_inicio.visible){

        musica.stop();
        sonido_interactuar_mouse.play();

        if(nivel_uno_jugado){

          this.scene.start('nivel_1');

        }
        else{
          
          this.scene.start('nivel_2');

        }

      }
    })

    creditos.on('pointerover', () => {
      creditos.setTint(0x0000ff);
    })
    creditos.on('pointerout', () => {
      creditos.setTint(0xffffff);
    })
    creditos.on('pointerdown', () => {
      if(!imagen_inicio.visible){

        sonido_interactuar_mouse.play();
        this.scene.start('creditos');

      }
    })

    window.focus();
  }

  update(time, delta){

    //  al presionarse cualquier tecla o botón del mouse, empieza la música y se deja de ver la imagen de inicio
    if(imagen_inicio.visible && presiona_cualquier_tecla){

      if(!musica.isPlaying){
        musica.play();
      }
      imagen_inicio.visible = false;
      
    }

  }

  agregarAnimaciones(){

    this.anims.create({

      key: 'robot_derecha',
      frames: this.anims.generateFrameNumbers('robot', { start: 0, end: 1 }),
      frameRate: 15,
      repeat: -1

    })

    this.anims.create({

      key: 'robot_izquierda',
      frames: this.anims.generateFrameNumbers('robot', { start: 2, end: 3 }),
      frameRate: 15,
      repeat: -1

    })

    this.anims.create({

      key: 'perdio_jugador',
      frames: this.anims.generateFrameNumbers('jugador_perder', { start: 0, end: 23 }),
      frameRate: 10,
      repeat: 0

    })

    this.anims.create({

      key: 'derecha',
      frames: this.anims.generateFrameNumbers('jugador_movimiento', { start: 0, end: 9 }),
      frameRate: 12,
      repeat: -1

    });

    this.anims.create({

      key: 'izquierda',
      frames: this.anims.generateFrameNumbers('jugador_movimiento', { start: 10, end: 19 }),
      frameRate: 12,
      repeat: -1

    });

    this.anims.create({

      key: 'derecha_aire',
      frames: [ { key: 'jugador_movimiento', frame: 22} ],
      frameRate: 12

    });

    this.anims.create({

      key: 'izquierda_aire',
      frames: [ { key: 'jugador_movimiento', frame: 23} ],
      frameRate: 12

    });

    this.anims.create({

      key: 'derecha_suelo',
      frames: [ { key: 'jugador_movimiento', frame: 20} ],
      frameRate: 12

    });

    this.anims.create({

      key: 'izquierda_suelo',
      frames: [ { key: 'jugador_movimiento', frame: 21} ],
      frameRate: 12

    });

    this.anims.create({

      key: 'dron_movimiento',
      frames: this.anims.generateFrameNumbers('dron_animacion', { start: 0, end: 1 }),
      frameRate: 12,
      repeat: -1

    });

  }

}