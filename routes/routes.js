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
        const { player_name } = req.body;
        player = await pool.query(
            'INSERT INTO player (player_name) VALUES($1) RETURNING *', 
            [player_name]
        );
        res.cookie('player', player.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
        const player_stats = await pool.query(
            `select
                coalesce(sum(case
                    when plays_in.is_first = 1
                        and board.board_status = 'p1wins'
                        and player.player_name = $1
                        then 1
                    when plays_in.is_first = 0
                        and board.board_status = 'p2wins'
                        and player.player_name = $1
                        then 1
                    else 0
                end),0) as wins,
                coalesce(sum(case
                    when plays_in.is_first = 1
                        and board.board_status = 'p2wins'
                        and player.player_name = $1
                        then 1
                    when plays_in.is_first = 0
                        and board.board_status = 'p1wins'
                        and player.player_name = $1
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
                    and board.board_status = 'open'
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
                p1.player_id as player1_id,
                p2.player_name as player2_name,
                p2.player_id as player1_id
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
        res.cookie('opponent', opponent.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
        res.render('dashboard/dashboard', {
            'player': player.rows[0], 
            'opponent': opponent.rows[0],
            'player_stats': player_stats.rows[0],
            'boards': boards.rows
        });
    } catch (err) {
        if (err.message.startsWith("duplicate key value violates unique constraint")) {
            // if user exist error, just select it and repeat above
            const { player_name } = req.body;
            player = await pool.query(
                "SELECT * FROM player WHERE player_name = $1",
                [player_name]
            );
            res.cookie('player', player.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
            const player_stats = await pool.query(
                `select
                    coalesce(sum(case
                        when plays_in.is_first = 1
                            and board.board_status = 'p1wins'
                            and player.player_name = $1
                            then 1
                        when plays_in.is_first = 0
                            and board.board_status = 'p2wins'
                            and player.player_name = $1
                            then 1
                        else 0
                    end),0) as wins,
                    coalesce(sum(case
                        when plays_in.is_first = 1
                            and board.board_status = 'p2wins'
                            and player.player_name = $1
                            then 1
                        when plays_in.is_first = 0
                            and board.board_status = 'p1wins'
                            and player.player_name = $1
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
                        and board.board_status = 'open'
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
                    p1.player_id as player1_id,
                    p2.player_name as player2_name,
                    p2.player_id as player1_id
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
            res.cookie('opponent', opponent.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
            res.render('dashboard/dashboard', {
                'player': player.rows[0], 
                'opponent': opponent.rows[0],
                'player_stats': player_stats.rows[0],
                'boards': boards.rows
            });
        } else {
            console.error(err.message);
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

 // only used in admin so far
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

// only used in admin so far
router.delete('/players/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletePlayer = await pool.query('DELETE FROM player WHERE player_id = $1', [id]);
    } catch (err) {
        console.error(err);
    }
    res.redirect('/admin');
});

// not used so far
router.get('/boards', async (req, res) => {
    try {
        const boards = await pool.query('SELECT * FROM board');
        res.json(boards.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// this creates a new board
router.post('/boards', async (req, res) => {
    try {
        board = await pool.query("INSERT INTO board (board_status) VALUES('open') RETURNING *");
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
        board = await pool.query(
            `select
                player_piece.board_id,
                player_piece.player_id,
                player_piece.piece_id,
                player_piece.is_alive,
                player_piece.piece_position,
                player_piece.positions_available,
                case
                    when plays_in.is_first = 1 
                        and player_piece.piece_id in (9,10,11,12,13,14,15,16)
                        then 'pawn_w'
                    when plays_in.is_first = 1 
                        and player_piece.piece_id in (7,8)
                        then 'horse_w'
                    when plays_in.is_first = 1 
                        and player_piece.piece_id in (5,6)
                        then 'bishop_w'
                    when plays_in.is_first = 1 
                        and player_piece.piece_id in (3,4)
                        then 'rook_w'
                    when plays_in.is_first = 1 
                        and player_piece.piece_id in (2)
                        then 'queen_w'
                    when plays_in.is_first = 1 
                        and player_piece.piece_id in (1)
                        then 'king_w'
                    when plays_in.is_first = 0
                        and player_piece.piece_id in (9,10,11,12,13,14,15,16)
                        then 'pawn_b'
                    when plays_in.is_first = 0
                        and player_piece.piece_id in (7,8)
                        then 'horse_b'
                    when plays_in.is_first = 0
                        and player_piece.piece_id in (5,6)
                        then 'bishop_b'
                    when plays_in.is_first = 0
                        and player_piece.piece_id in (3,4)
                        then 'rook_b'
                    when plays_in.is_first = 0
                        and player_piece.piece_id in (2)
                        then 'queen_b'
                    when plays_in.is_first = 0
                        and player_piece.piece_id in (1)
                        then 'king_b'
                    else ''
                end as img
            from
                player_piece
                join plays_in
                    on player_piece.board_id = plays_in.board_id
                    and player_piece.player_id = plays_in.player_id
            where
                player_piece.board_id = $1
            ;`,
            [board.rows[0].board_id]
        );
        board_imgs = {
            a1: (board.rows.filter(p => p.piece_position === 'a1').length>0) ? board.rows.filter(p => p.piece_position === 'a1')[0].img : '',
            a2: (board.rows.filter(p => p.piece_position === 'a2').length>0) ? board.rows.filter(p => p.piece_position === 'a2')[0].img : '',
            a3: (board.rows.filter(p => p.piece_position === 'a3').length>0) ? board.rows.filter(p => p.piece_position === 'a3')[0].img : '',
            a4: (board.rows.filter(p => p.piece_position === 'a4').length>0) ? board.rows.filter(p => p.piece_position === 'a4')[0].img : '',
            a5: (board.rows.filter(p => p.piece_position === 'a5').length>0) ? board.rows.filter(p => p.piece_position === 'a5')[0].img : '',
            a6: (board.rows.filter(p => p.piece_position === 'a6').length>0) ? board.rows.filter(p => p.piece_position === 'a6')[0].img : '',
            a7: (board.rows.filter(p => p.piece_position === 'a7').length>0) ? board.rows.filter(p => p.piece_position === 'a7')[0].img : '',
            a8: (board.rows.filter(p => p.piece_position === 'a8').length>0) ? board.rows.filter(p => p.piece_position === 'a8')[0].img : '',
            b1: (board.rows.filter(p => p.piece_position === 'b1').length>0) ? board.rows.filter(p => p.piece_position === 'b1')[0].img : '',
            b2: (board.rows.filter(p => p.piece_position === 'b2').length>0) ? board.rows.filter(p => p.piece_position === 'b2')[0].img : '',
            b3: (board.rows.filter(p => p.piece_position === 'b3').length>0) ? board.rows.filter(p => p.piece_position === 'b3')[0].img : '',
            b4: (board.rows.filter(p => p.piece_position === 'b4').length>0) ? board.rows.filter(p => p.piece_position === 'b4')[0].img : '',
            b5: (board.rows.filter(p => p.piece_position === 'b5').length>0) ? board.rows.filter(p => p.piece_position === 'b5')[0].img : '',
            b6: (board.rows.filter(p => p.piece_position === 'b6').length>0) ? board.rows.filter(p => p.piece_position === 'b6')[0].img : '',
            b7: (board.rows.filter(p => p.piece_position === 'b7').length>0) ? board.rows.filter(p => p.piece_position === 'b7')[0].img : '',
            b8: (board.rows.filter(p => p.piece_position === 'b8').length>0) ? board.rows.filter(p => p.piece_position === 'b8')[0].img : '',
            c1: (board.rows.filter(p => p.piece_position === 'c1').length>0) ? board.rows.filter(p => p.piece_position === 'c1')[0].img : '',
            c2: (board.rows.filter(p => p.piece_position === 'c2').length>0) ? board.rows.filter(p => p.piece_position === 'c2')[0].img : '',
            c3: (board.rows.filter(p => p.piece_position === 'c3').length>0) ? board.rows.filter(p => p.piece_position === 'c3')[0].img : '',
            c4: (board.rows.filter(p => p.piece_position === 'c4').length>0) ? board.rows.filter(p => p.piece_position === 'c4')[0].img : '',
            c5: (board.rows.filter(p => p.piece_position === 'c5').length>0) ? board.rows.filter(p => p.piece_position === 'c5')[0].img : '',
            c6: (board.rows.filter(p => p.piece_position === 'c6').length>0) ? board.rows.filter(p => p.piece_position === 'c6')[0].img : '',
            c7: (board.rows.filter(p => p.piece_position === 'c7').length>0) ? board.rows.filter(p => p.piece_position === 'c7')[0].img : '',
            c8: (board.rows.filter(p => p.piece_position === 'c8').length>0) ? board.rows.filter(p => p.piece_position === 'c8')[0].img : '',
            d1: (board.rows.filter(p => p.piece_position === 'd1').length>0) ? board.rows.filter(p => p.piece_position === 'd1')[0].img : '',
            d2: (board.rows.filter(p => p.piece_position === 'd2').length>0) ? board.rows.filter(p => p.piece_position === 'd2')[0].img : '',
            d3: (board.rows.filter(p => p.piece_position === 'd3').length>0) ? board.rows.filter(p => p.piece_position === 'd3')[0].img : '',
            d4: (board.rows.filter(p => p.piece_position === 'd4').length>0) ? board.rows.filter(p => p.piece_position === 'd4')[0].img : '',
            d5: (board.rows.filter(p => p.piece_position === 'd5').length>0) ? board.rows.filter(p => p.piece_position === 'd5')[0].img : '',
            d6: (board.rows.filter(p => p.piece_position === 'd6').length>0) ? board.rows.filter(p => p.piece_position === 'd6')[0].img : '',
            d7: (board.rows.filter(p => p.piece_position === 'd7').length>0) ? board.rows.filter(p => p.piece_position === 'd7')[0].img : '',
            d8: (board.rows.filter(p => p.piece_position === 'd8').length>0) ? board.rows.filter(p => p.piece_position === 'd8')[0].img : '',
            e1: (board.rows.filter(p => p.piece_position === 'e1').length>0) ? board.rows.filter(p => p.piece_position === 'e1')[0].img : '',
            e2: (board.rows.filter(p => p.piece_position === 'e2').length>0) ? board.rows.filter(p => p.piece_position === 'e2')[0].img : '',
            e3: (board.rows.filter(p => p.piece_position === 'e3').length>0) ? board.rows.filter(p => p.piece_position === 'e3')[0].img : '',
            e4: (board.rows.filter(p => p.piece_position === 'e4').length>0) ? board.rows.filter(p => p.piece_position === 'e4')[0].img : '',
            e5: (board.rows.filter(p => p.piece_position === 'e5').length>0) ? board.rows.filter(p => p.piece_position === 'e5')[0].img : '',
            e6: (board.rows.filter(p => p.piece_position === 'e6').length>0) ? board.rows.filter(p => p.piece_position === 'e6')[0].img : '',
            e7: (board.rows.filter(p => p.piece_position === 'e7').length>0) ? board.rows.filter(p => p.piece_position === 'e7')[0].img : '',
            e8: (board.rows.filter(p => p.piece_position === 'e8').length>0) ? board.rows.filter(p => p.piece_position === 'e8')[0].img : '',
            f1: (board.rows.filter(p => p.piece_position === 'f1').length>0) ? board.rows.filter(p => p.piece_position === 'f1')[0].img : '',
            f2: (board.rows.filter(p => p.piece_position === 'f2').length>0) ? board.rows.filter(p => p.piece_position === 'f2')[0].img : '',
            f3: (board.rows.filter(p => p.piece_position === 'f3').length>0) ? board.rows.filter(p => p.piece_position === 'f3')[0].img : '',
            f4: (board.rows.filter(p => p.piece_position === 'f4').length>0) ? board.rows.filter(p => p.piece_position === 'f4')[0].img : '',
            f5: (board.rows.filter(p => p.piece_position === 'f5').length>0) ? board.rows.filter(p => p.piece_position === 'f5')[0].img : '',
            f6: (board.rows.filter(p => p.piece_position === 'f6').length>0) ? board.rows.filter(p => p.piece_position === 'f6')[0].img : '',
            f7: (board.rows.filter(p => p.piece_position === 'f7').length>0) ? board.rows.filter(p => p.piece_position === 'f7')[0].img : '',
            f8: (board.rows.filter(p => p.piece_position === 'f8').length>0) ? board.rows.filter(p => p.piece_position === 'f8')[0].img : '',
            g1: (board.rows.filter(p => p.piece_position === 'g1').length>0) ? board.rows.filter(p => p.piece_position === 'g1')[0].img : '',
            g2: (board.rows.filter(p => p.piece_position === 'g2').length>0) ? board.rows.filter(p => p.piece_position === 'g2')[0].img : '',
            g3: (board.rows.filter(p => p.piece_position === 'g3').length>0) ? board.rows.filter(p => p.piece_position === 'g3')[0].img : '',
            g4: (board.rows.filter(p => p.piece_position === 'g4').length>0) ? board.rows.filter(p => p.piece_position === 'g4')[0].img : '',
            g5: (board.rows.filter(p => p.piece_position === 'g5').length>0) ? board.rows.filter(p => p.piece_position === 'g5')[0].img : '',
            g6: (board.rows.filter(p => p.piece_position === 'g6').length>0) ? board.rows.filter(p => p.piece_position === 'g6')[0].img : '',
            g7: (board.rows.filter(p => p.piece_position === 'g7').length>0) ? board.rows.filter(p => p.piece_position === 'g7')[0].img : '',
            g8: (board.rows.filter(p => p.piece_position === 'g8').length>0) ? board.rows.filter(p => p.piece_position === 'g8')[0].img : '',
            h1: (board.rows.filter(p => p.piece_position === 'h1').length>0) ? board.rows.filter(p => p.piece_position === 'h1')[0].img : '',
            h2: (board.rows.filter(p => p.piece_position === 'h2').length>0) ? board.rows.filter(p => p.piece_position === 'h2')[0].img : '',
            h3: (board.rows.filter(p => p.piece_position === 'h3').length>0) ? board.rows.filter(p => p.piece_position === 'h3')[0].img : '',
            h4: (board.rows.filter(p => p.piece_position === 'h4').length>0) ? board.rows.filter(p => p.piece_position === 'h4')[0].img : '',
            h5: (board.rows.filter(p => p.piece_position === 'h5').length>0) ? board.rows.filter(p => p.piece_position === 'h5')[0].img : '',
            h6: (board.rows.filter(p => p.piece_position === 'h6').length>0) ? board.rows.filter(p => p.piece_position === 'h6')[0].img : '',
            h7: (board.rows.filter(p => p.piece_position === 'h7').length>0) ? board.rows.filter(p => p.piece_position === 'h7')[0].img : '',
            h8: (board.rows.filter(p => p.piece_position === 'h8').length>0) ? board.rows.filter(p => p.piece_position === 'h8')[0].img : ''
        };
        res.render('board/board', {
            'player': req.cookies.player, 
            'opponent': req.cookies.opponent,
            'board': board.rows,
            'board_imgs': board_imgs
        });
    } catch (err) {
        console.error(err.message);
    }
});

// open board in history
router.get('/boards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const board = await pool.query(
            `select
                player_piece.board_id,
                player_piece.player_id,
                player_piece.piece_id,
                player_piece.is_alive,
                player_piece.piece_position,
                player_piece.positions_available,
                case
                    when plays_in.is_first = 1 
                        and player_piece.piece_id in (9,10,11,12,13,14,15,16)
                        then 'pawn_w'
                    when plays_in.is_first = 1 
                        and player_piece.piece_id in (7,8)
                        then 'horse_w'
                    when plays_in.is_first = 1 
                        and player_piece.piece_id in (5,6)
                        then 'bishop_w'
                    when plays_in.is_first = 1 
                        and player_piece.piece_id in (3,4)
                        then 'rook_w'
                    when plays_in.is_first = 1 
                        and player_piece.piece_id in (2)
                        then 'queen_w'
                    when plays_in.is_first = 1 
                        and player_piece.piece_id in (1)
                        then 'king_w'
                    when plays_in.is_first = 0
                        and player_piece.piece_id in (9,10,11,12,13,14,15,16)
                        then 'pawn_b'
                    when plays_in.is_first = 0
                        and player_piece.piece_id in (7,8)
                        then 'horse_b'
                    when plays_in.is_first = 0
                        and player_piece.piece_id in (5,6)
                        then 'bishop_b'
                    when plays_in.is_first = 0
                        and player_piece.piece_id in (3,4)
                        then 'rook_b'
                    when plays_in.is_first = 0
                        and player_piece.piece_id in (2)
                        then 'queen_b'
                    when plays_in.is_first = 0
                        and player_piece.piece_id in (1)
                        then 'king_b'
                    else ''
                end as img
            from
                player_piece
                join plays_in
                    on player_piece.board_id = plays_in.board_id
                    and player_piece.player_id = plays_in.player_id
            where
                player_piece.board_id = $1
            ;`, 
            [id]
        );
        const opponent = await pool.query(
            `select
                player.player_id,
                player.player_name
            from 
                plays_in
                join board
                    on plays_in.board_id = board.board_id
                join player
                    on plays_in.player_id = player.player_id
            where
                board.board_id = $1
                and player.player_id != $2
            ;`,
            [id, req.cookies.player.player_id]
        );
        res.cookie('opponent', opponent.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
        board_imgs = {
            a1: (board.rows.filter(p => p.piece_position === 'a1').length>0) ? board.rows.filter(p => p.piece_position === 'a1')[0].img : '',
            a2: (board.rows.filter(p => p.piece_position === 'a2').length>0) ? board.rows.filter(p => p.piece_position === 'a2')[0].img : '',
            a3: (board.rows.filter(p => p.piece_position === 'a3').length>0) ? board.rows.filter(p => p.piece_position === 'a3')[0].img : '',
            a4: (board.rows.filter(p => p.piece_position === 'a4').length>0) ? board.rows.filter(p => p.piece_position === 'a4')[0].img : '',
            a5: (board.rows.filter(p => p.piece_position === 'a5').length>0) ? board.rows.filter(p => p.piece_position === 'a5')[0].img : '',
            a6: (board.rows.filter(p => p.piece_position === 'a6').length>0) ? board.rows.filter(p => p.piece_position === 'a6')[0].img : '',
            a7: (board.rows.filter(p => p.piece_position === 'a7').length>0) ? board.rows.filter(p => p.piece_position === 'a7')[0].img : '',
            a8: (board.rows.filter(p => p.piece_position === 'a8').length>0) ? board.rows.filter(p => p.piece_position === 'a8')[0].img : '',
            b1: (board.rows.filter(p => p.piece_position === 'b1').length>0) ? board.rows.filter(p => p.piece_position === 'b1')[0].img : '',
            b2: (board.rows.filter(p => p.piece_position === 'b2').length>0) ? board.rows.filter(p => p.piece_position === 'b2')[0].img : '',
            b3: (board.rows.filter(p => p.piece_position === 'b3').length>0) ? board.rows.filter(p => p.piece_position === 'b3')[0].img : '',
            b4: (board.rows.filter(p => p.piece_position === 'b4').length>0) ? board.rows.filter(p => p.piece_position === 'b4')[0].img : '',
            b5: (board.rows.filter(p => p.piece_position === 'b5').length>0) ? board.rows.filter(p => p.piece_position === 'b5')[0].img : '',
            b6: (board.rows.filter(p => p.piece_position === 'b6').length>0) ? board.rows.filter(p => p.piece_position === 'b6')[0].img : '',
            b7: (board.rows.filter(p => p.piece_position === 'b7').length>0) ? board.rows.filter(p => p.piece_position === 'b7')[0].img : '',
            b8: (board.rows.filter(p => p.piece_position === 'b8').length>0) ? board.rows.filter(p => p.piece_position === 'b8')[0].img : '',
            c1: (board.rows.filter(p => p.piece_position === 'c1').length>0) ? board.rows.filter(p => p.piece_position === 'c1')[0].img : '',
            c2: (board.rows.filter(p => p.piece_position === 'c2').length>0) ? board.rows.filter(p => p.piece_position === 'c2')[0].img : '',
            c3: (board.rows.filter(p => p.piece_position === 'c3').length>0) ? board.rows.filter(p => p.piece_position === 'c3')[0].img : '',
            c4: (board.rows.filter(p => p.piece_position === 'c4').length>0) ? board.rows.filter(p => p.piece_position === 'c4')[0].img : '',
            c5: (board.rows.filter(p => p.piece_position === 'c5').length>0) ? board.rows.filter(p => p.piece_position === 'c5')[0].img : '',
            c6: (board.rows.filter(p => p.piece_position === 'c6').length>0) ? board.rows.filter(p => p.piece_position === 'c6')[0].img : '',
            c7: (board.rows.filter(p => p.piece_position === 'c7').length>0) ? board.rows.filter(p => p.piece_position === 'c7')[0].img : '',
            c8: (board.rows.filter(p => p.piece_position === 'c8').length>0) ? board.rows.filter(p => p.piece_position === 'c8')[0].img : '',
            d1: (board.rows.filter(p => p.piece_position === 'd1').length>0) ? board.rows.filter(p => p.piece_position === 'd1')[0].img : '',
            d2: (board.rows.filter(p => p.piece_position === 'd2').length>0) ? board.rows.filter(p => p.piece_position === 'd2')[0].img : '',
            d3: (board.rows.filter(p => p.piece_position === 'd3').length>0) ? board.rows.filter(p => p.piece_position === 'd3')[0].img : '',
            d4: (board.rows.filter(p => p.piece_position === 'd4').length>0) ? board.rows.filter(p => p.piece_position === 'd4')[0].img : '',
            d5: (board.rows.filter(p => p.piece_position === 'd5').length>0) ? board.rows.filter(p => p.piece_position === 'd5')[0].img : '',
            d6: (board.rows.filter(p => p.piece_position === 'd6').length>0) ? board.rows.filter(p => p.piece_position === 'd6')[0].img : '',
            d7: (board.rows.filter(p => p.piece_position === 'd7').length>0) ? board.rows.filter(p => p.piece_position === 'd7')[0].img : '',
            d8: (board.rows.filter(p => p.piece_position === 'd8').length>0) ? board.rows.filter(p => p.piece_position === 'd8')[0].img : '',
            e1: (board.rows.filter(p => p.piece_position === 'e1').length>0) ? board.rows.filter(p => p.piece_position === 'e1')[0].img : '',
            e2: (board.rows.filter(p => p.piece_position === 'e2').length>0) ? board.rows.filter(p => p.piece_position === 'e2')[0].img : '',
            e3: (board.rows.filter(p => p.piece_position === 'e3').length>0) ? board.rows.filter(p => p.piece_position === 'e3')[0].img : '',
            e4: (board.rows.filter(p => p.piece_position === 'e4').length>0) ? board.rows.filter(p => p.piece_position === 'e4')[0].img : '',
            e5: (board.rows.filter(p => p.piece_position === 'e5').length>0) ? board.rows.filter(p => p.piece_position === 'e5')[0].img : '',
            e6: (board.rows.filter(p => p.piece_position === 'e6').length>0) ? board.rows.filter(p => p.piece_position === 'e6')[0].img : '',
            e7: (board.rows.filter(p => p.piece_position === 'e7').length>0) ? board.rows.filter(p => p.piece_position === 'e7')[0].img : '',
            e8: (board.rows.filter(p => p.piece_position === 'e8').length>0) ? board.rows.filter(p => p.piece_position === 'e8')[0].img : '',
            f1: (board.rows.filter(p => p.piece_position === 'f1').length>0) ? board.rows.filter(p => p.piece_position === 'f1')[0].img : '',
            f2: (board.rows.filter(p => p.piece_position === 'f2').length>0) ? board.rows.filter(p => p.piece_position === 'f2')[0].img : '',
            f3: (board.rows.filter(p => p.piece_position === 'f3').length>0) ? board.rows.filter(p => p.piece_position === 'f3')[0].img : '',
            f4: (board.rows.filter(p => p.piece_position === 'f4').length>0) ? board.rows.filter(p => p.piece_position === 'f4')[0].img : '',
            f5: (board.rows.filter(p => p.piece_position === 'f5').length>0) ? board.rows.filter(p => p.piece_position === 'f5')[0].img : '',
            f6: (board.rows.filter(p => p.piece_position === 'f6').length>0) ? board.rows.filter(p => p.piece_position === 'f6')[0].img : '',
            f7: (board.rows.filter(p => p.piece_position === 'f7').length>0) ? board.rows.filter(p => p.piece_position === 'f7')[0].img : '',
            f8: (board.rows.filter(p => p.piece_position === 'f8').length>0) ? board.rows.filter(p => p.piece_position === 'f8')[0].img : '',
            g1: (board.rows.filter(p => p.piece_position === 'g1').length>0) ? board.rows.filter(p => p.piece_position === 'g1')[0].img : '',
            g2: (board.rows.filter(p => p.piece_position === 'g2').length>0) ? board.rows.filter(p => p.piece_position === 'g2')[0].img : '',
            g3: (board.rows.filter(p => p.piece_position === 'g3').length>0) ? board.rows.filter(p => p.piece_position === 'g3')[0].img : '',
            g4: (board.rows.filter(p => p.piece_position === 'g4').length>0) ? board.rows.filter(p => p.piece_position === 'g4')[0].img : '',
            g5: (board.rows.filter(p => p.piece_position === 'g5').length>0) ? board.rows.filter(p => p.piece_position === 'g5')[0].img : '',
            g6: (board.rows.filter(p => p.piece_position === 'g6').length>0) ? board.rows.filter(p => p.piece_position === 'g6')[0].img : '',
            g7: (board.rows.filter(p => p.piece_position === 'g7').length>0) ? board.rows.filter(p => p.piece_position === 'g7')[0].img : '',
            g8: (board.rows.filter(p => p.piece_position === 'g8').length>0) ? board.rows.filter(p => p.piece_position === 'g8')[0].img : '',
            h1: (board.rows.filter(p => p.piece_position === 'h1').length>0) ? board.rows.filter(p => p.piece_position === 'h1')[0].img : '',
            h2: (board.rows.filter(p => p.piece_position === 'h2').length>0) ? board.rows.filter(p => p.piece_position === 'h2')[0].img : '',
            h3: (board.rows.filter(p => p.piece_position === 'h3').length>0) ? board.rows.filter(p => p.piece_position === 'h3')[0].img : '',
            h4: (board.rows.filter(p => p.piece_position === 'h4').length>0) ? board.rows.filter(p => p.piece_position === 'h4')[0].img : '',
            h5: (board.rows.filter(p => p.piece_position === 'h5').length>0) ? board.rows.filter(p => p.piece_position === 'h5')[0].img : '',
            h6: (board.rows.filter(p => p.piece_position === 'h6').length>0) ? board.rows.filter(p => p.piece_position === 'h6')[0].img : '',
            h7: (board.rows.filter(p => p.piece_position === 'h7').length>0) ? board.rows.filter(p => p.piece_position === 'h7')[0].img : '',
            h8: (board.rows.filter(p => p.piece_position === 'h8').length>0) ? board.rows.filter(p => p.piece_position === 'h8')[0].img : ''
        };
        res.render('board/board', {
            'player': req.cookies.player,
            'opponent': opponent.rows[0], 
            'board': board.rows,
            'board_imgs': board_imgs
        });
    } catch (err) {
        console.error(err.message);
    }
});

// quit board in history and refresh dashboard
router.post('/boards/:id/quit', async (req, res) => {
    try {
        const { id } = req.params;
        // finding out who is player1 so we can assign a winner
        const boardStatus = await pool.query(
            `SELECT 
                plays_in.board_id,
                CASE
                    when is_first = 1 then 'p2wins'
                    when is_first = 0 then 'p1wins'
                    else 'open'
                END as board_status
            FROM
                plays_in 
            WHERE 
                plays_in.board_id = $1 
                and plays_in.player_id = $2
            ;`,
            [id, req.cookies.player.player_id]
        ); 
        // update board_status to opponent as winner
        const quitBoard = await pool.query(
            `UPDATE board SET board_status = $1 WHERE board_id = $2`,
            [boardStatus.rows[0].board_status, boardStatus.rows[0].board_id]
        );
        player_name = req.cookies.player.player_name;
        const player_stats = await pool.query(
            `select
                coalesce(sum(case
                    when plays_in.is_first = 1
                        and board.board_status = 'p1wins'
                        and player.player_name = $1
                        then 1
                    when plays_in.is_first = 0
                        and board.board_status = 'p2wins'
                        and player.player_name = $1
                        then 1
                    else 0
                end),0) as wins,
                coalesce(sum(case
                    when plays_in.is_first = 1
                        and board.board_status = 'p2wins'
                        and player.player_name = $1
                        then 1
                    when plays_in.is_first = 0
                        and board.board_status = 'p1wins'
                        and player.player_name = $1
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
                    and board.board_status = 'open'
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
                p1.player_id as player1_id,
                p2.player_name as player2_name,
                p2.player_id as player1_id
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
        res.render('dashboard/dashboard', {
            'player': req.cookies.player,
            'opponent': opponent.rows[0],
            'player_stats': player_stats.rows[0],
            'boards': boards.rows
        });
    } catch (err) {
        console.error(err);
    }
});

// DASHBOARD Page
router.get('/dashboard', async (req, res) => {
    try {
        player_name = req.cookies.player.player_name;
        const player_stats = await pool.query(
            `select
                coalesce(sum(case
                    when plays_in.is_first = 1
                        and board.board_status = 'p1wins'
                        and player.player_name = $1
                        then 1
                    when plays_in.is_first = 0
                        and board.board_status = 'p2wins'
                        and player.player_name = $1
                        then 1
                    else 0
                end),0) as wins,
                coalesce(sum(case
                    when plays_in.is_first = 1
                        and board.board_status = 'p2wins'
                        and player.player_name = $1
                        then 1
                    when plays_in.is_first = 0
                        and board.board_status = 'p1wins'
                        and player.player_name = $1
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
                    and board.board_status = 'open'
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
                p1.player_id as player1_id,
                p2.player_name as player2_name,
                p2.player_id as player1_id
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
        res.cookie('opponent', opponent.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
        res.render('dashboard/dashboard', {
            'player': req.cookies.player, 
            'opponent': opponent.rows[0],
            'player_stats': player_stats.rows[0],
            'boards': boards.rows
        });
    } catch (err) {
        console.log(err);
    }
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