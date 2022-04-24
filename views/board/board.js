
// helper functions
var is_move_inside_board = function(move_data) {return move_data.row <= 7 && move_data.column <= 7 && move_data.row >= 0 && move_data.column >= 0;}
var parse_square = function(square) {
    var col_letter = square.charAt(0);
    var row = 8-parseInt(square.charAt(1));

    var col = 0;
    if (col==='B') {
        col = 1;
    } else if (col==='C') {
        col = 2;
    } else if (col==='D') {
        col = 3;
    } else if (col==='E') {
        col = 4;
    } else if (col==='F') {
        col = 5;
    } else if (col==='G') {
        col = 6;
    } else if (col==='H') {
        col = 7;
    }
    return {row: row, column: col}
}

// chess pieces
var Piece = function() {};
Piece.prototype.move_paths = [];
Piece.prototype.set_cur_pos = function(cur_pos) {
	this.cur_pos = cur_pos;
};
var Bishop = function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
};
Bishop.prototype = new Piece();
Bishop.prototype.get_move_paths = function() {
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
var Knight =  function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
};
Knight.prototype = new Piece();
Knight.prototype.get_move_paths = function() {
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
var Pawn = function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
};
Pawn.prototype = new Piece();
Pawn.prototype.get_move_paths = function() {
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
var Queen = function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
};
Queen.prototype = new Piece();
Queen.prototype.get_move_paths = function() {
	this.move_paths = [];
	Rook.prototype.get_move_paths.call(this);
	var rookmove_paths = this.move_paths;
	Bishop.prototype.get_move_paths.call(this);
	this.move_paths = this.move_paths.concat(rookmove_paths);
	return this.move_paths;
}

var Rook = function(team, cur_pos) {
	this.team = team;
	this.cur_pos = cur_pos;
};
Rook.prototype = new Piece();
Rook.prototype.get_move_paths = function() {
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
		if (piece instanceof Pawn) {
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
		else { // Rook, Bishop, King, Queen
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
			king = new King('1', {row: 7, column: 4});
			board[7][4] = king;
			queen = new Queen('1', {row: 7, column: 3});
			board[7][3] = queen;
			bishop = new Bishop('1', {row: 7, column: 2});
			board[7][2] = bishop;
			bishop = new Bishop('1', {row: 7, column: 5});
			board[7][5] = bishop;
			knight = new Knight('1', {row: 7, column: 1});
			board[7][1] = knight;
			knight = new Knight('1', {row: 7, column: 6});
			board[7][6] = knight;
			rook = new Rook('1', {row: 7, column: 0});
			board[7][0] = rook;
			rook = new Rook('1', {row: 7, column: 7});
			board[7][7] = rook;
			for(var i = 0; i <= 7; i++) {
				pawn = new Pawn('1', {row: 6, column: i});
				board[6][i] = pawn;
			}
			king = new King('0', {row: 0, column: 4});
			board[0][4] = king;
			queen = new Queen('0', {row: 0, column: 3});
			board[0][3] = queen;
			bishop = new Bishop('0', {row: 0, column: 2});
			board[0][2] = bishop;
			bishop = new Bishop('0', {row: 0, column: 5});
			board[0][5] = bishop;
			knight = new Knight('0', {row: 0, column: 1});
			board[0][1] = knight;
			knight = new Knight('0', {row: 0, column: 6});
			board[0][6] = knight;
			rook = new Rook('0', {row: 0, column: 0});
			board[0][0] = rook;
			rook = new Rook('0', {row: 0, column: 7});		
			board[0][7] = rook;
			for(var i = 0; i <= 7; i++) {
				pawn = new Pawn('0', {row: 1, column: i});
				board[1][i] = pawn;
			}
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
			square = document.getElementById(col+row);
			if (( (pos.row % 2 === 1) && (pos.column % 2 === 0)) ||
			  	((pos.row % 2 === 0) && (pos.column % 2 === 1)) ) {
				square.style.background = "#7E757B";
			}
			else {
				square.style.background = "";
			}
		},
		highlight_square: function(pos) {
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
			document.getElementById(col+row).style.background = "#4CAF50";
		},
		reset_square_colors: function() {
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
			document.querySelectorAll('.square').forEach(function(square) {
				square_data = parse_square(square);
				interface.set_square_color(square_data);
			});
		},
		set_square_text: function(text) {
			square = document.getElementById(col+row);
			square.innerHTML = text;
		}
	}
}();

var chess = function(chessboard, user_interface) {
	var selected_piece = null;
	var possible_moves = null;
	var selected_square_data = null;
	var player1 = {team: '1'}
	var player2 = {team: '0'}
	var active = player1;

	var toggle_active_player = function() {
		active = (active.team === '1' ? player2 : player1)
	};
	var setup_event_listeners = function() {
		document.querySelectorAll('.square').forEach(function(square) {
			square.addEventListener('click', make_move_or_show_possible_moves);
		});
	};
	var make_move_or_show_possible_moves = function(event) {
		var square_data;
		square = event.target;
		square_data = parse_square(square);
		selected_piece ? make_move(square_data) : show_possible_moves(square_data);
	};
	var show_possible_moves = function(square_data) {
		if (is_valid_square(square_data)) {
			selected_piece = chessboard.get_piece(square_data);
			selected_square_data = square_data;
			possible_moves = chessboard.get_possible_moves(square_data);
			possible_moves.forEach(function(possibleMove){
				user_interface.highlight_square(possibleMove);
			});
		}
	};
	var make_move = function(move_data) {
		user_interface.reset_square_colors();
		if (is_valid_move(move_data)) {
			chessboard.move_piece(selected_square_data, move_data);
			user_interface.set_square_text(move_data, "x");
			user_interface.set_square_text(selected_square_data, "&nbsp");
			toggle_active_player();
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
	return {
		init: function() {
			user_interface.reset_square_colors();
			chessboard.initialize();
			setup_event_listeners();
		}
	};

}(board_display, interface);

chess.init();