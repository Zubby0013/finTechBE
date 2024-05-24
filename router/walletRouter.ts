import { Router } from "express";
import { tranferWallet } from "../Controller/walletController";

const router: Router = Router();

router.route("/transactions/:userID/:beneficiaryID").post(tranferWallet)

export default router;