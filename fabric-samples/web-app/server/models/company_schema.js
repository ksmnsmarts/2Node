const mongoose = require('mongoose');

// company_code 
const companySchema = mongoose.Schema(
	{
        company_name: {
            type: String
        },
        my_name: {
            type: String
        },
        your_name: {
            type: String
        },
       
	},
	{
		timestamps: true
	}
);

const Company = mongoose.model('Company', companySchema);

module.exports = Company;


