const express = require('express');
const router = express.Router();
const pool = require('../models/db');

//get all players
router.get('/players', async (req, res) => {
    try {
        const allPlayers = await pool.query('SELECT * FROM player');
        res.json(allPlayers.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//create a player
router.post('/players', async (req, res) => {
    try {
        const { player_name } = req.body;
        player = await pool.query(
            'INSERT INTO player (player_name) VALUES($1) RETURNING *', 
            [player_name]
        );
        const opponent = await pool.query(
            "SELECT * FROM player WHERE player_name = 'computer';"
        );
        res.cookie('player', player.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
        res.cookie('opponent', opponent.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
        res.render('dashboard/dashboard', {'player': player.rows[0], 'opponent': opponent.rows[0]});
    } catch (err) {
        console.error(err.message);
        const { player_name } = req.body;
        if (err.message.startsWith("duplicate key value violates unique constraint")) {
            player = await pool.query(
                "SELECT * FROM player WHERE player_name = $1",
                [player_name]
            );
            const opponent = await pool.query(
                "SELECT * FROM player WHERE player_name = 'computer';"
            );
            res.cookie('player', player.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
            res.cookie('opponent', opponent.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
            res.render('dashboard/dashboard', {'player': player.rows[0], 'opponent': opponent.rows[0]});
        }
    }
    
});

//get a player
router.get('/players/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const player = await pool.query(
            'SELECT * FROM player WHERE player_id = $1', 
            [id]
        );
        const opponent = await pool.query(
            "SELECT * FROM player WHERE player_name = 'computer';"
        );
        res.cookie('player', player.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
        res.cookie('opponent', opponent.rows[0], { expires: new Date(Date.now() + 900000), httpOnly: true });
        res.render('dashboard/dashboard', {'player': player.rows[0], 'opponent': opponent.rows[0]});
    } catch (err) {
        console.error(err.message);
    }
});

//update a player
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

//delete a player
router.delete('/players/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletePlayer = await pool.query('DELETE FROM player WHERE player_id = $1', [id]);
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