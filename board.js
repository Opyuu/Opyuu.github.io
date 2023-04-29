//board.js

//rendering init (ugly code)
const game_canvas = document.getElementById("board");
const game_ctx = game_canvas.getContext("2d");
game_ctx.canvas.width = COLS * BLOCK_SIZE;
game_ctx.canvas.height = ROWS * BLOCK_SIZE;
game_ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

const queue_canvas = document.getElementById("queue");
const queue_ctx = queue_canvas.getContext("2d");
queue_ctx.canvas.width = 4 * BLOCK_SIZE;
queue_ctx.canvas.height = 16 * BLOCK_SIZE;
queue_ctx.scale(BLOCK_SIZE, BLOCK_SIZE);


class Game{
    constructor(){
        this.ctx = game_ctx;
        this.queue_ctx = queue_ctx;
        this.grid;
        this.piece; // Current falling piece type
        this.x;
        this.y;
        this.rotation; // 0 = North, 1 = East, 2 = South, 3 = West
        this.bag;
        this.bagIndex;
    }

    // board
    newBoard() {
        let temp = Array.from(
            {length: COLS}, () => Array(ROWS).fill(0)
        );
        for (let i=0; i<COLS; i++){
            for (let j=0; j<ROWS; j++){
                temp[i][j] = 0;
            }
        }
        return temp;
    }

    init(){ //initialise stuff, reset all variables
        this.grid = this.newBoard();
        this.bag = [1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7];
        this.sevenBag(true);
        this.sevenBag(false);
        this.bagIndex = 0;
        this.piece = this.bag[this.bagIndex];
        this.x = 3;
        this.y = 22;
        this.rotation = 0;
    }
    
    clearBoard(){ // Removes entire playing field from the canvas
        this.ctx.clearRect(0, 0, 10, 24);
    }

    renderBoard() { // Draws the existing board onto the canvas
        //clear board
        this.clearBoard();
        
        //draw background
        this.ctx.fillStyle = BACKGROUND_COLOUR;
        this.ctx.fillRect(0, 4, 10, 20);

        //draw existing pieces
        for (let i=0; i<COLS; i++){
            for (let j=0; j<ROWS; j++){
                if(this.grid[i][j] == 0) continue;
                this.ctx.fillStyle = PIECE_COLOUR[this.grid[i][j]];
                this.ctx.fillRect(i,ROWS-j-1,1,1);
            }
        }

        //draw grid lines
        this.ctx.lineWidth = GRID_SIZE/BLOCK_SIZE;
        this.ctx.strokeStyle = GRID_COLOUR;
        this.ctx.beginPath();
        for (let i=1; i<COLS; i++){ //horizontal
            this.ctx.moveTo(i,4);
            this.ctx.lineTo(i,ROWS);
        }
        for (let j=ROWS-1; j>3; j--){ //vertical
            this.ctx.moveTo(0,j);
            this.ctx.lineTo(10,j);
        }
        this.ctx.closePath();
        this.ctx.stroke();

        //draw border lines
        this.ctx.lineWidth = BORDER_SIZE/BLOCK_SIZE;
        this.ctx.strokeStyle = BORDER_COLOUR;
        //this.ctx.strokeRect(0, 4, 10, 20);
        this.ctx.beginPath();
        this.ctx.moveTo(0,4);
        this.ctx.lineTo(0,24);
        this.ctx.moveTo(0,24);
        this.ctx.lineTo(10,24);
        this.ctx.moveTo(10,24);
        this.ctx.lineTo(10,4);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    //queue
    clearQueue(){
        this.queue_ctx.clearRect(0, 0, 4, 15);
    }

    renderQueue(){
        this.clearQueue();

        //draw background
        // this.queue_ctx.fillStyle = BACKGROUND_COLOUR;
        // this.queue_ctx.fillRect(0, 0, 4, 15);

        //draw pieces
        let y_offset = 1;
        for (let tempIndex = this.bagIndex; tempIndex < 5; tempIndex++){
            this.queue_ctx.fillStyle = PIECE_COLOUR[this.bag[tempIndex]];
            for (let mino = 0; mino < 4; mino++){
                let drawX = PIECE_X[this.bag[tempIndex]][0][mino];
                let drawY = y_offset - PIECE_Y[this.bag[tempIndex]][0][mino];
                this.queue_ctx.fillRect(drawX, drawY, 1, 1);
            }
            y_offset += 3;
        }

        //draw border lines
        // this.queue_ctx.lineWidth = BORDER_SIZE/10;
        // this.queue_ctx.strokeStyle = BORDER_COLOUR;
        // this.queue_ctx.strokeRect(0, 0, 4, 15);
    }

    //piece
    renderPiece(){
        this.ctx.fillStyle = PIECE_COLOUR[this.piece];
        for (let mino = 0; mino < 4; mino++){
            let drawX = this.x + PIECE_X[this.piece][this.rotation][mino];
            let drawY = SPAWNROW - this.y - PIECE_Y[this.piece][this.rotation][mino];
            this.ctx.fillRect(drawX, drawY, 1, 1);
        }
    }

    placePiece(){ //places existing piece into board
        for (let mino = 0; mino < 4; mino++){
            this.grid   [ this.x + PIECE_X[this.piece][this.rotation][mino] ]
                        [ this.y + PIECE_Y[this.piece][this.rotation][mino] ] = this.piece;
        }
        this.clearBoard();
        this.renderBoard();
        this.x = 3;
        this.y = 22;
        this.bagIncrement();
    }

    //bag
    bagIncrement(){ //increment bag
        this.bagIndex++;
        if (this.bagIndex == 7){
            this.sevenBag(true);
        }
        if (this.bagIndex == 15){
            this.sevenBag(false); this.bagIndex = 0;
        }
    }

    sevenBag(shuffle_first_bag){ //contains 2 bags
        //idea is that we loop through the entire 2 bags as the queue
        //while looping the first bag, the second bag can be shuffled
        //while looping the second bag, the first bag can be shuffled
        if (shuffle_first_bag == true){ //shuffle the first bag
            for (let i = 6; i > 0; i--){
                let j = Math.floor(Math.random() * (i + 1));
                [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
            }
        }
        else{                           //shuffle the second bag
            for (let i = 13; i > 7; i--){
                let j = Math.floor(Math.random() * (i + 1)) + 6;
                [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
            }
        }
    }

    isValid(piece, rotation, x, y){ // Checks if the inputted position is a valid position
        rotation = rotation % 4;
        try{
            for (let mino = 0; mino < 4; mino ++){
                if (this.grid[x + PIECE_X[piece][rotation][mino]]
                    [y + PIECE_Y[piece][rotation][mino]] !== 0){ // If this mino position isn't 0, return false
                    return false;
                }
                
            }
            return true; // If it isn't not valid, it must be valid
        }catch(error){
            return false; // If the piece would clip out of the board array it would be invalid too
        }
    }

    moveLeft(){ // Moves the current piece left if it is a valid position, otherwise nothing happens
        if (this.isValid(this.piece, this.rotation, this.x - 1, this.y)){
            this.x--;
        }
    }

    moveRight(){ // Moves the current piece right if it is a valid position, otherwise nothing happens
        if (this.isValid(this.piece, this.rotation, this.x + 1, this.y)){
            this.x++;
        }
    }

    moveDown(){
        if (this.isValid(this.piece, this.rotation, this.x, this.y)){
            this.y--;
            return true;
        }
        return false
    }

    rotateCW(){
        if (this.piece === 2)return; // O piece has no kicks and or rotations

        for (let kick = 0; kick < 5; kick++){
            if (this.piece == 1){
                if ( this.isValid(this.piece, this.rotation + 1, this.x + CW_I_KICKS_X[this.rotation][kick], this.y + CW_I_KICKS_Y[this.rotation][kick]) ){
                    this.x = this.x + CW_I_KICKS_X[this.rotation][kick];
                    this.y = this.y + CW_I_KICKS_Y[this.rotation][kick];
                    this.rotation = this.rotation + 1;
                    this.rotation = this.rotation % 4;
                    return;
                }
            } else{
                if ( this.isValid(this.piece, this.rotation + 1, this.x + CW_KICKS_X[this.rotation][kick], this.y + CW_KICKS_Y[this.rotation][kick]) ){
                    this.x = this.x + CW_KICKS_X[this.rotation][kick];
                    this.y = this.y + CW_KICKS_Y[this.rotation][kick];
                    this.rotation = this.rotation + 1;
                    this.rotation = this.rotation % 4;
                    return;
                }
            }
        }
    }

    rotateCCW(){
        this.rotation = this.rotation + 4; // Make sure rotation doesn't reach negative
        if (this.piece === 2)return; // O piece has no kicks and or rotations

        for (let kick = 0; kick < 5; kick++){
            if (this.piece == 1){
                if ( this.isValid(this.piece, this.rotation - 1, this.x + CCW_I_KICKS_X[this.rotation][kick], this.y + CCW_I_KICKS_Y[this.rotation][kick]) ){
                    this.x = this.x + CCW_I_KICKS_X[this.rotation][kick];
                    this.y = this.y + CCW_I_KICKS_Y[this.rotation][kick];
                    this.rotation = this.rotation - 1;
                    this.rotation = this.rotation % 4;
                    return;
                }
            } else{
                if ( this.isValid(this.piece, this.rotation - 1, this.x + CCW_KICKS_X[this.rotation][kick], this.y + CCW_KICKS_Y[this.rotation][kick]) ){
                    this.x = this.x + CCW_KICKS_X[this.rotation][kick];
                    this.y = this.y + CCW_KICKS_Y[this.rotation][kick];
                    this.rotation = this.rotation - 1;
                    this.rotation = this.rotation % 4;
                    return;
                }
            }
        }
    }
}