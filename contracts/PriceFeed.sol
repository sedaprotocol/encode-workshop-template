// SPDX-License-Identifier: MIT
// NOTICE: this is an example contract and no security considirations are taken into account
// This contract is in no way secure and acts only as an example of how to create and read Data Requests
pragma solidity ^0.8.24;

import "@seda-protocol/contracts/src/SedaProver.sol";

contract PriceFeed {
    bytes32 data_request_id;
    bytes32 dr_binary_id;
    SedaProver seda_prover_contract;

    constructor(address _seda_prover_contract, bytes32 _dr_binary_id) {
        seda_prover_contract = SedaProver(_seda_prover_contract);
        dr_binary_id = _dr_binary_id;
    }

    function transmit() public {
        bytes memory dr_inputs = "eth-usdc";
        bytes memory tally_inputs = hex"00";
        bytes memory consensus_filter = hex"00";
        bytes memory memo = abi.encodePacked(block.number);

        SedaDataTypes.DataRequestInputs memory inputs = SedaDataTypes.DataRequestInputs(dr_binary_id, dr_inputs, dr_binary_id, tally_inputs, 1, consensus_filter, 0, 0, memo);
        data_request_id = seda_prover_contract.postDataRequest(inputs);
    }

    function latestAnswer() public view returns (uint128) {
        SedaDataTypes.DataResult memory data_result = seda_prover_contract.getDataResult(data_request_id);

        // Check if the data result was in consensus (≥ 66% of nodes agreed on the answer)
        if (data_result.consensus) {
            uint128 result = uint128(bytes16(data_result.result));
            return result;
        }

        return 0;
    }
}
