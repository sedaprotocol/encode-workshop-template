import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/types";
import dotenv from 'dotenv';

// tasks
import "./tasks/deploy/pricefeed";
import "./tasks/transmit";
import "./tasks/latest-answer";

dotenv.config();

const privateKey = process.env.EVM_PRIVATE_KEY;
const etherScanApiKey = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: '0.8.25',
  networks: {
    sepoliaBase: {
      accounts: [privateKey],
      url: 'https://sepolia.base.org',
      chainId: 84532,
    }
  },
  etherscan: {
    apiKey: etherScanApiKey,
    customChains: [
      {
        chainId: 84532,
        network: 'sepoliaBase',
        urls: {
          apiURL: 'https://api-sepolia.basescan.org/api',
          browserURL: 'https://sepolia.basescan.org/',
        }
      }
    ]
  }
}

export default config;
