import { Tally, Process, u128, Bytes } from "@seda-protocol/as-sdk/assembly";

/**
 * Executes the tally phase within the SEDA network.
 * This phase aggregates the results (e.g., price data) revealed during the execution phase,
 * calculates the median value, and submits it as the final result.
 * Note: The number of reveals depends on the replication factor set in the data request parameters.
 */
export function tallyPhase(): void {
  const reveals = Tally.getReveals();

  const revealsAsPrices: u128[] = [];
  let cumulativePrice: u128 = u128.from(0);

  for (let i = 0; i < reveals.length; i++) {
    const revealAsPrice = reveals[i].reveal.toU128();
    cumulativePrice = u128.add(cumulativePrice, revealAsPrice)
    revealsAsPrices.push(revealAsPrice);
  }

  if (revealsAsPrices.length > 0) {
    const avg = u128.div(cumulativePrice, u128.from(revealsAsPrices.length));
    const result = avg.toString();
    Process.success(Bytes.fromUtf8String(result));
  } else {
    Process.error(Bytes.fromUtf8String("No reveals to calculate average"));
  }
}
