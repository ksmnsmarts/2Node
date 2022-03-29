const { ObjectId } = require('bson');
const network = require('../../../../fabric/network.js')
const fs = require("fs");



exports.uploadFiles = async (req, res) => {
    console.log(`
--------------------------------------------------
  User : Hyperledger-Fabric Test User
  API  : Get company Info
  router.post('/uploadFiles', upload.single('file'), uploadFilesController.uploadFiles);
--------------------------------------------------`);
    const dbModels = global.DB_MODELS;

    try {

        const criteria = {
            company_name: req.body.company_name,
            my_name: req.body.my_name,
            your_name: req.body.your_name,
        }


        network.queryAllCompany().then((response) => {
            var carsRecord = JSON.parse(response);
            var numCars = carsRecord.length;
            var newKey = 'Company' + numCars;

            // 파일시스템에서 파일 열기
            fs.open(req.files[0].path, "r", function (err, fd) {
                // binary 데이터를 저장하기 위해 파일 사이즈 만큼의 크기를 갖는 Buffer 객체 생성
                const buffer = Buffer.alloc(req.files[0].size);
                fs.read(fd, buffer, 0, buffer.length, null, function (err, bytes, buffer) {
                    const obj = {
                        "originalFileName": req.files[0].originalname,
                        "filePath": req.files[0].path,
                        "fileSize": req.files[0].size,
                        "file": buffer,
                        "Key": newKey
                    };

                    const addCompany = dbModels.UploadFiles(obj)
                    addCompany.save(function (err) { // 저장
                        if (err) {
                            res.send(err);
                        }

                        // db에 모든 작업이 올라간 후에 uploads에 있는 파일이 지워진다.
                        fs.unlink(req.files[0].path, function () { }) // 파일 삭제
                    });

                    res.status(500).send({
                        message: 'file save complete'
                    })
                })
            })
        })

    } catch (err) {

        console.log('[ ERROR ]', err);
        res.status(500).send({
            message: 'file upload error'
        })
    }
};

