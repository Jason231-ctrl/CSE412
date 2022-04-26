if(document.getElementById("matchTitle").textContent == "p1wins) " + document.getElementById("playerName").textContent +" vs COMPUTER"){
	document.getElementById("resultText").textContent = "You won!"
	document.getElementById("resultScreen").classList.add("resultAnimation");
}

if(document.getElementById("matchTitle").textContent == "p2wins) " + document.getElementById("playerName").textContent +" vs COMPUTER"){
	document.getElementById("resultText").textContent = "You Lost!"
	document.getElementById("resultScreen").classList.add("resultAnimation");
}

// helper functions
var is_move_inside_board = function(move_data) {return move_data.row <= 7 && move_data.column <= 7 && move_data.row >= 0 && move_data.column >= 0;}
var parse_square = function(square) {
	square = (square.tagName==='BUTTON') ? square : square.parentElement;
    var splitId = square.id.split("-");
	return {row: parseInt(splitId[1]), column: parseInt(splitId[3])}
}
var get_loc_id = function(pos) {
	var row = 8-pos.row;
	var col = '';
	if (pos.column===0) {
		col='A';
	} else if (pos.column===1) {
		col='B';
	} else if (pos.column===2) {
		col='C';
	} else if (pos.column===3) {
		col='D';
	} else if (pos.column===4) {
		col='E';
	} else if (pos.column===5) {
		col='F';
	} else if (pos.column===6) {
		col='G';
	} else if (pos.column===7) {
		col='H';
	}
	return col+row;
}
var get_loc_id_lower = function(pos) {
	var row = 8-pos.row;
	var col = '';
	if (pos.column===0) {
		col='a';
	} else if (pos.column===1) {
		col='b';
	} else if (pos.column===2) {
		col='c';
	} else if (pos.column===3) {
		col='d';
	} else if (pos.column===4) {
		col='e';
	} else if (pos.column===5) {
		col='f';
	} else if (pos.column===6) {
		col='g';
	} else if (pos.column===7) {
		col='h';
	}
	return col+row;
}

// chess pieces
var Piece = function() {};
Piece.prototype.move_paths = [];
Piece.prototype.set_cur_pos = function(cur_pos) {
	this.cur_pos = cur_pos;
};

var Bishop1 = function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
	this.id = 5;
};
Bishop1.prototype = new Piece();
Bishop1.prototype.get_move_paths = function() {
	var cur_row, cur_col;
	this.move_paths = [];
	move_up_right = []; 
	this.move_paths.push(move_up_right);
	for (cur_col = this.cur_pos.column + 1, cur_row = this.cur_pos.row - 1; cur_col <= 7 && cur_row >= 0; cur_col++, cur_row-- ) {
		move_up_right.push({row: cur_row, column: cur_col});
	}
	move_down_right = []; 
	this.move_paths.push(move_down_right);
	for (cur_col = this.cur_pos.column + 1, cur_row = this.cur_pos.row + 1; cur_col <= 7 && cur_row <= 7; cur_col++, cur_row++ ) {
		move_down_right.push({row: cur_row, column: cur_col});
	}
	move_up_left = [];
	this.move_paths.push(move_up_left);
	for (cur_col = this.cur_pos.column - 1, cur_row = this.cur_pos.row - 1; cur_col >= 0 && cur_row >=0; cur_col--, cur_row-- ) {
		move_up_left.push({row: cur_row, column: cur_col})
	}
	move_down_left = []; 
	this.move_paths.push(move_down_left);
	for (cur_col = this.cur_pos.column-1, cur_row = this.cur_pos.row+1; cur_col >= 0 && cur_row <= 7; cur_col--, cur_row++ ) {
		move_down_left.push({row: cur_row, column: cur_col});
	}
	return this.move_paths;
}
var Bishop2 = function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
	this.id = 6;
};
Bishop2.prototype = new Piece();
Bishop2.prototype.get_move_paths = function() {
	var cur_row, cur_col;
	this.move_paths = [];
	move_up_right = []; 
	this.move_paths.push(move_up_right);
	for (cur_col = this.cur_pos.column + 1, cur_row = this.cur_pos.row - 1; cur_col <= 7 && cur_row >= 0; cur_col++, cur_row-- ) {
		move_up_right.push({row: cur_row, column: cur_col});
	}
	move_down_right = []; 
	this.move_paths.push(move_down_right);
	for (cur_col = this.cur_pos.column + 1, cur_row = this.cur_pos.row + 1; cur_col <= 7 && cur_row <= 7; cur_col++, cur_row++ ) {
		move_down_right.push({row: cur_row, column: cur_col});
	}
	move_up_left = [];
	this.move_paths.push(move_up_left);
	for (cur_col = this.cur_pos.column - 1, cur_row = this.cur_pos.row - 1; cur_col >= 0 && cur_row >=0; cur_col--, cur_row-- ) {
		move_up_left.push({row: cur_row, column: cur_col})
	}
	move_down_left = []; 
	this.move_paths.push(move_down_left);
	for (cur_col = this.cur_pos.column-1, cur_row = this.cur_pos.row+1; cur_col >= 0 && cur_row <= 7; cur_col--, cur_row++ ) {
		move_down_left.push({row: cur_row, column: cur_col});
	}
	return this.move_paths;
}

var King = function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
	this.id = 1;
};
King.prototype = new Piece();
King.prototype.get_move_paths = function() {
	this.move_paths = [];
	move_right = [];
	this.move_paths.push(move_right);
	if (this.cur_pos.column != 7) move_right.push({row: this.cur_pos.row, column: this.cur_pos.column + 1}) 
	move_up_right = [];
	this.move_paths.push(move_up_right);
	if (this.cur_pos.column != 7 && this.cur_pos.row != 0) move_up_right.push({row: this.cur_pos.row - 1, column: this.cur_pos.column + 1}) 
	move_up = [];
	this.move_paths.push(move_up);
	if (this.cur_pos.row != 0) move_up.push({row: this.cur_pos.row - 1, column: this.cur_pos.column}) 
	move_up_left = [];
	this.move_paths.push(move_up_left);
	if (this.cur_pos.row != 0 && this.cur_pos.column != 0) move_up_left.push({row: this.cur_pos.row - 1, column: this.cur_pos.column - 1}) 
	move_left = [];
	this.move_paths.push(move_left);
	if (this.cur_pos.row != 0) move_left.push({row: this.cur_pos.row, column: this.cur_pos.column - 1}) 
	move_down_left = [];
	this.move_paths.push(move_down_left);
	if (this.cur_pos.row != 7 && this.cur_pos.column != 0) move_down_left.push({row: this.cur_pos.row + 1, column: this.cur_pos.column - 1}) 
	move_down = [];
	this.move_paths.push(move_down);
	if (this.cur_pos.row != 7) move_down.push({row: this.cur_pos.row + 1, column: this.cur_pos.column});
	move_down_right = [];
	this.move_paths.push(move_down_right);
	if (this.cur_pos.row != 7 && this.cur_pos.column != 7) move_down_right.push({row: this.cur_pos.row + 1, column: this.cur_pos.column + 1});
	return this.move_paths;
}

var Knight1 =  function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
	this.id = 7;
};
Knight1.prototype = new Piece();
Knight1.prototype.get_move_paths = function() {
	this.move_paths = [];
	var move1, move2, move3, move4, move5, move6, move7, move8;
	path1 = [];
	this.move_paths.push(path1);
	move1 = {row: this.cur_pos.row - 1, column: this.cur_pos.column + 2};
	if (is_move_inside_board(move1)) {
		path1.push(move1);
	}
	path2 = [];
	this.move_paths.push(path2);
	move2 = {row: this.cur_pos.row - 2, column: this.cur_pos.column + 1};
	if (is_move_inside_board(move2)) {
		path2.push(move2);
	}
	path3 = [];
	this.move_paths.push(path3);
	move3 = {row: this.cur_pos.row-2, column: this.cur_pos.column-1};
	if (is_move_inside_board(move3)) {
		path3.push(move3);
	}
	path4 = [];
	this.move_paths.push(path4);
	move4 = {row: this.cur_pos.row-1, column: this.cur_pos.column-2};
	if (is_move_inside_board(move4)) {
		path4.push(move4);
	}
	path5 = [];
	this.move_paths.push(path5);
	move5 = {row: this.cur_pos.row+1, column: this.cur_pos.column-2};
	if (is_move_inside_board(move5)) {
		path5.push(move5);
	}
	path6 = [];
	this.move_paths.push(path6);	
	move6 = {row: this.cur_pos.row+2, column: this.cur_pos.column-1};
	if (is_move_inside_board(move6)) {
		path6.push(move6);
	}
	path7 = [];
	this.move_paths.push(path7);
	move7 = {row: this.cur_pos.row+2, column: this.cur_pos.column+1};
	if (is_move_inside_board(move7)) {
		path7.push(move7);
	}
	path8 = [];
	this.move_paths.push(path8);
	move8 = {row: this.cur_pos.row+1, column: this.cur_pos.column+2};
	if (is_move_inside_board(move8)) {
		path8.push(move8);
	}
	return this.move_paths;
};
var Knight2 =  function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
	this.id = 8;
};
Knight2.prototype = new Piece();
Knight2.prototype.get_move_paths = function() {
	this.move_paths = [];
	var move1, move2, move3, move4, move5, move6, move7, move8;
	path1 = [];
	this.move_paths.push(path1);
	move1 = {row: this.cur_pos.row - 1, column: this.cur_pos.column + 2};
	if (is_move_inside_board(move1)) {
		path1.push(move1);
	}
	path2 = [];
	this.move_paths.push(path2);
	move2 = {row: this.cur_pos.row - 2, column: this.cur_pos.column + 1};
	if (is_move_inside_board(move2)) {
		path2.push(move2);
	}
	path3 = [];
	this.move_paths.push(path3);
	move3 = {row: this.cur_pos.row-2, column: this.cur_pos.column-1};
	if (is_move_inside_board(move3)) {
		path3.push(move3);
	}
	path4 = [];
	this.move_paths.push(path4);
	move4 = {row: this.cur_pos.row-1, column: this.cur_pos.column-2};
	if (is_move_inside_board(move4)) {
		path4.push(move4);
	}
	path5 = [];
	this.move_paths.push(path5);
	move5 = {row: this.cur_pos.row+1, column: this.cur_pos.column-2};
	if (is_move_inside_board(move5)) {
		path5.push(move5);
	}
	path6 = [];
	this.move_paths.push(path6);	
	move6 = {row: this.cur_pos.row+2, column: this.cur_pos.column-1};
	if (is_move_inside_board(move6)) {
		path6.push(move6);
	}
	path7 = [];
	this.move_paths.push(path7);
	move7 = {row: this.cur_pos.row+2, column: this.cur_pos.column+1};
	if (is_move_inside_board(move7)) {
		path7.push(move7);
	}
	path8 = [];
	this.move_paths.push(path8);
	move8 = {row: this.cur_pos.row+1, column: this.cur_pos.column+2};
	if (is_move_inside_board(move8)) {
		path8.push(move8);
	}
	return this.move_paths;
};

var Queen = function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
	this.id = 2;
};
Queen.prototype = new Piece();
Queen.prototype.get_move_paths = function() {
	this.move_paths = [];
	Rook1.prototype.get_move_paths.call(this);
	var rookmove_paths = this.move_paths;
	Bishop1.prototype.get_move_paths.call(this);
	this.move_paths = this.move_paths.concat(rookmove_paths);
	return this.move_paths;
}

var Rook1 = function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
	this.id = 3;
};
Rook1.prototype = new Piece();
Rook1.prototype.get_move_paths = function() {
	this.move_paths = [];
	move_right = [];
	this.move_paths.push(move_right);
	for(var column = this.cur_pos.column + 1; column <= 7; column++) {
		move_right.push({row: this.cur_pos.row, column: column});
	}
	move_left = [];
	this.move_paths.push(move_left);
	for(var column = this.cur_pos.column - 1; column >= 0 ; column--) {
		move_left.push({row: this.cur_pos.row, column: column});
	}
	move_up = [];
	this.move_paths.push(move_up);
	for(var row = this.cur_pos.row - 1; row >= 0 ; row--) {
		move_up.push({row: row, column: this.cur_pos.column});
	}
	move_down = [];
	this.move_paths.push(move_down);
	for(var row = this.cur_pos.row + 1; row <= 7; row++) {
		move_down.push({row: row, column: this.cur_pos.column});
	}
	return this.move_paths;
}
var Rook2 = function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
	this.id = 4;
};
Rook2.prototype = new Piece();
Rook2.prototype.get_move_paths = function() {
	this.move_paths = [];
	move_right = [];
	this.move_paths.push(move_right);
	for(var column = this.cur_pos.column + 1; column <= 7; column++) {
		move_right.push({row: this.cur_pos.row, column: column});
	}
	move_left = [];
	this.move_paths.push(move_left);
	for(var column = this.cur_pos.column - 1; column >= 0 ; column--) {
		move_left.push({row: this.cur_pos.row, column: column});
	}
	move_up = [];
	this.move_paths.push(move_up);
	for(var row = this.cur_pos.row - 1; row >= 0 ; row--) {
		move_up.push({row: row, column: this.cur_pos.column});
	}
	move_down = [];
	this.move_paths.push(move_down);
	for(var row = this.cur_pos.row + 1; row <= 7; row++) {
		move_down.push({row: row, column: this.cur_pos.column});
	}
	return this.move_paths;
}

var Pawn1 = function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
	this.id = 9;
};
Pawn1.prototype = new Piece();
Pawn1.prototype.get_move_paths = function() {
	var move_march_forward, move_diagonal_kill_right, move_diagonal_kill_left;
	this.move_paths = [];
	if (this.team === '1') {
		move_march_forward = {row: this.cur_pos.row - 1, column: this.cur_pos.column}
		if (this.cur_pos.row !== 0) this.move_paths.push(move_march_forward);
		move_diagonal_kill_right = {row: this.cur_pos.row - 1, column:this.cur_pos.column + 1}
		if (this.cur_pos.row !== 0 && this.cur_pos.column !== 7) this.move_paths.push(move_diagonal_kill_right);
		move_diagonal_kill_left = {row: this.cur_pos.row - 1, column:this.cur_pos.column - 1}
		if (this.cur_pos.row !== 0 && this.cur_pos.column !== 0) this.move_paths.push(move_diagonal_kill_left);
		if (this.cur_pos.row === 6) this.move_paths.push({row: this.cur_pos.row-2, column: this.cur_pos.column});
	}
	else {
		move_march_forward = {row: this.cur_pos.row + 1, column: this.cur_pos.column}
		if (this.cur_pos.row !== 7) this.move_paths.push(move_march_forward);
		move_diagonal_kill_right = {row: this.cur_pos.row + 1, column:this.cur_pos.column - 1}
		if (this.cur_pos.row !== 7 && this.cur_pos.column != 0) this.move_paths.push(move_diagonal_kill_right);
		move_diagonal_kill_left = {row: this.cur_pos.row + 1, column:this.cur_pos.column + 1}
		if (this.cur_pos.row !== 7 && this.cur_pos.column != 7) this.move_paths.push(move_diagonal_kill_left);
		if (this.cur_pos.row === 1) this.move_paths.push({row: this.cur_pos.row + 2, column: this.cur_pos.column});
	}
	return this.move_paths;
}
var Pawn2 = function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
	this.id = 10;
};
Pawn2.prototype = new Piece();
Pawn2.prototype.get_move_paths = function() {
	var move_march_forward, move_diagonal_kill_right, move_diagonal_kill_left;
	this.move_paths = [];
	if (this.team === '1') {
		move_march_forward = {row: this.cur_pos.row - 1, column: this.cur_pos.column}
		if (this.cur_pos.row !== 0) this.move_paths.push(move_march_forward);
		move_diagonal_kill_right = {row: this.cur_pos.row - 1, column:this.cur_pos.column + 1}
		if (this.cur_pos.row !== 0 && this.cur_pos.column !== 7) this.move_paths.push(move_diagonal_kill_right);
		move_diagonal_kill_left = {row: this.cur_pos.row - 1, column:this.cur_pos.column - 1}
		if (this.cur_pos.row !== 0 && this.cur_pos.column !== 0) this.move_paths.push(move_diagonal_kill_left);
		if (this.cur_pos.row === 6) this.move_paths.push({row: this.cur_pos.row-2, column: this.cur_pos.column});
	}
	else {
		move_march_forward = {row: this.cur_pos.row + 1, column: this.cur_pos.column}
		if (this.cur_pos.row !== 7) this.move_paths.push(move_march_forward);
		move_diagonal_kill_right = {row: this.cur_pos.row + 1, column:this.cur_pos.column - 1}
		if (this.cur_pos.row !== 7 && this.cur_pos.column != 0) this.move_paths.push(move_diagonal_kill_right);
		move_diagonal_kill_left = {row: this.cur_pos.row + 1, column:this.cur_pos.column + 1}
		if (this.cur_pos.row !== 7 && this.cur_pos.column != 7) this.move_paths.push(move_diagonal_kill_left);
		if (this.cur_pos.row === 1) this.move_paths.push({row: this.cur_pos.row + 2, column: this.cur_pos.column});
	}
	return this.move_paths;
}
var Pawn3 = function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
	this.id = 11;
};
Pawn3.prototype = new Piece();
Pawn3.prototype.get_move_paths = function() {
	var move_march_forward, move_diagonal_kill_right, move_diagonal_kill_left;
	this.move_paths = [];
	if (this.team === '1') {
		move_march_forward = {row: this.cur_pos.row - 1, column: this.cur_pos.column}
		if (this.cur_pos.row !== 0) this.move_paths.push(move_march_forward);
		move_diagonal_kill_right = {row: this.cur_pos.row - 1, column:this.cur_pos.column + 1}
		if (this.cur_pos.row !== 0 && this.cur_pos.column !== 7) this.move_paths.push(move_diagonal_kill_right);
		move_diagonal_kill_left = {row: this.cur_pos.row - 1, column:this.cur_pos.column - 1}
		if (this.cur_pos.row !== 0 && this.cur_pos.column !== 0) this.move_paths.push(move_diagonal_kill_left);
		if (this.cur_pos.row === 6) this.move_paths.push({row: this.cur_pos.row-2, column: this.cur_pos.column});
	}
	else {
		move_march_forward = {row: this.cur_pos.row + 1, column: this.cur_pos.column}
		if (this.cur_pos.row !== 7) this.move_paths.push(move_march_forward);
		move_diagonal_kill_right = {row: this.cur_pos.row + 1, column:this.cur_pos.column - 1}
		if (this.cur_pos.row !== 7 && this.cur_pos.column != 0) this.move_paths.push(move_diagonal_kill_right);
		move_diagonal_kill_left = {row: this.cur_pos.row + 1, column:this.cur_pos.column + 1}
		if (this.cur_pos.row !== 7 && this.cur_pos.column != 7) this.move_paths.push(move_diagonal_kill_left);
		if (this.cur_pos.row === 1) this.move_paths.push({row: this.cur_pos.row + 2, column: this.cur_pos.column});
	}
	return this.move_paths;
}
var Pawn4 = function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
	this.id = 12;
};
Pawn4.prototype = new Piece();
Pawn4.prototype.get_move_paths = function() {
	var move_march_forward, move_diagonal_kill_right, move_diagonal_kill_left;
	this.move_paths = [];
	if (this.team === '1') {
		move_march_forward = {row: this.cur_pos.row - 1, column: this.cur_pos.column}
		if (this.cur_pos.row !== 0) this.move_paths.push(move_march_forward);
		move_diagonal_kill_right = {row: this.cur_pos.row - 1, column:this.cur_pos.column + 1}
		if (this.cur_pos.row !== 0 && this.cur_pos.column !== 7) this.move_paths.push(move_diagonal_kill_right);
		move_diagonal_kill_left = {row: this.cur_pos.row - 1, column:this.cur_pos.column - 1}
		if (this.cur_pos.row !== 0 && this.cur_pos.column !== 0) this.move_paths.push(move_diagonal_kill_left);
		if (this.cur_pos.row === 6) this.move_paths.push({row: this.cur_pos.row-2, column: this.cur_pos.column});
	}
	else {
		move_march_forward = {row: this.cur_pos.row + 1, column: this.cur_pos.column}
		if (this.cur_pos.row !== 7) this.move_paths.push(move_march_forward);
		move_diagonal_kill_right = {row: this.cur_pos.row + 1, column:this.cur_pos.column - 1}
		if (this.cur_pos.row !== 7 && this.cur_pos.column != 0) this.move_paths.push(move_diagonal_kill_right);
		move_diagonal_kill_left = {row: this.cur_pos.row + 1, column:this.cur_pos.column + 1}
		if (this.cur_pos.row !== 7 && this.cur_pos.column != 7) this.move_paths.push(move_diagonal_kill_left);
		if (this.cur_pos.row === 1) this.move_paths.push({row: this.cur_pos.row + 2, column: this.cur_pos.column});
	}
	return this.move_paths;
}
var Pawn5 = function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
	this.id = 13;
};
Pawn5.prototype = new Piece();
Pawn5.prototype.get_move_paths = function() {
	var move_march_forward, move_diagonal_kill_right, move_diagonal_kill_left;
	this.move_paths = [];
	if (this.team === '1') {
		move_march_forward = {row: this.cur_pos.row - 1, column: this.cur_pos.column}
		if (this.cur_pos.row !== 0) this.move_paths.push(move_march_forward);
		move_diagonal_kill_right = {row: this.cur_pos.row - 1, column:this.cur_pos.column + 1}
		if (this.cur_pos.row !== 0 && this.cur_pos.column !== 7) this.move_paths.push(move_diagonal_kill_right);
		move_diagonal_kill_left = {row: this.cur_pos.row - 1, column:this.cur_pos.column - 1}
		if (this.cur_pos.row !== 0 && this.cur_pos.column !== 0) this.move_paths.push(move_diagonal_kill_left);
		if (this.cur_pos.row === 6) this.move_paths.push({row: this.cur_pos.row-2, column: this.cur_pos.column});
	}
	else {
		move_march_forward = {row: this.cur_pos.row + 1, column: this.cur_pos.column}
		if (this.cur_pos.row !== 7) this.move_paths.push(move_march_forward);
		move_diagonal_kill_right = {row: this.cur_pos.row + 1, column:this.cur_pos.column - 1}
		if (this.cur_pos.row !== 7 && this.cur_pos.column != 0) this.move_paths.push(move_diagonal_kill_right);
		move_diagonal_kill_left = {row: this.cur_pos.row + 1, column:this.cur_pos.column + 1}
		if (this.cur_pos.row !== 7 && this.cur_pos.column != 7) this.move_paths.push(move_diagonal_kill_left);
		if (this.cur_pos.row === 1) this.move_paths.push({row: this.cur_pos.row + 2, column: this.cur_pos.column});
	}
	return this.move_paths;
}
var Pawn6 = function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
	this.id = 14;
};
Pawn6.prototype = new Piece();
Pawn6.prototype.get_move_paths = function() {
	var move_march_forward, move_diagonal_kill_right, move_diagonal_kill_left;
	this.move_paths = [];
	if (this.team === '1') {
		move_march_forward = {row: this.cur_pos.row - 1, column: this.cur_pos.column}
		if (this.cur_pos.row !== 0) this.move_paths.push(move_march_forward);
		move_diagonal_kill_right = {row: this.cur_pos.row - 1, column:this.cur_pos.column + 1}
		if (this.cur_pos.row !== 0 && this.cur_pos.column !== 7) this.move_paths.push(move_diagonal_kill_right);
		move_diagonal_kill_left = {row: this.cur_pos.row - 1, column:this.cur_pos.column - 1}
		if (this.cur_pos.row !== 0 && this.cur_pos.column !== 0) this.move_paths.push(move_diagonal_kill_left);
		if (this.cur_pos.row === 6) this.move_paths.push({row: this.cur_pos.row-2, column: this.cur_pos.column});
	}
	else {
		move_march_forward = {row: this.cur_pos.row + 1, column: this.cur_pos.column}
		if (this.cur_pos.row !== 7) this.move_paths.push(move_march_forward);
		move_diagonal_kill_right = {row: this.cur_pos.row + 1, column:this.cur_pos.column - 1}
		if (this.cur_pos.row !== 7 && this.cur_pos.column != 0) this.move_paths.push(move_diagonal_kill_right);
		move_diagonal_kill_left = {row: this.cur_pos.row + 1, column:this.cur_pos.column + 1}
		if (this.cur_pos.row !== 7 && this.cur_pos.column != 7) this.move_paths.push(move_diagonal_kill_left);
		if (this.cur_pos.row === 1) this.move_paths.push({row: this.cur_pos.row + 2, column: this.cur_pos.column});
	}
	return this.move_paths;
}
var Pawn7 = function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
	this.id = 15;
};
Pawn7.prototype = new Piece();
Pawn7.prototype.get_move_paths = function() {
	var move_march_forward, move_diagonal_kill_right, move_diagonal_kill_left;
	this.move_paths = [];
	if (this.team === '1') {
		move_march_forward = {row: this.cur_pos.row - 1, column: this.cur_pos.column}
		if (this.cur_pos.row !== 0) this.move_paths.push(move_march_forward);
		move_diagonal_kill_right = {row: this.cur_pos.row - 1, column:this.cur_pos.column + 1}
		if (this.cur_pos.row !== 0 && this.cur_pos.column !== 7) this.move_paths.push(move_diagonal_kill_right);
		move_diagonal_kill_left = {row: this.cur_pos.row - 1, column:this.cur_pos.column - 1}
		if (this.cur_pos.row !== 0 && this.cur_pos.column !== 0) this.move_paths.push(move_diagonal_kill_left);
		if (this.cur_pos.row === 6) this.move_paths.push({row: this.cur_pos.row-2, column: this.cur_pos.column});
	}
	else {
		move_march_forward = {row: this.cur_pos.row + 1, column: this.cur_pos.column}
		if (this.cur_pos.row !== 7) this.move_paths.push(move_march_forward);
		move_diagonal_kill_right = {row: this.cur_pos.row + 1, column:this.cur_pos.column - 1}
		if (this.cur_pos.row !== 7 && this.cur_pos.column != 0) this.move_paths.push(move_diagonal_kill_right);
		move_diagonal_kill_left = {row: this.cur_pos.row + 1, column:this.cur_pos.column + 1}
		if (this.cur_pos.row !== 7 && this.cur_pos.column != 7) this.move_paths.push(move_diagonal_kill_left);
		if (this.cur_pos.row === 1) this.move_paths.push({row: this.cur_pos.row + 2, column: this.cur_pos.column});
	}
	return this.move_paths;
}
var Pawn8 = function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
	this.id = 16;
};
Pawn8.prototype = new Piece();
Pawn8.prototype.get_move_paths = function() {
	var move_march_forward, move_diagonal_kill_right, move_diagonal_kill_left;
	this.move_paths = [];
	if (this.team === '1') {
		move_march_forward = {row: this.cur_pos.row - 1, column: this.cur_pos.column}
		if (this.cur_pos.row !== 0) this.move_paths.push(move_march_forward);
		move_diagonal_kill_right = {row: this.cur_pos.row - 1, column:this.cur_pos.column + 1}
		if (this.cur_pos.row !== 0 && this.cur_pos.column !== 7) this.move_paths.push(move_diagonal_kill_right);
		move_diagonal_kill_left = {row: this.cur_pos.row - 1, column:this.cur_pos.column - 1}
		if (this.cur_pos.row !== 0 && this.cur_pos.column !== 0) this.move_paths.push(move_diagonal_kill_left);
		if (this.cur_pos.row === 6) this.move_paths.push({row: this.cur_pos.row-2, column: this.cur_pos.column});
	}
	else {
		move_march_forward = {row: this.cur_pos.row + 1, column: this.cur_pos.column}
		if (this.cur_pos.row !== 7) this.move_paths.push(move_march_forward);
		move_diagonal_kill_right = {row: this.cur_pos.row + 1, column:this.cur_pos.column - 1}
		if (this.cur_pos.row !== 7 && this.cur_pos.column != 0) this.move_paths.push(move_diagonal_kill_right);
		move_diagonal_kill_left = {row: this.cur_pos.row + 1, column:this.cur_pos.column + 1}
		if (this.cur_pos.row !== 7 && this.cur_pos.column != 7) this.move_paths.push(move_diagonal_kill_left);
		if (this.cur_pos.row === 1) this.move_paths.push({row: this.cur_pos.row + 2, column: this.cur_pos.column});
	}
	return this.move_paths;
}

var board_display = function() {
	var board = [
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null]
	];
	var is_empty = function(pos) {return board[pos.row][pos.column] === null;};
	var is_occuppied = function(pos, team) {return board[pos.row][pos.column] !== null && board[pos.row][pos.column].team !== team;};
	var validate_moves = function(piece) {
		var valid_moves = [];
		if (piece instanceof Pawn1 
			|| piece instanceof Pawn2
			|| piece instanceof Pawn3
			|| piece instanceof Pawn4
			|| piece instanceof Pawn5
			|| piece instanceof Pawn6
			|| piece instanceof Pawn7
			|| piece instanceof Pawn8) {
			piece.get_move_paths().forEach(function(move) {
				if (move.column === piece.cur_pos.column && move.row < piece.cur_pos.row) { 
					for (var i = piece.cur_pos.row - 1; i >= move.row ; i--) {
						if (is_empty({row: i, column: move.column})) {
							valid_moves.push({row: i, column: move.column});
						} else {break;}
					}
				}
				if (move.column === piece.cur_pos.column && move.row > piece.cur_pos.row) { 
					for (var i = piece.cur_pos.row + 1; i <= move.row ; i++) {
						if (is_empty({row: i, column: move.column})) {
							valid_moves.push({row: i, column: move.column});
						} else {break;}
					}
				}
				if (move.column !== piece.cur_pos.column) {
					if (is_occuppied({row: move.row, column: move.column}, piece.team)) {
						valid_moves.push({row: move.row, column: move.column});
					}
				}

			});
		}
		else { 
			piece.get_move_paths().forEach(function(path) {
				if (path.length > 0) {
					path.every(function(move) {
						if(is_empty(move)) {
							valid_moves.push(move);
							return true;
						} else if (is_occuppied(move, piece.team)) {
							valid_moves.push(move);
							return false;
						} else {
							return false;
						}
					});
				}
			});
		}
		return valid_moves;
	};
	return {
		initialize: function() {
			// maybe insert db board here
			// for every square, read html
			document.querySelectorAll('.square').forEach(function(square) {
				// use img to create pieces
				var img_src_split = square.getElementsByTagName('img')[0].src.split("/");
				var img_name = img_src_split[img_src_split.length-1].split(".")[0]; // 'rook_b'
				var piece_name = img_name.split("_")[0]; // 'rook'
				var team = (img_name.charAt(img_name.length-1)==='w') ? '1' : '0';  // '0'
				var pos = square.parentElement.id;
				var row = 8-parseInt(pos.charAt(pos.length-1)); // 8
				var col_char = pos.charAt(0); // 'A'
				var col;

				if (col_char==='A') {
					col=0;
				} else if (col_char==='B') {
					col=1;
				} else if (col_char==='C') {
					col=2;
				} else if (col_char==='D') {
					col=3;
				} else if (col_char==='E') {
					col=4;
				} else if (col_char==='F') {
					col=5;
				} else if (col_char==='G') {
					col=6;
				} else if (col_char==='H') {
					col=7;
				} // 0

				if (piece_name==='king') {
					piece = new King(team, {row: row, column: col});
					board[row][col] = piece;
				} else if (piece_name==='queen') {
					piece = new Queen(team, {row: row, column: col});
					board[row][col] = piece;
				} else if (piece_name==='bishop1') {
					piece = new Bishop1(team, {row: row, column: col});
					board[row][col] = piece;
				} else if (piece_name==='bishop2') {
					piece = new Bishop2(team, {row: row, column: col});
					board[row][col] = piece;
				} else if (piece_name==='knight1') {
					piece = new Knight1(team, {row: row, column: col});
					board[row][col] = piece;
				} else if (piece_name==='knight2') {
					piece = new Knight2(team, {row: row, column: col});
					board[row][col] = piece;
				} else if (piece_name==='rook1') {
					piece = new Rook1(team, {row: row, column: col});
					board[row][col] = piece;
				} else if (piece_name==='rook2') {
					piece = new Rook2(team, {row: row, column: col});
					board[row][col] = piece;
				} else if (piece_name==='pawn1') {
					piece = new Pawn1(team, {row: row, column: col});
					board[row][col] = piece;
				} else if (piece_name==='pawn2') {
					piece = new Pawn2(team, {row: row, column: col});
					board[row][col] = piece;
				} else if (piece_name==='pawn3') {
					piece = new Pawn3(team, {row: row, column: col});
					board[row][col] = piece;
				} else if (piece_name==='pawn4') {
					piece = new Pawn4(team, {row: row, column: col});
					board[row][col] = piece;
				} else if (piece_name==='pawn5') {
					piece = new Pawn5(team, {row: row, column: col});
					board[row][col] = piece;
				} else if (piece_name==='pawn6') {
					piece = new Pawn6(team, {row: row, column: col});
					board[row][col] = piece;
				} else if (piece_name==='pawn7') {
					piece = new Pawn7(team, {row: row, column: col});
					board[row][col] = piece;
				} else if (piece_name==='pawn8') {
					piece = new Pawn8(team, {row: row, column: col});
					board[row][col] = piece;
				}
			});
		},
		get_piece: function(pos) {
			return board[pos.row][pos.column];
		},
		get_possible_moves: function(pos) {
			var piece;
			piece = board[pos.row][pos.column];
			return validate_moves(piece);
		},
		move_piece: function(from_pos, to_pos) {
			board[to_pos.row][to_pos.column] = board[from_pos.row][from_pos.column];
			board[from_pos.row][from_pos.column] = null;
			board[to_pos.row][to_pos.column].set_cur_pos(to_pos);
		},
		board: board
	}
}();

var interface = function() {
	return {
		set_square_color: function(pos) {
            square_id = get_loc_id(pos);
			square = document.getElementById(square_id);
			square.style.background = "";
		},
		highlight_square: function(pos) {
            square_id = get_loc_id(pos);
			square = document.getElementById(square_id);
			square.style.background = "lightgreen";
		},
		reset_square_colors: function() {
			document.querySelectorAll('.square').forEach(function(square) {
				square_data = parse_square(square);
				interface.set_square_color(square_data);
			});
		},
		set_square_piece: function(start_square_data, square_data, piece_id) {
			square = document.getElementById("row-" + square_data.row + "-column-" + square_data.column);

			// send post request and update board
			board_id = document.querySelectorAll('[data-boardid]')[0].dataset.boardid;
			player_id = document.querySelectorAll('[data-playerid]')[0].dataset.playerid;
			opponent_id = document.querySelectorAll('[data-opponentid]')[0].dataset.opponentid;
			is_turn = document.querySelectorAll('[data-isturn]')[0].dataset.isturn;
			old_position = get_loc_id_lower(start_square_data);
			new_position = get_loc_id_lower(square_data);

			fetch("/boards/"+board_id, {
				method: "POST",
				headers: {'Content-Type': 'application/json'}, 
				body: JSON.stringify({
					board_id: board_id,
					player_id: player_id,
					opponent_id: opponent_id,
					piece_id: piece_id,
					player_turn: (is_turn==="1") ? 0 : 1,
					opponent_turn: (is_turn==="1") ? 1 : 0,
					old_position: old_position,
					new_position: new_position,
				})
			  }).then(res => {
				console.log("Request complete! response:", res);
				window.open("/boards/"+board_id, "_self");
			  });
		}
	}
}();

var chess = function(chessboard, user_interface) {
	var selected_piece = null;
	var possible_moves = null;
	var selected_square_data = null;
	var player1 = {team: '1'}
	var player2 = {team: '0'}
	var active = (document.querySelectorAll('[data-isturn]')[0].dataset.isturn==='1') ? player1 : player2;

	var toggle_active_player = function() {
		active = (active.team === '1' ? player2 : player1)
	};
	var setup_event_listeners = function() {
		document.querySelectorAll('.square').forEach(function(square) {
			square.addEventListener('click', make_move_or_show_possible_moves);
		});
	};
	var make_move_or_show_possible_moves = function(event) {
		square = event.target;
		square_data = parse_square(square);
		selected_piece ? make_move(square_data) : show_possible_moves(square_data);
	};
	var show_possible_moves = function(square_data) {
		if (is_valid_square(square_data)) {
			selected_piece = chessboard.get_piece(square_data);
			selected_square_data = square_data;
			possible_moves = chessboard.get_possible_moves(square_data);
			possible_moves.forEach(function(possible_move){
				user_interface.highlight_square(possible_move);
			});
		}
	};
	var make_move = function(move_data) {
		user_interface.reset_square_colors();
		if (is_valid_move(move_data)) {
			chessboard.move_piece(selected_square_data, move_data);
			user_interface.set_square_piece(selected_square_data, move_data, selected_piece.id);
		}
		selected_piece = null;
		selected_square_data = null;
		possible_moves = null;
	};
	var is_valid_square = function(square_data) {
		var piece = chessboard.get_piece(square_data);
		return piece != null && piece.team === active.team;
	};
	var is_valid_move = function(move_data) {
		var valid = false;
		possible_moves.forEach(function(square_data) {
			if (JSON.stringify(square_data) === JSON.stringify(move_data)) {
				valid = true;
				this.break;
			}
		});
		return valid;		
	};
	var player2_moves = function() {
		var all_possible_moves = [];
		document.querySelectorAll('.square').forEach(function(square) {
			square_data = parse_square(square);
			if (is_valid_square(square_data)) {
				var sample_possible_moves = chessboard.get_possible_moves(square_data);
				sample_possible_moves.forEach(function(possible_move){
					all_possible_moves.push([square_data, possible_move]);
				});
			}
		});
		if (active.team==='0') {
			var random_guess = all_possible_moves[Math.floor((Math.random()*all_possible_moves.length))];
			show_possible_moves(random_guess[0]);
			make_move(random_guess[1]);
		}
	};
	return {
		init: function() {
			user_interface.reset_square_colors();
			chessboard.initialize();
			setup_event_listeners();
			player2_moves();
		}
	};
}(board_display, interface);

chess.init();