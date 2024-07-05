<p align="center">
  <a href="https://seda.xyz/">
    <img width="90%" alt="seda-protocol" src="https://www.seda.xyz/images/footer/footer-image.png">
  </a>
</p>

<h1 align="center">
  SEDA SDK Starter Template
</h1>

Starter template to create Data Requests on the SEDA network using AssemblyScript.
This is meant as a showcase of what a project utilising SEDA looks like and can serve as a jump off point for your own project.

## Requirements

* Have [Bun](https://bun.sh/) installed in your system OR
* Use the [devcontainer](https://containers.dev/) which installs all requirements for you

## Getting started

A complete Data Request cycle goes through 2 WASM VM executions: the execution phase and the tally phase. It's possible to specify different binaries for the phases, or alternatively specify a single binary and add a branching condition for the execution phase and tally phase. This branching is required as the available functions and environment variables are different between the 2 phases.

This project uses the dual structure to simplify testing and uploading.

The source code for the Data Request binary lives in the `assembly` directory. This includes a `tsconfig.json` to configure the editor to process all files in the directory as AssemblyScript.

### Building

To build the binary with the release profile run:

```sh
bun run build:release
```

To build the binary with the debug profile run:

```sh
bun run build:debug
```

To build the contracts:

```sh
bun run build:contracts
```

You can also generate both with the shorthand command:

```sh
bun run build
```

### Local Testing

To test the binary this project uses `@seda-protocol/vm` and `@seda-protocol/dev-tools` which allows makes it easy to run the binary in a local WASM VM and provide different test cases for it. Your tests should use the compiled WASM code, so make sure to build the binary before running tests. In this project the `test` script in the `package.json` always calls `bun run build` before running the test.

This project uses Bun's built in test runner, but any JavaScript/TypeScript testing framework should work.

> [!WARNING]
> The `@seda-protocol/vm` package might not work properly in Node.js. Try setting the environment variable `NODE_OPTIONS=--experimental-vm-modules` before running the test command.

```sh
bun run test
```

### Uploading

Installing `@seda-protocol/dev-tools` also installs a CLI to easily upload new WASM binaries, query an existing binary, or request a list of existing binaries. The CLI requires a RPC endpoint which can be provided through a `.env` file or a flag:

```sh
# With .env file
bunx seda-sdk wasm list
# With flag
bunx seda-sdk wasm list --rpc https://rpc.devnet.seda.xyz
```

Uploading a WASM binary requires submitting a transaction, make sure the `.env` file contains a mnemonic for a wallet that has enough funds to submit transactions.

```sh
bunx seda-sdk wasm upload PATH_TO_BUILD
```

Or you can use one of the following commands:

```sh
bun run deploy:debug

bun run deploy:release
```

### Deploying contract

You can deploy the EVM contract on Base Sepolia using the following command:

```sh
bun run deploy:contracts
```

Make sure you have the following environment variables filled in:

```sh
# Your EVM private key in order to deploy the consumer contract
# This example deploys on Base Sepolia, so it requires you to have some Base Sepolia ETH
EVM_PRIVATE_KEY=

# Used to verify the contract on Base Sepolia
ETHERSCAN_API_KEY=

# Used for posting data request on the seda chain and configuring the consumer contract
# You can get this by running `bunx seda-sdk wasm upload PATH_TO_BUILD`
DR_BINARY_ID=
```

### Integration Testing

`@seda-protocol/dev-tools` exposes functions that make it easy to create scripts that submit Data Requests to the SEDA network and await the result. The `scripts` directory shows an example.

### Creating a Data Request

Creating a Data Request can be done through the consumer contract (which will be relayed if there is an active relayer) or through immidiatly posting a Data Request on the SEDA chain.

Posting through the SEDA chain:

```sh
bun run post-dr
```

This will post a transaction and wait till there is an result.
Make sure you have the following environment variables filled in:

```sh
# RPC for the SEDA network you want to interact with
SEDA_RPC_ENDPOINT=https://rpc.devnet.seda.xyz

# Your SEDA chain mnemonic, fill this in to upload binaries or interact with data requests directly
SEDA_MNEMONIC=

# Used for posting data request on the seda chain and configuring the consumer contract
# You can get this by running `bunx seda-sdk wasm upload PATH_TO_BUILD`
DR_BINARY_ID=
```

Through the deployed consumer contract:

```sh
bun run contract:transmit
```

After a few seconds you can get the result back and read it using:

```sh
bun run contract:latestAnswer
```

You need the following environment variables for this to work:

```sh
# Used so you can call transmit `bun run contract:transmit` and `bun run contract:latestAnswer`
# You can get this by running `bun run deploy:contracts`
EVM_PRICEFEED_ADDRESS=

# Your EVM private key in order to deploy the consumer contract
# This example deploys on Base Sepolia, so it requires you to have some Base Sepolia ETH
EVM_PRIVATE_KEY=
```