import { Router } from "express";
import { createUser, getOneUser, getUsers, signinUser, verifyUser } from "../Controller/userController";


const router: Router = Router();

router.route("/create-user").post(createUser)
router.route("/signin-user").post(signinUser)

router.route("/verify-user/:userID").patch(verifyUser)
router.route("/view-user/:userID").get(getOneUser)
router.route("/view-users").get(getUsers)

export default router;