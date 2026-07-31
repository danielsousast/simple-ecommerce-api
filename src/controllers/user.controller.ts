//create user controller
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from "../helpers/jwt.js";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, city, state, postalCode, address, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: req.t("userWithEmailAlreadyExists") });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
      city,
      state,
      postalCode,
      address,
      phone,
    });
    await newUser.save();
    res.status(201).json({
        status: true,
        message: req.t("userCreatedSuccessfully"),
        data: newUser,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: req.t("invalidEmailOrPassword") });
    }

    const token = generateToken(user);
    res.json({
      status: true,
      message: req.t("loginSuccessful"),
      token,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.auth!.id);

    if (!user) {
      res.status(404).json({ error: req.t("userNotFound") });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
};


export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.auth!.id);

    if (!user) {
      res.status(404).json({ error: req.t("userNotFound") });
      return;
    }

    const { name, email, password, city, state, postalCode, address, phone } = req.body;
    const userWithEmail = await User.findOne({
      email,
      _id: { $ne: user._id },
    });

    if (userWithEmail) {
      res.status(409).json({ error: req.t("userWithEmailAlreadyExists") });
      return;
    }

    user.set({ name, email, password, city, state, postalCode, address, phone });
    await user.save();

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: req.t("userNotFound") });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
};
