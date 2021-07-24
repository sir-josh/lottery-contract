const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } =  require('../compile');

let FetchedAccounts;
let inbox;
const INITIAL_STRING = "Hi, This is my first smart contract";
const newMessage = "Good for you, welcome to smart contract programming";

beforeEach(async() => {
    //Get a list of my accounts associated with ganache network
    FetchedAccounts = await web3.eth.getAccounts();


    //Use of the fetched accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
                            .deploy({ data: bytecode, arguments: [INITIAL_STRING] })
                            .send({ from: FetchedAccounts[0], gas: "1000000" });
});

describe("Inbox Contract Body", () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () =>{
        const msg = await inbox.methods.message().call();
        assert.equal(msg, INITIAL_STRING);
    });

    it('changed the default message', async () => {
        await inbox.methods.setMessage("Good for you, welcome to smart contract programming").send({ from: FetchedAccounts[0]});
        const msg = await inbox.methods.message().call();
        assert.equal(msg, newMessage);
    });
});