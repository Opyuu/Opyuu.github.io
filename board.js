//board.js

class Board{ 
    constructor(ctx) {
        this.ctx = ctx;
        this.grid = this.newBoard();
    }

    newBoard() {
        let temp = Array.from(
            {length: ROWS}, () => Array(COLS).fill(0)
        );
        for (let i=0; i<COLS; i++){
            for (let j=0; j<ROWS; j++){
                temp[i][j] = 0;
            }
        }
        return temp;
    }
    
    render() {
        //draw existing pieces
        for (let i=0; i<COLS; i++){
            for (let j=0; j<ROWS; j++){
                if(this.grid[i][j] == 0) continue;
                this.ctx.fillStyle = PIECE_COLOUR[this.grid[i][j]];
                
                this.ctx.fillRect(i,ROWS-j-1,1,1);

            }
        }

        //draw grid lines
        this.ctx.strokeStyle = GRID_COLOUR;
        this.ctx.lineWidth = 1/BLOCK_SIZE;
        this.ctx.moveTo(1,0);
        this.ctx.beginPath();
        for (let i=1; i<COLS; i++){ //horizontal
            this.ctx.moveTo(i,0);
            this.ctx.lineTo(i,20);
        }
        for (let j=1; j<ROWS; j++){ //vertical
            this.ctx.moveTo(0,j);
            this.ctx.lineTo(10,j);
        }
        
        this.ctx.closePath();
        this.ctx.stroke();
        
    }
}
