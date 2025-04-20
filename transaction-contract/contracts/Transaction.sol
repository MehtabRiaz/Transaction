// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.29;

// Uncomment this line to use console.log for debugging
// import "hardhat/console.sol";

error InsufficientDeposit(uint256 requested, uint256 required);
error NotOwner();

contract Transaction {
    //STATES
    uint256 public constant MINIMUM_DEPOSIT = 63e13;
    address payable public immutable i_owner;

    //CONSTRUCTOR
    constructor() {
        i_owner = payable(msg.sender);
    }

    //DEPOSIT
    modifier checkDeposit() {
        if (msg.value < MINIMUM_DEPOSIT) {
            revert InsufficientDeposit({
                requested: msg.value,
                required: MINIMUM_DEPOSIT
            });
        }
        _;
    }
    event Deposit(address indexed sender, uint256 amount, uint when);

    function deposit() public payable checkDeposit {
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    receive() external payable checkDeposit {
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    fallback() external {
        revert("Unable to process transaction");
    }

    //WITHDRAW
    event Withdraw(address indexed sender, uint256 amount, uint when);
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        _;
    }

    function withdraw() public onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        if (success) {
            emit Withdraw(msg.sender, address(this).balance, block.timestamp);
        } else {
            revert("Unable to withdraw");
        }
    }
}
