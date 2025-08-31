const Post = require('../models/post');

// Create a post
exports.createPost = async (req, res, next) => {
  try {
    const { text, imageUrl } = req.body;
    if (!text) return res.status(400).json({ message: 'Post text is required' });

    const post = await Post.create({
      user: req.user.id,
      text,
      imageUrl: imageUrl || null,
    });

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// Get all posts
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username name avatarUrl')
      .populate('comments.user', 'username name avatarUrl')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// Get single post
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username name avatarUrl')
      .populate('comments.user', 'username name avatarUrl');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// Delete post
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await post.remove();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};
