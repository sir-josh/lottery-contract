const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } =  require('../compile');

let FetchedAccounts;
let inbox;

beforeEach(async() => {
    //Get a list of my accounts associated with ganache network
    FetchedAccounts = await web3.eth.getAccounts();


    //Use of the fetched accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
                            .deploy({ data: bytecode, arguments: ["Hi, There"] })
                            .send({ from: FetchedAccounts[0], gas: "1000000" });
});

describe("Inbox Contract Body", () => {
    it('deploys a contract', () => {
        console.log(inbox);
    });
});