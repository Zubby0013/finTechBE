import { Request, Response } from "express";
import userModel from "../Model/userModel";
import https, { } from "https"
import axios from "axios"
import crypto from "crypto"
import moment from "moment"

export const tranferWallet = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { amount } = req.body;
        const { userID, beneficiaryID } = req.params;

        const user = await userModel.findById(userID);
        const beneficiary = await userModel.findById(beneficiaryID);

        if (user && beneficiary) {
            const ref = crypto.randomBytes(3).toString;
            let kindPay = "";
            ("hex");
            if (user.walletBalance > amount) {

                await userModel.findById(userID,
                    {
                        walletBalance: user?.walletBalance - amount,
                        history: [...user?.history, {
                            receivedFrom: `${user?.fisrtName} ${user?.lastName}`,
                            bank_name: user?.platformName,
                            transaction_type: "debit",
                            transaction_date: moment(Date.now()).format("llll"),
                            beneficiary: `${beneficiary?.fisrtName} ${beneficiary?.lastName}`,
                            credit_Account: `${beneficiary?.accountNumber}`,
                            reference: ref,
                            amount,
                            kind: "debit"
                        }],

                    },
                    { new: true }
                )

                await userModel.findById(beneficiaryID,
                    {
                        walletBalance: beneficiary?.walletBalance + amount,
                        history: [...beneficiary?.history, {
                            bank_name: user?.platformName,
                            transaction_type: "credit",
                            transaction_date: moment(Date.now()).format("llll"),
                            beneficiary: `${user?.fisrtName} ${user?.lastName}`,
                            credit_Account: `${user?.accountNumber.toString().slice(0, 2)}${"*".repeat(4)}${user?.accountNumber.toString().slice(7)}`,
                            reference: ref,
                            amount,
                            kind: "credit"
                        }],
                    },
                    { new: true }
                )
                return res.status(201).json({
                    message: "transaction successfull",
                    status: 201,
                });
            } else {
                return res.status(404).json({
                    message: "Insufficient funds",
                    status: 404,
                });
            }

        } else {
            return res.status(404).json({
                message: "can't find user",
                status: 404,
            });
        }


    } catch (error: any) {
        return res.status(404).json({
            message: "Error creating user wallet",
            status: 404,
            error: error.message,
        });
    }
};

export const depositeFunds = async (
    req: Request,
    res: Response
) => {
    try {

        const { amount } = req.body;
        const { userID } = req.params;

        const user = await userModel.findById(userID);
        const params = JSON.stringify({
            "email": user?.email,
            "amount": `${amount + 100} `,
            "currency": "NGN",
            "callback_url": `http://localhost:${process.env.PORT}/`
        })

        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: '/transaction/initialize',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
                'Content-Type': 'application/json'
            }
        }

        const request = https.request(options, resp => {
            let data = ''

            resp.on('data', (chunk) => {
                data += chunk
            });

            resp.on('end', () => {
                console.log(JSON.parse(data))
            })
        }).on('error', error => {
            return (error)
        })

        request.write(params)
        request.end()

        // return res.status(201).json({
        //     message: "User created successfully",
        //     // data: user,
        //     status: 201,
        // });
    } catch (error: any) {
        return res.status(404).json({
            message: "Error creating user",
            status: 404,
            error: error.message,
        });
    }
};

// export const verifyDeposite2 = async (
//     req: Request,
//     res: Response
// ) => {
//     try {
//         const { reference } = req.params;

//         const options = {
//             hostname: 'api.paystack.co',
//             port: 443,
//             path: `/transaction/verify/:${reference}`,
//             method: 'GET',
//             headers: {
//                 Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
//             }
//         }

//         https.request(options, resp => {
//             let data = ''

//             resp.on('data', (chunk) => {
//                 data += chunk
//             });

//             resp.on('end', () => {
//                 console.log(JSON.parse(data))
//                 return res.status(201).json({
//                     message: "verification payment successful",
//                     data: JSON.parse(data),
//                     status: 201,
//                 })
//             }).on('error', error => {
//                 return (error)
//             })

//         })
//     } catch (error: any) {
//         return res.status(404).json({
//             message: "Error creating user",
//             status: 404,
//             error: error.message,
//         });
//     }
// };

export const verifyDeposite = async (
    req: Request,
    res: Response
) => {
    try {
        const { reference, userID } = req.params;

        const user: any = await userModel.findById(userID).populate({
            path: "transactionHistory",
        });

        const URL = `https://api.paystack.co/transaction/verify/:${reference}`;

        await axios.get(URL, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
            }
        }).then(async (readData) => {

            const check = user?.transactionHistory.findOne((el: any) => {
                return el.reference === readData?.data?.data?.reference
            })
            if (check) {
                return res.status(200).json({
                    message: "deposit data already done",
                    status: 200,
                });
            } else {
                await userModel.findByIdAndUpdate(userID,
                    {
                        walletBalance: user?.walletBalance + readData?.data?.data?.amount / 100,
                    },
                    { new: true }
                )

                const History = {
                    reference,
                    amount: readData?.data?.data?.amount / 100,
                    kind: "credit",
                }

                user?.history.push(History);
                user?.save()
                return res.status(200).json({
                    message: "deposit  done",
                    status: 200,
                    data: readData?.data?.data,
                });
            }
        })

    } catch (error: any) {
        return res.status(404).json({
            message: "Error creating user",
            status: 404,
            error: error.message,
        });
    }
};