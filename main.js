//main.js

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d'); //idk if this works

ctx.canvas.width = COLUMNS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);