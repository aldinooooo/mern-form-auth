const User = require('../models/user');
const {hashedPassword, comparePassword, hashPassword} = require('../helpers/auth')
const jwt = require('jsonwebtoken')

const test = (req, res) => {
    res.json('this is working');
};
//register endpoint
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the name is provided
        if (!name) {
            return res.json({
                error:"Name is required"
            })
        }

        // Check if the email is already taken
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                error:"Email is already taken"
            })
        }

        // Check if the password is valid
        if (!password || password.length < 6) {
            return res.json({
                error:'Password must be at least 6 characters'
            })
        }
        //hash password
        const hashedPassword = await hashPassword(password)
        // Create the user
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
        });

        return res.status(201).json(user);
    } catch (err) {
        console.error(`It's not working: ${err}`);
        return res.status(500).json({
            error: 'Server error. Please try again later.',
        });
    }
};
//login endpoint
const loginUser = async(req,res)=>{
    try {
        const {email,password} =req.body
        //check the user is already register
        const user = await User.findOne({email})
        if(!user){
            return res.json({
                error:'User have not register yet'
            })
        }
        const match = await comparePassword(password,user.password)
        if(match){
           jwt.sign({email :user.email, id:user._id, name:user.name},process.env.JWT_SECRET,{},(err,token)=>{
            if(err) throw err
            res.cookie('token', token).json(user)
           })
        }
        if(!match){
            return res.json({
                error:'Wrong password'
            })
        }
    } catch (err) {
        console.error(`It's not working: ${err}`);
        return res.status(500).json({
            error: 'Server error. Please try again later.',
        });
    }
}

//profile user endpoint
const getProfile = async(req,res)=>{
    const {token} = req.cookies
    if(token) {
        jwt.verify(token,process.env.JWT_SECRET,{},(err,user)=>{
            if(err)throw err
            res.json(user)
        })
    }else{
        res.json(null)
    }
}

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile
};
