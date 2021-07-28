pragma solidity ^0.4.17;  // solhint-disable-line


contract Inbox{
    string public message;

    function Inbox(string initialMessage) public {
        message = initialMessage;
    }

    function setMessage(string newMessage) public {
        message = newMessage;
    }
}