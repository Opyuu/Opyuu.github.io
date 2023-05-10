//main.js
content = document.getElementsByClassName("settings")[0];
buttons = content.getElementsByTagName("button");
playButton = document.getElementById("start_button");
var clearTextTimeout;
var clearPCTimeout;
var clearComboTimeout;
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
        
        if (event.code == controls['Move_Down'] && tookAction[controls['Move_Down']] !== true){
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
            // Hard drop first
            if(tookAction[controls['Hard_Drop']] !== true && keys[controls['Hard_Drop']]) { 
                while(game.moveDown()){}
                game.placePiece();
                tookAction[controls['Hard_Drop']] = true;
            }
            // Hold Second
            if(tookAction[controls['Hold']] !== true && keys[controls['Hold']]) {game.holdPiece(); tookAction[controls['Hold']] = true;}

            // Soft Drop Thirds
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

            // DAS fourth
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

            // Movement 
            if(tookAction[controls['Move_Left']] !== true && keys[controls['Move_Left']]) {game.moveLeft(); tookAction[controls['Move_Left']] = true;}
            if(tookAction[controls['Move_Right']] !== true && keys[controls['Move_Right']]) {game.moveRight(); tookAction[controls['Move_Right']] = true;}

            if(tookAction[controls['Rotate_CW']] !== true && keys[controls['Rotate_CW']]) {game.rotateCW(); tookAction[controls['Rotate_CW']] = true;}
            if(tookAction[controls['Rotate_CW_Secondary']] !== true && keys[[controls['Rotate_CW_Secondary']]]) {game.rotateCW(); tookAction[controls['Rotate_CW_Secondary']] = true;}

            if(tookAction[controls['Rotate_CCW']] !== true && keys[controls['Rotate_CCW']]) {game.rotateCCW(); tookAction[controls['Rotate_CCW']] = true;}
            if(tookAction[controls['Rotate_CCW_Secondary']] !== true && keys[controls['Rotate_CCW_Secondary']]) {game.rotateCCW(); tookAction[controls['Rotate_CCW_Secondary']] = true;}

            if(tookAction[controls['Rotate_180']] !== true && keys[controls['Rotate_180']]) {game.rotate180(); tookAction[controls['Rotate_180']] = true;}

            
            if(tookAction[controls['Reset']] !== true && keys[controls['Reset']]) {game.init(); tookAction[controls['Reset']] = true;}
            
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
    if (Object.keys(controls).length !== 0){ 
        controls = JSON.parse(controls);
        console.log("loaded controls")
    }
    else{ // If no controls are stored, use default
        console.log("Default controls used")
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
        e.preventDefault();
        
        if (Object.values(controls).includes(e.code)){
            if(e.code == controls[button.name]){
                controls[button.name] = e.code;
                document.getElementsByName(button.name)[0].innerHTML = e.code;
                document.removeEventListener('keydown', changeSetting); // Remove event listener after the setting has been set
                return;
            }
            document.getElementsByName(button.name)[0].innerHTML = "That key is already used";

        }
        else{
            controls[button.name] = e.code;
            document.getElementsByName(button.name)[0].innerHTML = e.code;
            document.removeEventListener('keydown', changeSetting); // Remove event listener after the setting has been set
            return;
        }
        
    };

    document.getElementsByName(button.name)[0].innerHTML = controls[button.name];

    document.addEventListener('keydown', changeSetting, false);
    document.getElementsByName(button.name)[0].innerHTML = "enter something";
}


function on_load(){
    load_settings();
    console.log("Use parse_fumen('fumen') when a new game is started to load a fumen.")
}


function update_clear(clear){
    try{clearTimeout(clearTextTimeout);}
    catch{}
    document.getElementById("clear_text").innerHTML = clear;
    clearTextTimeout = setTimeout(function timeout(){
        document.getElementById("clear_text").innerHTML = "";
    }, 2000);
    
}

function update_pc(){
    try{clearTimeout(clearPCTimeout);}
    catch{}
    document.getElementById("all_clear_text").innerHTML = "Perfect Clear";

    clearPCTimeout = setTimeout(function timeout(){
        document.getElementById("all_clear_text").innerHTML = "";
    }, 2000);
}

function update_combo(combo){
    try{clearTimeout(clearComboTimeout);}
    catch{}
    document.getElementById("combo_text").innerHTML = combo + "\n combo";
    clearComboTimeout = setTimeout(function timeout(){
        document.getElementById("combo_text").innerHTML = "";
    }, 2000);
}

function update_b2b(b2b){
    if (b2b > 0){document.getElementById("b2b_text").innerHTML = "B2B: " + b2b;}
    else{document.getElementById("b2b_text").innerHTML = "";}
}


function parse_fumen(fumen){
    let minoCounter = 0;

    let splitFumen = fumen.split("@")[1]; // Remove version header
    splitFumen = splitFumen.substring(0, splitFumen.length - 3); // Remove piece appended at end
    splitFumen = splitFumen.replace(/[?]/g, ''); // Remove ? separators
    pairs = splitFumen.match(/.{2}/g); // Split fumen into pairs
    console.log(pairs);
    console.log(pairs.length)
    for (let i = 0; i < pairs.length; i++){ // Loop through pairs
        value1 = ENCODE_TABLE.indexOf(pairs[i][0]);
        value2 = ENCODE_TABLE.indexOf(pairs[i][1]);

        console.log(pairs[i][0], pairs[i][1]);
        // Calculate num & the corresponding piece values
        let num = value1 + value2 * 64;
        console.log(value1, value2, num);

        pieceType = Math.abs(Math.floor(num / 240 - 8));
        pieceCount = num % 240 + 1;
        //console.log (pieceCount);
        
        // Place piece onto board
        for (let j = 0; j < pieceCount; j++){
            let newPos = j + minoCounter;
            let x = newPos % 10;
            let y = 22 - Math.floor(newPos / 10);
            //console.log(x,y,pieceType)
            if(y < 0) return; // Last piece
            game.board[x][y] = FUMEN_PIECE[pieceType];
        }
        minoCounter = minoCounter + pieceCount;
    }
}

function arrLeft(ARR){
    let loop = setInterval(function() {
        if (das > controls["DAS"]){ // IF ARR IS POSSIBLE
            game.moveLeft();
        }else{ // IF ARR IS NOT POSSIBLE
            clearInterval(loop);
        }
    }, ARR);
}