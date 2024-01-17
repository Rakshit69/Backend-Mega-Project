const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(
            requestHandler(req, res, next).catch((err)=>next(err))
        )
    }

}

export { asyncHandler }


// const asyncHandler = (requestHandler) => async (req,res,next) => {
//     try {
        
//     }
//     catch (err) {
//         res.status(err.code || 400).json({
//             succes: false,
//             message: err.message
//         })
//     }
// } 
