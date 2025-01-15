import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from '../models/user.models.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Jwt from "jsonwebtoken";
import { trusted } from "mongoose";

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    const { username, email, fullname, password } = req.body;

    if ([username, email, fullname, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "FullName, username, email, and password are required");
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverimageLocalPath =
        req.files?.coverimage && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0
            ? req.files.coverimage[0].path
            : null;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverimage = coverimageLocalPath ? await uploadOnCloudinary(coverimageLocalPath) : null;

    let user;
    try {
        user = await User.create({
            fullname,
            avatar: avatar.url,
            coverimage: coverimage?.url || "",
            email,
            username: username.toLowerCase(),
            password,
        });
    } catch (error) {
        console.error("Error while creating user:", error.message);
        throw new ApiError(400, "Validation error while creating user");
    }

    if (!user) {
        throw new ApiError(500, "User creation failed unexpectedly");
    }

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user");
    }

    return res.status(200).json(new ApiResponse(200, "User created successfully"));
});

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken =  user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}


    } catch (error) {
        throw new Error(500, "Something went wrong while generating refresh and acess tokens");
        
    }
}

const loginUser = asyncHandler(async (req, res)=> {
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email,username, password} = req.body
    if (!username && !email) {
        throw new ApiError(400, "username or Email is requird");
        
    }

    const user = await User.findOne({
        $or: [
            { username: username || undefined },
            { email: email || undefined }
        ]
    });
    console.log("Query result:", user);

    if (!user) {
        throw new ApiError(404, "user does not exists");
    }

    const isPasswordValid =await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(404, "password Incorrect");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken");


    const options = {
        httpOnly : true, 
        secure: true, 
    }


    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            }, 
            "user Logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req, res)=>{
    await User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly : true, 
        secure: true, 
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"))
})

const refreshAcessToken = asyncHandler(async(req, res)=> {
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken 
   if (incomingRefreshToken) {
    throw new ApiError(401,"unauthorized request");
   }

   try {
    const decodedToken = Jwt.verify(
     incomingRefreshToken, 
     process.env.REFRESH_TOKEN_SECRET
    )
 
    const user = await User.findById(decodedToken._id)
 
    if (!user) {
     throw new ApiError(401, "invalid refresh token");
    }
 
    if (incomingRefreshToken !== user?.refreshToken) {
     throw new ApiError(401, "refreshed token is either expired");
    }
 
    const options ={
     httpOnly: true, 
     secure: true
    }
    const {accessToken, newRefreshToken}= await generateAccessAndRefreshTokens(user._id)
    console.log('resposeOfRefresh :>> ', resposeOfRefresh);
 
 
    return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("newRefreshToken", newRefreshToken)
    .json(
     new ApiResponse(
         200, 
         {accessToken, newRefreshToken},
         "accessToken refreshed succesfully"
    )
    )
   } catch (error) {
    throw new ApiError(401, error?.message || "something went wrong")
   }
})

export {registerUser, loginUser, logoutUser, refreshAcessToken}