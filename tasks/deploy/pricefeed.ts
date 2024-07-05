import { task } from "hardhat/config";
import { PriceFeed__factory } from "../../typechain-types";

interface TaskOptions {
    prover: string,
    binary: string,
    verify: boolean,
}

const VERIFY_DELAY = 10_000;

task('deploy:PriceFeed')
    .addFlag('verify', 'Verify the contract')
    .setAction(async (args: TaskOptions, { ethers, run }) => {
        let drBinaryId = process.env.DR_BINARY_ID;
        let proverContract = process.env.EVM_SEDA_PROVER_CONTRACT;

        if (!drBinaryId) throw new Error('Environment variable DR_BINARY_ID must be set');
        if (!proverContract) throw new Error('Environment variable EVM_SEDA_PROVER_CONTRACT must be set');

        // Required for ethers to recognize the string as bytes
        if (!drBinaryId.startsWith('0x')) drBinaryId = `0x${drBinaryId}`;
        if (!proverContract.startsWith('0x')) proverContract = `0x${proverContract}`;

        const pricefeedFactory: PriceFeed__factory = await ethers.getContractFactory('PriceFeed');
        const priceFeed = await pricefeedFactory.deploy(proverContract, drBinaryId);
        const deployedAddress = await priceFeed.getAddress();

        console.log(`PriceFeed deployed to: ${deployedAddress}`);

        if (args.verify) {
            console.log('Verifying..');

            // Give etherscan some time to index the contract
            await sleep(VERIFY_DELAY);

            await run("verify:verify", {
                address: deployedAddress,
                constructorArguments: [proverContract, drBinaryId],
            });
            
            console.log("Etherscan Verification Done");
        }
    });

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
}