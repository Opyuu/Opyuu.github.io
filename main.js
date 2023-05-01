//main.js

var keys;
var tookAction;
var softDrop;
var leftDas;
var rightDas;

game = new Game();
gameRunning = false; //temp fix

function play() {
    game.init();
    // Game loop?
    // Key down
    if (gameRunning == true){return;}
    gameRunning = true;


    document.addEventListener('keydown', (event) => {
        tookAction = (tookAction || []);
        // Update the keys currently held 
        keys = (keys || []);
        keys[event.code] = true;  
        
        if (event.code == 'ArrowDown' && tookAction['ArrowDown'] !== true){
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
        tookAction[event.code] = false;
        keys[event.code] = false;
    }, false);

    window.requestAnimationFrame(gameLoop);
    function gameLoop(){
        softDrop = softDrop % 5;
        // Only carry an action if tookaction is false and event code is true. Set keydown to false after carrying out the action
        if (keys){
            if(tookAction['ArrowLeft'] !== true && keys['ArrowLeft']) {game.moveLeft(); tookAction['ArrowLeft'] = true;}
            if(tookAction['ArrowRight'] !== true && keys['ArrowRight']) {game.moveRight(); tookAction['ArrowRight'] = true;}

            if(tookAction['ArrowUp'] !== true && keys['ArrowUp']) {game.rotateCW(); tookAction['ArrowUp'] = true;}
            if(tookAction['KeyD'] !== true && keys['KeyD']) {game.rotateCW(); tookAction['KeyD'] = true;}

            if(tookAction['KeyS'] !== true && keys['KeyS']) {game.rotateCCW(); tookAction['KeyS'] = true;}
            if(tookAction['KeyZ'] !== true && keys['KeyZ']) {game.rotateCCW(); tookAction['KeyZ'] = true;}

            if(tookAction['KeyA'] !== true && keys['KeyA']) {game.rotate180(); tookAction['KeyA'] = true;}

            if(tookAction['ShiftLeft'] !== true && keys['ShiftLeft']) {game.holdPiece(); tookAction['ShiftLeft'] = true;}

            if(tookAction['Space'] !== true && keys['Space']) {
                while(game.moveDown()){}
                game.placePiece();
                tookAction['Space'] = true;
            }
            if(keys['ArrowDown']) {
                if (softDrop == 0){
                    game.moveDown();
                    tookAction['ArrowDown'] = true;
                }
                softDrop+=20;
            }
            //sob wtf
            if(keys['ArrowLeft']){
                leftDas++;
                if (leftDas >= 5){
                    while(game.moveLeft()){}
                }
            }
            if(keys['ArrowRight']){
                rightDas++;
                if (rightDas >= 5){
                    while(game.moveRight()){}
                }
            }
        }
        game.update_render();
        window.requestAnimationFrame(gameLoop);
    }
    // Key up
    return;
}
