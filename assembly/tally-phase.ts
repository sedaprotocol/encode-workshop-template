import { Tally, Process, Bytes, u128, Console } from "@seda-protocol/as-sdk/assembly";

/**
 * Executes the tally phase within the SEDA network.
 * This phase aggregates the results (e.g., price data) revealed during the execution phase,
 * calculates the median value, and submits it as the final result.
 * Note: The number of reveals depends on the replication factor set in the data request parameters.
 */
export function tallyPhase(): void {
  Process.success(Tally.getReveals()[0].reveal);
}
