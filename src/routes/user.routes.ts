//create a crud for user
import express from "express";

import validateRequest from "../middlewares/validate-request.middleware.js";
import {
  validateUserId,
  validateUserName,
} from "../validators/user.validator.js";
import { getUsers, createUser, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);

userRouter.post("/register", validateUserName, validateRequest, createUser);

userRouter.get("/:id", validateUserId, validateRequest, getUserById);

userRouter.put(
  "/:id",
  validateUserId,
  validateUserName,
  validateRequest,
  updateUser,
);

userRouter.delete("/:id", validateUserId, validateRequest, deleteUser);

export default userRouter;