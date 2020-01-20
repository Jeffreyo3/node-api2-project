const express = require('express');
const db = require('../data/db');

const router = express.Router();

// find() containing all posts in database
router.get('/', (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log('get posts: ', err)
            res.status(500).json({ success: false, errorMessage: "The post information could not be retrieved" });
        });
});

// findById() expects id & returns the post with the ID. If no matching ID, return empty array
router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.findById(id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            }
            else {
                res.status(404).json({ success: false, message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log('get post by ID error: ', err)
            res.status(500).json({ success: false, errorMessage: "The post information could not be retrieved" });
        })
})


module.exports = router;