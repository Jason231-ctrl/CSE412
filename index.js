const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const pool = require('./src/server/db');
const { response } = require('express');

process.env.PWD = process.cwd()

//middleware
app.use(cors());
app.use(express.json()); //req.body
app.use(express.static(process.env.PWD + '/src'));

//ROUTES//

//create a player

app.post('/players', async (req, res) => {
    try {
        const { player_name } = req.body;
        const newPlayer = await pool.query(
            'INSERT INTO player (player_name) VALUES($1) RETURNING *', 
            [player_name]
        );

        res.json(newPlayer.rows[0])
    } catch (err) {
        console.error(err.message);
    }
});

//get all players
app.get('/players', async (req, res) => {
    try {
        const allPlayers = await pool.query('SELECT * FROM player');
        res.json(allPlayers.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//get a player
app.get('/players/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const player = await pool.query('SELECT * FROM player WHERE player_id = $1', [
            id
        ]);

        res.json(player.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//update a player
app.put('/players/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { player_name } = req.body;
        const updatePlayer = await pool.query(
            'UPDATE player SET player_name = $1 WHERE player_id = $2',
            [player_name, id]
        )
    } catch (err) {
        console.error(err);
    }
});

//delete a player
app.delete('/players/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletePlayer = await pool.query('DELETE FROM player WHERE player_id = $1', [
            id
        ]);
        res.json('Player was deleted!');
    } catch (err) {
        console.error(err);
    }
});

// BOARD Page
app.get('/board', async (req, res) => {
    res.sendFile(path.join(__dirname, '/src/boardScreen/index.html'));
});

// START PAGE
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/src/startScreen/start.html'));
});

app.listen(5001, () => {
    console.log('server has started on port 5001')
});