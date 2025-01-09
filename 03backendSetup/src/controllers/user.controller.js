import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/user.models.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res)=> {
    /*res.status(200).json(
       {message: "ok"}
    )*/

    const {username, email, fullname, password} = req.body;
    console.log('username, email, fullname, password :::>>>', username, email, fullname, avatar, password)

    if (
        [username, email, fullname, password].some((field)=> field?.trim()==="")
    ) {
        throw new ApiError(400, "fullName is required");   
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })
    console.log('existedUser :::>>>', existedUser)

    if (existedUser) {
        throw new ApiError(409, "user with email or username already exists");
    }

   const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log('req.files', req.files)

    const coverimageLocalPath = req.files?.coverimage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar image required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverimage = await uploadOnCloudinary(coverimageLocalPath);

    console.log('avatar ::> ', avatar)

    if (!avatar) {
        throw new ApiError(400, "avatar file is required");
    }

   const user = User.create({
        fullname, 
        avatar: avatar.url,
        coverimage : coverimage?.url || "", 
        email, 
        username: username.tol=LowerCase(), 
        password, 
    })

    console.log('user :::> ', user )

    const createdUser= await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new ApiError(500, "something went wrong while creating user");
    }

    return res.status(200).json(
       new ApiResponse(200, "user created successfully")
    )
})

export {registerUser}