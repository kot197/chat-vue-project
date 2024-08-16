const express = require('express');
const router = express.Router();

// Define a route to get all users
router.get('/users', (req, res) => {
    // Logic to fetch and return all users
    res.send('Get all users');
});

// Export the router
module.exports = router;