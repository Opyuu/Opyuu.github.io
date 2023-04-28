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
    game.x = -1;
    game.y = 3;
    game.piece = 1;
    game.rotation = 3;
    game.placePiece();
    //game.renderPiece();
    //game.clearPiece();
}

