const router = require('express').Router();
const company = require('./company/company_index');



router.use('/company', company);


module.exports = router;