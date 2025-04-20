import { CONTRACT_ADDRESS, TRANSACTION_ABI } from "../static/constants";
import * as ethers from "ethers";
import { isEmpty, ethToWie } from "./formatter";

function getProvider() {
  const { ethereum } = window;
  if (ethereum) {
    return new ethers.BrowserProvider(ethereum);
  } else {
    console.log("No provider found!");
    return null;
  }
}

async function getSigner() {
  try {
    const provider = getProvider();
    if (!provider) throw new Error();
    return await provider.getSigner();
  } catch (error) {
    console.log("No signer Found!");
    return null;
  }
}

export async function getContract() {
  try {
    const signer = await getSigner();
    if (isEmpty(signer)) throw new Error();
    return new ethers.Contract(CONTRACT_ADDRESS, TRANSACTION_ABI, signer);
  } catch (error) {
    console.log("Contract initialize failed!");
    return null;
  }
}

export async function getAccount() {
  try {
    const signer = await getSigner();
    if (!signer) throw new Error();
    return await signer.getAddress();
  } catch (error) {
    console.log("Account fetching failed!");
    return "";
  }
}

export async function getBalance() {
  try {
    const provider = getProvider();
    const signer = await getSigner();
    if (!provider || !signer) throw new Error();
    return await provider.getBalance(signer);
  } catch (error) {
    console.log("Balance fetching failed");
    return "";
  }
}

export async function depositFund(contract, depositValue) {
  try {
    if (isEmpty(contract) || isEmpty(depositValue)) throw new Error();
    const deposit = await contract.deposit({
      value: ethToWie(depositValue.toString()),
    });
    contract.on("*", (event) => {
      console.log(event.log);
    });
    await deposit.wait();
    return true;
  } catch (e) {
    console.log(e, "Deposit failed!");
    return false;
  }
}

export async function withdrawFunds(contract) {
  try {
    if (isEmpty(contract)) throw new Error();
    const withdraw = await contract.withdraw();
    await withdraw.wait();
    return true;
  } catch (e) {
    console.log(e, "Withdraw failed!");
    return false;
  }
}
