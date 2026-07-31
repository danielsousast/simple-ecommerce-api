//create a crud for user
import express from "express";

import authenticate from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validate-request.middleware.js";
import {
  validateLoginDetails,
  validateProfileDetails,
  validateUserId,
  validateUserDetails,
} from "../validators/user.validator.js";
import {
  getUsers,
  createUser,
  loginUser,
  getProfile,
  updateProfile,
  deleteUser,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// Public routes: users must be able to create an account and obtain a token.
userRouter.post("/register", validateUserDetails, validateRequest, createUser);
userRouter.post("/login", validateLoginDetails, validateRequest, loginUser);

// Every route declared after this middleware requires a valid Bearer token.
userRouter.use(authenticate);

userRouter.get("/profile", getProfile);
userRouter.put(
  "/profile",
  validateProfileDetails,
  validateRequest,
  updateProfile,
);
userRouter.get("/", getUsers);

userRouter.delete("/:id", validateUserId, validateRequest, deleteUser);

export default userRouter;
