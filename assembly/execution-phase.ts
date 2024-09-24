import {
  Bytes,
  Process,
} from "@seda-protocol/as-sdk/assembly";


/**
 * Executes the data request phase within the SEDA network.
 * This phase is responsible for fetching non-deterministic data (e.g., price of an asset pair)
 * from an external source such as a price feed API. The input specifies the asset pair to fetch.
 */
export function executionPhase(): void {
  Process.success(Bytes.fromUtf8String("Hello, world"));
}
