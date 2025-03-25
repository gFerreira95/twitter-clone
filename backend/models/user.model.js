import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
        minLength: 8,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    bio: {
        type: String,
        default: ""
    },
    profileImg: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default: ""
    },
    coverImg: {
        type: String,
        default: ""
    },
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: []
    }]    
},{timestamps:true});

const User = mongoose.model('User', userSchema);

export default User;