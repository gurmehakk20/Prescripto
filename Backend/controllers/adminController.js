import validator from "validator";
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken'

// API FOR ADDING DOCTOR
const addDoctor = async (req, res) => {

    try {
        const {name, email, password, speciality, degree, experience, about, fees, address} = req.body;
        const imageFile = req.file;
        
        // CHECKING FOR ALL DATA TO ADD DOCTOR
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address)
        {
            return res.json({success:false, message : "Missing Details"});
        }

        // VALIDATING EMAIL
        if (!validator.isEmail(email))
        {
            return res.json({success:false, message : "Please enter a valid email"});
        }

        // VALIDATING PASSWORD
        if (password.length < 8)
        {
            return res.json({success:false, message : "Please enter a strong password"});
        }

        // HASHING A PASSWORD
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        // UPLOAD IMAGE TO CLOUDINARY
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"})
        const imageURL = imageUpload.secure_url

        // SAVING DATA TO DATABASE
        const doctorData = {
            name, 
            email,
            image:imageURL, 
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees, 
            address: JSON.parse(address),
            date: Date.now(),
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true, message:"DOCTOR ADDED"});


    } catch (error) {
        
        console.log(error)
        res.json({ success:false, message:error.message })
    }
}

// API FOR ADMIN LOGIN 
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) 
        {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            // console.log(token)
            res.json({ success: true, token });
        } 

        else 
        {
            res.json({ success: false, message: "INVALID EMAIL OR PASSWORD" });
        }
    } 
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
  

export {addDoctor, loginAdmin}
