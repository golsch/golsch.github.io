const NUMBER_OF_COLS = 8;
const NUMBER_OF_ROWS = 8;
const SHADOW_SIZE = 1;
const BLOCK_SIZE = 100 - SHADOW_SIZE;
const COLOR_BOARD = "white";
const COLOR_PLAYER_ONE = "red";
const COLOR_PLAYER_TWO = "green";
const COLOR_HOVER = "grey";
//------------------------------------

var ctx = null;
var canvas = null;

var current_color = null;
var color_temp = null;

var x_temp = null;
var y_temp = null;

var current_x = -1;
var current_y = -1;

var game_config = new Array();
var currentPlayer = COLOR_PLAYER_ONE;
const DIRECTIONS =new Array("LEFT","RIGHT","UP", "DOWN", "UPLEFT", "UPRIGHT", "DOWNLEFT", "DOWNRIGHT");

function buildStartConfig() {
    for (var i = 0; i < NUMBER_OF_COLS*NUMBER_OF_ROWS; i++) {
        if(i == 27 || i == 36) {
            game_config[i] = COLOR_PLAYER_ONE;
        } 
        else if (i == 28 || i == 35) {
            game_config[i] = COLOR_PLAYER_TWO;
        }
        else {
            game_config[i] = COLOR_BOARD;
        }
        
    }
}

function coordinatesToBlock(x,y) {
    return x*NUMBER_OF_ROWS+y;
}

function screenToBlock(x, y) {
    var block =  {
        "row": Math.floor(y / BLOCK_SIZE),
        "col": Math.floor(x / BLOCK_SIZE)
    };
    return block;
}

function drawBlock(x, y, color) {
    ctx.fillStyle=color;
    ctx.fillRect(y*(BLOCK_SIZE+SHADOW_SIZE), x*(BLOCK_SIZE+SHADOW_SIZE), BLOCK_SIZE, BLOCK_SIZE);
}

 function getRow(index) {
		return parseInt(index / NUMBER_OF_COLS);
}

function getColumn(index) {
		return index % NUMBER_OF_COLS;
}

function switchPlayer() {
    if(currentPlayer == COLOR_PLAYER_ONE) {
        currentPlayer = COLOR_PLAYER_TWO;
    }
    else {
        currentPlayer = COLOR_PLAYER_ONE;
    }
}

function drawBoard() {
    var x = 0;
    var y = 0;
    for (var i = 0; i < NUMBER_OF_COLS*NUMBER_OF_ROWS; i++) {
        if(x == NUMBER_OF_COLS) {
            y++;
            x = 0;
        }
        drawBlock(y, x, game_config[i]);
        x++;
    }
}

function isPlayer(index){
    if(game_config[index]!=COLOR_BOARD) {
        return true;
    }
    return false;
}

function isFlippable(index, player, direction) {
		var flipsStones = false;
		while (isPlayer(index) && game_config[index]!=player) {
			index = calcIndexTo(index, direction);
			flipsStones = true;
		}
		//if the index ended on a field of the player, the row can be flipped.
		if (game_config[index] == player && flipsStones){
			return true;
		}
		return false;
}

function flip(index, player, direction) {
		index = calcIndexTo(index, direction);
		if(isFlippable(index, player, direction)) {
			while(isPlayer(index) && game_config[index]!=player) {
				game_config[index] = player;
				index = calcIndexTo(index, direction);
			}
		}
}

function add(index, player) {
    for(var i = 0; i < DIRECTIONS.length; i++) {
        flip(index, player, DIRECTIONS[i]);
    }
    game_config[index] = player;
    drawBlock(getRow(index), getColumn(index), player);
    
}

function calcIndexTo(index, direction) {
    switch(direction) {
		case "LEFT": return --index;
		case "RIGHT": return ++index;
		case "UP": return index - NUMBER_OF_COLS;
		case "DOWN": return index + NUMBER_OF_COLS;
		case "UPLEFT": return index - NUMBER_OF_COLS - 1;
		case "UPRIGHT": return index - NUMBER_OF_COLS + 1;
		case "DOWNLEFT": return index + NUMBER_OF_COLS - 1;
		case "DOWNRIGHT": return index + NUMBER_OF_COLS + 1;
		
		default: console.log("fehler");
    }
}

function board_click(ev) {
    var x = ev.clientX - canvas.offsetLeft,
    y = ev.clientY - canvas.offsetTop,
    clickedBlock = screenToBlock(x, y);
        if(game_config[coordinatesToBlock(clickedBlock.row, clickedBlock.col)] != currentPlayer) {
        game_config[coordinatesToBlock(clickedBlock.row, clickedBlock.col)] = currentPlayer;
        add(coordinatesToBlock(clickedBlock.row, clickedBlock.col), currentPlayer);
        drawBoard();
        switchPlayer();
    }
    else {
        alert("move is not supported");
    }
}

function board_hover(ev) {
    var x = ev.clientX - canvas.offsetLeft;
    var y = ev.clientY - canvas.offsetTop;
    clickedBlock = screenToBlock(x, y);
    //field-switch
    if(current_x != clickedBlock.row || current_y != clickedBlock.col) {
        drawBlock(current_x, current_y,game_config[coordinatesToBlock(current_x,current_y)]);
        current_x = clickedBlock.row;
        current_y = clickedBlock.col;
        //field is not a player
        if(game_config[coordinatesToBlock(current_x,current_y)]==COLOR_BOARD) {
            drawBlock(current_x, current_y, COLOR_HOVER); 
        }
    }
}

function mouse_out() {
    drawBlock(current_x, current_y,game_config[coordinatesToBlock(current_x,current_y)]);
}

function draw() {
    canvas = document.getElementById('reversi');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        buildStartConfig();
        drawBoard();
        canvas.addEventListener('click', board_click, false);
        canvas.addEventListener("mousemove", board_hover);
        canvas.addEventListener ("mouseout", mouse_out, false);
    } else {
        alert("Canvas not supported!");
    }
}
