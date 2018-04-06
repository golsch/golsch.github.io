const NUMBER_OF_COLS = 8;
const NUMBER_OF_ROWS = 8;
const BLOCK_SIZE = 99;
const COLOR_BOARD = "white";
const COLOR_PLAYER_ONE = "red";
const COLOR_PLAYER_TWO = "green";
const COLOR_HOVER = "grey";
//------------------------------------

var ctx = null;
var canvas = null;

var current_color = null;
var current_x = -1;
var current_y = -1;
var clicked = false;

function screenToBlock(x, y) {
    var block =  {
        "row": Math.floor(y / BLOCK_SIZE),
        "col": Math.floor(x / BLOCK_SIZE)
    };

    return block;
}



function drawBlock(x, y, color) {
    ctx.fillStyle=color;
    ctx.fillRect(x*(BLOCK_SIZE+1), y*(BLOCK_SIZE+1), BLOCK_SIZE, BLOCK_SIZE);
}


function drawBoard() {
    for (var x = 0; x < NUMBER_OF_ROWS; x++) {
        for (var y = 0; y < NUMBER_OF_ROWS; y++) {
            drawBlock(x, y, COLOR_BOARD);
        }
    }
    
    board_start_config();
}


function board_click(ev) {
    !clicked;
    current_color = COLOR_PLAYER_ONE;
    var x = ev.clientX - canvas.offsetLeft,
    y = ev.clientY - canvas.offsetTop,
    clickedBlock = screenToBlock(x, y);
    drawBlock(clickedBlock.col, clickedBlock.row, COLOR_PLAYER_ONE);
    !clicked;
}

function board_start_config() {
    drawBlock(4,4,COLOR_PLAYER_ONE);
    drawBlock(3,3,COLOR_PLAYER_ONE);
    drawBlock(3,4,COLOR_PLAYER_TWO);
    drawBlock(4,3,COLOR_PLAYER_TWO);
}


function board_hover(ev) {
    if(!clicked) {
        var x = ev.clientX - canvas.offsetLeft,
        y = ev.clientY - canvas.offsetTop,
        clickedBlock = screenToBlock(x, y);

        if(current_x == clickedBlock.row && current_y == clickedBlock.col) {
            drawBlock(clickedBlock.col, clickedBlock.row, COLOR_HOVER)
        }
        else {
            drawBlock(current_y, current_x, COLOR_PLAYER_ONE)
        }

        current_x = clickedBlock.row;
        current_y = clickedBlock.col;
    }
}

function draw() {
    canvas = document.getElementById('reversi');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        drawBoard();
        canvas.addEventListener('click', board_click, false);
        canvas.addEventListener("mousemove", board_hover);
    } else {
        alert("Canvas not supported!");
    }
}
