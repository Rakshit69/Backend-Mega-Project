import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/apiError.js'
import { User } from "../models/User.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
const registerUser = asyncHandler(async (req, res) => {

    //get details from frontend

    //check vaidation 
    //check that the user already exist :username email
    //check for images and avatar check
    //upload images to the cloudinary check for avatar
    // create user object -entry in the db
    //remove refresh token and password from the response
    //check for user creation 
    //return response
    const { username, fullName, email, password } = req.body;
    if (
        [username,email ,password,fullName].some((field)=> field.trim()==="")
    ) throw new ApiError(400,"All field is required ")
   const userExisted= User.findOne({
        $or: [{ email }, { username }],
    })
    if (userExisted) throw new ApiError(409, "user with given username or email already exists ");

    console.log("request.files ",req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required ");
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) throw new ApiError(409, "Avatar file is required");
    
    const user=await User.create({
       username: username.toLowerCase(),
        fullName,
        email,
        password,
        avatar:avatar.url,
        coverImage: coverImage?.url || "",
    

    })
const createdUser=await User.findById(user._id).select("-password -refreshToken")

if(!createdUser) throw new ApiError(501, "Something went wromg while registering the user");

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully"),
    )
})

    
export { registerUser };

