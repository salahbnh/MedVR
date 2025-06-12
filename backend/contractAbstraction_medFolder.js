import web3 from './web3Setup.js';
import fs from 'fs';
import isBlockchainEnabled from './lib/blockchain.js';

let medFolderContract = null;

if (isBlockchainEnabled()) {
    try {
        const artifact = JSON.parse(fs.readFileSync('./build/contracts/MedicalFolder.json', 'utf-8'));
        const { abi, networks } = artifact;
        const networkId = Object.keys(networks)[0];
        const contractAddress = networks[networkId].address;
        medFolderContract = new web3.eth.Contract(abi, contractAddress);
        console.log('MedicalFolder contract loaded at', contractAddress);
    } catch (err) {
        console.warn('MedicalFolder contract artifact not found. Run: truffle migrate');
    }
}

export { medFolderContract };
