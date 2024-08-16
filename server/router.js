const { checkRoomCode } = require('./db');
const express = require('express');
const router = express.Router();

router.get('/room/:roomCode', async (req, res) => {
    console.log("Params " + req.params['roomCode']);
    const row = await checkRoomCode(req.params['roomCode']);
    console.log("row: " + row);
    if(row) {
        res.send(row.room_code);
    } else {
        res.send(row);
    }
});

// Export the router
module.exports = router;