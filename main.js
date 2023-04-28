//main.js

function play() {
    game = new Game();
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

