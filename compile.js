const path = require('path');
const filesource = require('fs');
const solc = require('solc');

const lotteryContractPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const sourceCode = filesource.readFileSync(lotteryContractPath, 'utf8');

module.exports = solc.compile(sourceCode, 1).contracts[':Lottery'];