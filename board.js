//board.js

class Board{ 
    constructor(ctx) {
        this.ctx = ctx;
        this.grid = newBoard();
    }

    newBoard() {
        return Array.from(
            {length: ROWS}, () => Array(COLUMNS).fill(0)
        );
    }
    
}