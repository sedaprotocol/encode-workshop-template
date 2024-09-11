import { Tally, Process, Bytes } from "@seda-protocol/as-sdk/assembly";
import { u128 } from "as-bignum/assembly";

/**
 * This function represents the tally phase in the SEDA network.
 * It calculates the median price from the results revealed during the execution phase and submits it.
 * The number of reveals depends on the data request parameter replication factor.
 */
export function tallyPhase(): void {
  // We can get tally inputs from Process.getInputs(), but it's unused in this example
  // const tallyInputs = Process.getInputs();

  // Get consensus reveals from the tally phase
  const reveals = Tally.getReveals();
  const prices: f64[] = [];

  // Loop through each reveal, parse it as a float (f64), and store it in the prices array
  for (let i = 0; i < reveals.length; i++) {
    const price = f64.parse(reveals[i].reveal.toUtf8String());
    prices.push(price);
  }

  // If there are valid prices, calculate the median price
  if (prices.length > 0) {
    // Multiply the median by 1,000,000 to avoid floating-point precision issues
    // and convert it to a u128 to maintain large precision.
    const finalPrice = u128.from(median(prices) * 1000000);

    // Report the final price as success in the tally phase
    Process.success(Bytes.fromUtf8String(finalPrice.toString()));
  } else {
    // If no prices were available, return an error
    Process.error(Bytes.fromUtf8String("No consensus among revealed results"), 1);
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
