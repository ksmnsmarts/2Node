

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

// Define the car structure, with 4 properties.  Structure tags are used by encoding/json library
type Company struct {
	Company_name   			string `json:"company_name"`
	My_name  				string `json:"my_name"`
	Your_name 				string `json:"your_name"`
	upload_file_name 		string `json:"upload_file_name"`
	upload_file_buffer 		string `json:"upload_file_buffer"`
}

/*
 * The Init method is called when the Smart Contract "company" is instantiated by the blockchain network
 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method is called as a result of an application request to run the Smart Contract "company"
 * The calling application program has also specified the particular smart contract function to be called, with arguments
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "queryCompany" {
		return s.queryCompany(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "createCompany" {
		return s.createCompany(APIstub, args)
	} else if function == "queryAllCompany" {
		return s.queryAllCompany(APIstub)
	} else if function == "changeCompanyName" {
		return s.changeCompanyName(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) queryCompany(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	companyAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(companyAsBytes)
}

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	company := []Company{
		Company{Company_name: "Toyota", My_name: "Prius", Your_name: "blue"},

	}

	i := 0
	for i < len(company) {
		fmt.Println("i is ", i)
		companyAsBytes, _ := json.Marshal(company[i])
		APIstub.PutState("Company"+strconv.Itoa(i), companyAsBytes)
		fmt.Println("Added", company[i])
		i = i + 1
	}

	return shim.Success(nil)
}

func (s *SmartContract) createCompany(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 6 {
		return shim.Error("Incorrect number of arguments. Expecting 6")
	}

	var company = Company{Company_name: args[1], My_name: args[2], Your_name: args[3], upload_file_name: args[4], upload_file_buffer: ares[5]}

	companyAsBytes, _ := json.Marshal(company)
	APIstub.PutState(args[0], companyAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) queryAllCompany(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "Company0"
	endKey := "Company999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllCompany:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) changeCompanyName(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	companyAsBytes, _ := APIstub.GetState(args[0])
	company := Company{}

	json.Unmarshal(companyAsBytes, &company)
	company.Company_name = args[1]

	companyAsBytes, _ = json.Marshal(company)
	APIstub.PutState(args[0], companyAsBytes)

	return shim.Success(nil)
}

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}