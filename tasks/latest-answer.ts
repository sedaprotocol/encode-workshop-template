import { task } from "hardhat/config";
import { PriceFeed, PriceFeed__factory } from "../typechain-types";

task("latestAnswer:PriceFeed").setAction(async (args, { ethers }) => {
  const pricefeedAddress = process.env.EVM_PRICEFEED_ADDRESS;
  if (!pricefeedAddress)
    throw new Error("Environment variable EVM_PRICEFEED_ADDRESS must be set");

  const pricefeedFactory: PriceFeed__factory = await ethers.getContractFactory(
    "PriceFeed"
  );
  const contract = pricefeedFactory.attach(pricefeedAddress) as PriceFeed;

  try {
    const result = await contract.latestAnswer();
    const integer = result / BigInt(1e6);
    const decimals = result % BigInt(1e6);

    console.log(`ETH/USDC price: ${integer}.${decimals}`);
  } catch (e) {
    // Query will revert if data result is not available
    console.log(`ETH/USDC price: (not set)`);
  }
});
