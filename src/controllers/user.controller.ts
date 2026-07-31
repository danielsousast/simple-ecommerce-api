//create user controller
import { Request, Response } from "express";
import User from "../models/user.model.js";

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

export const getUserById = async (req: Request, res: Response   ) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: req.t("userNotFound") });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message || req.t("serverError") });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, city, state, postalCode, address, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, password, role, city, state, postalCode, address, phone },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: req.t("userNotFound") });
    }
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
