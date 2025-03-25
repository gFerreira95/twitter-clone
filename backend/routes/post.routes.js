import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { commentOnPost, createPost, deleteComment, deletePost, getFollowingPosts, getLikedPosts, getPosts, getUserPosts, likePost } from '../controllers/post.controller.js';

const router = express.Router();
router.get('/', protectRoute, getPosts);
router.get('/liked/:id', protectRoute, getLikedPosts);
router.get('/following/', protectRoute, getFollowingPosts);
router.get('/:username/', protectRoute, getUserPosts);
router.post('/create', protectRoute, createPost);
router.post('/like/:id', protectRoute, likePost);
router.post('/:postId/comments/', protectRoute, commentOnPost);
router.delete('/:id', protectRoute, deletePost);
router.delete('/:postId/comments/:commentId', protectRoute, deleteComment);


export default router;
