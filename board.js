//board.js

class Board{ 
    constructor(ctx) {
        this.ctx = ctx;
        this.grid = this.newBoard();
    }

    newBoard() {
        return Array.from(
            {length: ROWS}, () => Array(COLS).fill(0) //empty grid
        );
    }
    
    render() {
        
        for (let i=0; i<COLS; i++){
            for (let j=0; j<ROWS; j++){
                if(this.grid[i][j] === 0) continue;
                this.ctx.fillStyle = PIECE_COLOUR[this.grid[i][j]];
                this.ctx.drawRect(i*30,ROWS*30-j*30,30,30);
                // set draw colour
                // draw one mino
            }
        }
    }
}
