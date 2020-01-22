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
                const updatedPost = { ...updatePost, id: Number(id) }
                res.status(200).json({ success: true, updatedPost, update })
            } else {
                res.status(404).json({ success: false, message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log("update post error: ", err);
            res.status(500).json({ success: false, error: "The post information could not be modified." })
        })
});

//remove() take id and returns record of deletion (1 if successful)
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.remove(id)
        .then(remove => {
            if (remove) {
                res.status(200).json({ success: true, remove })
            } else {
                res.status(404).json({ success: false, message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log("remove post error: ", err);
            res.status(500).json({ success: false, error: "The post could not be removed" })
        })
})

//findPostComments() accepts postId and returns comments on associated post
router.get("/:id/comments", (req, res) => {
    const { id } = req.params;

    db.findById(id).then(post => {
        if (!post.length > 0) {
            res.status(404).json({ success: false, message: "The post with the specified ID does not exist." });
        } else {
            db.findPostComments(id)
                .then(comments => {
                    res.status(200).json(comments);
                })
                .catch(err => {
                    console.log("findPostComments error: ", err);
                    res.status(500).json({ success: false, error: "The comments information could not be retrieved." })
                });
        }
    });
});

//insertComment() - pass in a comment, will return object with id of inserted comment. Throws an error if post_id doesn't match a post id
router.post("/:id/comments", (req, res) => {
    const { text } = req.body;
    const post_id = req.params.id;

    if (!text) {
        res.status(400).json({ success: false, errorMessage: "Please provide text for the comment." });
    } else {
        db.findById(post_id).then(post => {
            if (!post) {
                res.status(404).json({ success: false, message: "The post with the specified ID does not exist." });
            } else {
                let newComment = {
                    text: text,
                    post_id: post_id
                };
                db.insertComment(newComment)
                    .then(({ id }) => {
                        db.findCommentById(id).then(comment => {
                            res.status(201).json(comment);
                        });
                    })
                    .catch(err => {
                        res.status(500).json({ success: false, error: "There was an error while saving the comment to the database" });
                    });
            }
        });
    }
});





module.exports = router;