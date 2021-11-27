import User from "../models/User";
import { Request, Response } from "express";
import { UserService } from "../db/services";
import { formatCreateUserError } from "../utils/formatError";
const { createUser, updateUserById } = UserService;
export const UserController = {
  createUser: async function (
    req: Request,
    res: Response
  ): Promise<Record<string, any>> {
    const { username, email, password } = req.body;
    try {
      // TODO: verify the request body most likely with some verifyUser middleware
      const user = await createUser({
        username,
        email,
        password,
      });
      return res.status(201).json({ user });
    } catch (error) {
      const { username, email, password } = error.errors;
      if (Boolean(username || email || password)) {
        return res.status(400).json({
          error: `${formatCreateUserError({
            username,
            email,
            password,
          })}`,
        });
      }
      return res.status(500).json({
        error: `error when creating a user:\n ${error}`,
      });
    }
  },
  getAllUsers: async function (
    _req: Request,
    res: Response
  ): Promise<Record<string, any>> {
    console.log("get all users query");
    try {
      const allUsers = await User.find({}).select("-__v");
      return res.status(200).json({ users: allUsers });
    } catch (error) {
      return res.status(500).json({
        error: `error when getting all users ${error}`,
      });
    }
  },
  getUserById: {},
  updateUserById: async function (
    req: Request,
    res: Response
  ): Promise<Record<string, any>> {
    try {
      console.log("\x1b[33m", "request to update a user", "\x1b[00m", req.body);
      const updatedUser = await updateUserById(req.body);
      console.log("updated user service response", { user: updatedUser });
      return res.status(204).json({ user: updatedUser });
    } catch (error) {
      return res.status(500).json({
        error: `error when updating a user by id ${error}`,
      });
    }
  },
};
