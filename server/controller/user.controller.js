import dotenv from "dotenv";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import ApiResponse from "../lib/ApiResponse.js";
import ApiError from "../lib/ApiError.js";

dotenv.config();

export const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "Email is already in use");
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, { httpOnly: true });

    return res.status(201).json(
      new ApiResponse(201, "User registered successfully", {
        user: newUser,
        token,
      })
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res.status(500).json(new ApiError(500, "Server error"));
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "User deleted successfully"));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res.status(500).json(new ApiError(500, "Server error"));
  }
};

export const logout = async (_, res) => {
  try {
    res.clearCookie("token");
    return res
      .status(200)
      .json(new ApiResponse(200, "Logged out successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Server error"));
  }
};

export const getUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "Invalid username or password");
    }

    // Compare passwords (ideally should use bcrypt.compare if passwords are hashed)
    if (user.password !== password) {
      throw new ApiError(404, "Invalid username or password");
    }

    // Create a user object without the password
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, { httpOnly: true });

    // Return both token and user in the response
    return res.status(200).json(
      new ApiResponse(200, "User Verified", {
        user: userWithoutPassword,
        token,
      })
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res.status(500).json(new ApiError(500, "Server error"));
  }
};
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { name, email, password },
      { new: true }
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "User updated successfully", { user }));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res.status(500).json(new ApiError(500, "Server error"));
  }
};

export const getallusers = async (req, res) => {
  try {
    const users = await User.find();
    return res
      .status(200)
      .json(new ApiResponse(200, "Users retrieved successfully", { users }));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Server error"));
  }
};

