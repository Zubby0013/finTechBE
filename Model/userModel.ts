import { Document, Schema, Types, model } from "mongoose";
import { iUser } from "../Utils/interface";

interface IUserData extends iUser, Document { }

const userModel = new Schema(
    {
        fisrtName: { type: String },
        lastName: { type: String },
        email: { type: String, unique: true },
        code: { type: String },
        password: { type: String },
        verifyCode: { type: String },
        verify: { type: Boolean, default: false },
        accountNumber: { type: Number, unique: true },
        platformName: { type: String, default: "Aj CashIN" },
        avatar: { type: String },
        avatarID: { type: String },
        walletBalance: { type: Number, default: 0 },
        transactionHistory: [{ type: Types.ObjectId, ref: "walletTransactions" }],
        purchaseHistory: [{ type: Types.ObjectId, }],
        history: {
            type: []
        },
    },
    { timestamps: true }
);

export default model<IUserData>("users", userModel);
