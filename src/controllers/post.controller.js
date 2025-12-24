import mongoose from "mongoose"
import { Post } from "../models/Post.js"
import { User } from "../models/User.js"


export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find()
        return res.status(200).json(posts)
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error")
    }
}
export const getSinglePost = async (req, res) => {
    try {
        const {id} = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json("Invalid post ID");
        }
        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).json("Post does not Exist")
        }
        return res.status(200).json(post)
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error")
    }
}

export const getAllMyPost = async (req, res) => {
    try {
        const {userId} = req.user
        
        const posts = await Post.find({user: userId})

        if (!posts || posts.length < 1) {
            return res.status(200).json("You don't have any post at the moment")
        }
    
        return res.status(200).json(posts)
    } catch (error) {
        console.log(error)
        return res.status(500).json("Internal Server Error")
    }
}

export const createPost = async (req, res) => {
    try {
        const {userId} = req.user        
        const {title, content} = req.body
        if (!title || !content) {
            return res.status(400).json("All fields are required")
        }
        if (title.length < 5 || content.length < 20) {
        return res.status(400).json("Invalid post length");
        }
        const newPost = new Post({
            title,
            content,
            user: userId
        })
        
        await newPost.save()
        await User.findByIdAndUpdate(userId, {
            $push: { posts: newPost._id },
        });
        return res.status(201).json({message: "Post created successfully", newPost})
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error")
    }
}

export const updatePost = async (req, res) => {
    try {
        const {title, content} = req.body
        const {userId, role} = req.user
        const {id} = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json("Invalid post ID");
        }

        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).json("Post does not Exist")
        }
        if (post.user.toString() !== userId && role !== 'admin') {
            return res.status(403).json("Unauthorized to perform this action")
        }
        if (title && title.length < 5) {
            return res.status(400).json("Title length must be at least 5 characters");
        }
        if (content && content.length < 20) {
        return res.status(400).json("Content length must be at least 20 characters");
        }
        const updateData = {}
        if (title) updateData.title = title
        if (content) updateData.content = content
        const updatePost = await Post.findByIdAndUpdate(id, updateData, {new: true})
        return res.status(200).json({message: "Post updated successfully", updatePost})
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal server Error")
    }
}

export const deletePost = async (req, res) => {
    try {
        const {userId, role} = req.user
        const {id} = req.params
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json("Invalid post ID");
        }

        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).json("Post does not Exist")
        }
        
        if (post.user.toString() !== userId && role !== 'admin') {
            return res.status(403).json("Unauthorized to perform this action")
        }
        await Post.findByIdAndDelete(id)
        await User.findByIdAndUpdate(post.user, {
            $pull: { posts: post._id },
        });
        return res.status(200).json({message: "Post deleted successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error")
    }
}