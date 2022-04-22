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
        // console.log(req.body.player_name);
        const { player_name } = req.body;
        const newPlayer = await pool.query(
            'INSERT INTO player (player_name) VALUES($1) RETURNING *', 
            [player_name]
        );
        res.redirect('/');
    } catch (err) {
        console.error(err.message);
    }
});

//get a player
router.get('/players/:id', async (req, res) => {
    try {
        console.log('get', req.params);
        const { id } = req.params;
        const player = await pool.query(
            'SELECT * FROM player WHERE player_id = $1', 
            [id]
        );
        res.json(player.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//update a player
router.put('/players/:id', async (req, res) => {
    try {
        console.log('delete', req.params);
        const { id } = req.params;
        const { player_name } = req.body;
        const updatePlayer = await pool.query(
            'UPDATE player SET player_name = $1 WHERE player_id = $2',
            [player_name, id]
        );
    } catch (err) {
        console.error(err);
    }
});

//delete a player
router.delete('/players/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletePlayer = await pool.query('DELETE FROM player WHERE player_id = $1', [id]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
    }
});

// DASHBOARD Page
router.get('/dashboard', async (req, res) => {
    res.render('dashboard/dashboard');
});

// BOARD Page
router.get('/board', async (req, res) => {
    const allPlayers = await pool.query('SELECT * FROM player');
    res.render('board/board', {'players': allPlayers.rows});
});

// START PAGE
router.get('/start', async (req, res) => {
    res.render('start/start');
});

// API TESTING PAGE
router.get('/', async (req, res) => {
    try {
        const allPlayers = await pool.query('SELECT * FROM player');
        res.render('index', {'players': allPlayers.rows});
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;