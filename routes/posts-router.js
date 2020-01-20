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
        });
});

//insert() pass a 'post' object and db will return object with ID
router.post('/', (req, res) => {
    const newPost = req.body;

    if (!newPost.hasOwnProperty('title')) {
        res.status(400).json({ errorMessage: "Please provide title for the post" })
    }
    if (!newPost.hasOwnProperty('contents')) {
        res.status(400).json({ errorMessage: "Please provide contents for the post" })
    }

    db.insert(newPost)
        .then(post => {
            const addPost = { ...newPost, id: post.id }
            res.status(201).json({ success: true, addPost });
        })
        .catch(err => {
            console.log('insert post error: ', err);
            res.status(500).json({ success: false, error: "There was an error while saving the post to the database" });
        });
});

//update() accepts id and changes, returns object with ID
router.put('/:id', (req, res) => {
    const updatePost = req.body;
    const { id } = req.params;

    if (!updatePost.hasOwnProperty('title')) {
        res.status(400).json({ errorMessage: "Please provide title for the post" })
    }
    if (!updatePost.hasOwnProperty('contents')) {
        res.status(400).json({ errorMessage: "Please provide contents for the post" })
    }

    db.update(id, updatePost)
        .then(update => {
            if (update) {
                const updatedPost = {...updatePost, id: Number(id)}
                res.status(200).json({ success: true, updatedPost, update })
            } else {
                res.status(404).json({ success: false, message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log("update post error: ", err);
            res.status(500).json({ success: false, error: "The post information could not be modified." })
        })


})

module.exports = router;