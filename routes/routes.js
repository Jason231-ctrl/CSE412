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
        // if user doesn't exist, create
        // and set computer as opponent
        const { player_name } = req.body;
        player = await pool.query(
            'INSERT INTO player (player_name) VALUES($1) RETURNING *', 
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
        const opponent = await pool.query(
            "SELECT * FROM player WHERE player_name = 'Computer';"
        );
        res.cookie('player', player.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
        res.cookie('opponent', opponent.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
        res.render('dashboard/dashboard', {
            'player': player.rows[0], 
            'opponent': opponent.rows[0],
            'player_stats': player_stats.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        const { player_name } = req.body;
        // if user exists, select
        // and set computer as opponent
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
            const opponent = await pool.query(
                "SELECT * FROM player WHERE player_name = 'Computer';"
            );
            console.log(player_stats.rows[0]);
            res.cookie('player', player.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
            res.cookie('opponent', opponent.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
            res.render('dashboard/dashboard', {
                'player': player.rows[0], 
                'opponent': opponent.rows[0],
                'player_stats': player_stats.rows[0]
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
            "SELECT * FROM player WHERE player_name = 'Computer';"
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

router.post('/boards', async (req, res) => {
    try {
        const { board } = req.body;
        player = await pool.query(
            "INSERT INTO board (board_status) VALUES('open') RETURNING *", 
            [board]
        );
        res.render('board/board', {'player': req.cookies.player, 'opponent': req.cookies.opponent, 'board': board});
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