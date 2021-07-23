const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

let FetchedAccounts;

beforeEach(async() => {
    //Get a list of my accounts associated with ganache network
    FetchedAccounts = await web3.eth.getAccounts();


    //Use of the fetched accounts to deploy the contract
});

it('Show all my ganache eth accounts', () => {
    console.log(FetchedAccounts);
});