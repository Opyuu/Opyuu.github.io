//main.js
var softDrop;
var leftDas;
var rightDas;


function play() {
    game = new Game();
    game.init();
    // Game loop?
    // Key down
    
    document.addEventListener('keydown', (event) => {
        game.tookAction = (game.tookAction || []);
        // Update the keys currently held 
        game.keys = (game.keys || []);
        game.keys[event.code] = true;  
        
        if (event.code == 'ArrowDown' && game.tookAction['ArrowDown'] !== true){
            softDrop = 0
        }

        if (event.code == 'ArrowLeft'){
            leftDas = 0;
        }

        if (event.code == 'ArrowRight'){
            rightDas = 0;
        }
        
      }, false);

      document.addEventListener('keyup', (event) => {
        game.tookAction[event.code] = false;
        game.keys[event.code] = false;

      }, false);

      window.requestAnimationFrame(gameLoop);
      function gameLoop(){
        softDrop = softDrop % 5;
        // Only carry an action if tookaction is false and event code is true. Set keydown to false after carrying out the action
        if (game.keys){
            if(game.tookAction['ArrowLeft'] !== true && game.keys['ArrowLeft']) {game.moveLeft(); game.tookAction['ArrowLeft'] = true;}
            if(game.tookAction['ArrowRight'] !== true && game.keys['ArrowRight']) {game.moveRight(); game.tookAction['ArrowRight'] = true;}

            if(game.tookAction['ArrowUp'] !== true && game.keys['ArrowUp']) {game.rotateCW(); game.tookAction['ArrowUp'] = true;}
            if(game.tookAction['KeyD'] !== true && game.keys['KeyD']) {game.rotateCW(); game.tookAction['KeyD'] = true;}

            if(game.tookAction['KeyS'] !== true && game.keys['KeyS']) {game.rotateCCW(); game.tookAction['KeyS'] = true;}
            if(game.tookAction['KeyZ'] !== true && game.keys['KeyZ']) {game.rotateCCW(); game.tookAction['KeyZ'] = true;}

            if(game.tookAction['ShiftLeft'] !== true && game.keys['ShiftLeft']) {game.holdPiece(); game.tookAction['ShiftLeft'] = true;}

            if(game.tookAction['Space'] !== true && game.keys['Space']) {
                while(game.moveDown()){game.moveDown()}
                game.placePiece();
                game.tookAction['Space'] = true;
            }
            if(game.keys['ArrowDown']) {
                if (softDrop == 0){
                    game.moveDown();
                    game.tookAction['ArrowDown'] = true;
                }
                softDrop++;
            }
            if(game.keys['ArrowLeft']){
                leftDas++;
                if (leftDas >= 6){
                    game.moveLeft();
                    game.moveLeft();
                    game.moveLeft();
                    game.moveLeft();
                    game.moveLeft();
                    game.moveLeft();
                    game.moveLeft();
                    game.moveLeft();
                    game.moveLeft();
                    game.moveLeft();
                    game.moveLeft();
                    game.moveLeft();
                }
            }

            if(game.keys['ArrowRight']){
                rightDas++;
                if (rightDas >= 6){
                    game.moveRight();
                    game.moveRight();
                    game.moveRight();
                    game.moveRight();
                    game.moveRight();
                    game.moveRight();
                    game.moveRight();
                    game.moveRight();
                    game.moveRight();
                    game.moveRight();
                    game.moveRight();
                    game.moveRight();

                }
            }
        }
        game.update_render();
        window.requestAnimationFrame(gameLoop);
      }

      // Key up
      
    
    
}
