const COLS = 6 + 2;
const DEBUG = 0;
//quadratic field
const ROWS = COLS;
const SHADOW_SIZE = 1;
const COLOR_BOARD = "white";
const COLOR_PLAYER_ONE = "red";
const COLOR_POSS_MOVE = "lightgoldenrodyellow";
const COLOR_PLAYER_TWO = "green";
const COLOR_HOVER = "grey";
const COLOR_BLOCKED = "black";
const DIRECTIONS = new Array("LEFT","RIGHT","UP", "DOWN", "UPLEFT", "UPRIGHT", "DOWNLEFT", "DOWNRIGHT");
//---------------
var current_color = null;
var current_row = -1;
var current_col = -1;
var current_player = COLOR_PLAYER_ONE;
var map = new Array();
//------------------------------------
var ctx = null;
var canvas = null;
var block_size = 0;
var canvas_init_size = 0;
//------------------------------------

//build gameconfig with initial start options
function generate_map() {
    for (var index = 0; index < COLS * ROWS; index++) {
        var col = get_col(index);
        var row = get_row(index);
        
        if(col == 0 || col == COLS - 1 || row == 0 || row == ROWS - 1) {
            map[index] = COLOR_BLOCKED;
        }
        else {
            if(index == ((ROWS / 2) - 1)* ROWS + COLS / 2 - 1 || index == (COLS / 2) * ROWS + COLS / 2) {
                map[index] = COLOR_PLAYER_ONE;
            } else if (index == ((COLS / 2)) * ROWS + COLS / 2 - 1 || index == ((ROWS / 2) - 1) * ROWS + COLS / 2) {
                map[index] = COLOR_PLAYER_TWO;
            } else {
                map[index] = COLOR_BOARD;
            }
        }
    }
}

var pm = null;

function get_row(index) {
    return parseInt(index / ROWS);
}

//get col with index
function get_col(index) {
    return index % COLS;
}

function block_to_index(x, y) {
    return x * COLS + y;
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

Array.prototype.contains = function (v) {
    return this.indexOf(v) > -1;
}

function possible_moves(player) {
    console.log("give this sgit");
    var enemy_index_list = new Array();
    for (var index = 0; index < map.length; index++) {
        if((is_player(index) && map[index] != player)) {
            enemy_index_list.push(index);
        }
    }

    //System.out.println("Potentielle Zuege:");
    var potential_move_index_list = new Array();
    for (var i = 0; i < enemy_index_list.length; i++) {
        for (var j = 0; j < DIRECTIONS.length; j++) {
            var index = index_to_direction(enemy_index_list[i], DIRECTIONS[j]);
            if(is_empty(index)) {
                if(!potential_move_index_list.contains(index)) {
                    potential_move_index_list.push(index);
                }
            }
        }
    }

    var potential_move_list = new Array();
    for(var i = 0; i < potential_move_index_list.length; i++) {
        for(var j = 0; j < DIRECTIONS.length; j++) {
            var temp = potential_move_index_list[i];
            var index = index_to_direction(temp, DIRECTIONS[j]);
            if(is_flippable(index, player, DIRECTIONS[j])) {
                potential_move_list.push(temp);
                //System.out.println(temp);
                break;
            }
        }
    }
    return potential_move_list;
}

function get_winner() {
    var points_player_one = 0;
    var points_player_two = 0;
    
    for(var i = 0; i < map.length; i++) {
        if(map[i] == COLOR_PLAYER_ONE) {
            points_player_one++;
        }
        if(map[i] == COLOR_PLAYER_TWO) {
            points_player_two++;
        }
    }

    if(points_player_one == points_player_two) {
        alert("unentschieden!");
    } else if(points_player_one > points_player_two) {
        alert("spieler 1 gewinnt");
    } else {
        alert("spieler 2 gewinnt");
    }
}

//switch player current player
function switch_player() {
    if(current_player == COLOR_PLAYER_ONE) {
        current_player = COLOR_PLAYER_TWO;
    } else {
        current_player = COLOR_PLAYER_ONE;
    }
}

//draw board with game config
function draw_board() {
    var x = 0;
    var y = 0;
    for (var index = 0; index < COLS * ROWS; index++) {
        if(map[index] != COLOR_BLOCKED || DEBUG == 0) {
            if(x == COLS - 2 * DEBUG) {
                y++;
                x = 0;
            }
            draw_block(y, x, map[index]);
            x++;
        }
    }
}

//check block if it is playerblock
function is_player(index){
    if(map[index] == COLOR_PLAYER_ONE || map[index] == COLOR_PLAYER_TWO) {
        return true;
    }
    return false;
}

function is_empty(index) {
    if(map[index] == COLOR_BOARD) {
        return true;
    }
    return false;
}

//check direction if its flippable
function is_flippable(index, player, direction) {
    //console.log("is flippable?");
    var flipsStones = false;
    while (is_player(index) && map[index] != player) {
        index = index_to_direction(index, direction);
        flipsStones = true;
    }
    //console.log("yes");
    //if the index ended on a field of the player, the row can be flipped.
    if (map[index] == player && flipsStones){
        return true;
    }
    return false;
}

//flip stones in direction
function flip(index, player, direction) {
    index = index_to_direction(index, direction);
    if(is_flippable(index, player, direction)) {
        while(is_player(index) && map[index]!=player) {
            map[index] = player;
            index = index_to_direction(index, direction);
        }
    }
}

//add new move
function add(index, player) {
    for(var i = 0; i < DIRECTIONS.length; i++) {
        flip(index, player, DIRECTIONS[i]);
    }
    map[index] = player;
    draw_block(get_row(index), get_col(index), player);
    
}

//calc step in direction to index
function index_to_direction(index, direction) {
    switch(direction) {
		case "LEFT": return --index;
		case "RIGHT": return ++index;
		case "UP": return index - COLS;
		case "DOWN": return index + COLS;
		case "UPLEFT": return index - COLS - 1;
		case "UPRIGHT": return index - COLS + 1;
		case "DOWNLEFT": return index + COLS - 1;
		case "DOWNRIGHT": return index + COLS + 1;
		
		default: alert("error, unkonwn direction");
    }
}


function draw_possible_moves(player) {
    pm = possible_moves(player);
    console.log(pm.length)
    for(var i = 0; i < pm.length; i++) {
        map[pm[i]] = COLOR_POSS_MOVE;
    }
}

function undraw_possible_moves(player){
    for(var i = 0; i < pm.length; i++) {
        map[pm[i]] = COLOR_BOARD;
    }
}

function low_ai(player) {
    add(possible_moves(player)[0], player);
    draw_possible_moves(COLOR_PLAYER_ONE);
    draw_board();
    undraw_possible_moves();
    
    
}

//click event form board (compute move)
function board_click(ev) {
    var x = ev.clientX - canvas.offsetLeft,
    y = ev.clientY - canvas.offsetTop,
    clickedBlock = screen_to_block(x, y);
    //check that block is empty
    
    
    if(possible_moves(current_player).contains(block_to_index(clickedBlock.row + DEBUG, clickedBlock.col + DEBUG)) ) {
        //undraw_possible_moves();
        add(block_to_index(clickedBlock.row + DEBUG, clickedBlock.col + DEBUG), COLOR_PLAYER_ONE);
        draw_board();
        
    
        //low_ai(COLOR_PLAYER_TWO);
        
        do {
            low_ai(COLOR_PLAYER_TWO);
            if(possible_moves(COLOR_PLAYER_TWO).length == 0) {
                get_winner();
                break;
            }
        }
            while(possible_moves(COLOR_PLAYER_ONE).length == 0);
        
    } else {
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
        draw_block(current_row, current_col,map[block_to_index(current_row + DEBUG,current_col + DEBUG)]);
        current_row = clickedBlock.row;
        current_col = clickedBlock.col;
        //field is not a player
        if(map[block_to_index(current_row + DEBUG, current_col + DEBUG)]==COLOR_BOARD) {
            draw_block(current_row, current_col, COLOR_HOVER); 
        }
    }
}

//event when mouse leaves canvas
function mouse_out() {
    draw_block(current_row, current_col,map[block_to_index(current_row + 1,current_col + 1)]);
}

//window resize event
window.onresize = function(event) {
    renew_canvas_size();
};

//dynamic canvas size
function renew_canvas_size() {
    if(window.innerWidth > canvas_init_size) {
            ctx.canvas.width  = canvas_init_size;
            ctx.canvas.height = ctx.canvas.width;
    }
    else {
        ctx.canvas.width = window.innerWidth - 20;
        ctx.canvas.height = ctx.canvas.width;
    }
        
    block_size = (canvas.width/(COLS - 2 * DEBUG)) - SHADOW_SIZE;
    
        draw_possible_moves(COLOR_PLAYER_ONE);
    draw_board();
    undraw_possible_moves();
}

//init
function draw() {
    canvas = document.getElementById('reversi');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        canvas_init_size = canvas.width;
        generate_map();    
        renew_canvas_size();
        
        canvas.addEventListener('click', board_click, false);
        //canvas.addEventListener("mousemove", board_hover);
        canvas.addEventListener ("mouseout", mouse_out, false);
    } else {
        alert("error, canvas not supported!");
    }
}
