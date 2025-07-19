import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { User } from "../models/user.model.js";


export const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, PhoneNumber,Gender,DOB } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    PhoneNumber,
    Gender,
    DOB
  });

  if (user) {
    const token = generateToken(user._id);
    res.status(200).json({
      user:{

      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      PhoneNumber: user.PhoneNumber,
      Gender: user.Gender,
      DOB: user.DOB,
      },
      
      token: token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    res.status(200).json({
      user:{

        _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      PhoneNumber: user.PhoneNumber,
      Gender: user.Gender,
      DOB: user.DOB,
      },
      
      token: token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

// Get All Users (Search)
export const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { firstName: { $regex: req.query.search, $options: "i" } },
          { lastName: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
          { PhoneNumber: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});
