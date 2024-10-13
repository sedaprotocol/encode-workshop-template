import {
  Bytes,
  Console,
  httpFetch,
  Process,
  u128,
} from "@seda-protocol/as-sdk/assembly";

@json
class BinanceResponse {
  price!: string;
}

/**
 * Executes the data request phase within the SEDA network.
 * This phase is responsible for fetching non-deterministic data (e.g., price of an asset pair)
 * from an external source such as a price feed API. The input specifies the asset pair to fetch.
 */
export function executionPhase(): void {

  const drInputs = Process.getInputs().toUtf8String();

  const apiEndpoint = `https://api.binance.com/api/v3/ticker/price?symbol=${drInputs.toUpperCase()}`;

  const response = httpFetch(apiEndpoint);

  if (!response.ok) {
    Console.error(`HTTP request failed with status: ${response.status.toString()} -  ${response.bytes.toUtf8String()}`);

    Process.error(Bytes.fromUtf8String("Failed to fetch price data"));
  }

  const data = response.bytes.toJSON<BinanceResponse>();

  const priceFloat = f32.parse(data.price);

  if (isNaN(priceFloat)) {
    Process.error(Bytes.fromUtf8String(`Error while parsing data ${data.price} `));
  }

  const finalResult = u128.from(priceFloat * 1000000); // example: 0.09 -> 9000000

  Process.success(Bytes.fromNumber(finalResult));
}
