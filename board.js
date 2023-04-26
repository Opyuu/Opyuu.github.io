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

        for (let i=0; i<COLS; i++){
            for (let j=0; j<ROWS; j++){
                if(this.grid[i][j] == 0) continue;
                this.ctx.fillStyle = PIECE_COLOUR[this.grid[i][j]];
                
                this.ctx.fillRect(i,ROWS-j,1,1);

            }
        }
    }
}
