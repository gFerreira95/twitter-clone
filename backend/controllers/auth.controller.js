import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";



export const signup = async (req, res) => {

    try {
        const {fullName, username, email, password} = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)) {
            return res.status(400).json({message: 'Invalid email address'});
        }

        const existingUser = await User.findOne({username});
        if(existingUser) {
            return res.status(400).json({message: 'Username already exists'});
        }

        const existingEmail = await User.findOne({email});
        if(existingEmail) {
            return res.status(400).json({message: 'Email already exists'});
        }

        if(password.lenght < 8 ){
            return res.status(400).json({message: 'Password must be at least 8 characters'})
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User ({
            fullName,
            username,
            email,
            password: hashedPassword
        })

        if(newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                token: res.locals.token
            });
        }else {

            return res.status(400).json({message: 'Failed to create new user'});

        }
    } catch (error) {

        res.status(500).json({error: "internal server error "})
        console.log("error in signup controller", error.message);        
    }
}

export const login = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

export const logout = async (req, res) => {
    res.json({
        data: "you hit the logout endpoint"
    })
}