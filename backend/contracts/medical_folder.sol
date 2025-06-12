pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract MedicalFolder {
    
    event MedFolderAdded(bytes32 medHash);

    struct MedFolder{
        address patient;
        bytes32 medHash;
        uint256 modifDate;
    }

    MedFolder[] private medFolders;

    mapping (address => mapping(address => bool)) public allowedAccess;
    mapping (address=> uint) public ownerToMedFolder;
    mapping (address => uint) ownerMedFolderCount;

    modifier onlyAllowedDoctor(address _patient) {
        require(allowedAccess[_patient][msg.sender], "Caller is not an allowed doctor");
        _;
    }

    function addMedFolder(string memory _hash) public{
        require(ownerMedFolderCount[msg.sender] == 0);
        bytes32 hsh = keccak256(abi.encode(_hash));
        medFolders.push(MedFolder(msg.sender, hsh, block.timestamp));
        uint id = medFolders.length - 1;
        ownerToMedFolder[msg.sender] = id;
        ownerMedFolderCount[msg.sender]++;
        emit MedFolderAdded(hsh);
    }
    
    function modifyMedFolder(address _patient, string memory _newHash) public onlyAllowedDoctor(_patient){
        bytes32 newHash = keccak256(abi.encode(_newHash));

        medFolders.push(MedFolder(_patient, newHash, block.timestamp));
        uint newIndex = medFolders.length - 1;

        ownerToMedFolder[_patient] = newIndex;
        ownerMedFolderCount[_patient]++;
        emit MedFolderAdded(newHash);
    }

    function setAllowedAccess(address patient, address doctor, bool access) private {
        allowedAccess[patient][doctor] = access;
    }

    function giveAccess(address _doctor) public {
        setAllowedAccess(msg.sender, _doctor, true);
    }

    function removeAccess(address _doctor) public {
        require(allowedAccess[msg.sender][_doctor], "Doctor does not have access");
        setAllowedAccess(msg.sender, _doctor, false);
    }

    function getMedFolder(address _patient) public view returns(MedFolder memory){
        require(msg.sender == _patient || allowedAccess[_patient][msg.sender], "Caller does not have permission to access medical folder");
        return medFolders[ownerToMedFolder[_patient]];
    }

}