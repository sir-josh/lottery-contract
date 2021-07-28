const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    "kiss member author service section bronze seminar bicycle federal piano angry scan",
    "https://rinkeby.infura.io/v3/dad984162b06451eb4babfcc418e113c"
);

const web3 = new Web3(provider);

const deployContract = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy a contract from account ', accounts[0]);

    const deploymentResult = await new web3.eth.Contract(JSON.parse(interface))
                                .deploy({ data: bytecode })
                                .send({ gas: '1000000', from: accounts[0]})

    console.log('Contract deployed to ', deploymentResult.options.address);
}

deployContract();