//main.js
content = document.getElementsByClassName("settings")[0];
buttons = content.getElementsByTagName("button");
playButton = document.getElementById("start_button");
var keys;
var tookAction;
var softDrop;
var leftDas;
var rightDas;
var das;
var showSetting = false;
var controls = {   
    "DAS": 5,
    "SDARR": 0, // Change to regular ARR later?
    "Move_Down": 'ArrowDown',
    "Move_Left": 'ArrowLeft',
    "Move_Right": 'ArrowRight',
    "Rotate_CW": 'ArrowUp',
    "Rotate_CW_Secondary": 'None',
    "Rotate_CCW": 'KeyZ',
    "Rotate_CCW_Secondary": 'None',
    "Rotate_180": 'KeyA',
    "Hold": 'ShiftLeft',
    "Hard_Drop": 'Space',
    "Reset": 'KeyR'
};

game = new Game();
gameRunning = false; //temp fix

function play() {
    das = 5; // DAS in frames
    sdARR = 0;
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
        if (showSetting) return; // If settings menu is shown do not take inputs
        keys[event.code] = true;  
        
        if (event.code == 'ArrowDown' && tookAction['ArrowDown'] !== true){
            softDrop = 0
        }
        
    }, false);

    document.addEventListener('keyup', (event) => {
        tookAction[event.code] = false;
        keys[event.code] = false;
        
        if (event.code == controls['Move_Left'] || event.code == controls['Move_Right']){
            rightDas = 0;
            leftDas = 0;
        }
    }, false);

    window.requestAnimationFrame(gameLoop);
    function gameLoop(){
        // Only carry an action if tookaction is false and event code is true. Set keydown to false after carrying out the action
        if (keys){
            if(tookAction[controls['Move_Left']] !== true && keys[controls['Move_Left']]) {game.moveLeft(); tookAction[controls['Move_Left']] = true;}
            if(tookAction[controls['Move_Right']] !== true && keys[controls['Move_Right']]) {game.moveRight(); tookAction[controls['Move_Right']] = true;}

            if(tookAction[controls['Rotate_CW']] !== true && keys[controls['Rotate_CW']]) {game.rotateCW(); tookAction[controls['Rotate_CW']] = true;}
            if(tookAction[controls['Rotate_CW_Secondary']] !== true && keys[[controls['Rotate_CW_Secondary']]]) {game.rotateCW(); tookAction[controls['Rotate_CW_Secondary']] = true;}

            if(tookAction[controls['Rotate_CCW']] !== true && keys[controls['Rotate_CCW']]) {game.rotateCCW(); tookAction[controls['Rotate_CCW']] = true;}
            if(tookAction[controls['Rotate_CCW_Secondary']] !== true && keys[controls['Rotate_CCW_Secondary']]) {game.rotateCCW(); tookAction[controls['Rotate_CCW_Secondary']] = true;}

            if(tookAction[controls['Rotate_180']] !== true && keys[controls['Rotate_180']]) {game.rotate180(); tookAction[controls['Rotate_180']] = true;}

            if(tookAction[controls['Hold']] !== true && keys[controls['Hold']]) {game.holdPiece(); tookAction[controls['Hold']] = true;}

            if(tookAction[controls['Reset']] !== true && keys[controls['Reset']]) {game.init(); tookAction[controls['Reset']] = true;}
            
            if(tookAction[controls['Hard_Drop']] !== true && keys[controls['Hard_Drop']]) {
                while(game.moveDown()){}
                game.placePiece();
                tookAction[controls['Hard_Drop']] = true;
            }
            if(keys[controls['Move_Down']]) {
                softDrop++;
                if (softDrop >= sdARR){ // 
                    if (sdARR === 0){
                        while (game.moveDown()){}
                    }
                    game.moveDown();
                    softDrop = 0; // Set reset Soft drop
                }
                
            }
            // DAS
            if(keys[controls['Move_Left']]){
                leftDas++;
                if (leftDas > rightDas && rightDas >= das){ // If DAS left is possbile but DAS right was activated later then DAS right
                    while(game.moveRight()){}
                }
                if (leftDas >= das && !keys[controls['Move_Right']]){
                    while(game.moveLeft()){}
                }
            }
            if(keys[controls['Move_Right']]){
                rightDas++;
                if (rightDas > leftDas && leftDas >= das){ // If DAS right is possible but DAS left was activated later then DAS left
                    while(game.moveLeft()){}
                }
                if (rightDas >= das && !keys[controls['Move_Left']]){
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

function load_settings(){
    controls = localStorage.getItem("controls");
    if (controls){ 
        controls = JSON.parse(controls);
    }
    else{ // If no controls are stored, use default
        controls = {   
            "DAS": 5,
            "SDARR": 0, // Change to regular ARR later?
            "Move_Down": 'ArrowDown',
            "Move_Left": 'ArrowLeft',
            "Move_Right": 'ArrowRight',
            "Rotate_CW": 'ArrowUp',
            "Rotate_CW_Secondary": 'None',
            "Rotate_CCW": 'KeyZ',
            "Rotate_CCW_Secondary": 'None',
            "Rotate_180": 'KeyA',
            "Hold": 'ShiftLeft',
            "Hard_Drop": 'Space',
            "Reset": 'KeyR'
        };
        console.log("reset to default")
    }
}

function save_settings(){
    localStorage.setItem('controls', JSON.stringify(controls)); // This is it??
}

function settings(){
    let menu = document.getElementById("settings");
    if (!showSetting){ // Show settings
        showSetting = true;
        menu.style.display = "block";
    } else{ // Close settings
        showSetting = false;
        menu.style.display = "none";
        save_settings();
    }

    // Make settings button display their current settings
    for (let k in controls){
        document.getElementsByName(k)[0].innerHTML = controls[k];
    }
    
    document.getElementById('DAS').value = controls["DAS"]; // Displays current DAS
    document.getElementById('SDARR').value = controls["SDARR"]; // Displays current SD ARR
    // When closing, make it run function that saves current control to local
    
}

function change(button){
    const changeSetting = (e) => {
        controls[button.name] = e.code;
        console.log(controls, "a");
        document.getElementsByName(button.name)[0].innerHTML = e.key;
        document.removeEventListener('keydown', changeSetting); // Remove event listener after the setting has been set
    };
    console.log(button.name);
    console.log(buttons[0]);
    document.getElementsByName(button.name)[0].innerHTML = controls[button.name];

    document.addEventListener('keydown', changeSetting, false);
    document.getElementsByName(button.name)[0].innerHTML = "enter something";
}


function on_load(){
    load_settings();
}

