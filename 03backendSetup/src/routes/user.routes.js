import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAcessToken} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewear.js";
import { verifyJWT } from "../middlewares/auth.middlewear.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar", 
            maxCount: 1,
        }, 
        {
            name: "coverimage", 
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)


//secured route
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAcessToken)

export default router