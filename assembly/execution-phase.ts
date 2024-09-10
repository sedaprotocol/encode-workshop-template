import {
  Process,
  Console,
  JSON,
  httpFetch,
  Bytes,
} from "@seda-protocol/as-sdk/assembly";

export function executionPhase(): void {
  // DR Execution inputs
  const drInputsRaw = Process.getInputs().toUtf8String();
  Console.log("Fetching price for pair: " + drInputsRaw);
  const drInputs = drInputsRaw.split("-");
  const symbolA = drInputs[0];
  const symbolB = drInputs[1];

  // Response from Price Feed API
  const response = httpFetch(
    `https://api.binance.com/api/v3/ticker/price?symbol=${symbolA.toUpperCase()}${symbolB.toUpperCase()}`
  );

  // Response is fulfilled
  if (response.isFulfilled()) {
    const result = JSON.parse<BinanceResponse>(
      response.unwrap().bytes.toUtf8String()
    );

    const price = f64.parse(result.price).toString();
    Console.log("Price Feed price: " + price);

    Process.success(Bytes.fromString(price));
  } else {
    // Response is rejected
    const error = response.unwrapRejected();
    Console.log(
      "HTTP Response was rejected: " +
        error.status.toString() +
        " - " +
        error.bytes.toUtf8String()
    );

    Process.error(Bytes.fromString("Error while fetching"), 1);
  }
}

@json
class BinanceResponse {
  price!: string;
}
