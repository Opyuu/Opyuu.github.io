//main.js

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

ctx.canvas.width = COLUMNS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

ctx.fillStyle = "green";
ctx.fillRect(10, 10, 100, 100); // try drawing a green square to test or sth