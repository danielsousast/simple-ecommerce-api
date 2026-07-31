//create a crud for user
import express from "express";

import validateRequest from "../middlewares/validate-request.middleware.js";
import {
  validateLoginDetails,
  validateUserId,
  validateUserDetails,
} from "../validators/user.validator.js";
import { getUsers, createUser, loginUser, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);

userRouter.post("/register", validateUserDetails, validateRequest, createUser);
userRouter.post("/login", validateLoginDetails, validateRequest, loginUser);

userRouter.get("/:id", validateUserId, validateRequest, getUserById);

userRouter.put(
  "/:id",
  validateUserId,
  validateUserDetails,
  validateRequest,
  updateUser,
);

userRouter.delete("/:id", validateUserId, validateRequest, deleteUser);

export default userRouter;
