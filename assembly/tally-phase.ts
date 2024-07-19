import { Tally, Process } from "@seda-protocol/as-sdk/assembly";
import { jsonArrToUint8Array } from "@seda-protocol/as-sdk/assembly/json-utils";
import { median } from "./services/median";
import { u128 } from "as-bignum/assembly";

export function tallyPhase(): void {
    // Allows you to access tally inputs 
    // in this example we don't need it
    const inputs = Process.getInputs();

    const reveals = Tally.getConsensusReveals();
    const prices: f64[] = [];

    for (let i = 0; i < reveals.length; i++) {
        const reveal = reveals[i];
        const price = String.UTF8.decode(jsonArrToUint8Array(reveal.reveal).buffer);

        prices.push(f64.parse(price));
    }

    if (prices.length > 0) {
        const finalPrice = u128.from(median(prices) * 1000000);
        Process.exit_with_result(0, finalPrice.toUint8Array(true));
    } else {
        Process.exit_with_message(1, "No consensus");
    }
}
