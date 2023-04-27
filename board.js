//board.js
class Game{
    constructor(ctx){
        this.ctx = ctx;
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
        this.x = 0;
        this.y = 0;
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

    //piece
    renderPiece(){
        for (let mino = 0; mino < 4; mino++){
            this.ctx.fillStyle = PIECE_COLOUR[this.piece];
            let drawX = this.x + PIECEX[this.piece][this.rotation][mino];
            let drawY = SPAWNROW - this.y - PIECEY[this.piece][this.rotation][mino];

            this.ctx.fillRect(drawX, drawY, 1, 1);
        }
    }

    clearPiece(){
        for (let mino = 0; mino < 4; mino++){
            // this.ctx.fillStyle = PIECE_COLOUR[this.piece];
            let drawX = this.x + PIECEX[this.piece][this.rotation][mino];
            let drawY = SPAWNROW - this.y - PIECEY[this.piece][this.rotation][mino];

            this.ctx.clearRect(drawX, drawY, 1, 1);
        }
    }

    //7 bag randomising system
    sevenBag(shuffle_first_bag){ //contains 2 bags
        //idea is that we loop through the entire 2 bags as the queue
        //while looping the first bag, the second bag can be shuffled
        //while looping the second bag, the first bag can be shuffled
        if (shuffle_first_bag == true){ //shuffle the first bag
            for (let i = 6; i >= 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
            }
        }
        else{                           //shuffle the second bag
            for (let i = 13; i >= 7; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
            }
        }
    }
}