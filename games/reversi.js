const NUMBER_OF_COLS = 8;
//quadratic field
const NUMBER_OF_ROWS = NUMBER_OF_COLS;
const SHADOW_SIZE = 1;
const COLOR_BOARD = "white";
const COLOR_PLAYER_ONE = "red";
const COLOR_PLAYER_TWO = "green";
const COLOR_HOVER = "grey";
const DIRECTIONS =new Array("LEFT","RIGHT","UP", "DOWN", "UPLEFT", "UPRIGHT", "DOWNLEFT", "DOWNRIGHT");
//------------------------------------
var current_color = null;
var current_row = -1;
var current_col = -1;
var current_player = COLOR_PLAYER_ONE;
var current_config = new Array();
//------------------------------------
var ctx = null;
var canvas = null;
var block_size = 100;
//------------------------------------

//build gameconfig with initial start options
function build_start_config() {
    for (var index = 0; index < NUMBER_OF_COLS * NUMBER_OF_ROWS; index++) {
        if(index == ((NUMBER_OF_ROWS / 2) - 1)*NUMBER_OF_ROWS+NUMBER_OF_COLS / 2 - 1 || index ==(NUMBER_OF_ROWS / 2)*NUMBER_OF_ROWS + NUMBER_OF_COLS / 2) {
            current_config[index] = COLOR_PLAYER_ONE;
        } 
        else if (index == ((NUMBER_OF_ROWS / 2)) * NUMBER_OF_ROWS + NUMBER_OF_COLS / 2 - 1 || index ==((NUMBER_OF_ROWS / 2) - 1) * NUMBER_OF_ROWS + NUMBER_OF_COLS / 2) {
            current_config[index] = COLOR_PLAYER_TWO;
        }
        else {
            current_config[index] = COLOR_BOARD;
        }
    }
}

//calc block to index
function block_to_index(x, y) {
    return x * NUMBER_OF_COLS + y;
}

//calc screen to block
function screen_to_block(x, y) {
    return block =  {
        "row": Math.floor(x / block_size),
        "col": Math.floor(y / block_size)
    };
}

function draw_block(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * (block_size + SHADOW_SIZE), y * (block_size + SHADOW_SIZE), block_size, block_size);
}

//get row with index
 function get_row(index) {
		return parseInt(index / NUMBER_OF_COLS);
}

//get col with index
function get_col(index) {
		return index % NUMBER_OF_COLS;
}

//switch player current player
function switch_player() {
    if(current_player == COLOR_PLAYER_ONE) {
        current_player = COLOR_PLAYER_TWO;
    }
    else {
        current_player = COLOR_PLAYER_ONE;
    }
}

//draw board with game config
function draw_board() {
    var x = 0;
    var y = 0;
    for (var i = 0; i < NUMBER_OF_COLS*NUMBER_OF_ROWS; i++) {
        if(x == NUMBER_OF_COLS) {
            y++;
            x = 0;
        }
        draw_block(y, x, current_config[i]);
        x++;
    }
}

//check block if it is playerblock
function is_player(index){
    if(current_config[index] != COLOR_BOARD) {
        return true;
    }
    return false;
}

//check direction if its flippable
function is_flippable(index, player, direction) {
		var flipsStones = false;
		while (is_player(index) && current_config[index] != player) {
			index = index_to_direction(index, direction);
			flipsStones = true;
		}
		//if the index ended on a field of the player, the row can be flipped.
		if (current_config[index] == player && flipsStones){
			return true;
		}
		return false;
}

//flip stones in direction
function flip(index, player, direction) {
		index = index_to_direction(index, direction);
		if(is_flippable(index, player, direction)) {
			while(is_player(index) && current_config[index]!=player) {
				current_config[index] = player;
				index = index_to_direction(index, direction);
			}
		}
}

//add new move
function add(index, player) {
    for(var i = 0; i < DIRECTIONS.length; i++) {
        flip(index, player, DIRECTIONS[i]);
    }
    current_config[index] = player;
    draw_block(get_row(index), get_col(index), player);
    
}

//calc step in direction to index
function index_to_direction(index, direction) {
    switch(direction) {
		case "LEFT": return --index;
		case "RIGHT": return ++index;
		case "UP": return index - NUMBER_OF_COLS;
		case "DOWN": return index + NUMBER_OF_COLS;
		case "UPLEFT": return index - NUMBER_OF_COLS - 1;
		case "UPRIGHT": return index - NUMBER_OF_COLS + 1;
		case "DOWNLEFT": return index + NUMBER_OF_COLS - 1;
		case "DOWNRIGHT": return index + NUMBER_OF_COLS + 1;
		
		default: alert("error, unkonwn direction");
    }
}

//click event form board (compute move)
function board_click(ev) {
    var x = ev.clientX - canvas.offsetLeft,
    y = ev.clientY - canvas.offsetTop,
    clickedBlock = screen_to_block(x, y);
    //check that block is empty
    if(!is_player(block_to_index(clickedBlock.row, clickedBlock.col))) {
        current_config[block_to_index(clickedBlock.row, clickedBlock.col)] = current_player;
        add(block_to_index(clickedBlock.row, clickedBlock.col), current_player);
        draw_board();
        switch_player();
    }
    else {
        alert("error, move is not supported");
    }
}

//hover selected field
function board_hover(ev) {
    var x = ev.clientX - canvas.offsetLeft;
    var y = ev.clientY - canvas.offsetTop;
    clickedBlock = screen_to_block(x, y);
    //field-switch
    if(current_row != clickedBlock.row || current_col != clickedBlock.col) {
        draw_block(current_row, current_col,current_config[block_to_index(current_row,current_col)]);
        current_row = clickedBlock.row;
        current_col = clickedBlock.col;
        //field is not a player
        if(current_config[block_to_index(current_row,current_col)]==COLOR_BOARD) {
            draw_block(current_row, current_col, COLOR_HOVER); 
        }
    }
}

//event when mouse leaves canvas
function mouse_out() {
    draw_block(current_row, current_col,current_config[block_to_index(current_row,current_col)]);
}

window.onresize = function(event) {
    renew_canvas_size();
};

//dynamic canvas size
function renew_canvas_size() {
    if(window.innerWidth >800) {
            ctx.canvas.width  = 800;
            ctx.canvas.height = ctx.canvas.width;
    }
    else {
        ctx.canvas.width = window.innerWidth-20;
        ctx.canvas.height = ctx.canvas.width;
    }
        
    block_size = (canvas.width/NUMBER_OF_COLS)-SHADOW_SIZE;
    draw_board();
}

//init
function draw() {
    canvas = document.getElementById('reversi');
    
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        build_start_config();
        renew_canvas_size();
        canvas.addEventListener('click', board_click, false);
        canvas.addEventListener("mousemove", board_hover);
        canvas.addEventListener ("mouseout", mouse_out, false);
    } else {
        alert("error, canvas not supported!");
    }
}
