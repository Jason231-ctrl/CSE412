CREATE DATABASE ChessDB;

CREATE TYPE gamestat as enum ('open', 'draw', 'p1wins', 'p2wins');

CREATE TABLE player (
	player_id serial PRIMARY KEY,
  player_name varchar(32) NOT NULL UNIQUE
);

CREATE TABLE board (
	board_id serial PRIMARY KEY,
	board_status gamestat NOT NULL
);

CREATE TABLE piece (
	piece_id serial PRIMARY KEY,
	piece_name varchar(16) UNIQUE NOT NULL
);

CREATE TABLE plays_in (
	board_id int REFERENCES board (board_id),
	player_id int REFERENCES player (player_id),
	is_first smallint CHECK (is_first in (0,1)) NOT NULL,
	UNIQUE (board_id, player_id, is_first),
	PRIMARY KEY (board_id, player_id)
);

CREATE TABLE player_piece (
	board_id int REFERENCES board (board_id),
	player_id int REFERENCES player (player_id),
	piece_id int REFERENCES piece (piece_id),
	is_alive smallint CHECK (is_alive in (0,1)) NOT NULL,
	piece_position varchar(2) UNIQUE NOT NULL,
	positions_available varchar(128) NOT NULL, 
	PRIMARY KEY (board_id, player_id, piece_id)
);