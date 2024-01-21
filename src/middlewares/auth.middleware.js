import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/User.model.js"
import jwt from "jsonwebtoken"


export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
      const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
      if (!accessToken) throw new ApiError(400, "Unauthorized request");
  
  const  accessTokenVerified=  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  if (!accessTokenVerified) throw new ApiError(400, "Access Token INvalid hai");
  
      
      const user = await User.findById(accessTokenVerified._id).select("-password -refreshToken");
  if (!user) throw new ApiError(400, "Access Token INvalid hai");
      
      req.user = user;
      next();

  } catch (error) {
    throw new ApiError(401,error?.message ||"AccessToken Invalid")
    }
    
})
