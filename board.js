//board.js
class Game{
    constructor(ctx){
        this.ctx = ctx;
        this.grid = this.newBoard();
        this.piece = 0; // Current falling piece type
        this.x = 0;
        this.y = 0;
        this.rotate = 0; // 0 = North, 1 = East, 2 = South, 3 = West
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
    
    renderBoard() {
        //clear board
        this.ctx.clearRect(0, 0, 10, 24);
        
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
        for (let j=4; j<ROWS; j++){ //vertical
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

    }
}
