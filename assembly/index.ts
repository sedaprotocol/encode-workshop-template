import { executionPhase } from "./execution-phase";
import { tallyPhase } from "./tally-phase";
import { OracleProgram } from "@seda-protocol/as-sdk/assembly";

/**
 * Defines a price feed oracle program that performs two main tasks:
 * 1. Fetches non-deterministic price data from external sources during the execution phase.
 * 2. Aggregates the results from multiple executors in the tally phase and calculates the median.
 */
class PriceFeed extends OracleProgram {
  execution(): void {
    executionPhase();
  }

  tally(): void {
    tallyPhase();
  }
}

// Runs the price feed oracle program by executing both phases.
new PriceFeed().run();
