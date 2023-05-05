//board.js

//rendering init (ugly code)
const game_canvas = document.getElementById("board");
const game_ctx = game_canvas.getContext("2d");
game_ctx.canvas.width = COLS * BLOCK_SIZE;
game_ctx.canvas.height = ROWS * BLOCK_SIZE;
game_ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

const queue_canvas = document.getElementById("queue");
const queue_ctx = queue_canvas.getContext("2d");
queue_ctx.canvas.width = 6 * BLOCK_SIZE;
queue_ctx.canvas.height = 16 * BLOCK_SIZE;
queue_ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

const hold_canvas = document.getElementById("hold");
const hold_ctx = hold_canvas.getContext("2d");
hold_ctx.canvas.width = 4 * BLOCK_SIZE;
hold_ctx.canvas.height = 4 * BLOCK_SIZE;
hold_ctx.scale(BLOCK_SIZE, BLOCK_SIZE);


class Game{
    constructor(){
        this.ctx = game_ctx;
        this.queue_ctx = queue_ctx;
        this.hold_ctx = hold_ctx;
        this.board;
        this.piece; // Current falling piece type
        this.x;
        this.y;
        this.rotation; // 0 = North, 1 = East, 2 = South, 3 = West
        this.rotated;
        this.kickFive;
        this.hold;
        this.canHold;
        this.bag;
        this.bagIndex;
    }

    // board
    newBoard() {
        let temp = Array.from(
            {length: COLS}, () => Array(ROWS).fill(0)
        );
        for (let i = 0; i < COLS; i++){
            for (let j = 0; j < ROWS; j++){
                temp[i][j] = 0;
            }
        }
        return temp;
    }

    init(){ //initialise stuff, reset all variables
        this.board = this.newBoard();
        this.bag = [1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7];
        this.sevenBag(true);
        this.sevenBag(false);
        this.bagIndex = 0;
        this.hold = 0;
        this.canHold = true;
        this.spawnPiece();
        this.update_render();
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
        for (let i = 0; i < COLS; i++){
            for (let j = 0; j < ROWS; j++){
                if(this.board[i][j] == 0) continue;
                this.ctx.fillStyle = PIECE_COLOUR[this.board[i][j]];
                this.ctx.fillRect(i,ROWS-j-1,1,1);
            }
        }

        //draw ghost pieces
        let r = this.y
        while(this.isValid(this.piece, this.rotation, this.x, r)){r-=1;}
        this.renderPiece(this.piece, this.rotation, this.x, r+1, 1);


        //draw grid lines
        this.ctx.lineWidth = GRID_SIZE/BLOCK_SIZE;
        this.ctx.strokeStyle = GRID_COLOUR;
        this.ctx.beginPath();
        for (let i = 1; i < COLS; i++){ //horizontal
            this.ctx.moveTo(i,4);
            this.ctx.lineTo(i,ROWS);
        }
        for (let j = ROWS - 1; j > 3; j--){ //vertical
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

    clearLines(){
        //i kinda don't like this way of memory access but whatever
        //[0 [0 [0 [0
        // 0  0  0  0
        // 0  0  0  0
        // 1] 1] 1] 1]
        // rather than
        //[0  0  0  0]
        //[0  0  0  0]
        //[0  0  0  0]
        //[1  1  1  1]
        let clear = 0;
        let maxHeight = 0;
        let tspin = false;
        let mini = true;
        if (this.piece == 7 && this.rotated == true){
            let corners = [false, false, false, false, false]
            if (this.x == -1 && this.rotation == 1){
                corners[0] = corners[1] = true;
                corners[2] = this.board[this.x+2][this.y-2] !== 0;
                corners[3] = this.board[this.x  ][this.y-2] !== 0;
            }
            else if (this.x == 8 && this.rotation == 3){
                corners[0] = this.board[this.x  ][this.y  ] !== 0;
                corners[1] = this.board[this.x+2][this.y  ] !== 0;
                corners[2] = corners[3] = true;
            }
            else{
                corners[0] = this.board[this.x  ][this.y  ] !== 0;
                corners[1] = this.board[this.x+2][this.y  ] !== 0;
                corners[2] = this.board[this.x+2][this.y-2] !== 0;
                corners[3] = this.board[this.x  ][this.y-2] !== 0;
            }   

            if (corners[0] +
                corners[1] +
                corners[2] +
                corners[3] >= 3){tspin = true;}

            corners[4] = corners[0];

            if ((corners[this.rotation] == true && corners[this.rotation+1] == true)
                || this.kickFive == true){
                mini = false;
            }
        }

        for (let row = 0; row < ROWS; row++){
            let temp = 1;
            let temp2 = false;
            for (let col = 0; col < COLS; col++){
                temp  *= this.board[col][row]; //if there is hole, it would = 0
                temp2 = (temp2 || (this.board[col][row] > 0));
            }
            
            maxHeight += temp2;

            if (temp !== 0){ //there are no holes in a line
                //better memory access
                for (let col2 = 0; col2 < COLS; col2++){
                    for (let row2 = row; row2 < SPAWNROW; row2++){
                        this.board[col2][row2] = this.board[col2][row2+1];
                    }
                    this.board[col2][ROWS] = 0;
                }
                row--;
                maxHeight--;
                clear++;
            }
        }

        if (clear == 4){console.log("quad");}
        if (tspin){
            switch(clear){
                case 0:
                    if (mini){console.log("tspin mini null");}
                    else{console.log("tspin null");}
                    break;
                case 1:
                    if (mini){console.log("tspin mini single");}
                    else{console.log("tspin single");}
                    break;
                case 2:
                    if (mini){console.log("tspin mini double");}
                    else{console.log("tspin double");}
                    break;
                case 3:
                    console.log("tspin triple");
                    break;
                default:
                    break;
            }
        }
        if (maxHeight == 0){console.log("perfect clear");}
    }

    update_render(){
        this.renderBoard();
        this.renderQueue();
        this.renderPiece(this.piece, this.rotation, this.x, this.y, 0);
        this.renderHold();
    }

    //queue
    clearQueue(){
        this.queue_ctx.clearRect(0, 0, 6, 16);
    }

    renderQueue(){
        this.clearQueue();

        //draw pieces
        let y_offset = 1;
        let limit = this.bagIndex + 5;
        if (limit >= 14){limit -= 14;}
        for (let tempIndex = this.bagIndex; tempIndex != limit; tempIndex++){
            this.queue_ctx.fillStyle = PIECE_COLOUR[this.bag[tempIndex]];
            for (let mino = 0; mino < 4; mino++){
                let drawX = PIECE_X[this.bag[tempIndex]][0][mino];
                let drawY = y_offset - PIECE_Y[this.bag[tempIndex]][0][mino];
                this.queue_ctx.fillRect(1+ drawX, drawY, 1, 1);
            }
            y_offset += 3;
            if (tempIndex >= 13){tempIndex -= 14;}
        }
        
        //draw border lines
        // this.queue_ctx.lineWidth = BORDER_SIZE/10;
        // this.queue_ctx.strokeStyle = BORDER_COLOUR;
        // this.queue_ctx.strokeRect(0, 0, 4, 15);
    }

    //piece
    renderPiece(piece, rotation, x, y, ghost){
        this.ctx.fillStyle = ghost ? GHOST_COLOUR : PIECE_COLOUR[piece];
        for (let mino = 0; mino < 4; mino++){
            let drawX = x + PIECE_X[piece][rotation][mino];
            let drawY = SPAWNROW - y - PIECE_Y[piece][rotation][mino];
            this.ctx.fillRect(drawX, drawY, 1, 1);
        }
    }

    spawnPiece(){ //spawn piece
        this.x = 3;
        this.y = 22;
        this.piece = this.bag[this.bagIndex];
        this.rotation = 0;
        this.rotated = false;
        this.bagIncrement();
    }

    placePiece(){ //places existing piece into board
        for (let mino = 0; mino < 4; mino++){
            this.board   [ this.x + PIECE_X[this.piece][this.rotation][mino] ]
                        [ this.y + PIECE_Y[this.piece][this.rotation][mino] ] = this.piece;
        }
        this.clearLines();
        this.spawnPiece();
        this.canHold = true;
    }

    isValid(piece, rotation, x, y){ // Checks if the inputted position is a valid position

        if ((x + PIECE_X[piece][rotation][0] < 10) +
            (x + PIECE_X[piece][rotation][1] < 10) +
            (x + PIECE_X[piece][rotation][2] < 10) +
            (x + PIECE_X[piece][rotation][3] < 10) +
            (x + PIECE_X[piece][rotation][0] > -1) +
            (x + PIECE_X[piece][rotation][1] > -1) +
            (x + PIECE_X[piece][rotation][2] > -1) +
            (x + PIECE_X[piece][rotation][3] > -1) !== 8) return false;

        return ((this.board[x + PIECE_X[piece][rotation][0]] [y + PIECE_Y[piece][rotation][0]] === 0) +
                (this.board[x + PIECE_X[piece][rotation][1]] [y + PIECE_Y[piece][rotation][1]] === 0) +
                (this.board[x + PIECE_X[piece][rotation][2]] [y + PIECE_Y[piece][rotation][2]] === 0) +
                (this.board[x + PIECE_X[piece][rotation][3]] [y + PIECE_Y[piece][rotation][3]] === 0) === 4);
    }

    moveLeft(){ // Moves the current piece left if it is a valid position, otherwise nothing happens
        if (this.isValid(this.piece, this.rotation, this.x - 1, this.y)){
            this.x--;
            this.rotated = false;
            return true;
        }
        return false;
    }

    moveRight(){ // Moves the current piece right if it is a valid position, otherwise nothing happens
        if (this.isValid(this.piece, this.rotation, this.x + 1, this.y)){
            this.x++;
            this.rotated = false;
            return true;
        }
        return false;
    }

    moveDown(){
        if (this.isValid(this.piece, this.rotation, this.x, this.y - 1)){
            this.y--;
            this.rotated = false;
            return true;
        }
        return false
    }

    rotateCW(){
        if (this.piece === 2)return; // O piece has no kicks and or rotations

        for (let kick = 0; kick < 5; kick++){
            if ( this.isValid(this.piece, rotation_CW[this.rotation],
                this.x + CW_KICKS_X[+(this.piece==1)][this.rotation][kick], 
                this.y + CW_KICKS_Y[+(this.piece==1)][this.rotation][kick]) ){

                this.x = this.x + CW_KICKS_X[+(this.piece==1)][this.rotation][kick];
                this.y = this.y + CW_KICKS_Y[+(this.piece==1)][this.rotation][kick];
                this.rotation = rotation_CW[this.rotation];
                this.rotated = true;

                this.kickFive = kick == 4;

                return;
            }
        }
    }

    rotateCCW(){
        if (this.piece === 2)return; // O piece has no kicks and or rotations

        for (let kick = 0; kick < 5; kick++){
            if ( this.isValid(this.piece, rotation_CCW[this.rotation],
                this.x + CCW_KICKS_X[+(this.piece==1)][this.rotation][kick], 
                this.y + CCW_KICKS_Y[+(this.piece==1)][this.rotation][kick]) ){
                
                this.x = this.x + CCW_KICKS_X[+(this.piece==1)][this.rotation][kick];
                this.y = this.y + CCW_KICKS_Y[+(this.piece==1)][this.rotation][kick];
                this.rotation = rotation_CCW[this.rotation];
                this.rotated = true;

                this.kickFive = kick == 4;

                return;
            }
        }
    }

    rotate180(){
        if (this.piece === 2) return; // O piece has no kicks and or rotations

        for (let kick = 0; kick < 6; kick++){
            if ( this.isValid(this.piece, rotation_180[this.rotation],
                this.x + KICKS_180_X[this.rotation][kick],
                this.y + KICKS_180_Y[this.rotation][kick]) ){
                
                this.x = this.x + KICKS_180_X[this.rotation][kick];
                this.y = this.y + KICKS_180_Y[this.rotation][kick];
                this.rotation = rotation_180[this.rotation];
                this.rotated = true;
                
                return;
            }  
        }
    }

    //hold
    holdPiece(){
        if (this.canHold == false) return;
        [this.hold, this.piece] = [this.piece, this.hold];
        this.canHold = false;
        if(this.piece === 0){
            this.spawnPiece();
        }
        else{
            this.x = 3;
            this.y = 22;
            this.rotation = 0;
            this.rotated = false;
        }
    }

    clearHold(){
        this.hold_ctx.clearRect(0, 0, 4, 4);
    }

    renderHold(){
        this.clearHold();

        this.hold_ctx.fillStyle = PIECE_COLOUR[this.hold];
        for (let mino = 0; mino < 4; mino++){
            let drawX = PIECE_X[this.hold][0][mino];
            let drawY = - PIECE_Y[this.hold][0][mino];
            this.hold_ctx.fillRect(drawX, drawY, 1, 1);
        }
    }

    //bag
    bagIncrement(){ //increment bag
        this.bagIndex++;
        if (this.bagIndex == 7){
            this.sevenBag(true);
        }
        if (this.bagIndex == 14){
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
            for (let i = 6; i > 0; i--){
                let j = Math.floor(Math.random() * (i + 1));
                [this.bag[i+7], this.bag[j+7]] = [this.bag[j+7], this.bag[i+7]];
            }
        }
    }

}