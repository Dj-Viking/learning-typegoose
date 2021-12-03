"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const models_1 = require("../models");
const services_1 = require("../db/services");
const formatError_1 = require("../utils/formatError");
const signToken_1 = require("../utils/signToken");
const uuid = require("uuid");
const { createUser, updateUserById } = services_1.UserService;
exports.UserController = {
    createUser: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password } = req.body;
            try {
                const user = yield createUser({
                    username,
                    email,
                    password,
                });
                return res.status(201).json({ user });
            }
            catch (error) {
                let errorsObj = {};
                if (error.errors) {
                    errorsObj = Object.assign({}, error.errors);
                }
                if (Boolean(errorsObj.username || errorsObj.email || errorsObj.password)) {
                    return res
                        .status(400)
                        .json({ error: `${(0, formatError_1.formatCreateUserError)(errorsObj)}` });
                }
                return res.status(500).json({
                    error: `error when creating a user: ${error}, ${error.stack}`,
                });
            }
        });
    },
    login: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const foundUser = yield models_1.User.findOne({ email });
                if (foundUser === null)
                    return res.status(400).json({ error: "incorrect credentials" });
                console.log("found user in login route", foundUser);
                const validPass = yield foundUser.isCorrectPassword(password);
                if (!validPass)
                    return res.status(400).json({ error: "incorrect credentials" });
                const token = (0, signToken_1.signToken)({
                    _id: foundUser === null || foundUser === void 0 ? void 0 : foundUser._id,
                    username: foundUser === null || foundUser === void 0 ? void 0 : foundUser.username,
                    email: foundUser === null || foundUser === void 0 ? void 0 : foundUser.email,
                    uuid: uuid.v4(),
                });
                const returnUser = {
                    token,
                    username: foundUser === null || foundUser === void 0 ? void 0 : foundUser.username,
                    email: foundUser === null || foundUser === void 0 ? void 0 : foundUser.email,
                    _id: foundUser === null || foundUser === void 0 ? void 0 : foundUser._id,
                    cards: [],
                };
                return res.status(200).json({ user: returnUser });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message || error });
            }
        });
    },
    getAllUsers: function (_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("get all users query");
            try {
                const allUsers = yield models_1.User.find({}).select("-__v");
                return res.status(200).json({ users: allUsers });
            }
            catch (error) {
                return res.status(500).json({
                    error: `error when getting all users ${error}`,
                });
            }
        });
    },
    getUserById: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foundUser = yield models_1.User.findOne({ _id: req.params.id }).select("-__v");
                if (foundUser === null) {
                    return res.status(404).json({ message: "user not found" });
                }
                return res.status(200).json({ user: foundUser });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message });
            }
        });
    },
    deleteUserById: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foundUser = yield models_1.User.findOne({ _id: req.params.id }).select("-__v");
                if (foundUser === null) {
                    return res.status(404).json({ message: "user not found" });
                }
                const deleteRes = yield models_1.User.findOneAndDelete({ _id: req.params.id });
                console.log("delete response", deleteRes);
                if (deleteRes !== null)
                    return res.status(200).json({ message: "deleted user" });
                else
                    throw new Error("delete response was null, unsuccessful delete");
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: error.message || error });
            }
        });
    },
    updateUserById: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield models_1.User.findOne({ _id: req.params.id });
            if (foundUser === null) {
                return res.status(404).json({ message: "user not found" });
            }
            try {
                console.log("\x1b[33m", "request to update a user", "\x1b[00m", req.body, req.params);
                const updatedUser = yield updateUserById({
                    _id: req.params.id,
                    username: req.body.username,
                    email: req.body.email,
                });
                console.log("updated user service response", { user: updatedUser });
                return res.status(200).json({ user: updatedUser });
            }
            catch (error) {
                return res.status(500).json({
                    error: `error when updating a user by id ${error}`,
                });
            }
        });
    },
};
//# sourceMappingURL=UserController.js.map