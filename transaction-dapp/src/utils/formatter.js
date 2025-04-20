import * as ethers from "ethers";

export function isEmpty(value) {
  return (
    value == null ||
    value === false ||
    value === "" ||
    value === 0 ||
    value === 0n ||
    (typeof value === "number" && isNaN(value))
  );
}

//converts wei to eth
export function wieToEth(value, decimals = 5) {
  if (isEmpty(value)) return "";
  return parseFloat(ethers.formatEther(value)).toFixed(decimals);
}

//converts eth to wie
export function ethToWie(value) {
  if (isEmpty(value)) return "";
  return ethers.parseEther(value);
}
