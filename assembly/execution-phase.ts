import {
  Bytes,
  Console,
  JSON,
  Process,
  httpFetch,
} from "@seda-protocol/as-sdk/assembly";

// API response structure for the price feed
@json
class PriceFeedResponse {
  price!: string;
}

/**
 * This function represents the execution phase of a data request within the SEDA network.
 * It fetches the price of a specified pair (symbolA-symbolB) from a price feed API.
 */
export function executionPhase(): void {
  // Get the input parameters for the data request (DR).
  // The input is expected to be a string like "BTC-USDT" (symbolA-symbolB).
  const drInputsRaw = Process.getInputs().toUtf8String();
  Console.log("Fetching price for pair: " + drInputsRaw);

  // Split the input string into symbolA and symbolB.
  // Example: "ETH-USDC" will be split into "ETH" and "USDC".
  const drInputs = drInputsRaw.split("-");
  const symbolA = drInputs[0]; // First currency symbol (e.g., ETH)
  const symbolB = drInputs[1]; // Second currency symbol (e.g., USDC)

  // Make an HTTP request to a price feed API to get the price for the symbol pair.
  // The URL is dynamically constructed using the provided symbols (e.g., ETHUSDC).
  const response = httpFetch(
    `https://api.binance.com/api/v3/ticker/price?symbol=${symbolA.toUpperCase()}${symbolB.toUpperCase()}`
  );

  // Check if the HTTP request was successfully fulfilled.
  if (response.isFulfilled()) {
    // Parse the API response, which contains the price as a string.
    const result = JSON.parse<PriceFeedResponse>(
      response.unwrap().bytes.toUtf8String()
    );

    // Report the successful result back to the SEDA network.
    Process.success(Bytes.fromString(result.price));
  } else {
    // Handle the case where the HTTP request failed or was rejected.
    const error = response.unwrapRejected();
    Console.log(
      "HTTP Response was rejected: " +
        error.status.toString() +  // Status code of the HTTP error
        " - " +
        error.bytes.toUtf8String() // Error message returned by the server
    );

    // Report the failure to the SEDA network with an error code of 1.
    Process.error(Bytes.fromString("Error while fetching price feed"), 1);
  }
}
