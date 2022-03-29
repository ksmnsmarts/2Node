const mongoose = require('mongoose');

// UploadFiles_code 
const uploadFilesSchema = mongoose.Schema(
	{
        Key: {
            type: String
        },
        originalFileName: {
            type: String
        },
        filePath: {
            type: String
        },
        fileSize: {
            type: String
        },
        file: {
            type: Buffer
        },       
	},
	{
		timestamps: true
	}
);

const UploadFiles = mongoose.model('UploadFiles', uploadFilesSchema);

module.exports = UploadFiles;


