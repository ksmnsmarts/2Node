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
        // console.log(`Wallet path: ${walletPath}`);

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

        // console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        console.log(`Transaction has been evaluated, result is:`);
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
        // console.log(`Wallet path: ${walletPath}`);

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





// 계약서 상세 조회
exports.selectCompany = async function (key) {
    try {
        console.log('starting to selectCompany')
        var response = {};
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);
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
        await gateway.connect(connectionFile, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('mycc');
        const result = await contract.evaluateTransaction('selectCompany', key);
        // response.msg = ' select Result submitted';
        // 상세조회에서 나온 값 추출
        // console.log(result)
        let resultJSON = JSON.parse(result);
        // console.log(resultJSON)


        // // pdf 파일 불러오기
        // const filename = path.resolve(__dirname + '..', '..', '..', 'uploads', resultJSON.contract_contract_name);
        // const fileLoaded = fs.readFileSync(filename, 'utf8');
        // // 불러온 pdf 파일 hash 값 추출
        // var hashToAction = CryptoJS.SHA256(fileLoaded).toString();
        // console.log("Hash of the file: " + hashToAction);
        // console.log("");

        // // 갑 인증서 불러오기
        // const certfile = path.resolve(__dirname + '..', '..', '..', 'wallet', resultJSON.contract_writer, resultJSON.contract_writer);
        // const certLoaded = fs.readFileSync(certfile, 'utf8');
        // const certfileObj = JSON.parse(certLoaded);
        // // console.log(certfileObj.enrollment.identity.certificate);
        // const certificate = certfileObj.enrollment.identity.certificate;

        // console.log("갑 계약서 서명 시간 " + resultJSON.contract_timeA);
        // console.log("");

        // // Show info about certificate provided
        // const certAObj = new X509();
        // certAObj.readCertPEM(certificate);
        // console.log("Detail of certificate provided")
        // console.log("Subject: " + certAObj.getSubjectString());
        // console.log("Issuer (CA) Subject: " + certAObj.getIssuerString());
        // console.log("Valid period: " + certAObj.getNotBefore() + " to " + certAObj.getNotAfter());
        // console.log("CA Signature validation: " + certAObj.verifySignature(KEYUTIL.getKey(caCert)));
        // console.log("");

        // // perform signature checking
        // var userPublicKey = KEYUTIL.getKey(certificate);
        // var recover = new KJUR.crypto.Signature({ "alg": "SHA256withECDSA" });
        // recover.init(userPublicKey);
        // recover.updateHex(hashToAction);
        // var getBackSigValueHex = new Buffer.from(resultJSON.contract_hashA, 'base64').toString('hex');
        // console.log("갑 서명 확인 Signature verified with certificate provided: " + recover.verify(getBackSigValueHex));
        // console.log("");

        // if (resultJSON.contract_receiver) {
        //     // 을 인증서 불러오기
        //     const certBfile = path.resolve(__dirname + '..', '..', '..', 'wallet', resultJSON.contract_receiver, resultJSON.contract_receiver);
        //     const certBLoaded = fs.readFileSync(certBfile, 'utf8');
        //     const certBfileObj = JSON.parse(certBLoaded);
        //     // console.log(certBfileObj.enrollment.identity.certificate);
        //     const certificateB = certBfileObj.enrollment.identity.certificate;

        //     console.log("을 계약서 서명 시간 " + resultJSON.contract_timeB);
        //     console.log("");

        //     // Show info about certificate provided
        //     const certBObj = new X509();
        //     certBObj.readCertPEM(certificateB);
        //     console.log("Detail of certificate provided")
        //     console.log("계약자: " + certBObj.getSubjectString());
        //     console.log("Issuer (CA) Subject: " + certBObj.getIssuerString());
        //     console.log("Valid period: " + certBObj.getNotBefore() + " to " + certBObj.getNotAfter());
        //     console.log("CA Signature validation: " + certBObj.verifySignature(KEYUTIL.getKey(caCert)));
        //     console.log("");

        //     // perform signature checking
        //     var userBPublicKey = KEYUTIL.getKey(certificateB);
        //     var recover = new KJUR.crypto.Signature({ "alg": "SHA256withECDSA" });
        //     recover.init(userBPublicKey);
        //     recover.updateHex(hashToAction);
        //     var getBackSigValueHex = new Buffer.from(resultJSON.contract_hashB, 'base64').toString('hex');
        //     console.log("을 서명 확인 Signature verified with certificate provided: " + recover.verify(getBackSigValueHex));
        //     console.log("");
        // }



        return result;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}



// 계약서 수정
exports.editCompany = async function (key, company_name, my_name, your_name, upload_file_name, upload_file_buffer) {
    try {
        var response = {};
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);
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
        await gateway.connect(connectionFile, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('mycc');
        // Submit the specified transaction.
        // editCompany transaction - requires 6 args , ex: ('editCompany', 'CAR10', 'Dave')
        await contract.submitTransaction('editCompany', key, company_name, my_name, your_name, upload_file_name, upload_file_buffer);
        console.log('Transaction has been submitted');
        // Disconnect from the gateway.
        await gateway.disconnect();
        response.msg = 'editCompany Transaction has been submitted';
        return response;
        
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}



// 계약서 삭제
exports.deleteCompany = async function (key) {
    try {
        console.log('starting to deleteCompany')
        var response = {};
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);
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
        await gateway.connect(connectionFile, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('mycc');
        await contract.submitTransaction('deleteCompany', key);
        console.log('Transaction has been submitted');
        // Disconnect from the gateway.
        await gateway.disconnect();
        response.msg = 'deleteCompany Transaction has been submitted';
        return response;

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}