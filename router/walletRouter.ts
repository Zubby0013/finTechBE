import { Router } from "express";
import { depositeFunds, tranferWallet, verifyDeposite } from "../Controller/walletController";

const router: Router = Router();

router.route("/transaction/:userID/:beneficiaryID").post(tranferWallet)
router.route("/deposite-funds/:userID").post(depositeFunds);

router.route("/verify-deposite/:userID/:reference").get(verifyDeposite);

export default router;