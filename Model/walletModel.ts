import { Document, Schema, model } from "mongoose";
import { iWalletTransaction } from "../Utils/interface";

interface iWalletTransactionData extends iWalletTransaction, Document { }

const walletModel = new Schema(
    {
        bankAccoount: { type: String },
        bankName: { type: String },
        transactionType: { type: String },
        description: { type: String },
        amount: { type: Number },
        user: { type: Schema.Types.ObjectId, ref: "users" }

    },
    { timestamps: true }
);

export default model<iWalletTransactionData>("walletTransactions", walletModel);
