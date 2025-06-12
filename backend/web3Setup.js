import Web3 from 'web3';
import isBlockchainEnabled from './lib/blockchain.js';

const web3 = isBlockchainEnabled()
    ? new Web3(process.env.WEB3_PROVIDER || 'HTTP://127.0.0.1:7545')
    : null;

export default web3;
