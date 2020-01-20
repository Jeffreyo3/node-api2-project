const express = require('express');
const db = require('../data/db');

const router = express.Router();

router.get('/', (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log('get posts, .find()', err)
            res.status(500).json({success: false, errorMessage:"The post information could not be retrieved"});
        });
});


module.exports = router;