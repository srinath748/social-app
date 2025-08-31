const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createPost,
  getPosts,
  getPost,
  deletePost,
} = require('../controllers/postController');

// Create a post
router.post('/', auth, createPost);

// Get all posts
router.get('/', auth, getPosts);

// Get single post
router.get('/:id', auth, getPost);

// Delete a post
router.delete('/:id', auth, deletePost);

module.exports = router;
