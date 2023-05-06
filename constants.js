//constants.js
const COLS = 10;
const ROWS = 40;
const RENDER_ROWS = 24;
const SPAWNROW = 23

const BLOCK_SIZE = 30;
const BORDER_SIZE = 5;
const GRID_SIZE = 1;

const INT_TO_PIECE = ["-", "I", "O", "J", "L", "S", "Z", "T", "#"];
//"#000000", "#00FFE1", "#FFEA00", "#0008FF", "#FF8800", "#00FF15", "#FF000D", "#B300FF", "#8F8F8F"
const PIECE_COLOUR = ["#000000", "#00FFE1", "#FFEA00", "#0008FF", "#FF8800", "#00FF15", "#FF000D", "#B300FF", "#8F8F8F"]
const GHOST_COLOUR = "rgba(255, 255, 255, 0.5)";
const GRID_COLOUR = "rgba(172, 170, 170, 1)";
const BACKGROUND_COLOUR = "#000000";
const BORDER_COLOUR = "#FFFFFF";

const ENCODE_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const FUMEN_PIECE = [0, 1, 4, 2, 6, 7, 3, 5, 8];