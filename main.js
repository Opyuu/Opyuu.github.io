//main.js

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

function play() {
    game = new Game(ctx);
    game.init();
    game.renderBoard();
    game.x = 5;
    game.y = 5;
    game.piece = 7;
    game.rotation = 3;
    game.renderPiece();
    game.clearPiece();
}

