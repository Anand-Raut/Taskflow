import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import transporter from '../config/nodemailer.js'

export const register = async (req, res) => {

    const {name, email, password} = req.body;

    if (!name || !email || !password){
        return res.json({success: false, message: 'Missing Details'})
    }
    try {

        const existingUser = await userModel.findOne({email})

        if (existingUser){
            return res.json({success: false, message: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new userModel({name, email, password: hashedPassword})
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        //SEND WELCOME EMAIL
        const mailoptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to the website',
            text: `Your account has been created with username: ${name} and email: ${email}`
        }

        await transporter.sendMail(mailoptions)

        return res.json({success: true})
    }
    catch (error) {
        res.json({success: false, message: `Encounter error: ${error.message}`})
    }
}   

export const login = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password){
        return res.json({success: false, message: 'Email and Password are required'})
    }
    try{
        const user = await userModel.findOne({email})
        if (!user){
            return res.json({success: false, message: 'Invalid email'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){
            return res.json()
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})

        res.cookie('token', token, {
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            // httpOnly: true,
        })

        return res.json({success: true})

    }catch (error){
        return res.json({sucess: false, message: error.message})
    }
}

export const logout = async (req, res) => {
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })

        return res.json({success: true, message: 'Logged out'})

    }catch(error){
        return res.json({success: false, message: error.message})
    }
}

export const sendVerifyOtp = async (req, res) => {
    try{
        const userId = req.userId
        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }   
        if (user.isAccountVerified){
            return res.json({success: false, message: 'account already verified'})
        }

        const otp = String(Math.floor( 100000 + Math.random()*900000 ))

        user.verifyOtp = otp;
        user.verifyOtpExpiryAt = Date.now() + 24*60*60*1000
        
        await user.save()

        const mailoptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account verification',
            text: `OTP: ${otp}` 
        }
        await transporter.sendMail(mailoptions)
        res.json({
            success: true,
            message: 'Otp sent'
        })

    }catch(error){
        res.json({success: false, message:`Encountered error in sendVerifyOtp: ${error.message}`})
    }
}

export const verifyEmail = async (req, res) => {
    const {otp} = req.body
    const userId = req.userId
    const user = await userModel.findById(userId)
    if (!user || !otp) {
        res.json({
            success: false,
            message: 'Missing Details'
        })
    }
    try{
        // const user = await userModel.findById(userId)

        if (!user){
            return res.json({
                sucess:false,
                message: 'User not found'
            })
        }
        if (user.verifyOtp === ''){
            return res.json({
                sucess:false,
                message: 'verify Otp not set'
            })
        }

        if (user.verifyOtp !== otp){
            return res.json({
                sucess: false,
                message: 'Invalid OTP'
            })
        }
        if (user.verifyOtpExpiryAt < Date.now()){
            return res.json({
                sucess: false,
                message: 'Otp expired'
            })
        }

        user.isAccountVerified = true
        user.verifyOtp = ''
        user.verifyOtpExpiryAt = 0

        await user.save();
        return res.json({
            success: true,
            message: 'Email verified successfully'
        })

    }catch(error){
        res.json({
            success: false,
            message: `Error encountered: ${error.message}`
        })
    }
}

// export const isAuthenticated = async (req, res) => {
//     try {
//         res.json({success: true})
//     } catch (error) {
//         res.json({success: false, message: error.message})
//     }
// }