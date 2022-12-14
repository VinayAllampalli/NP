const express = require('express');
const router = express.Router();
const multer = require("multer");
const {users,getAllusers,UpdateAgeGender,DeleteRecord,imageUpload,getImage,matchedDataImage,getbyDept,updateToNewTable

        ,CheckedIn }=require('../controllers/user')


const FILE_TYPE_MAP = {
    "image/png": "png",
    "image/pdf": "pdf",
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error("invalid image type");

        if (isValid) {
            uploadError = null;
        }
        cb(null,"public/uploads");
    },
    filename: function (req, file, cb) {
        const filename = file.originalname;
        console.log(filename);

        cb(null, `${Date.now()}-${filename}`);
    },
});

const uploadoptions = multer({ storage: storage });

router.post('/users',users);
router.get('/getAllusers',getAllusers);
router.post('/updateAgeGender/:id',UpdateAgeGender);
router.delete('/DeleteRecord/:id',DeleteRecord);
router.post('/imageUpload/:id',  uploadoptions.single("file"),imageUpload);
router.get('/getImage/:id',getImage);
router.get('/matchedData',matchedDataImage);
router.get('/dept',getbyDept);
router.post('/updateToNewTable',updateToNewTable);
router.post('/logData/:value/:id',CheckedIn)

module.exports=router;