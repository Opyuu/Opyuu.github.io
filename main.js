//main.js

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

//console.log(`${canvas}`);
//console.log(`${ctx}`);

ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

function play() {
    //let canvas = document.getElementById("canvas");
    //let ctx = canvas.getContext("2d");
    //ctx.canvas.width = COLS * BLOCK_SIZE;
    //ctx.canvas.height = ROWS * BLOCK_SIZE;
    //ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

    //ctx.fillStyle = "green";
    //ctx.fillRect(100, 0, 150, 300);

    board = new Board(ctx);
    board.grid[2][5] = 4;
    board.grid[3][15] = 3;
    board.grid[9][4] = 1;
    board.render();
}

