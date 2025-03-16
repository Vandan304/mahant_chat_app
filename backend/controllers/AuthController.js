import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import path from "path";
import { renameSync, unlinkSync } from "fs";
const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};
export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email && !password) {
      return response.status(400).send("Email and password are require");
    }
    const user = await User.create({ email, password });
    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal server error");
  }
};

export const login = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response
        .status(400)
        .json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return response
        .status(404)
        .json({ error: "User with this email not found" });
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return response.status(400).send("Password is incorrect");
    }
    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return response.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileSetup: user.profileSetup,
        images: user.images,
        color: user.color,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};
export const getUserInfo = async (request, response, next) => {
  try {
    const userData = await User.findById(request.userId);
    if (!userData) {
      return response
        .status(404)
        .json({ error: "User with this id not found" });
    }

    return response.status(200).json({
      id: userData._id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileSetup: userData.profileSetup,
      images: userData.images,
      color: userData.color,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProfile = async (request, response, next) => {
  try {
    const userId = request.userId;
    const { firstName, lastName, color } = request.body;

    if (!firstName || !lastName) {
      return response
        .status(400)
        .json({ error: "Firstname, Lastname, and color are required" });
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, color, profileSetup: true },
      { new: true, runValidators: true }
    );

    return response.status(200).json({
      id: userData._id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileSetup: userData.profileSetup,
      images: userData.images,
      color: userData.color,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

export const addProfileImage = async (request, response) => {
  try {
    if (!request.file) {
      return response.status(400).send("File is required");
    }
    const date = Date.now();
    let fileName = "uploads/profiles/" + date + request.file.originalname;
    renameSync(request.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      request.userId,
      { images: fileName },
      { new: true, runValidators: true }
    );

    return response.status(200).json({ images: updatedUser.images });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeProfileImage = async (request, response, next) => {
  try {
    const userId = request.userId;
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).send("User Not found");
    }
    if (user.images) {
      unlinkSync(user.images);
    }
    user.images = null;
    await user.save();

    return response.status(200).send("Profile image removed successfully");
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (request, response, next) => {
  try {
    response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return response.status(200).send("Logout successful");
  } catch (error) {
    console.error(error);
    return response.status(500).send("Internal Server Error");
  }
};
