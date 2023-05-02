//main.js

var keys;
var tookAction;
var softDrop;
var leftDas;
var rightDas;
var das;

game = new Game();
gameRunning = false; //temp fix

function play() {
    das = 5; // DAS in frames
    leftDas = 0;
    rightDas = 0;
    game.init();
    // Game loop?
    // Key down
    if (gameRunning == true){return;}
    gameRunning = true;


    document.addEventListener('keydown', (event) => {
        event.preventDefault();
        tookAction = (tookAction || []);
        // Update the keys currently held 
        keys = (keys || []);
        keys[event.code] = true;  
        
        if (event.code == 'ArrowDown' && tookAction['ArrowDown'] !== true){
            softDrop = 0
        }

        if (event.code == 'ArrowLeft'){
            //leftDas = 0;
        }

        if (event.code == 'ArrowRight'){
            //rightDas = 0;
        }
        
    }, false);

    document.addEventListener('keyup', (event) => {
        tookAction[event.code] = false;
        keys[event.code] = false;
        
        if (event.code == 'ArrowLeft'){
            rightDas = 0;
            leftDas = 0;
        }

        if (event.code == 'ArrowRight'){
            leftDas = 0;
            rightDas = 0;
        }
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

            if(tookAction['KeyR'] !== true && keys['KeyR']) {game.init(); tookAction['KeyR'] = true;}
            
            if(tookAction['Space'] !== true && keys['Space']) {
                while(game.moveDown()){}
                game.placePiece();
                tookAction['Space'] = true;
            }
            if(keys['ArrowDown']) {
                if (softDrop == 0){
                    while(game.moveDown()){};
                    tookAction['ArrowDown'] = true;
                }
                softDrop+=20;
            }
            // DAS
            if(keys['ArrowLeft']){
                leftDas++;
                if (leftDas > rightDas && rightDas >= das){ // If DAS left is possbile but DAS right was activated later then DAS right
                    while(game.moveRight()){}
                }
                if (leftDas >= das && !keys['ArrowRight']){
                    while(game.moveLeft()){}
                }
            }
            if(keys['ArrowRight']){
                rightDas++;
                if (rightDas > leftDas && leftDas >= das){ // If DAS right is possible but DAS left was activated later then DAS left
                    while(game.moveLeft()){}
                }
                if (rightDas >= das && !keys['ArrowLeft']){
                    while(game.moveRight()){}
                }
            }


            // Expected behaviour: When left is held for more than 5 frames, das
            // When DAS is activated, pressing right will move mino right anyway, ignore das & do not(?) reset DAS timer
            // When left DAS is activated, DAS right will still activate witohut DAS left being cancelled
        }
        game.update_render();
        window.requestAnimationFrame(gameLoop);
    }
    // Key up
    return;
}


function settings(){
    
}