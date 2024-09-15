import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // Steps for register user
  // get user details from frontend
  // validation - not empty
  // check if user already exists
  // check for image and check for avatar
  // upload then to cloudinary cloudinary
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return respones - (res)

  const { fullName, email, username, password } = req.body;
//   console.log("email : ", email);
//   console.log("password : ", password);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All field are required");
  }
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  })
  if(existedUser){
    throw new ApiError(409,"User with email or username is already exsist")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")
  }

 const avatar = await uploadOnCloudinary(avatarLocalPath);
 const coverImage = await uploadOnCloudinary(coverImageLocalPath);

 if(!avatar){
    throw new ApiError(400,"Avatar is req.")
 }

 const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
 })

//  const createdUser = User.findById(user._id).select(
//     "-password -refreshToken"
//  ) 


  // Convert the user object to a plain JS object to avoid circular structure issues

  const createdUser = user.toObject();
  delete createdUser.password;
  delete createdUser.refreshToken; // If refreshToken exists

if(!createdUser){
    throw new ApiError(500,"Something went wrong while creating user")}

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User created successfully")
    )

});

export { registerUser };
