import { connect } from "mongoose"
import dotenv from "dotenv";
dotenv.config()

const URL: string = process.env.MONGODB_URL!;

export const dbConnect = async () => {
    try {
        connect(URL).then(() => {
            console.log()
            console.log("dbConnect successful🧨🧨🧨")
        })
    } catch (error) {
        console.log(error)
    }
}