import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: 'User not found!'});

        if(!text && !img) return res.status(400).json({message: 'Post must have text or image!'});

        if(img) {
           const uploadedResponse = await cloudinary.uploader.upload(img);
           img = uploadedResponse.secure_url;
        }

        const newPost = new Post ({
            user:userId,
            text,
            img
        })

        await newPost.save();
        res.status(201).json({message: 'Post created successfully!'});
    } catch (error) {
        res.status(500).json({message: 'Error creating post!'});
        console.log("error in createPost controller", error.message);
    }
}

export const deletePost = async (req, res) => {
    try {
        
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({message: 'Post not found!'});
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(403).json({message: 'You are not authorized to delete this post'});
        }
        if(post.img) {
            const imgId = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message: 'Post deleted successfully!'});                
    } catch (error) {
        res.status(500).json({message: 'Error deleting post!'});
        console.log("error in deletePost controller", error.message);        
    }
}

export const deleteComment = async (req, res ) => {
    try {
        const post = await Post.findById(req.params.postId);
        if(!post) return res.status(404).json({message: 'Post not found!'});

        const comment = await post.comments.id(req.params.commentId);
        if(!comment) return res.status(404).json({message: 'Comment not found!'});

        if(comment.user.toString() !== req.user._id.toString()){
            return res.status(403).json({message: 'You are not authorized to delete this comment'})
        }

        await post.comments.pull(comment);
        await post.save();

        res.status(200).json({message: 'Comment deleted successfully!'});

    } catch (error) {
        res.status(500).json({message: 'Error deleting comment!'});
        console.log("error in deleteComment controller", error.message);        
    }
}

export const commentOnPost = async (req, res ) => {
    try {
        const { text } = req.body;
        const postId = req.params.postId;
        const userId = req.user._id;

        if(!text) {
            return res.status(400).json({message: 'Comment must have text!'});
        }
        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({message: 'Post not found!'});

        const comment = {user: userId, text};
        post.comments.push(comment);
        await post.save();
        
        res.status(200).json({message: 'Comment added successfully!'});

    } catch (error) {
        res.status(500).json({message: 'Error commenting on post!'});
        console.log("error in commentOnPost controller", error.message);        
    }
}

export const likePost = async (req, res ) => {
    try {
        const userId = req.user._id;
        const {id: postId} = req.params;
        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({message: 'Post not found!'});

        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost){
            await Post.updateOne({_id:postId}, {$pull: {likes: userId}});
            res.status(200).json({message: 'Post unliked successfully!'});
        }
        else {
            await post.likes.push(userId);
            await post.save();

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: 'like'
            });
            await notification.save();
            res.status(200).json({message: 'Post liked successfully!'});
        }
        
                
    } catch (error) {
        res.status(500).json({message: 'Error liking post!'});
        console.log("error in likePost controller", error.message);
    }
}

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1}).populate({
            path: 'user',
            select: '-password'
        }).populate({
            path: 'comments.user',
            select: '-password'
        });
        if( posts.lenght == 0){
            return res.status(404).json({message: 'No posts found!'});
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({message: 'Error getting posts!'});
        console.log("error in getPosts controller", error.message);        
    }
}