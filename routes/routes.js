const express = require('express');
const router = express.Router();
const pool = require('../models/db');

router.get('/players', async (req, res) => {
    try {
        const allPlayers = await pool.query('SELECT * FROM player');
        res.json(allPlayers.rows);
    } catch (err) {
        console.error(err.message);
    }
});

router.post('/players', async (req, res) => {
    try {
        // player: if user doesn't exist, create
        // player_stats: wins/losses, defaults to 0
        // oppontent: default computer
        const { player_name } = req.body;
        player = await pool.query(
            'INSERT INTO player (player_name) VALUES($1) RETURNING *', 
            [player_name]
        );

        // player wins and losses
        const player_stats = await pool.query(
            `select
                coalesce(sum(case
                    when plays_in.is_first = 1
                        and board.board_status = 'p1wins' 
                        then 1
                    else 0
                end),0) as wins,
                coalesce(sum(case
                    when plays_in.is_first = 0
                        and board.board_status = 'p2wins' 
                        then 1
                    else 0
                end),0) as losses
            from 
                plays_in
                join board
                    on plays_in.board_id = board.board_id
                join player
                    on plays_in.player_id = player.player_id
            where
                player.player_name = $1;`,
            [player_name]
        );

        // player board history
        const boards = await pool.query(
            `with player_boards as (
                select
                    board.board_id,
                    player.player_id,
                    plays_in.is_first
                from
                    plays_in
                    join player
                        on plays_in.player_id = player.player_id
                    join board
                        on plays_in.board_id = board.board_id
                where
                    player.player_name = $1
            ),
            players_in_boards as (
                select
                    player_boards.board_id,
                    max(case
                        when plays_in.is_first = 1 then plays_in.player_id
                        else 0
                    end) as player1,
                    max(case
                        when plays_in.is_first = 0 then plays_in.player_id
                        else 0
                    end) as player2
                from 
                    player_boards
                    join plays_in
                        on player_boards.board_id = plays_in.board_id
                    join player
                        on plays_in.player_id = player.player_id
                group by
                    player_boards.board_id
            )
            select
                pib.board_id,
                p1.player_name as player1_name,
                p2.player_name as player2_name
            from
                players_in_boards pib
                join player p1
                    on pib.player1 = p1.player_id
                join player p2
                    on pib.player2 = p2.player_id
            ;`,
            [player_name]
        );
        const opponent = await pool.query(
            "SELECT * FROM player WHERE player_name = 'COMPUTER';"
        );
        res.cookie('player', player.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
        res.cookie('opponent', opponent.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
        res.render('dashboard/dashboard', {
            'player': player.rows[0], 
            'opponent': opponent.rows[0],
            'player_stats': player_stats.rows[0],
            'boards': boards.rows
        });
    } catch (err) {
        console.error(err.message);
        const { player_name } = req.body;
        // player: if user exists, select
        // player_stats: wins/losses, defaults to 0
        // oppontent: default computer
        if (err.message.startsWith("duplicate key value violates unique constraint")) {
            player = await pool.query(
                "SELECT * FROM player WHERE player_name = $1",
                [player_name]
            );
            const player_stats = await pool.query(
                `select
                    coalesce(sum(case
                        when plays_in.is_first = 1
                            and board.board_status = 'p1wins' 
                            then 1
                        else 0
                    end),0) as wins,
                    coalesce(sum(case
                        when plays_in.is_first = 0
                            and board.board_status = 'p2wins' 
                            then 1
                        else 0
                    end),0) as losses
                from 
                    plays_in
                    join board
                        on plays_in.board_id = board.board_id
                    join player
                        on plays_in.player_id = player.player_id
                where
                    player.player_name = $1;`,
                [player_name]
            );
            const boards = await pool.query(
                `with player_boards as (
                    select
                        board.board_id,
                        player.player_id,
                        plays_in.is_first
                    from
                        plays_in
                        join player
                            on plays_in.player_id = player.player_id
                        join board
                            on plays_in.board_id = board.board_id
                    where
                        player.player_name = $1
                ),
                players_in_boards as (
                    select
                        player_boards.board_id,
                        max(case
                            when plays_in.is_first = 1 then plays_in.player_id
                            else 0
                        end) as player1,
                        max(case
                            when plays_in.is_first = 0 then plays_in.player_id
                            else 0
                        end) as player2
                    from 
                        player_boards
                        join plays_in
                            on player_boards.board_id = plays_in.board_id
                        join player
                            on plays_in.player_id = player.player_id
                    group by
                        player_boards.board_id
                )
                select
                    pib.board_id,
                    p1.player_name as player1_name,
                    p2.player_name as player2_name
                from
                    players_in_boards pib
                    join player p1
                        on pib.player1 = p1.player_id
                    join player p2
                        on pib.player2 = p2.player_id
                ;`,
                [player_name]
            );
            const opponent = await pool.query(
                "SELECT * FROM player WHERE player_name = 'COMPUTER';"
            );
            res.cookie('player', player.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
            res.cookie('opponent', opponent.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
            res.render('dashboard/dashboard', {
                'player': player.rows[0], 
                'opponent': opponent.rows[0],
                'player_stats': player_stats.rows[0],
                'boards': boards.rows
            });
        }
    }
});

router.get('/players/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const player = await pool.query(
            'SELECT * FROM player WHERE player_id = $1', 
            [id]
        );
        const opponent = await pool.query(
            "SELECT * FROM player WHERE player_name = 'COMPUTER';"
        );
        res.cookie('player', player.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
        res.cookie('opponent', opponent.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
        res.render('dashboard/dashboard', {'player': player.rows[0], 'opponent': opponent.rows[0]});
    } catch (err) {
        console.error(err.message);
    }
});

router.put('/players/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { player_name } = req.body;
        const updatePlayer = await pool.query(
            'UPDATE player SET player_name = $1 WHERE player_id = $2',
            [player_name, id]
        );
    } catch (err) {
        console.error(err);
    }
    res.redirect('/admin');
});

router.delete('/players/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletePlayer = await pool.query('DELETE FROM player WHERE player_id = $1', [id]);
    } catch (err) {
        console.error(err);
    }
    res.redirect('/admin');
});

router.get('/boards', async (req, res) => {
    try {
        const boards = await pool.query('SELECT * FROM board');
        res.json(boards.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// this creates the board
router.post('/boards', async (req, res) => {
    try {
        board = await pool.query(
            "INSERT INTO board (board_status) VALUES('open') RETURNING *"
        );
        player1 = await pool.query(
            `insert into plays_in(board_id, player_id, is_first, is_turn) values($1, $2, 1, 1)`,
            [board.rows[0].board_id, req.body.player_id]
        );
        player2 = await pool.query(
            `insert into plays_in(board_id, player_id, is_first, is_turn) values($1, $2, 0, 0)`,
            [board.rows[0].board_id, req.body.opponent_id]
        );
        white_rook1 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 3, 1, 'a1', '');`,
            [board.rows[0].board_id, req.body.player_id]
        );
        white_knight1 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 7, 1, 'b1', '');`,
            [board.rows[0].board_id, req.body.player_id]
        );
        white_bishop1 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 5, 1, 'c1', '');`,
            [board.rows[0].board_id, req.body.player_id]
        );
        white_queen =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 2, 1, 'd1', '');`,
            [board.rows[0].board_id, req.body.player_id]
        );
        white_king =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 1, 1, 'e1', '');`,
            [board.rows[0].board_id, req.body.player_id]
        );
        white_bishop2 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 6, 1, 'f1', '');`,
            [board.rows[0].board_id, req.body.player_id]
        );
        white_knight2 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 8, 1, 'g1', '');`,
            [board.rows[0].board_id, req.body.player_id]
        );
        white_rook2 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 4, 1, 'h1', '');`,
            [board.rows[0].board_id, req.body.player_id]
        );
        white_pawn1 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 9, 1, 'a2', '');`,
            [board.rows[0].board_id, req.body.player_id]
        );
        white_pawn2 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 10, 1, 'b2', '');`,
            [board.rows[0].board_id, req.body.player_id]
        );
        white_pawn3 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 11, 1, 'c2', '');`,
            [board.rows[0].board_id, req.body.player_id]
        );
        white_pawn4 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 12, 1, 'd2', '');`,
            [board.rows[0].board_id, req.body.player_id]
        );
        white_pawn5 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 13, 1, 'e2', '');`,
            [board.rows[0].board_id, req.body.player_id]
        );
        white_pawn6 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 14, 1, 'f2', '');`,
            [board.rows[0].board_id, req.body.player_id]
        );
        white_pawn7 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 15, 1, 'g2', '');`,
            [board.rows[0].board_id, req.body.player_id]
        );
        white_pawn8 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 16, 1, 'h2', '');`,
            [board.rows[0].board_id, req.body.player_id]
        );
        black_pawn1 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 9, 1, 'a7', '');`,
            [board.rows[0].board_id, req.body.opponent_id]
        );
        black_pawn2 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 10, 1, 'b7', '');`,
            [board.rows[0].board_id, req.body.opponent_id]
        );
        black_pawn3 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 11, 1, 'c7', '');`,
            [board.rows[0].board_id, req.body.opponent_id]
        );
        black_pawn4 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 12, 1, 'd7', '');`,
            [board.rows[0].board_id, req.body.opponent_id]
        );
        black_pawn5 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 13, 1, 'e7', '');`,
            [board.rows[0].board_id, req.body.opponent_id]
        );
        black_pawn6 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 14, 1, 'f7', '');`,
            [board.rows[0].board_id, req.body.opponent_id]
        );
        black_pawn7 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 15, 1, 'g7', '');`,
            [board.rows[0].board_id, req.body.opponent_id]
        );
        black_pawn8 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 16, 1, 'h7', '');`,
            [board.rows[0].board_id, req.body.opponent_id]
        );
        black_rook1 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 3, 1, 'a8', '');`,
            [board.rows[0].board_id, req.body.opponent_id]
        );
        black_knight1 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 7, 1, 'b8', '');`,
            [board.rows[0].board_id, req.body.opponent_id]
        );
        black_bishop1 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 5, 1, 'c8', '');`,
            [board.rows[0].board_id, req.body.opponent_id]
        );
        black_queen =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 2, 1, 'd8', '');`,
            [board.rows[0].board_id, req.body.opponent_id]
        );
        black_king =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 1, 1, 'e8', '');`,
            [board.rows[0].board_id, req.body.opponent_id]
        );
        black_bishop2 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 6, 1, 'f8', '');`,
            [board.rows[0].board_id, req.body.opponent_id]
        );
        black_knight2 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 8, 1, 'g8', '');`,
            [board.rows[0].board_id, req.body.opponent_id]
        );
        black_rook2 =  await pool.query(
            `INSERT INTO player_piece(
                board_id, player_id, piece_id, is_alive, piece_position, positions_available
            ) VALUES($1, $2, 4, 1, 'h8', '');`,
            [board.rows[0].board_id, req.body.opponent_id]
        );
        res.render('board/board', {
            'player': req.cookies.player, 
            'opponent': req.cookies.opponent,
            'board': board.rows[0]
        });
    } catch (err) {
        console.error(err.message);
    }
});

// needs playsin and playerpiece update
router.get('/boards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const board = await pool.query(
            'SELECT * FROM board WHERE board = $1', 
            [id]
        );
        res.render('board/board', {'player': req.cookies.player, 'opponent': req.cookies.opponent, 'board': board});
    } catch (err) {
        console.error(err.message);
    }
});

router.put('/boards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { player_name } = req.body;
        const updatePlayer = await pool.query(
            'UPDATE player SET player_name = $1 WHERE player_id = $2',
            [player_name, id]
        );
    } catch (err) {
        console.error(err);
    }
    res.redirect('/admin');
});

router.delete('/boards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletePlayer = await pool.query('DELETE FROM board WHERE board_id = $1', [id]);
    } catch (err) {
        console.error(err);
    }
    res.redirect('/admin');
});

// DASHBOARD Page
router.get('/dashboard', async (req, res) => {
    res.render('dashboard/dashboard', {'player': req.cookies.player, 'opponent': opponent.rows[0]});
});

// BOARD Page
router.get('/board', async (req, res) => {
    // this should be a board call instead, but gotta handle error-handling of choosing/creating boards
    // i think this is assuming new game against computer is chosen
    const player1 = await pool.query('SELECT * FROM player WHERE player_id = $1;', [req.cookies.player.player_id]);
    const player2 = await pool.query('SELECT * FROM player WHERE player_id = $1;', [req.cookies.opponent.player_id]);
    res.render('board/board', {'player': player1.rows[0], 'opponent': player2.rows[0]});
});

// START PAGE
router.get('/', async (req, res) => {
    res.render('start/start');
});

// API TESTING PAGE
router.get('/admin', async (req, res) => {
    try {
        const allPlayers = await pool.query('SELECT * FROM player');
        res.render('admin', {'players': allPlayers.rows});
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;