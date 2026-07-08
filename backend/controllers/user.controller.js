import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import cookie from "cookie-parser";

export const register = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, role } = req.body;

    if (!fullName || !email || password || phoneNumber || role) {
      return res.status(400).json({
        message: "Something is missing",
        sucess: false,
      });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        message: "User already exist with this email",
        sucess: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashPassword,
      role,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    //check role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role",
        success: false,
      });
    }
    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

    user = {
      _id: user._id,
      email: user.email,
      fullname: user.fullname,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: "strict" })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged Out Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, phoneNumber, email, bio, skills } = req.body;
    const file = req.file;

    if (!fullname || !phoneNumber || !email || !bio || !skills) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    //cloudinary for image

    const skillArray = skills.split(",");
    const userId = req.id; //middleware authentication

    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User Not Found",
        success: false,
      });
    }

    //updating data

    ((user.fullname = fullname), (user.email = email), (user.phoneNumber = phoneNumber), (user.profile.bio = bio), (user.profile.skills = skillArray));

    //resume comes later here
    await user.save();

    user = {
      _id: user._id,
      email: user.email,
      fullname: user.fullname,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile Updated Successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
