const { ObjectId } = require('bson');
const network = require('../../../../fabric/network.js')
const fs = require("fs");
const base64 = require('base64topdf');


exports.addCompany = async (req, res) => {
    console.log(`
--------------------------------------------------
  User : Hyperledger-Fabric Test User
  API  : Get company Info
  router.post('/addCompany', companyController.addCompany);
--------------------------------------------------`);
    const dbModels = global.DB_MODELS;

    try {

        const criteria = {
            company_name: req.body.company_name,
            my_name: req.body.my_name,
            your_name: req.body.your_name,
        }


        // await addCompany.save();

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

                    base64EncodedText = Buffer.from(obj.file, "utf8").toString('base64');
                    network.createCompany(newKey, req.body.company_name, req.body.my_name, req.body.your_name, obj.originalFileName, base64EncodedText)
                        .then((response) => {
                            return res.send(response)
                        })
                })
            })
        })

    } catch (err) {

        console.log('[ ERROR ]', err);
        res.status(500).send({
            message: 'add company error'
        })
    }
};


exports.queryAllCompany = async (req, res) => {
    console.log(`
--------------------------------------------------
  User : Hyperledger-Fabric Test User
  API  : Get company Info
  router.get('/queryAllCompany', companyController.queryAllCompany);
--------------------------------------------------`);
    const dbModels = global.DB_MODELS;

    try {

        network.queryAllCompany().then((response) => {
            var carsRecord = JSON.parse(response);
            return res.send(carsRecord)
        });

    } catch (err) {

        console.log('[ ERROR ]', err);
        res.status(500).send({
            message: 'query company error'
        })
    }
};



exports.fileDownload = async (req, res) => {
    console.log(`
--------------------------------------------------
  User : Hyperledger-Fabric Test User
  API  : Get company Info
  router.get('/fileDownload', companyController.fileDownload);
--------------------------------------------------`);
    const dbModels = global.DB_MODELS;

    try {

        const key = req.query.key

        network.selectCompany(key)
            .then(async (response) => {

                // 블록체인에서 온 데이터 json화
                let responseJSON = JSON.parse(response);

                // console.log('responseJSON >>>>>>>>>>', responseJSON.upload_file_name)

                const base64EncodedText = responseJSON.upload_file_buffer;


                let filePath = __dirname + '/../../../../public/downloads/';

                // pdf decoding
                base64.base64Decode(base64EncodedText, filePath + responseJSON.upload_file_name);

                let file = filePath + responseJSON.upload_file_name

                res.download(file)

                await new Promise(res => setTimeout(res, 0));

                // db에 모든 작업이 올라간 후에 downloads에 있는 파일이 지워진다.
                fs.unlinkSync(__dirname + '/../../../../public/downloads/' + responseJSON.upload_file_name, function () { }) // 파일 삭제
            })
    } catch (err) {

        console.log('[ ERROR ]', err);
        res.status(500).send({
            message: 'query company error'
        })
    }
};


exports.queryCompany = async (req, res) => {
    console.log(`
--------------------------------------------------
  User : Hyperledger-Fabric Test User
  API  : Get company Info
  router.get('/queryCompany', companyController.queryCompany);
--------------------------------------------------`);
    const dbModels = global.DB_MODELS;

    try {

        console.log(req.query.key)

        const key = req.query.key

        network.selectCompany(key).then((response) => {
            var carsRecord = JSON.parse(response);
            return res.send(carsRecord)
        });

    } catch (err) {

        console.log('[ ERROR ]', err);
        res.status(500).send({
            message: 'query company error'
        })
    }
};


exports.editCompany = async (req, res) => {
    console.log(`
--------------------------------------------------
  User : Hyperledger-Fabric Test User
  API  : Get company Info
  router.post('/editCompany', upload.any(), companyController.editCompany);
--------------------------------------------------`);
    const dbModels = global.DB_MODELS;

    try {

        console.log(req.body)
        console.log(req.files[0])

        // 파일시스템에서 파일 열기
        fs.open(req.files[0].path, "r", function (err, fd) {
            // binary 데이터를 저장하기 위해 파일 사이즈 만큼의 크기를 갖는 Buffer 객체 생성
            const buffer = Buffer.alloc(req.files[0].size);
            fs.read(fd, buffer, 0, buffer.length, null, function (err, bytes, buffer) {
                const obj = {
                    "Key": req.body.key,
                    "originalFileName": req.files[0].originalname,
                    "filePath": req.files[0].path,
                    "fileSize": req.files[0].size,
                    "file": buffer
                };

                const criteria = {
                    Key: req.body.key
                }
            

                const editCompany = dbModels.UploadFiles.findOneAndUpdate(criteria, obj, function (err) {
                    if (err) {
                        res.send(err);
                    }

                    // db에 모든 작업이 올라간 후에 uploads에 있는 파일이 지워진다.
                    fs.unlink(req.files[0].path, function () { }) // 파일 삭제
                })

                base64EncodedText = Buffer.from(obj.file, "utf8").toString('base64');
                network.editCompany(req.body.key, req.body.company_name, req.body.my_name, req.body.your_name, obj.originalFileName, base64EncodedText)
                    .then((response) => {
                        return res.send(response)
                    })
            })
        })

    } catch (err) {

        console.log('[ ERROR ]', err);
        res.status(500).send({
            message: 'add company error'
        })
    }
};