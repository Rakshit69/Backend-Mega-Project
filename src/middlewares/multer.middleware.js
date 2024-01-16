import multer from "multer";


const storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        // The destination is a folder in the root directory of our project
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) { 
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math
        //     .random() * 1e9);
        cb(null, file.originalname);
    }
})


export const upload = multer({
    storage,
});