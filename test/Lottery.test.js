const assert = require('assert');
const ganache = require ('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let lottery, accounts;

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
                    .deploy({ data: bytecode })
                    .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', ()=> {
    it('deploys a contract', ()=>{
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async()=>{
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.1', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[1], players[0]);
        assert.equal(1, players.length);
    });

    it('allows multiple accounts to enter', async()=>{
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.1', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[3],
            value: web3.utils.toWei('0.1', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[4],
            value: web3.utils.toWei('0.1', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[2], players[0]);
        assert.equal(accounts[3], players[1]);
        assert.equal(accounts[4], players[2]);
        assert.equal(3, players.length);
    });

    it('requires some minimum amount of ether to enter', async() => {
        try {
            await lottery.methods.enter().send({
                from: accounts[6],
                value: 200     // This amount to 200 wei(very small amount of ether), so it shoudn't enter the lottery
            });
        } catch (err) { // Test should pass because it caught an error( has < required ether) - an account needs sth > 0.01 ether to enter the lottery pool
           // console.log(err); // Log shows the evidence that this account didn't the lottery pool
            assert(err);
            return;
        }
        assert(false);
    });

    // it('requires some minimum amount of ether to enter', async() => {
    //     try {
    //         await lottery.methods.enter().send({
    //             from: accounts[7],
    //             value: web3.utils.toWei('0.1', 'ether')   // 0.1 ether
    //         });
    //     } catch (err) {       // Test should fail because it didn't catch an error - this account has more than enough (0.1) ether to enter the lottery pool
    //         assert(err);
    //         return;
    //     }
    //     assert(false);
    // });

    it('let only the manager pick a winner', async () => {
        try {
            // At least one person must enter the lottery else pickWinner will fail even if invoked by the manager 
            // and this test will pass because the error will be caught by the catch block.
            await lottery.methods.enter().send({
                from: accounts[2],
                value: web3.utils.toWei('0.02', 'ether')
            });

            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
        } catch (err) {
            // console.log(err);
            assert(err && !(err instanceof assert.AssertionError));
            return;
        }
        assert(false);
    });


    it('sends money to the winner', async () => {
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialPlayerBalance = await web3.eth.getBalance(accounts[1]);

        await lottery.methods.pickWinner().send({ from: accounts[0] });

        const finalPlayerBalance = await web3.eth.getBalance(accounts[1]);

        const difference = finalPlayerBalance - initialPlayerBalance;

        assert.equal(difference, web3.utils.toWei('2', 'ether'));
    });

    it('resets the player array after picking a winner', async () => {
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('2', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('2', 'ether')
        });

        await lottery.methods.pickWinner().send({ from: accounts[0] });

        const NoOfPlayers = await lottery.methods.getPlayers().call({ from: accounts[0] });

        assert.equal(NoOfPlayers, 0);
    });

    
    it('clears out the contract balance to the winner after a winner is decided', async () => {
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('2', 'ether')
        });

        await lottery.methods.pickWinner().send({ from: accounts[0] });

        const contractBalance = await web3.eth.getBalance(lottery.options.address);

        assert.equal(contractBalance, 0);
    });
});