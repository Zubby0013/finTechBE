import { Request, Response } from "express";
import userModel from "../Model/userModel";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const createUser = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { accountNumber, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const code = crypto.randomBytes(2).toString("hex");
        const verify = crypto.randomBytes(2).toString("hex");
        const hashedverify = await bcrypt.hash(verify, salt);

        if (accountNumber) {
            const user = await userModel.create({
                email,
                accountNumber,
                password: hashedPassword,
                code,
                verifyCode: hashedverify,
            });

            return res.status(201).json({
                message: "User created successfully",
                data: user,
                status: 201,
            });
        } else {
            return res.status(404).json({
                message: "please input your account",
                status: 404,
            });
        }
    } catch (error: any) {
        return res.status(404).json({
            message: "Error creating user",
            status: 404,
            error: error.message,
        });
    }
};

export const getUsers = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const user = await userModel.find();

        return res.status(201).json({
            message: "User created successfully",
            data: user,
            status: 201,
        });
    } catch (error: any) {
        return res.status(404).json({
            message: "Error creating user",
            status: 404,
            error: error.message,
        });
    }
};

export const getOneUser = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { userID } = req.params
        const user = await userModel.findById(userID);

        return res.status(201).json({
            message: "User created successfully",
            data: user,
            status: 201,
        });
    } catch (error: any) {
        return res.status(404).json({
            message: "Error creating user",
            status: 404,
            error: error.message,
        });
    }
};

export const verifyUser = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { userID, token } = req.params
        const { code } = req.body


        const openToken = jwt.verify(token, "access_token", (error, data) => {
            return data
        })
        const user = await userModel.findById(userID);

        if (user?.code === code) {
            await userModel.findByIdAndUpdate(userID, {
                verify: true,
                verifyCode: ""
            },
                { new: true }
            )
            return res.status(201).json({
                message: "User account verified successfully",
                status: 201,
            });
        } else {
            return res.status(404).json({
                message: "Error verifing User account",
                status: 404,
            });
        }


    } catch (error: any) {
        return res.status(404).json({
            message: "Error creating user",
            status: 404,
            error: error.message,
        });
    }
};

export const signinUser = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (user) {
            const check = await bcrypt.compare(password, user.password);
            if (check) {
                if (user.verify && user.verifyCode === "") {
                    const token = jwt.sign(
                        {
                            id: user._id,
                        },
                        "openSecret",
                        { expiresIn: "1h" }
                    );
                    return res.status(201).json({
                        message: "User created successfully",
                        data: token,
                        status: 201,
                    });
                } else {
                    return res.status(404).json({
                        message: "token is invalid",
                        status: 404,
                    });
                }
            } else {
                return res.status(404).json({
                    message: "password is incorrect",
                    status: 404,
                });
            }
        } else {
            return res.status(404).json({
                message: "error finding user",
                status: 404,
            });
        }
    } catch (error: any) {
        return res.status(404).json({
            message: "Error creating user",
            status: 404,
            error: error.message,
        });
    }
};
