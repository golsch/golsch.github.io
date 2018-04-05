var NUMBER_OF_COLS = 8,
NUMBER_OF_ROWS = 8,
BLOCK_SIZE = 100;


ctx = null,
json = null,
canvas = null;

current_color = null,
current_x = -1,
current_y = -1;

function screenToBlock(x, y) {
    var block =  {
        "row": Math.floor(y / BLOCK_SIZE),
        "col": Math.floor(x / BLOCK_SIZE)
    };

    return block;
}



function drawBlock(x, y, color) {
    ctx.fillStyle=color;
    ctx.fillRect((x * (BLOCK_SIZE+1))-1, (y * (BLOCK_SIZE+1))-1, BLOCK_SIZE, BLOCK_SIZE);
}


function drawBoard() {
    for (var x = 0; x < NUMBER_OF_ROWS; x++) {
        for (var y = 0; y < NUMBER_OF_ROWS; y++) {
            drawBlock(x, y, "#fff");
        }
    }
    
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, NUMBER_OF_ROWS * BLOCK_SIZE, NUMBER_OF_COLS * BLOCK_SIZE);
    ctx.stroke();
}


function board_click(ev) {
    var x = ev.clientX - canvas.offsetLeft,
    y = ev.clientY - canvas.offsetTop,
    clickedBlock = screenToBlock(x, y);
    drawBlock(clickedBlock.col, clickedBlock.row, "#eee");
}


function board_hover(ev) {
    var x = ev.clientX - canvas.offsetLeft,
    y = ev.clientY - canvas.offsetTop,
    clickedBlock = screenToBlock(x, y);
    
    if(current_x == clickedBlock.row && current_y == clickedBlock.col) {
        drawBlock(clickedBlock.col, clickedBlock.row, "#eee")
    }
    else {
        drawBlock(current_y, current_x, "#fff")
    }
    
    current_x = clickedBlock.row;
    current_y = clickedBlock.col;
}

function draw() {
    canvas = document.getElementById('reversi');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        BLOCK_SIZE = canvas.height / NUMBER_OF_ROWS;
        drawBoard();
        canvas.addEventListener('click', board_click, false);
        canvas.addEventListener("mousemove", board_hover);
    } else {
        alert("Canvas not supported!");
    }
}
