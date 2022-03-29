const { ObjectId } = require('bson');
const network = require('../../../../fabric/network.js')


exports.addCompany = async (req, res) => {
    console.log(`
--------------------------------------------------
  User : Hyperledger-Fabric Test User
  API  : Get company Info
  router.post('/addCompany', companyController.addCompany);
  
--------------------------------------------------`);
    const dbModels = global.DB_MODELS;

    try {

        console.log(req.body)

        const criteria = {
            company_name: req.body.company_name,
            my_name: req.body.my_name,
            your_name: req.body.your_name,
        }

        const addCompany = await dbModels.Company(criteria)
        // await addCompany.save();

        network.queryAllCompany().then((response) => {
                var carsRecord = JSON.parse(response);
                var numCars = carsRecord.length;
                var newKey = 'Company' + numCars;
                network.createCompany(newKey, req.body.company_name, req.body.my_name, req.body.your_name)
                    .then((response) => {
                        return res.send(response)
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