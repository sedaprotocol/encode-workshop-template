import {
  Bytes,
  Console,
  Process,
  httpFetch,
  u128,
} from "@seda-protocol/as-sdk/assembly";

// API response structure for the price feed
@json
class PriceFeedResponse {
  price!: string;
}

/**
 * Executes the data request phase within the SEDA network.
 * This phase is responsible for fetching non-deterministic data (e.g., price of an asset pair)
 * from an external source such as a price feed API. The input specifies the asset pair to fetch.
 */
export function executionPhase(): void {
  Process.success(Bytes.fromUtf8String("Hello, world"));
}
