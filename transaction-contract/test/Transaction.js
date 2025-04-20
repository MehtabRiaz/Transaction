const { expect } = require("chai");
const { ethers } = require("hardhat");
import hre from "hardhat";

describe("Transaction Contract", function () {
  async function deployTransactionFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const Transaction = await ethers.getContractFactory("Transaction");
    const transaction = await Transaction.deploy();
    await transaction.waitForDeployment();

    return { transaction, owner, otherAccount };
  }

  async function deployContract() {
    // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    // const ONE_GWEI = 1_000_000_000;

    // const lockedAmount = ONE_GWEI;
    // const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const Transaction = await hre.ethers.getContractFactory("Transaction");
    const transaction = await Transaction.deploy();

    return { transaction, owner, otherAccount };
  }

  // describe("Deployment", function () {
  //   it("Should set the right owner", async function () {
  //     const { transaction, owner } = await deployTransactionFixture();
  //     expect(await transaction.i_owner()).to.equal(owner.address);
  //   });
  // });

  describe("Deposits", function () {
    it("Should accept deposits above the minimum amount and update balance", async function () {
      let { transaction, otherAccount, owner } = await deployContract();
      let depositAmount = ethers.parseEther("0.00063");

      // Expect the Deposit event to be emitted on deposit
      await expect(
        transaction.connect(otherAccount).deposit({value: depositAmount,})
      ).to.emit(transaction, "Deposit");

      // Fetch the contract balance after deposit
      let balance = await ethers.provider.getBalance(transaction.address);
      console.log("Contract balance (ETH):", ethers.formatEther(balance));

      // Assert that the contract balance equals the depositAmount
      expect(balance).to.equal(depositAmount);
    });

    // it("Should revert deposits below the minimum amount", async function () {
    //   const { transaction, otherAccount } = await deployTransactionFixture();
    //   const depositAmount = ethers.parseEther("0.00040");

    //   await expect(
    //     transaction.connect(otherAccount).deposit({
    //       value: depositAmount,
    //     })
    //   ).to.be.revertedWithCustomError(transaction, "InsufficientDeposit");
    // });
  });

  // describe("Withdrawals", function () {
  //   it("Should allow the owner to withdraw all funds", async function () {
  //     const { transaction, owner, otherAccount } =
  //       await deployTransactionFixture();
  //     const depositAmount = ethers.parseEther("1");

  //     await transaction.connect(otherAccount).deposit({ value: depositAmount });
  //     await expect(transaction.connect(owner).withdraw()).to.emit(
  //       transaction,
  //       "Withdraw"
  //     );
  //   });

  //   it("Should revert if a non-owner tries to withdraw", async function () {
  //     const { transaction, otherAccount } = await deployTransactionFixture();

  //     await expect(
  //       transaction.connect(otherAccount).withdraw()
  //     ).to.be.revertedWithCustomError(transaction, "NotOwner");
  //   });
  // });
});
