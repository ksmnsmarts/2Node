const router = require('express').Router();
const companyController = require('./company_controller');


// multer 설정 s3 적용은 x-----------------------------------------------
const multer = require('multer'); // express에 multer모듈 적용 (for 파일업로드)

// Multer File upload settings
const DIR = './public/uploads/';

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, DIR) // 파일 업로드 경로
    },
    filename(req, file, callback) {
        callback(null, file.originalname) // 전송자가 보낸 원래 이름으로 저장
    }
});

// 파일 업로드 경로와 파일 용량 제한 설정
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1000 * 16
    }
});
////////////////////////////////////////////////////////////////////////////////////////////





// company controller
router.get('/queryAllCompany', companyController.queryAllCompany);
router.post('/addCompany', upload.any(), companyController.addCompany);
router.get('/fileDownload', companyController.fileDownload);
router.get('/queryCompany', companyController.queryCompany);
router.post('/editCompany', upload.any(), companyController.editCompany);
router.delete('/deleteCompany', companyController.deleteCompany);


module.exports = router;