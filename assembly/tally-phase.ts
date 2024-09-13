import { Tally, Process, Bytes } from "@seda-protocol/as-sdk/assembly";
import { u128 } from "as-bignum/assembly";

/**
 * Executes the tally phase within the SEDA network.
 * This phase aggregates the results (e.g., price data) revealed during the execution phase,
 * calculates the median value, and submits it as the final result.
 * Note: The number of reveals depends on the replication factor set in the data request parameters.
 */
export function tallyPhase(): void {
  // Tally inputs can be retrieved from Process.getInputs(), though it is unused in this example.
  // const tallyInputs = Process.getInputs();

  // Retrieve consensus reveals from the tally phase.
  const reveals = Tally.getReveals();
  const prices: f64[] = [];

  // Iterate over each reveal, parse its content as a floating-point number (f64), and store it in the prices array.
  for (let i = 0; i < reveals.length; i++) {
    const price = f64.parse(reveals[i].reveal.toUtf8String());
    prices.push(price);
  }

  // If there are valid prices revealed, calculate the median price.
  if (prices.length > 0) {
    // Multiply the median price by 1,000,000 to mitigate floating-point precision issues
    // and convert it to u128 to handle large numbers with precision.
    const finalPrice = u128.from(median(prices) * 1000000);

    // Convert the final price into a byte array that will be sent to the destination chains.
    const finalPriceAsByteArray = finalPrice.toUint8Array(true);

    // Report the successful result in the tally phase, encoding the result as bytes.
    Process.success(Bytes.fromByteArray(finalPriceAsByteArray));
  } else {
    // If no valid prices were revealed, report an error indicating no consensus.
    Process.error(Bytes.fromUtf8String("No consensus among revealed results"));
  }
}

/**
 * Function to calculate the median of an array of numbers.
 * @param numbers - Array of f64 numbers
 * @returns The median value
 */
function median(numbers: f64[]): f64 {
  const sorted: f64[] = numbers.sort();
  const middle = i32(Math.floor(sorted.length / 2));

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}
