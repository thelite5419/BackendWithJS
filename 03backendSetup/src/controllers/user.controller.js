import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from '../models/user.models.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
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


export {registerUser}