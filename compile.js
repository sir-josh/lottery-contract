const path = require('path');
const filesource = require('fs');
const solc = require('solc');

const inboxContractPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const sourceCode = filesource.readFileSync(inboxContractPath, 'utf8');

module.exports = solc.compile(sourceCode, 1).contracts[':Lottery'];