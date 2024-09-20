import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens = async(userId)=>{
        try {
            await User.findById(userId)
            const accessToken = user.generateAccessToken()
            const refreshToken = user.generateRefreshToken()

            user.refreshToken = refreshToken
          await user.save({validateBeforeSave:false})

          return {accessToken,refreshToken}

        } catch (error) {
            throw new ApiError(500,"server error while generating access and refresh token")
        }
}

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
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username is already exsist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //   const coverImageLocalPath = req.files?.coverImage[0]?.path;

  //method 2 clasic method

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is req.");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Convert the user object to a plain JS object to avoid circular structure issues
  //   const createdUser = user.toObject();
  //   delete createdUser.password;
  //   delete createdUser.refreshToken; // If refreshToken exists

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //req body -> data
  // username or email
  // find the user
  // password check
  // generate the access and refresh token
  //send these tokens via cookie

  const { email, username, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "username or password is required");
  }

 const user = await User.findOne({
    $or:[{username},{email}]
  })

  if(!user){
    throw new ApiError(404,"User not found")

  }
 const isPasswordValid =  await user.isPasswordCorrect(password)
if(!isPasswordValid){
    throw new ApiError(401,"Invalid User detalis")
}

const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   const options = {
    httpOnly:true,
    secure:true
   }

   
   return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
    new ApiResponse(
        200, { user: loggedInUser, accessToken, refreshToken },
        "User Logged In successfully"
    )
   )

});

const logoutUser = asyncHandler(async(req,res)=>{

  await User.findByIdAndUpdate(
    req.user_id,
    {
      $set:{
        refreshToken:undefined
      }
    }
  )

  const options = {
    httpOnly:true,
    secure:true
  }

  return res.status(200).clearCookie('accessToken',options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"User logged out successfully"))
})

export { registerUser,loginUser,logoutUser };
