import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const userSchema = new Schema(
    {
        username : {
            type : String, 
            required: true, 
            lowercase: true, 
            unique: true, 
            trim: true, 
            index: true
        },
        email : {
            type : String, 
            required: true, 
            lowercase: true, 
            unique: true, 
            trim: true, 
        },
        fullname : {
            type : String, 
            required: true,
            trim: true, 
            index: true
        },
        avatar : {
            type : String, 
            required: true
        },
        coverimage : {
            type : String, 
        },
        watchHistory : 
            [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Video"
                }
            ],
        password : {
            type : String, 
            required: [true, "password must required"]
        },
        refreshToken : {
            type : String, 
        },
        
    }, 
    {timestamps: true}
)


userSchema.pre("save",async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcryptjs.hashSync(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcryptjs.compareSync(password, this.password)
}

userSchema.methods.generateAccessToken = function (params) {
    jwt.sign({
        _id: this._id, 
        email: this.email,
        username: this.username, 
        fullname: this.fullname
    }, 
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshToken = function (params) {
    jwt.sign({
        _id: this._id, 
    }, 
    process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}
export const User = mongoose.model("User", userSchema)