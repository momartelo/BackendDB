import express from "express";
const usersRouter = express.Router();

import {
  loginUser,
  registerUser,
  getAllUsers,
} from "../controllers/users.controller.js";

usersRouter.post("/login", loginUser);
usersRouter.post("/register", registerUser);

usersRouter.get("/", getAllUsers);

export default usersRouter;
