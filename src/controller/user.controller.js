import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import  jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (user_id)=>{
    const user = await User.findById(user_id);
    if (!user) throw new ApiError(404, "Authentication failed, user not found.");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: true });

    return { accessToken, refreshToken };


        
}
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
		[username, fullName, email, password].some((field) => field.trim() === "")
	)
		throw new ApiError(400, "All field is required ");

	const userExisted = await User.findOne({
		$or: [{ email }, { username }],
	});
	if (userExisted)
		throw new ApiError(
			409,
			"user with given username or email already exists "
		);

	// console.log("request.files",req.files);

	const avatarLocalPath = req.files?.avatar[0]?.path;

	// const coverImageLocalPath = req.files?.coverImage[0]?.path
	let coverImageLocalPath;
	if (
		req.files &&
		Array.isArray(req.files.coverImage) &&
		req.files.coverImage.length > 0
	)
		coverImageLocalPath = req.files.coverImage[0].path;

	if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required ");

	const avatar = await uploadOnCloudinary(avatarLocalPath);

	const coverImage = await uploadOnCloudinary(coverImageLocalPath);

	if (!avatar) throw new ApiError(409, "Avatar file is required");

	const user = await User.create({
		username: username.toLowerCase(),
		fullName,
		email,
		password,
		avatar: avatar.url,
		coverImage: coverImage?.url || "",
	});
	const createdUser = await User.findById(user._id).select(
		"-password -refreshToken"
	);

	if (!createdUser)
		throw new ApiError(501, "Something went wromg while registering the user");

	return res
		.status(201)
		.json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUSer = asyncHandler(async (req, res) => {
	//data-->req.body
	//username or email login
	//find the user
	//password verification
	//refresh and access token
	//send cookie
	const { username, email, password } = req.body;
    if (!username && !email)
        throw new ApiError(404, "username and email  required ");

    const user = await User.findOne({
        $or: [{ email }, { username }],
    })
    if (!user) throw new ApiError(404, "user not found here");

    const passwordCheck = await user.isPasswordCorrect(password);
    if (!passwordCheck) throw new ApiError(401, "Invalid Credentials");
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser =await User.findById(user._id).select("-password -refreshToken");
    //res.header("auth-token", `Bearer ${accessToken}`).

    const options = {
        httpOnly: true,
        secure: true,
}
	return res
		.status(200)
		.cookie("accessToken", accessToken, options)
		.cookie("refreshToken", refreshToken, options)
		.json(new ApiResponse(201, {
			user: loggedInUser,
			accessToken,
			refreshToken,

		}, "user Logged in successfully"));
});
const logoutUser = asyncHandler(async (req, res) => {
	await User.findByIdAndUpdate(req.user._id, {
		$set: {
		refreshToken:undefined,
		}
		
	})
	const options = {
		httpOnly: true,
		secure:true
	}
	return res
		.clearCookie('accessToken', options)
		.clearCookie("refreshToken", options)
		.json(new ApiResponse(200,null, "Logged out Successfully"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {
	const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

	if (!incomingRefreshToken) throw new ApiError(406, "unauthorized Request");

try {
		const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
	
		const user = await User.findById(decodedRefreshToken?._id);
	
		if (!user) throw new ApiError(406, "Invalid refresh Token");
	
	
		if (user.refreshToken !== decodedRefreshToken) throw new ApiError(406, "Refresh Token is already used or Expired");
		const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
		const options = {
			httpOnly: true,
			secure:true
	
		}
		return res
			.cookie("accessToken", accessToken, options)
			.cookie("refresToken", refreshToken, options)
			.json(new ApiResponse(200, {
				accessToken, refreshToken
			}, "Tokens Refreshed successully ok")
			)
	
} catch (error) {

	throw new ApiError(401,error?.message||"Invalid refreshToken")
}
})
export {
	registerUser,
	loginUSer,
	logoutUser,
	refreshAccessToken
};
