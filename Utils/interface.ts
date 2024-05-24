export interface iUser {
    fisrtName: string;
    lastName: string;
    email: string;
    code: string;
    password: string;
    verifyCode: string;
    verify: boolean;
    accountNumber: number;
    platformName: string;
    avatar: string;
    avatarID: string;

    walletBalance: number;

    transactionHistory: Array<{}>;
    history: [];
    purchaseHistory: Array<{}>;
}

export interface iWalletTransaction {
    bankAccount: string;
    bankName: string;
    transactionType: string;
    description: string;

    amount: number;

    user: {};
}