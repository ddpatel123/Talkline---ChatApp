import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import generatetoken from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
    const { fullName, email, password, profilePic } = req.body;
    try {
        //hash password
        //create user
        //send response

        if(!fullName || !email || !password)
            return res.status(400).json({ message: 'All fields are required' });

        
        if (password.length < 6)
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });


        const user = await User.findOne({ email });
        if (user)
            return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        })

        if (newUser) {
            generatetoken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                message: 'User created successfully'
            });
        }
        else
        {
            res.status(400).json({ message: 'Invalid user data'});
        }

    } catch (error) { 
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {  
    const { email, password } = req.body;
    try {
        if (!email || !password)
            return res.status(400).json({ message: 'All fields are required' });

        const user = await User.findOne({ email });
        if(!user)
            return res.status(400).json({ message: 'Invalid credentials' });

        const iscorrectpassword = await bcrypt.compare(password, user.password);
        if(!iscorrectpassword)
            return res.status(400).json({ message: 'Invalid credentials' });
        
        generatetoken(user._id, res);

        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,

            message: 'Login successful'
        });  


    }
    catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};      

export const logout = (req, res) => {   
    try {
        // res.clearCookie('token');
        res.cookie("token", "", { maxAge: 0 });
        res.status(200).json({ message: 'Logged out successfully' });

    }
    catch(error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }   
}

export const updateprofile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userid = req.user._id;
        if(!profilePic)
            return res.status(400).json({ message: 'Profile picture is required' });

        const uploadedresponce = await cloudinary.uploader.upload(profilePic);
        const updateduser = await User.findByIdAndUpdate(userid, { profilePic: uploadedresponce.secure_url }, { new: true });
        res.status(200).json(updateduser);
    }catch (error) {
        console.log("Error in updateprofile controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    
}

export const checkauth = async (req, res) => {  
    try { 
        res.status(200).json( req.user );
    }
    catch (error) {
        console.log("Error in checkauth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }   
}