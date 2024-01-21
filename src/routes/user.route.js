import { Router } from "express";
import { loginUSer, logoutUser, refreshAccessToken, registerUser } from "../controller/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const userRouter = Router();
userRouter.route("/register").post(upload.fields([
    { name: "avatar", maxCount: 1 },
    {name:"coverImage", maxCount:1}
]), registerUser)

userRouter.route('/login').post(loginUSer)

//secure
userRouter.route('/logout').post(verifyJWT, logoutUser);

userRouter.route('/refresh-token').post(refreshAccessToken);


export { userRouter };