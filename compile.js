const path = require('path');
const filesource = require('fs');
const solc = require('solc');

const inboxContractPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const sourceCode = filesource.readFileSync(inboxContractPath, 'utf8');

module.exports = solc.compile(sourceCode, 1).constracts[':Inbox'];