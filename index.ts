import cors from "cors";
import express, { Application } from "express";
import { dbConnect } from "./Config/dbConfig";
import dotenv from "dotenv";
import { mainApp } from "./mainApp";

dotenv.config()

const app: Application = express();

const port: number = parseInt(process.env.PORT!);

app.use(cors());
app.use(express.json());
mainApp(app)

const server = app.listen(port, () => {
    console.clear();
    dbConnect()
});

process.on("uncaughtException", (error: Error) => {
    console.log("uncaughtException", error);
    process.exit(1);
});

process.on("unhandledRejection", (reason: Error) => {
    console.log("unhandledRejection", reason);
    server.close(() => {
        process.exit(1);
    });
});
