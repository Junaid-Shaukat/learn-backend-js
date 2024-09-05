// Method N0 1

const asyncHandler = (requestHandler) => {
            (req,res,next)=>{
              Promise.resolve(requestHandler(req,res,next)).catch((err)=> next(err))
            }


}

export {asyncHandler}


// how the below asyncHandler made ->
// const asyncHandler = () => {}
// const asyncHandler = (func) => {() => {}}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}
//-<


//Method N0 2

// const asyncHandler = (fn) => async (req,res,next) => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success:false,
//             message:error.message
//         })
        
//     }
// }