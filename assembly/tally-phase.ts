import { Tally, Process, Bytes } from "@seda-protocol/as-sdk/assembly";
import { jsonArrToUint8Array } from "@seda-protocol/as-sdk/assembly/json-utils";
import { u128 } from "as-bignum/assembly";

export function tallyPhase(): void {
  // Allows you to access tally inputs
  // in this example we don't need it
  const _tallyInputs = Process.getInputs();

  const reveals = Tally.getConsensusReveals();
  const prices: f64[] = [];

  for (let i = 0; i < reveals.length; i++) {
    const price = f64.parse(reveals[i].reveal.toUtf8String());
    // const price = String.UTF8.decode(jsonArrToUint8Array(reveal.reveal).buffer);
    prices.push(price);
  }

  if (prices.length > 0) {
    const finalPrice = u128.from(median(prices) * 1000000).toString();
    Process.success(Bytes.fromString(finalPrice));
  } else {
    Process.error(Bytes.fromString("No consensus"), 1);
  }
}

function median(numbers: f64[]): f64 {
  const sorted: f64[] = numbers.sort();
  const middle = i32(Math.floor(sorted.length / 2));

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}
