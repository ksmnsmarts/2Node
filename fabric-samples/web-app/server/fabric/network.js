'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml')

// capture network variables from config.json
const configPath = path.join(process.cwd(), '/config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
var connection_file = config.connection_file;
// var userName = config.userName;
var gatewayDiscovery = config.gatewayDiscovery;

// connect to the connection file
const filePath = path.join(process.cwd(), '/connection.yaml');
let fileContents = fs.readFileSync(filePath, 'utf8');
let connectionFile = yaml.safeLoad(fileContents);



// 계약서 생성에 필요한 계약서 전체 갯수 불러오기
exports.queryAllCompany = async function() {
    try {
        console.log('starting to queryAllCompany')

        var response = {};

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');

        if (!userExists) {
            console.log('An identity for the user ' + 'user1' + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + 'user1' + ' does not exist in the wallet. Register ' + 'user1' + ' first';
            return response;            
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();

        await gateway.connect(connectionFile, { wallet, identity: 'user1', discovery: gatewayDiscovery });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('mycc');

        // Evaluate the specified transaction.
        // queryAllCompany transaction - requires no arguments, ex: ('queryAllCompany')
        const result = await contract.evaluateTransaction('queryAllCompany');

        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        console.log('+---------------------------------------------+')

        return result;

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}



// create car transaction
exports.createCompany = async function(key, company_name, my_name, your_name, upload_file_name, upload_file_buffer) {
    try {

        var response = {};

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user ' + 'user1' + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + 'user1' + ' does not exist in the wallet. Register ' + 'user1' + ' first';
            return response;
        }

        // Create a new gateway for connecting to our peer node.
        console.log('we here in createCompany')

        const gateway = new Gateway();
        await gateway.connect(connectionFile, { wallet, identity: 'user1', discovery: gatewayDiscovery });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('mycc');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')

        await contract.submitTransaction('createCompany', key, company_name, my_name, your_name, upload_file_name, upload_file_buffer);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

        response.msg = 'createCompany Transaction has been submitted';
        console.log('+---------------------------------------------+')
        return response;        

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response; 
    }
}

