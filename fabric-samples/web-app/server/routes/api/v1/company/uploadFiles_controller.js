const { ObjectId } = require('bson');
const network = require('../../../../fabric/network.js')


exports.uploadFiles = async (req, res) => {
    console.log(`
--------------------------------------------------
  User : Hyperledger-Fabric Test User
  API  : Get company Info
  router.post('/uploadFiles', upload.single('file'), uploadFilesController.uploadFiles);
--------------------------------------------------`);
    const dbModels = global.DB_MODELS;

    try {

        console.log(req.files[0])

        // const criteria = {
        //     company_name: req.body.company_name,
        //     my_name: req.body.my_name,
        //     your_name: req.body.your_name,
        // }

        // const addCompany = await dbModels.Company(criteria)
        // // await addCompany.save();

        // network.queryAllCompany().then((response) => {
        //         var carsRecord = JSON.parse(response);
        //         var numCars = carsRecord.length;
        //         var newKey = 'Company' + numCars;
        //         network.createCompany(newKey, req.body.company_name, req.body.my_name, req.body.your_name)
        //             .then((response) => {
        //                 return res.send(response)
        //             })
        //     })

    } catch (err) {

        console.log('[ ERROR ]', err);
        res.status(500).send({
            message: 'file upload error'
        })
    }
};

