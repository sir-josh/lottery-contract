const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());


beforeEach(() => {
    //Get a list of my accounts associated with ganache network
    web3.eth.getAccounts().then( fetchedAccounts => {
        console.log(fetchedAccounts);
    });


    //Use of the accounts to deploy the contract
});

it('Show all my ganache eth accounts', () => {

});