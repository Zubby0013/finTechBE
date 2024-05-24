import { Application, Response, Request } from "express";
import user from "./router/userRouter";
import wallet from "./router/walletRouter";

export const mainApp = (app: Application) => {

    try {
        app.use("/api/v1", user)
        app.use("/api/v1", wallet)
        app.get("/", (req: Request, res: Response) => {
            try {
                return res.status(200).json({
                    message: "FinTech app",
                })
            } catch (error) {
                return res.status(404).json({
                    message: "Error recorded",
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
}