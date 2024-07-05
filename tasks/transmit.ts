import { task } from "hardhat/config";
import { PriceFeed, PriceFeed__factory } from "../typechain-types";

task('transmit:PriceFeed').setAction(async (args, { ethers }) => {
    const pricefeedAddress = process.env.EVM_PRICEFEED_ADDRESS;
    if (!pricefeedAddress) throw new Error('Environment variable EVM_PRICEFEED_ADDRESS must be set');

    const pricefeedFactory = await ethers.getContractFactory('PriceFeed') as PriceFeed__factory;
    const contract = pricefeedFactory.attach(pricefeedAddress) as PriceFeed;

    await contract.transmit();
});